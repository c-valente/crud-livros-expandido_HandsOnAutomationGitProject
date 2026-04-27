// @ts-check
import { test, expect } from '@playwright/test';
import { createUserData } from '../resources/common/testDataCreation';

// test data:
let newUser = {
  "nome": undefined,
  "email": undefined,
  "senha": undefined
};

// tests:
test.beforeEach("User Registration", async ({ request }) => {
  newUser = createUserData();

  const response = await request.post("/registro",
    {
      data: newUser
    }
  );

  expect(response.status()).toBe(201)
});

test("Successfull Login (Valid Credentials) with Correct Response Body Properties Available - API-003", async ({ request }) => {
  const response = await request.post("/login",
    {
      data: {
        "email": newUser.email,
        "senha": newUser.senha
      }
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body).toHaveProperty("mensagem");
  expect(body).toHaveProperty("usuario");
  expect(body.usuario).not.toHaveProperty("senha")
});

test("Successfull Login (Valid Credentials) with Correct Message in Response Body - API-003", async ({ request }) => {
  const response = await request.post("/login", 
    {
      data: {
        "email": newUser.email,
        "senha": newUser.senha
      }
    }
  );
  
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.mensagem.trim()).toBe("Login realizado com sucesso")
});

test("Successfull Login (Valid Credentials) with less than 2s Response Time - API-003", async ({ request }) => {
  const start = Date.now();
  const response = await request.post("/login",
    {
      data: {
        "email": newUser.email,
        "senha": newUser.senha
      }
    }
  );
  const elapsedMs = Date.now() - start;

  expect(response.status()).toBe(200);
  expect(elapsedMs).toBeLessThan(2000)
});

test("Failing to Login (Invalid User Credentials - Unregistered User) - API-004", async ({ request }) => {
  const unregisteredUser = createUserData();

  const response = await request.post("/login",
    {
      data: {
          "email": unregisteredUser.email,
          "senha": unregisteredUser.senha
      }
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(401);
  expect(body).toHaveProperty("mensagem");
  expect(body.mensagem.trim()).toBe("Email ou senha incorretos")
});

test("Failing to Login (Empty Request Body) - API-004", async ({ request }) => {
  const response = await request.post("/login",
    {
      data: {}
    }
  );

  expect(response.status()).toBe(401)
})
