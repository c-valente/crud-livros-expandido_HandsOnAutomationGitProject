// @ts-check 
import { test, expect } from '@playwright/test';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import ManageBooksPage from '../resources/pom/ManageBooksPage';
import { createBookData, createUserData } from '../resources/common/testDataCreation';

// test data:
let newBook = {
  "nome": undefined,
  "autor": undefined,
  "paginas": undefined,
  "descricao": undefined,
  "imagemUrl": undefined
};

const livrosUrlExtension = "./livros.html";

// tests:
test.beforeEach("User Registration, Login and New Book Data Creation", async({ page }) => {
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
});

test("Successfull Book Addition to Library - FE-007", async ({ page }) => {
  const manageBooksPage = new ManageBooksPage(page);

  await page.goto(livrosUrlExtension);
  await expect(manageBooksPage.gerenciarLivrosPageTitle).toBeVisible();

  const initialAmountGridLivros = await manageBooksPage.gridBookAmount.count();

  await manageBooksPage.fillBookFormCorrectly(newBook);
  await expect(manageBooksPage.nomeLivroField).toBeEmpty();
  await expect(manageBooksPage.autorField).toBeEmpty();
  await expect(manageBooksPage.numeroPaginasField).toBeEmpty();
  await expect(manageBooksPage.descricaoField).toBeEmpty();
  await expect(manageBooksPage.urlImagemField).toBeEmpty();
  
  const newBookCard = page.locator(`//div[@class="book-card"]//h3[contains(text(), "${newBook.nome}")]`);
  await expect(newBookCard).toBeVisible();

  const newAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  expect(newAmountGridLivros).toBeGreaterThan(initialAmountGridLivros)
});

test("Failing to Add a Book to Library - Empty Mandatory Fields (Validation Messages Occurrence) - FE-008", async ({ page }) => {
  const manageBooksPage = new ManageBooksPage(page);

  await page.goto(livrosUrlExtension);
  await expect(manageBooksPage.gerenciarLivrosPageTitle).toBeVisible();
  
  await manageBooksPage.emptyBookForm();

  const initialAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  
  await manageBooksPage.adicionarLivroButton.click();
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.nomeLivroField, false);
  
  let newAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  expect(newAmountGridLivros).toBe(initialAmountGridLivros);

  await manageBooksPage.nomeLivroField.fill(newBook.nome);
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.nomeLivroField, true);

  await manageBooksPage.adicionarLivroButton.click();
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.autorField, false);

  newAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  expect(newAmountGridLivros).toBe(initialAmountGridLivros);

  await manageBooksPage.autorField.fill(newBook.autor);
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.autorField, true);

  await manageBooksPage.adicionarLivroButton.click();
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.numeroPaginasField, false);

  newAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  expect(newAmountGridLivros).toBe(initialAmountGridLivros);

  await manageBooksPage.numeroPaginasField.fill(String(newBook.paginas));
  await manageBooksPage.checkBookFormFieldValidity(manageBooksPage.numeroPaginasField, true);

  await manageBooksPage.adicionarLivroButton.click();
  newAmountGridLivros = await manageBooksPage.gridBookAmount.count();
  expect(newAmountGridLivros).toBeGreaterThan(initialAmountGridLivros);

  const newBookCard = page.locator(`//div[@class="book-card"]//h3[contains(text(), "${newBook.nome}")]`);
  await expect(newBookCard).toBeVisible()
})