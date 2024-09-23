export default class ProductsPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.productBtnByName = (text) => this.page.locator(`//div[text()='${text}']//ancestor::div[@class='inventory_item']//button`);
        this.priceByProductName = (text) => this.page.locator(`//div[text()='${text}']//ancestor::div[@class='inventory_item']//div[@class='inventory_item_price']`);
        this.shoppingCartBadge = this.page.locator(".shopping_cart_badge");
        this.productSortContainer = this.page.locator(".product_sort_container");
        this.productNames = this.page.locator('.inventory_item_name');
        this.productPrice = this.page.locator('.inventory_item_price');
        this.burgerMenuBtn = this.page.locator('#react-burger-menu-btn');
        this.logoutBtn = this.page.locator('#logout_sidebar_link');
        this.shoppingCartLink = this.page.locator('.shopping_cart_link');
    }

    //Actions

    // Click on [Add to card] button for specific product by product's name
    async clickProductByName(name) {
        await this.productBtnByName(name).click();
    }

    // Get button text for specific product by product's name
    async getProductBtnText(name) {
        return await this.productBtnByName(name).textContent();
    }

    // Get number of products added to card
    async getNumererOfItemsInCart() {
        return await this.shoppingCartBadge.textContent();
    }

    // Select specific product sort option
    async selectProductSortOption(option) {
        await this.productSortContainer.selectOption(option);
    }

    // Get all products names
    async getProductsNames() {
        return await this.productNames.allTextContents();
    }

    // Get all products prices
    async getProductsPrises() {
        return (await this.productPrice.allTextContents()).map(function(item){ return item.replace('$', ''); }).map(Number);
    }

    // Perform logout
    async doLogout() {
        await this.burgerMenuBtn.click();
        await this.logoutBtn.click();
    }

    // Go to Shopping Cart
    async clickOnShoppingCartLink() {
        await this.shoppingCartLink.click();
    }

    // Get map of products and corresponding prices
    async getMapOfNamesAndPrices() {
        let map = new Map();
        let products = await this.getProductsNames();
        for (let i = 0; i < products.length; i++) {
            map.set(products[i], await this.priceByProductName(products[i]).textContent());
        }
        return map;
    }
}