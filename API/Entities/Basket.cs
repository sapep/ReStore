namespace API.Entities
{
  public class Basket
  {
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItem> Items { get; set; } = new();
    public string PaymentIntentId { get; set; }
    public string ClientSecret { get; set; }

    public void AddItem(Product product, int quantity)
    {
      // Check whether the product already exists in the list of items
      if (Items.All(item => item.ProductId != product.Id))
      {
        // Possible source of a bug here. Add quantity twice?
        Items.Add(new BasketItem { Product = product, Quantity = quantity });
      }

      BasketItem existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
      if (existingItem is not null) existingItem.Quantity += quantity;
    }

    public void RemoveItem(int productId, int quantity)
    {
        BasketItem item = Items.FirstOrDefault(item => item.ProductId == productId);
        if (item is null) return;
        item.Quantity -= quantity;
        if (item.Quantity <= 0) Items.Remove(item);
    }
  }
}