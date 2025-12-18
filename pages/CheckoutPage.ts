import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  private firstName = '[data-test="firstName"]'; 
  private lastName = '[data-test="lastName"]';        
  private postalCode = '[data-test="postalCode"]';    
  private continueButton = '[data-test="continue"]';  

  private finishButton = '[data-test="finish"]';

  private successHeader = '[data-test="complete-header"]';

  async fillRequiredFieldsAndContinue() {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);

    await expect(this.page.locator(this.firstName)).toBeVisible();

    await this.page.locator(this.firstName).fill('Test');
    await this.page.locator(this.lastName).fill('User');
    await this.page.locator(this.postalCode).fill('12345');

    await this.page.locator(this.continueButton).click();

    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  async finishOrder() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);

    await this.page.locator(this.finishButton).click();

    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }

  async assertOrderCompletedSuccessfully() {
    await expect(this.page.locator(this.successHeader)).toBeVisible();
    await expect(this.page.locator(this.successHeader)).toContainText(/thank you/i);
  }
}
