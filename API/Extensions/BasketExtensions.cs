using API.DTOs;
using API.Entities;
using System.Linq;

namespace API.Extensions
{
  public static class BasketExtensions
  {
    public static BasketDTO MapBasketToDto(this Basket basket)
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