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
test.beforeEach("New User Data Creation", async () => {
  newUser = createUserData()
});

test("New User Successfull Registration with Correct Response Body Properties Available - API-001", async ({ request }) => {
  const response = await request.post("/registro",
    {
      data: newUser
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body).toHaveProperty("mensagem");
  expect(body).toHaveProperty("usuario");
  expect(body.usuario).toHaveProperty("id");
  expect(body.usuario).toHaveProperty("nome");
  expect(body.usuario).toHaveProperty("email");
  expect(body.usuario).not.toHaveProperty("senha")
});

test("New User Successfull Registration with Correct Values in Response Body - API-001", async ({ request }) => {
  const response = await request.post("/registro",
    {
      data: newUser
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body.mensagem.trim()).toBe("Usuário criado com sucesso");
  expect(Number.isInteger(body.usuario.id)).toBe(true);
  expect(body.usuario.id).toBeGreaterThan(0);
  expect(body.usuario.nome).toBe(newUser.nome);
  expect(body.usuario.email).toBe(newUser.email)
});

test("Failing to Register with a Repeated Email - API-002", async ({ request }) => {
  const firstPostResponse = await request.post("/registro",
    {
      data: newUser
    }
  );

  expect(firstPostResponse.status()).toBe(201);

  const secondPostResponse = await request.post("/registro",
    {
      data: createUserData(undefined, newUser.email, undefined)
    }
  );

  const secondPostBody = await secondPostResponse.json();

  expect(secondPostResponse.status()).toBe(400);
  expect(secondPostBody).toHaveProperty("mensagem");
  expect(secondPostBody.mensagem.trim()).toBe("Email já cadastrado")
})
