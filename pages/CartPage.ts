import { Page, expect, Locator } from '@playwright/test';
import type { ProductDetails } from './ProductPage';

export class CartPage {
  constructor(private page: Page) {}

  private cartList = '.cart_list';
  private checkoutButton = '.checkout_button';

  private cartItemByName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async assertCartPageDisplayed() {
    await expect(this.page.locator(this.cartList)).toBeVisible();
  }

  async assertProductExistsInCart(name: string) {
    await expect(this.cartItemByName(name)).toBeVisible();
  }

  async removeProductFromCart(name: string) {
    const item = this.cartItemByName(name);
    await expect(item).toBeVisible();
    await item.locator('button', { hasText: /remove/i }).click();
  }

  async assertProductRemovedFromCart(name: string) {
    await expect(this.cartItemByName(name)).toHaveCount(0);
  }

  async getCartProductDetails(name: string): Promise<ProductDetails> {
    const item = this.cartItemByName(name);
    await expect(item).toBeVisible();

    const productName = (await item.locator('.inventory_item_name').innerText()).trim();
    const price = (await item.locator('.inventory_item_price').innerText()).trim();
    const description = (await item.locator('.inventory_item_desc').innerText()).trim();

    return { name: productName, price, description };
  }

  async clickCheckout() {
    await this.page.locator(this.checkoutButton).click();
  }

  async assertCheckoutBlockedWhenCartEmpty() {
    const beforeUrl = this.page.url();
    await this.page.locator(this.checkoutButton).click();
    await expect(this.page).toHaveURL(beforeUrl);
  }
}
