// @ts-check 
import { test, expect } from '@playwright/test';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import ManageBooksPage from '../resources/pom/ManageBooksPage';
import BookDetailsPage from '../resources/pom/BookDetailsPage';
import { createBookData, createUserData } from '../resources/common/testDataCreation';
import FavoritesPage from '../resources/pom/FavoritesPage';

// test data:
let newBook = {
  "nome": undefined,
  "autor": undefined,
  "paginas": undefined,
  "descricao": undefined,
  "imagemUrl": undefined
};
let newBookId = 0;

const livrosUrlExtension = "./livros.html";
const favoritosUrlExtension = "./favoritos.html";

// tests:
test.beforeEach("User Registration, Login and New Book Added to Library", async({ page, request }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  
  const newUser = createUserData();
  
  await page.goto("./registro.html");
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(newUser);
  await expect(page).toHaveURL("./login.html")

  await loginPage.fillLoginFiledsCorrectly(newUser);
  await expect(page).toHaveURL("./dashboard.html");

  newBook = createBookData();
  const response = await request.post("/livros",
    {
      data: newBook
    }
  );

  const body = await response.json();
  newBookId = body.id
});

test("Successfull Book Details Display - FE-010", async ({ page }) => {
  const manageBooksPage = new ManageBooksPage(page);
  const bookDetailsPage = new BookDetailsPage(page);

  await page.goto(livrosUrlExtension);
  await expect(manageBooksPage.gerenciarLivrosPageTitle).toBeVisible();

  await bookDetailsPage.clickBookCard(newBook);
  await expect(page).toHaveURL(`./detalhes.html?id=${newBookId}`);

  await expect(bookDetailsPage.bookImgElement).toBeVisible();
  await expect(bookDetailsPage.bookNomeElement).toBeVisible();
  await expect(bookDetailsPage.bookAutorElement).toBeVisible();
  await expect(bookDetailsPage.bookPaginasElement).toBeVisible();
  await expect(bookDetailsPage.bookDescricaoElement).toBeVisible();
  await expect(bookDetailsPage.bookDataElement).toBeVisible();

  const newBookImgValue = page.locator(`//img[@src="${newBook.imagemUrl}"]`);
  await expect(newBookImgValue).toBeVisible();
  const newBookNomeValue = page.locator(`//h2[contains(text(), "${newBook.nome}")]`);
  await expect(newBookNomeValue).toBeVisible();
  const newBookAutorValue = page.locator(`//div[@class="info-item" and text()[normalize-space()="${newBook.autor}"]]/strong[contains(text(), "Autor:")]`);
  await expect(newBookAutorValue).toBeVisible();
  const newBookPaginasValue = page.locator(`//div[@class="info-item" and text()[normalize-space()="${newBook.paginas}"]]/strong[contains(text(), "Páginas:")]`);
  await expect(newBookPaginasValue).toBeVisible();
  const newBookDescricaoValue = page.locator(`//div[@class="info-item" and text()[normalize-space()="${newBook.descricao}"]]/strong[contains(text(), "Descrição:")]`);
  await expect(newBookDescricaoValue).toBeVisible()
});

test("Successfull Display of Enabled Buttons in Book Details Page  - FE-010", async ({ page }) => {
  const manageBooksPage = new ManageBooksPage(page);
  const bookDetailsPage = new BookDetailsPage(page);

  await page.goto(livrosUrlExtension);
  await expect(manageBooksPage.gerenciarLivrosPageTitle).toBeVisible();

  await bookDetailsPage.clickBookCard(newBook);
  await expect(page).toHaveURL(`./detalhes.html?id=${newBookId}`);

  await expect(bookDetailsPage.adicionarFavoritosButton).toBeVisible();
  await expect(bookDetailsPage.deletarButton).toBeVisible();
  await expect(bookDetailsPage.voltarButton).toBeVisible();
  await expect(bookDetailsPage.adicionarFavoritosButton).toBeEnabled();
  await expect(bookDetailsPage.deletarButton).toBeEnabled();
  await expect(bookDetailsPage.voltarButton).toBeEnabled()
});

