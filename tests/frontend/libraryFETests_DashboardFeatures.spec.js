// @ts-check 
import { test, expect } from '@playwright/test';
import DashboardPage from '../resources/pom/DashboardPage';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import { createUserData } from '../resources/common/testDataCreation';
import { createBookData } from '../resources/common/testDataCreation';
import { consoleErrorsExposure } from '../resources/common/pageEventHandling';

// test data:
const dashboardUrlExtension = "./dashboard.html";

// tests:
test.beforeEach("User Registration, Login and Book Addition to Library", async({ page, request }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  
  const newUser = createUserData();
  
  await page.goto("./registro.html");
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(newUser);
  await expect(page).toHaveURL("./login.html")

  await loginPage.fillLoginFiledsCorrectly(newUser);
  await expect(page).toHaveURL(dashboardUrlExtension);

  
  const newBook = createBookData();

  const response = await request.post("/livros",
    {
      data: newBook
    }
  );

  expect(response.status()).toBe(201)
});

test("Successfull Dashboard Features Exhibition - Statistic Cards - FE-006", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await expect(dashboardPage.statisticCardTotalLivros).toBeVisible();
  await expect(dashboardPage.statisticCardTotalPaginas).toBeVisible();
  await expect(dashboardPage.statisticCardTotalUsuarios).toBeVisible();

  const cardTotalLivrosNumber = await dashboardPage.getStatisticNumbertoRealNumber(dashboardPage.statisticCardTotalLivrosNumber);
  expect(Number.isInteger(cardTotalLivrosNumber)).toBe(true);
  
  const cardTotalPaginasNumber = await dashboardPage.getStatisticNumbertoRealNumber(dashboardPage.statisticCardTotalPaginasNumber)
  expect(Number.isInteger(cardTotalPaginasNumber)).toBe(true);
  
  const cardTotalUsuariosNumber = await dashboardPage.getStatisticNumbertoRealNumber(dashboardPage.statisticCardTotalUsuariosNumber)
  expect(Number.isInteger(cardTotalUsuariosNumber)).toBe(true)
});

test("Successfull Dashboard Features Exhibition - Last Books Added - FE-006", async ({ page }) => { 
  const dashboardPage = new DashboardPage(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await expect(dashboardPage.gridUltimosLivros).toBeVisible();

  const countGridUltimosLivros = await (dashboardPage.gridBookAmount).count();
  expect(countGridUltimosLivros).toBeLessThanOrEqual(5)
});

test("Successfull Dashboard Features Exhibition - Book Cards Info - FE-006", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await expect(dashboardPage.bookCardTitle).toBeVisible();
  await expect(dashboardPage.bookCardAutor).toBeVisible();
  await expect(dashboardPage.bookCardImg).toBeVisible()
});

test("Successfull Navigation from Dashboard to same Dashboard Page - FE-009", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  consoleErrorsExposure(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await dashboardPage.dashboardButton.click();
  await expect(page).toHaveURL(dashboardUrlExtension)
});

test("Successfull Navigation from Dashboard to Manage Books Page - FE-009", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  consoleErrorsExposure(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await dashboardPage.gerenciarButton.click();
  await expect(page).toHaveURL("/livros.html")
});

test("Successfull Navigation from Dashboard to Favorites Page - FE-009", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  consoleErrorsExposure(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();

  await dashboardPage.favoritosdButton.click();
  await expect(page).toHaveURL("/favoritos.html")
})
