import { Page, expect, Locator } from '@playwright/test';

export type ProductDetails = {
  name: string;
  price: string;
  description: string;
};

export class ProductsPage {
  constructor(private page: Page) {}

  private inventoryList = '.inventory_list';
  private cartIcon = '.shopping_cart_link';

  private firstProductCard(): Locator {
    return this.page.locator('.inventory_item').first();
  }

  async assertProductsPageDisplayed() {
    await expect(this.page.locator(this.inventoryList)).toBeVisible();
  }

  async addFirstProductToCart() {
    const first = this.firstProductCard();
    await expect(first).toBeVisible();
    await first.locator('button', { hasText: /add to cart/i }).click();
  }

  async getFirstProductDetails(): Promise<ProductDetails> {
    const first = this.firstProductCard();
    await expect(first).toBeVisible();

    const name = (await first.locator('.inventory_item_name').innerText()).trim();
    const price = (await first.locator('.inventory_item_price').innerText()).trim();
    const description = (await first.locator('.inventory_item_desc').innerText()).trim();

    return { name, price, description };
  }

  async openCart() {
    await this.page.locator(this.cartIcon).click();
  }
}
