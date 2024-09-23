export default class LoginPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.usernameInput = this.page.getByPlaceholder("Username");
        this.passwordInput = this.page.getByPlaceholder("Password");
        this.loginBtn = this.page.locator("#login-button");
        this.errorContainer = this.page.locator('[data-test=\'error\']');
    }

    //Actions

    // Perform login
    async login(username, password) {
        // type credentials
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);

        //click [Login] button
        await this.loginBtn.click();
    }

    async getErrorText() {
        return await this.errorContainer.textContent();
    }
}