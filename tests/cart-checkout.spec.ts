import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Add / Remove / Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.assertLoginScreenDisplayed();

    await loginPage.login('standard_user', 'secret_sauce');

    const productsPage = new ProductsPage(page);
    await productsPage.assertProductsPageDisplayed();
  });

  test('Verify customer can add a product to cart from products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const firstProduct = await productsPage.getFirstProductDetails();

    await productsPage.addFirstProductToCart();
    await productsPage.openCart();

    await cartPage.assertCartPageDisplayed();

    await cartPage.assertProductExistsInCart(firstProduct.name);
  });

  test('Verify customer can remove a product from the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const firstProduct = await productsPage.getFirstProductDetails();

    await productsPage.addFirstProductToCart();
    await productsPage.openCart();

    await cartPage.assertCartPageDisplayed();
    await cartPage.assertProductExistsInCart(firstProduct.name);

    await cartPage.removeProductFromCart(firstProduct.name);

    await cartPage.assertProductRemovedFromCart(firstProduct.name);
  });

  test('Verify Product details is consistent across the pages', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const productDetailsOnProducts = await productsPage.getFirstProductDetails();

    await productsPage.addFirstProductToCart();
    await productsPage.openCart();

    await cartPage.assertCartPageDisplayed();
    await cartPage.assertProductExistsInCart(productDetailsOnProducts.name);

    const productDetailsOnCart = await cartPage.getCartProductDetails(productDetailsOnProducts.name);

    test.expect(productDetailsOnCart.name).toBe(productDetailsOnProducts.name);
    test.expect(productDetailsOnCart.price).toBe(productDetailsOnProducts.price);
    test.expect(productDetailsOnCart.description).toBe(productDetailsOnProducts.description);
  });

  test('Verify customer can create an order successfully from the checkout page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productsPage.addFirstProductToCart();
    await productsPage.openCart();

    await cartPage.assertCartPageDisplayed();
    await cartPage.clickCheckout();

    await checkoutPage.fillRequiredFieldsAndContinue();
    await checkoutPage.finishOrder();

    await checkoutPage.assertOrderCompletedSuccessfully();
  });

  
});
