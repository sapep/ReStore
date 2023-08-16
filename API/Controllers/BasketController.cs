using API.Data;
using API.DTOs;
using API.Entities;
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
      var basket = await RetrieveBasket();

      if (basket is null) return NotFound();
      return MapBasketToDto(basket);
    }

    [HttpPost]
    public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId, int quantity)
    {
      var basket = await RetrieveBasket();
      if (basket is null) basket = CreateBasket();

      var product = await _context.Products.FindAsync(productId);
      if (product is null) return NotFound();

      basket.AddItem(product, quantity);

      bool result = await _context.SaveChangesAsync() > 0;

      if (result) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

      return BadRequest(new ProblemDetails { Title = "Problem adding item to basket." });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
      var basket = await RetrieveBasket();

      if (basket is null) return NotFound();

      basket.RemoveItem(productId, quantity);
      
      bool result = await _context.SaveChangesAsync() > 0;

      if (result) return Ok();

      return BadRequest(new ProblemDetails { Title = "Problem removing item from basket. "});
    }

    private Basket CreateBasket()
    {
      string buyerId = Guid.NewGuid().ToString();
      CookieOptions cookieOptions = new CookieOptions
      {
        IsEssential = true,
        Expires = DateTime.Now.AddDays(30)
      };
      Response.Cookies.Append("buyerId", buyerId, cookieOptions);

      Basket basket = new Basket
      {
        BuyerId = buyerId
      };

      _context.Baskets.Add(basket);
      return basket;
    }

    private async Task<Basket> RetrieveBasket()
    {
      return await _context.Baskets
              .Include(basket => basket.Items)
              .ThenInclude(item => item.Product)
              .FirstOrDefaultAsync(basket =>
                basket.BuyerId == Request.Cookies["buyerId"]
              );
    }

    private BasketDTO MapBasketToDto(Basket basket)
    {
      return new BasketDTO
      {
        Id = basket.Id,
        BuyerId = basket.BuyerId,
        Items = basket.Items.Select(item => new BasketItemDTO
        {
          ProductId = item.ProductId,
          Name = item.Product.Name,
          Price = item.Product.Price,
          PictureUrl = item.Product.PictureUrl,
          Brand = item.Product.Brand,
          Type = item.Product.Type,
          Quantity = item.Quantity,
        }).ToList()
      };
    }
  }
}