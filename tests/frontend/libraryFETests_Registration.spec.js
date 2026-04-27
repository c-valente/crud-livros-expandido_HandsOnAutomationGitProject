// @ts-check 
import { test, expect } from '@playwright/test';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import { createUserData } from '../resources/common/testDataCreation';

// test data:
const registrationUrlExtension = "./registro.html";

// tests:
test("Successfull Registration - FE-001", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);

  await page.goto(registrationUrlExtension);
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(
    createUserData()
  );
  await expect(page).toHaveURL("./login.html");

  await expect(loginPage.emailField).toBeEmpty();
  await expect(loginPage.senhaField).toBeEmpty()
});

test("Failing to Register - Password Confirmation not Matching - FE-002", async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await page.goto(registrationUrlExtension);
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillForm_IncorrectPasswordConfirmation(
    createUserData()
  );
  await expect(page).toHaveURL(registrationUrlExtension)
})
