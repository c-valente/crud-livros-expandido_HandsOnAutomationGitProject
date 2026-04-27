import { test, expect } from '@playwright/test';
import { acceptDialog, cancelDialog } from '../common/pageEventHandling';

class BookDetailsPage {
    constructor(page) {
        this.page = page;
        this.detalhesPageTitle = page.locator('//h1[contains(text(), "Detalhes do Livro")]');
        this.bookImgElement = page.locator('//img[@src]');
        this.bookNomeElement = page.locator('//h2');
        this.bookAutorElement = page.locator('//strong[contains(text(), "Autor:")]');
        this.bookPaginasElement = page.locator('//strong[contains(text(), "Páginas:")]');
        this.bookDescricaoElement = page.locator('//strong[contains(text(), "Descrição:")]');
        this.bookDataElement = page.locator('//strong[contains(text(), "Data de Cadastro:")]');
        this.adicionarFavoritosButton = page.locator(`//button[contains(text(), "🤍 Adicionar aos Favoritos")]`);
        this.deletarButton = page.locator(`//button[contains(text(), "Deletar Livro")]`);
        this.voltarButton = page.locator(`//button[contains(text(), "Voltar")]`);
        this.removerFavoritosButton = page.locator(`//button[contains(text(), "❤️ Remover dos Favoritos")]`)
    };

    async clickBookCard(book) {
        const bookCard = this.page.locator(`//div[@class="book-card"]//h3[contains(text(), "${book.nome}")]`);
        await bookCard.click();
        await expect(this.detalhesPageTitle).toBeVisible()
    };

    async addFavoriteBook() {
        acceptDialog(this.page, "Adicionado aos favoritos!");
        await this.adicionarFavoritosButton.click();
        await expect(this.adicionarFavoritosButton).not.toBeVisible()
    };

    async removeFavoriteBook() {
        acceptDialog(this.page, "Removido dos favoritos!");
        await this.removerFavoritosButton.click();
        await expect(this.removerFavoritosButton).not.toBeVisible()
    };

    async deleteBook() {
        this.page.once("dialog", async (dialog) => {
            expect(dialog.message()).toBe("Tem certeza que deseja deletar este livro?");
            await dialog.accept();
            this.page.once("dialog", async (dialog) => {
                expect(dialog.message()).toBe("Livro deletado com sucesso!");
                await dialog.accept()
            })
        });
        await this.deletarButton.click();
        await expect(this.deletarButton).not.toBeVisible()
    };

    async deleteBookCancelation() {
        cancelDialog(this.page, "Tem certeza que deseja deletar este livro?");
        await this.deletarButton.click();
        await expect(this.deletarButton).toBeVisible()
    }
}

export default BookDetailsPage