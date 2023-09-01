using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class BasketController : BaseApiController
  {
    private readonly StoreContext _context;
    public BasketController(StoreContext context)
    {
      _context = context;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDTO>> GetBasket()
    {
      var basket = await RetrieveBasket(GetBuyerId());

      if (basket is null) return NotFound();
      return basket.MapBasketToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId, int quantity)
    {
      var basket = await RetrieveBasket(GetBuyerId());
      if (basket is null) basket = CreateBasket();

      var product = await _context.Products.FindAsync(productId);
      if (product is null) return BadRequest(new ProblemDetails { Title = "Product Not Found" });

      basket.AddItem(product, quantity);

      bool result = await _context.SaveChangesAsync() > 0;

      if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

      return BadRequest(new ProblemDetails { Title = "Problem adding item to basket." });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
      var basket = await RetrieveBasket(GetBuyerId());

      if (basket is null) return NotFound();

      basket.RemoveItem(productId, quantity);

      bool result = await _context.SaveChangesAsync() > 0;

      if (result) return Ok();

      return BadRequest(new ProblemDetails { Title = "Problem removing item from basket. " });
    }

    private Basket CreateBasket()
    {
      string buyerId = User.Identity?.Name;
      if (string.IsNullOrEmpty(buyerId))
      {
        buyerId = Guid.NewGuid().ToString();
        CookieOptions cookieOptions = new CookieOptions
        {
          IsEssential = true,
          Expires = DateTime.Now.AddDays(30)
        };
        Response.Cookies.Append("buyerId", buyerId, cookieOptions);
      }

      Basket basket = new Basket
      {
        BuyerId = buyerId
      };

      _context.Baskets.Add(basket);
      return basket;
    }

    private async Task<Basket> RetrieveBasket(string buyerId)
    {
      if (string.IsNullOrEmpty(buyerId))
      {
        Response.Cookies.Delete("buyerId");
        return null;
      }

      return await _context.Baskets
              .Include(basket => basket.Items)
              .ThenInclude(item => item.Product)
              .FirstOrDefaultAsync(basket =>
                basket.BuyerId == buyerId
              );
    }

    private string GetBuyerId()
    {
      return User.Identity?.Name ?? Request.Cookies["buyerId"];
    }
  }
}