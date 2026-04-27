// @ts-check 
import { test, expect } from '@playwright/test';
import LoginPage from '../resources/pom/LoginPage';
import RegistrationPage from '../resources/pom/RegistrationPage';
import { createUserData } from '../resources/common/testDataCreation';
import DashboardPage from '../resources/pom/DashboardPage';
import { getLocalStorage } from '../resources/common/localStorageDataManagement';

// test data:
const loginUrlExtension = "./login.html";
const dashboardUrlExtension = "./dashboard.html";

// tests:
test.beforeEach("User Registration and Login", async({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  
  const newUser = createUserData();
  
  await page.goto("./registro.html");
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(newUser);
  await expect(page).toHaveURL(loginUrlExtension);

  await loginPage.fillLoginFiledsCorrectly(newUser);
  await expect(page).toHaveURL(dashboardUrlExtension)
});

test("Successfull Logout with No Local Storage Remaining - FE-016", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();
  await expect(dashboardPage.sairButton).toBeVisible();
  
  await dashboardPage.sairButton.click();
  await expect(page).toHaveURL(loginUrlExtension);

  const remainStorage = await getLocalStorage(page);
  expect(remainStorage).toHaveLength(0)
});

test("Successfull Logout with Successfull Denied Unauthorized Access to Dashboard Page - FE-016", async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  await page.goto(dashboardUrlExtension);
  await expect(dashboardPage.dashboardPageTitle).toBeVisible();
  await expect(dashboardPage.sairButton).toBeVisible();

  await dashboardPage.sairButton.click();
  await expect(page).toHaveURL(loginUrlExtension);

  await page.goto(dashboardUrlExtension);
  await expect(page).toHaveURL(loginUrlExtension)
})