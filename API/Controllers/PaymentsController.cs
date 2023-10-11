using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
  public class PaymentsController : BaseApiController
  {
    private readonly PaymentService _paymentService;
    private readonly StoreContext _context;
    private readonly IConfiguration _config;

    public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config)
    {
      _paymentService = paymentService;
      _context = context;
      _config = config;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDTO>> CreateOrUpdatePaymentIntent()
    {
      var basket = await _context.Baskets
        .RetrieveBasketWithItems(User.Identity.Name)
        .FirstOrDefaultAsync();

      if (basket == null) return NotFound();

      var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

      if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

      basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
      basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

      _context.Update(basket);

      var result = await _context.SaveChangesAsync() > 0;

      if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with payment intent" });

      return basket.MapBasketToDto();
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebhook()
    {
      string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

      Event stripeEvent = EventUtility.ConstructEvent(
        json,
        Request.Headers["Stripe-Signature"],
        _config["StripeSettings:WhSecret"]
      );

      Charge charge = (Charge)stripeEvent.Data.Object;

      Order order = await _context.Orders.FirstOrDefaultAsync(
        order => order.PaymentIntentId == charge.PaymentIntentId
      );

      if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

      await _context.SaveChangesAsync();

      return new EmptyResult();
    }
  }
}