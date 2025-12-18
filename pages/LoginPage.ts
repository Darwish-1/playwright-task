import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton = '#login-button';

  async goto() {
    await this.page.goto('https://www.saucedemo.com/v1/');
  }

  async assertLoginScreenDisplayed() {
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }
}
