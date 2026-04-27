import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { acceptDialog } from '../common/pageEventHandling';

class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginPageTitle = page.locator('//h1[contains(text(), "Login")]');
        this.emailField = page.locator('//input[@id = "email"]');
        this.senhaField = page.locator('//input[@id = "senha"]');
        this.entrarButton = page.locator('//button[contains(text(), "Entrar")]')
    };

    async fillLoginFiledsCorrectly(user) {
        await this.emailField.fill(user.email);
        await this.senhaField.fill(user.senha);
        acceptDialog(this.page, "Login realizado com sucesso!");
        await this.entrarButton.click();
        await expect(this.entrarButton).not.toBeVisible()
    };

    async fillLoginFileds_IncorrectCredentials(user) {
        await this.emailField.fill(user.email);
        await this.senhaField.fill(faker.internet.password({ length: 6 }));
        this.page.once("dialog", async (dialog) => {
            expect(dialog).toBeTruthy();
            await dialog.accept()
        });
        await this.entrarButton.click();
        await expect(this.entrarButton).toBeVisible()
    }
}

export default LoginPage