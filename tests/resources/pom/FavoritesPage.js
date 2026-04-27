import { test, expect } from '@playwright/test';

class FavoritesPage {
    constructor(page) {
        this.page = page;
        this.meusFavoritosPageTitle = page.locator('//h1[contains(text(), "Meus Favoritos")]');
        this.gridMeusFavoritosAmount = page.locator('//div[@id="lista-favoritos"]/div');
        this.noFavoritesMessage = page.locator('//p[@id="mensagem-vazio"]')
    }
}

export default FavoritesPage