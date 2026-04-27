import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { acceptDialog } from '../common/pageEventHandling';

class RegistrationPage {
    constructor(page) {
        this.page = page;
        this.registrationPageTitle = page.locator('//h1[contains(text(), "Criar Conta")]');
        this.nomeField = page.locator('//input[@id = "nome"]');
        this.emailField = page.locator('//input[@id = "email"]');
        this.senhaField = page.locator('//input[@id = "senha"]');
        this.confirmarSenhaField = page.locator('//input[@id = "confirmarSenha"]');
        this.registrarButton = page.locator('//button[contains(text(), "Registrar")]')
    };

    async fillFormCorrectly(user) {
        await this.nomeField.fill(user.nome);
        await this.emailField.fill(user.email);
        await this.senhaField.fill(user.senha);
        await this.confirmarSenhaField.fill(user.senha);
        acceptDialog(this.page, "Conta criada com sucesso!");
        await this.registrarButton.click();
        await expect(this.registrarButton).not.toBeVisible()
    };

    async fillForm_IncorrectPasswordConfirmation(user) {
        await this.nomeField.fill(user.nome);
        await this.emailField.fill(user.email);
        await this.senhaField.fill(user.senha);
        await this.confirmarSenhaField.fill(faker.internet.password({ length: 6 }));
        acceptDialog(this.page, "As senhas não coincidem!");
        await this.registrarButton.click();
        await expect(this.registrarButton).toBeVisible()
    }
}

export default RegistrationPage