test("Successfull Book Addition to Favorites - FE-011", async ({ page }) => {
  const bookDetailsPage = new BookDetailsPage(page);
  const favoritesPage = new FavoritesPage(page);

  await page.goto(`./detalhes.html?id=${newBookId}`);
  await expect(bookDetailsPage.detalhesPageTitle).toBeVisible();

  await bookDetailsPage.addFavoriteBook();
  await expect(bookDetailsPage.removerFavoritosButton).toBeVisible();

  await page.goto(favoritosUrlExtension);
  await expect(favoritesPage.meusFavoritosPageTitle).toBeVisible();

  const newFavoriteBook = page.locator(`//h3[contains(text(),"${newBook.nome}")]`);
  await expect(newFavoriteBook).toBeVisible()
});

test("Successfull Book Removal from Favorites - FE-012", async ({ page }) => {
  const bookDetailsPage = new BookDetailsPage(page);
  const favoritesPage = new FavoritesPage(page);

  await page.goto(`./detalhes.html?id=${newBookId}`);
  await expect(bookDetailsPage.detalhesPageTitle).toBeVisible();

  await bookDetailsPage.addFavoriteBook();
  await expect(bookDetailsPage.removerFavoritosButton).toBeVisible();

  await bookDetailsPage.removeFavoriteBook();
  await expect (bookDetailsPage.adicionarFavoritosButton).toBeVisible();

  await page.goto(favoritosUrlExtension);
  await expect(favoritesPage.meusFavoritosPageTitle).toBeVisible();

  const newFavoriteBook = page.locator(`//h3[contains(text(),"${newBook.nome}")]`);
  await expect(newFavoriteBook).not.toBeVisible()
});

test("Successfull Listing of Favorite Books - FE-013", async ({ page }) => {
  const bookDetailsPage = new BookDetailsPage(page);
  const favoritesPage = new FavoritesPage(page);

  await page.goto(`./detalhes.html?id=${newBookId}`);
  await expect(bookDetailsPage.detalhesPageTitle).toBeVisible();

  await bookDetailsPage.addFavoriteBook();
  await expect(bookDetailsPage.removerFavoritosButton).toBeVisible();

  await page.goto(favoritosUrlExtension);
  await expect(favoritesPage.gridMeusFavoritosAmount).toBeVisible();

  const initialCountGridFavoritos = await favoritesPage.gridMeusFavoritosAmount.count();

  const newFavoriteBook = page.locator(`//h3[contains(text(),"${newBook.nome}")]`);
  await newFavoriteBook.click();

  await bookDetailsPage.removeFavoriteBook();
  await expect (bookDetailsPage.adicionarFavoritosButton).toBeVisible();

  await page.goto(favoritosUrlExtension);

  const countGridFavoritosAfterRemoveFav = await favoritesPage.gridMeusFavoritosAmount.count();
  expect(countGridFavoritosAfterRemoveFav).toBe(initialCountGridFavoritos - 1);
  await expect(newFavoriteBook).not.toBeVisible();

  if(countGridFavoritosAfterRemoveFav == 0) {
    await expect(favoritesPage.noFavoritesMessage).toBeVisible();
    await expect(favoritesPage.gridMeusFavoritosAmount).not.toBeVisible()
  }
});

test("Successfull Book Delete from Library - FE-014", async ({ page }) => {
  const bookDetailsPage = new BookDetailsPage(page);

  await page.goto(`./detalhes.html?id=${newBookId}`);
  await expect(bookDetailsPage.detalhesPageTitle).toBeVisible();

  await bookDetailsPage.deleteBook();
  await expect(page).toHaveURL(livrosUrlExtension);

  const newFavoriteBook = page.locator(`//h3[contains(text(),"${newBook.nome}")]`);
  await expect(newFavoriteBook).not.toBeVisible()
});

test("Successfull Book Delete Cancelation - FE-015", async ({ page }) => {
  const bookDetailsPage = new BookDetailsPage(page);
  const detalhesNewBookUrlExtension = `./detalhes.html?id=${newBookId}`;

  await page.goto(detalhesNewBookUrlExtension);
  await expect(bookDetailsPage.detalhesPageTitle).toBeVisible();

  await bookDetailsPage.deleteBookCancelation();
  await expect(page).toHaveURL(detalhesNewBookUrlExtension);

  const newFavoriteBook = page.locator(`//h2[contains(text(),"${newBook.nome}")]`);
  await expect(newFavoriteBook).toBeVisible()
})
