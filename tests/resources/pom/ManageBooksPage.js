import { test, expect } from '@playwright/test';
import { acceptDialog } from '../common/pageEventHandling';

class ManageBooksPage {
    constructor(page) {
        this.page = page;
        this.gerenciarLivrosPageTitle = page.locator('//h1[contains(text(), "Gerenciar Livros")]');
        this.nomeLivroField = page.locator('//input[@id="nome"]');
        this.autorField = page.locator('//input[@id="autor"]');
        this.numeroPaginasField = page.locator('//input[@id="paginas"]');
        this.descricaoField = page.locator('//textarea[@id="descricao"]');
        this.urlImagemField = page.locator('//input[@id="imagemUrl"]');
        this.adicionarLivroButton = page.locator('//button[contains(text(), "Adicionar Livro")]');
        this.gridBookAmount = page.locator('//div[@id="lista-livros"]/div[@class="book-card"]')
    };

    async fillBookFormCorrectly(book) {
        await this.nomeLivroField.fill(book.nome);
        await this.autorField.fill(book.autor);
        await this.numeroPaginasField.fill(String(book.paginas));
        await this.descricaoField.fill(book.descricao);
        await this.urlImagemField.fill(book.imagemUrl);
        acceptDialog(this.page, "Livro adicionado com sucesso!");
        await this.adicionarLivroButton.click();
        await expect(this.adicionarLivroButton).toBeVisible()
    };

    async emptyBookForm() {
        await this.nomeLivroField.clear();
        await this.autorField.clear();
        await this.numeroPaginasField.clear();
        await this.descricaoField.clear();
        await this.urlImagemField.clear()
    };

    async checkBookFormFieldValidity(field, isValid) {
        const isFieldValid = await field.evaluate((element) => element.checkValidity());
        expect(isFieldValid).toBe(isValid)
    }
}

export default ManageBooksPage