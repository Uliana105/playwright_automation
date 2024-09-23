const { test, expect, chromium } = require('@playwright/test');
const { default: LoginPage } = require('./support/pages/login.page');
const { default: ProductsPage } = require('./support/pages/products.page');

test('Login test positive', async ({page}) => {
  const loginPage = new LoginPage(page);
  await page.goto('');

  //try to login with valid credentials
  await loginPage.login("standard_user", "secret_sauce");

  expect(page.url()).toContain("/inventory.html");
});

test('Do login with wrong password', async ({page}) => {
  const loginPage = new LoginPage(page);
  await page.goto('');

  //try to login with invalid credentials
  loginPage.login("standard_user", "111111");

  await expect(loginPage.errorContainer).toBeVisible();

  expect(await loginPage.getErrorText()).toBe("Epic sadface: Username and password do not match any user in this service");
});

test('Do login with wrong username', async ({page}) => {
  const loginPage = new LoginPage(page);
  await page.goto('');

  //try to login with invalid credentials
  loginPage.login("wrong_user", "secret_sauce");

  await expect(loginPage.errorContainer).toBeVisible();

  expect(await loginPage.getErrorText()).toBe("Epic sadface: Username and password do not match any user in this service");
});

test('Do login with locked user', async ({page}) => {
  const loginPage = new LoginPage(page);
  await page.goto('');

  //try to login with invalid credentials
  loginPage.login("locked_out_user", "secret_sauce");

  await expect(loginPage.errorContainer).toBeVisible();

  expect(await loginPage.getErrorText()).toBe("Epic sadface: Sorry, this user has been locked out.");
});

test('Logout test', async ({page}) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  await page.goto('');

  //login with valid credentials
  await loginPage.login("standard_user", "secret_sauce");

  await productsPage.doLogout();

  expect(page.url()).toBe("https://www.saucedemo.com/");
});