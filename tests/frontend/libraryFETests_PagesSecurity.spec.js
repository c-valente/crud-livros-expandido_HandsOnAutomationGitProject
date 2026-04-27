// @ts-check 
import { test, expect } from '@playwright/test';
import { createUserData } from '../resources/common/testDataCreation';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import { eraseLocalStorage } from '../resources/common/localStorageDataManagement';

// test data:
let newUser = {
  "nome": undefined,
  "email": undefined,
  "senha": undefined
};

const loginUrlExtension = "./login.html";
const dashboardUrlExtension = "./dashboard.html";

// tests:
test("Successfull Denied Unauthorized Access to Dashboard Page - FE-005", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  
  newUser = createUserData();
  
  await page.goto("./registro.html");
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(newUser);
  await expect(page).toHaveURL(loginUrlExtension);

  await loginPage.fillLoginFiledsCorrectly(newUser);
  await expect(page).toHaveURL(dashboardUrlExtension);

  await eraseLocalStorage(page);
  await page.goto(dashboardUrlExtension);
  await expect(page).toHaveURL(loginUrlExtension)
})