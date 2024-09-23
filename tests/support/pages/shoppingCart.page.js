export default class ShoppingCartPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.cartItem = this.page.locator('.cart_item');
        this.cartItemName = this.page.locator('.inventory_item_name');
        this.removeBtnByProductName = (text) => this.page.locator(`//div[text()='${text}']//ancestor::div[@class='cart_item']//button`);
        this.priceByProductName = (text) => this.page.locator(`//div[text()='${text}']//ancestor::div[@class='cart_item']//div[@class='inventory_item_price']`);
        this.continueShoppingBtn = this.page.locator('#continue-shopping');
    }

    //Actions
    // Get number of items in the cart
    async getNumberOfItemsInCart() {
        return await this.cartItem.count();
    }

    // Remove product from the cart by it's name
    async clickRemoveByItemName(name) {
        await this.removeBtnByProductName(name).click();
    }

    // Click [Continue Shopping] btn
    async clickContinueShoppingBtn() {
        await this.continueShoppingBtn.click();
    }

    // Get price of specific product
    async getPriceByProductName(name) {
        return await this.priceByProductName(name).textContent();
    }

    // Get products' present in the cart names
    async getListOfProductsInCart() {
        return await this.cartItemName.allTextContents();
    }
}