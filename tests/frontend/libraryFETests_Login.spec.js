// @ts-check 
import { test, expect } from '@playwright/test';
import RegistrationPage from '../resources/pom/RegistrationPage';
import LoginPage from '../resources/pom/LoginPage';
import DashboardPage from '../resources/pom/DashboardPage';
import { createUserData } from '../resources/common/testDataCreation';
import { getUsuarioFromLocalStorage } from '../resources/common/localStorageDataManagement';

// test data:
let newUser = {
  "nome": undefined,
  "email": undefined,
  "senha": undefined
};

const loginUrlExtension = "./login.html";

// tests:
test.beforeEach("User Registration", async({ page }) => {
  const registrationPage = new RegistrationPage(page);
  
  newUser = createUserData();
  
  await page.goto("./registro.html");
  await expect(registrationPage.registrationPageTitle).toBeVisible();

  await registrationPage.fillFormCorrectly(newUser);
  await expect(page).toHaveURL(loginUrlExtension)
});

test("Successfull Login - FE-003", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  console.log(newUser); // proves newUser is not undefined

  await page.goto(loginUrlExtension);
  await expect(loginPage.loginPageTitle).toBeVisible();

  await loginPage.fillLoginFiledsCorrectly(newUser);
  await expect(page).toHaveURL("./dashboard.html");

  await expect(dashboardPage.headerUserInfo).toContainText(newUser.nome); // says newUser.nome is undefined, but it is not and runs (console.log above this, proves it)

  
  const usuario = await getUsuarioFromLocalStorage(page);

  expect(usuario).toMatchObject({
    "nome": newUser.nome,
    "email": newUser.email
  })
});

test("Failing to Login - Invalid Credentials (Wrong Password) - FE-004", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(loginUrlExtension);
  await expect(loginPage.loginPageTitle).toBeVisible();

  await loginPage.fillLoginFileds_IncorrectCredentials(newUser);
  await expect(page).toHaveURL(loginUrlExtension);

  await expect(loginPage.emailField).not.toBeEmpty();
  await expect(loginPage.senhaField).not.toBeEmpty()
})
