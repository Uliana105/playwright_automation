// @ts-check
import assert from 'assert';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
const { test, expect, chromium } = require('@playwright/test');
const { default: LoginPage } = require('./support/pages/login.page');
const { default: ProductsPage } = require('./support/pages/products.page');

const records = parse(fs.readFileSync(path.join(__dirname, 'credentials.csv')), {
  columns: true,
  skip_empty_lines: true
});

for (const record of records) {
  test(`Add product to card ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    let expectedNumberOfProductsInCart = "1";
    let productName = "Sauce Labs Backpack";

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add the product to the shoping cart
    await productsPage.clickProductByName(productName);

    // Verify product is added to shoping cart
    expect(await productsPage.getNumererOfItemsInCart(), `Cart should contain ${expectedNumberOfProductsInCart} products`).toBe(expectedNumberOfProductsInCart);
    expect(await productsPage.getProductBtnText(productName), 'Button text should be \'Remove\'').toBe("Remove");
  });
}

for (const record of records) {
  test(`Remove product from card throught products page ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    let firstProductName = "Sauce Labs Backpack";
    let secondProductName = "Sauce Labs Bolt T-Shirt";

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    await productsPage.clickProductByName(firstProductName);
    await productsPage.clickProductByName(secondProductName);
    let numOfProductsInCart = await productsPage.getNumererOfItemsInCart();

    // Remove previously selected product
    await productsPage.clickProductByName(firstProductName);

    // Verify product is deleted from shoping cart
    assert
    expect(await productsPage.getNumererOfItemsInCart(), `Cart should contain ${numOfProductsInCart - 1} products`).toBe((numOfProductsInCart - 1).toString());
    expect(await productsPage.getProductBtnText(firstProductName), 'Button text should be \'Add to cart\'').toBe("Add to cart");
  });
}

for (const record of records) {
  test(`Filter (Name (Z to A)) ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    let listOfProducts = await productsPage.getProductsNames();

    // Sort by 'Name (Z to A)' criteria
    await productsPage.selectProductSortOption("Name (Z to A)");
    let sortedListOfProducts = await productsPage.getProductsNames();

    // Verify product list is sorted
    expect(sortedListOfProducts.toString(), 'Invalid order of products').toBe(listOfProducts.reverse().toString());
  });
}

for (const record of records) {
  test(`Filter (Price (low to high)) ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    let listOfPrises = await productsPage.getProductsPrises();


    // Sort by 'Price (low to high)' criteria
    await productsPage.selectProductSortOption("Price (low to high)");
    let sortedListOfPrises = await productsPage.getProductsPrises();

    // Verify product list is sorted
    expect(sortedListOfPrises.toString(), 'Invalid order of products').toBe(listOfPrises.sort((a, b) => a - b).toString());
  });
}

for (const record of records) {
  test(`Filter (Price (high to low)) ${record.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Open base url
    await page.goto('');

    // Do login
    await loginPage.login(record.username, record.password);

    // Add two products to shoping cart
    let listOfPrises = await productsPage.getProductsPrises();

    // Sort by 'Price (high to low)' criteria
    await productsPage.selectProductSortOption("Price (high to low)");
    let sortedListOfPrises = await productsPage.getProductsPrises();

    // Verify product list is sorted
    expect(sortedListOfPrises.toString(), 'Invalid order of products').toBe(listOfPrises.sort((a, b) => a - b).reverse().toString());
  });
}