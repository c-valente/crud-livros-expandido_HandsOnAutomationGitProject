import { test, expect } from '@playwright/test';

class DashboardPage {
    constructor(page) {
        this.page = page;
        this.headerUserInfo = page.locator('//span[@id="nomeUsuario"]');
        this.dashboardButton = page.locator('//a[@href="dashboard.html"]');
        this.gerenciarButton = page.locator('//a[@href="livros.html"]');
        this.favoritosdButton = page.locator('//a[@href="favoritos.html"]');
        this.sairButton = page.locator('//button[contains(text(), "Sair")]');
        this.dashboardPageTitle = page.locator('//h1[contains(text(), "Minha Biblioteca")]');
        this.statisticCardTotalLivros = page.locator('//div[@class="stat-card"]/h3[contains(text(), "Total de Livros")]');
        this.statisticCardTotalPaginas = page.locator('//div[@class="stat-card"]/h3[contains(text(), "Total de Páginas")]');
        this.statisticCardTotalUsuarios = page.locator('//div[@class="stat-card"]/h3[contains(text(), "Usuários Cadastrados")]');
        this.statisticCardTotalLivrosNumber = page.locator('//h3[contains(text(), "Total de Livros")]//following-sibling::div[@class="number"]');
        this.statisticCardTotalPaginasNumber = page.locator('//h3[contains(text(), "Total de Páginas")]//following-sibling::div[@class="number"]');
        this.statisticCardTotalUsuariosNumber = page.locator('//h3[contains(text(), "Usuários Cadastrados")]//following-sibling::div[@class="number"]');
        this.gridUltimosLivros = page.locator('//div[@id="livros-recentes"]');
        this.gridBookAmount = page.locator('//div[@id="livros-recentes"]/div');
        this.bookCardTitle = page.locator('(//div[@class="book-card"]/h3)[1]');
        this.bookCardAutor = page.locator('(//div[@class="book-card"]/p/strong[text()="Autor:"])[1]');
        this.bookCardImg = page.locator('(//div[@class="book-card"]/img)[1]')
    };

    async getStatisticNumbertoRealNumber (pageElement) {
        const pageElementText = await pageElement.innerText();
        const pageElementNumber = Number(pageElementText.replace(",", ""));
        return pageElementNumber
    }
}

export default DashboardPage