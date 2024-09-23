// @ts-check
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
const { test, expect, chromium } = require('@playwright/test');
const { default: LoginPage } = require('./support/pages/login.page');
const { default: ProductsPage } = require('./support/pages/products.page');
const { default: ShoppingCartPage } = require('./support/pages/shoppingCart.page');

const records = parse(fs.readFileSync(path.join(__dirname, 'credentials.csv')), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`Price in shopping cart the same as on products page ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    let productName = "Sauce Labs Backpack";

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Get map of products and corresponding prices
    let productsAndPrices = await productsPage.getMapOfNamesAndPrices();

    // Add two products to shoping cart
    await productsPage.clickProductByName(productName);

    // Go to shopping cart
    await productsPage.clickOnShoppingCartLink();

    let priceOfProduct = await shoppingCartPage.getPriceByProductName(productName)

    expect(priceOfProduct, `Incorrect price of product`).toBe(productsAndPrices.get(productName));
  });
}

for (const record of records) {
  test(`Removing from shopping cart ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    let firstProductName = "Sauce Labs Backpack";
    let secondProductName = "Sauce Labs Bolt T-Shirt";
    let initialNumberOfProducts = 2;

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    await productsPage.clickProductByName(firstProductName);
    await productsPage.clickProductByName(secondProductName);

    // Go to shopping cart
    await productsPage.clickOnShoppingCartLink();

    let numOfProductsInCart = await shoppingCartPage.getNumberOfItemsInCart();

    expect(numOfProductsInCart, `Incorrect number of product after adding`).toEqual(initialNumberOfProducts);

    await shoppingCartPage.clickRemoveByItemName(firstProductName);
    numOfProductsInCart = await shoppingCartPage.getNumberOfItemsInCart();

    expect(numOfProductsInCart, `Incorrect number of product after deleting`).toEqual(initialNumberOfProducts - 1);
  });
}

for (const record of records) {
  test(`List of products on cart the same after re-login ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    let firstProductName = "Sauce Labs Backpack";
    let secondProductName = "Sauce Labs Bolt T-Shirt";
    let initialNumberOfProducts = 2;

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    await productsPage.clickProductByName(firstProductName);
    await productsPage.clickProductByName(secondProductName);

    // Go to shopping cart
    await productsPage.clickOnShoppingCartLink();

    let listOfProductsInCart = await shoppingCartPage.getListOfProductsInCart();
    let numOfProductsInCart = await shoppingCartPage.getNumberOfItemsInCart();

    expect(listOfProductsInCart.toString(), `Incorrect names of product before re-login`).toEqual(`${firstProductName},${secondProductName}`);
    expect(numOfProductsInCart, `Incorrect number of product before re-login`).toEqual(initialNumberOfProducts);

    // Re-login
    productsPage.doLogout();
    await loginPage.login(record.username, record.password);

    await productsPage.clickOnShoppingCartLink();

    listOfProductsInCart = await shoppingCartPage.getListOfProductsInCart();
    numOfProductsInCart = await shoppingCartPage.getNumberOfItemsInCart();

    expect(listOfProductsInCart.toString(), `Incorrect names of product after re-login`).toEqual(`${firstProductName},${secondProductName}`);
    expect(numOfProductsInCart, `Incorrect number of product after re-login`).toEqual(initialNumberOfProducts);
  });
}

for (const record of records) {
  test(`Return to products page by [Continue Shopping] button ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Go to shopping cart
    await productsPage.clickOnShoppingCartLink();

    expect(page.url(), `User wasn't redirected to cart page`).toContain("/cart.html");

    // Go back to Products page
    await shoppingCartPage.clickContinueShoppingBtn();

    expect(page.url(), `User wasn't redirected to products page`).toContain("/inventory.html");
  });
}