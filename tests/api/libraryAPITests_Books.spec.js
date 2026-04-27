// @ts-check
import { test, expect } from '@playwright/test';
import { createBookData } from '../resources/common/testDataCreation';

test.describe("List, Update and Delete Book from Library (Having a New Book Added 'beforeEach')", () => {
  // test data:
  let newBook = {
    "nome": undefined,
    "autor": undefined,
    "paginas": undefined,
    "descricao": undefined,
    "imagemUrl": undefined
  };
  let newBookId = 0; // id is a number (integer) - see swagger

  // tests:
  test.beforeEach("New Book Added to Library", async ({ request }) => {
    newBook = createBookData();

    const response = await request.post("/livros",
      {
        data: newBook
      }
    );

    const body = await response.json();
    newBookId = body.id;

    expect(response.status()).toBe(201)
  });

  test("Successfull Listing of all Books with Correct Response Body Properties Available - API-005", async ({ request }) => {
    const response = await request.get("/livros");

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("nome");
    expect(body[0]).toHaveProperty("autor");
    expect(body[0]).toHaveProperty("paginas");
    expect(body[0]).toHaveProperty("descricao");
    expect(body[0]).toHaveProperty("imagemUrl");
    expect(body[0]).toHaveProperty("dataCadastro")
  });

  test("Successfull Listing of all Books with Correct Values/Format in Response Body - API-005", async ({ request }) => {
    const response = await request.get("/livros");

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Number.isInteger(body[0].paginas)).toBe(true);
    expect(body[0].paginas).toBeGreaterThan(0);
    const iso860RegexExpr = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    expect(body[0].dataCadastro).toMatch(iso860RegexExpr)
  });

  test("Successfull Listing of Existing Book by its ID with Correct Response Body Properties Available - API-006", async ({ request }) => {
    const response = await request.get(`/livros/${newBookId}`);

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("nome");
    expect(body).toHaveProperty("autor");
    expect(body).toHaveProperty("paginas");
    expect(body).toHaveProperty("descricao");
    expect(body).toHaveProperty("imagemUrl");
    expect(body).toHaveProperty("dataCadastro")
  });

  test("Successfull Listing of Existing Book by its ID with Correct Values in Response Body - API-006", async ({ request }) => {
    const response = await request.get(`/livros/${newBookId}`);

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(newBookId);
    expect(body.nome).toBeDefined();
    expect(body.nome).toBe(newBook.nome);
    expect(body.autor).toBe(newBook.autor);
    expect(body.paginas).toBe(newBook.paginas);
    expect(body.descricao).toBe(newBook.descricao);
    expect(body.imagemUrl).toBe(newBook.imagemUrl)
  });

  test("Failing to List a Non-Existent Book - API-007", async ({ request }) => {
    const deleteResponse = await request.delete(`/livros/${newBookId}`);

    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(`/livros/${newBookId}`);

    const getBody = await getResponse.json();

    expect(getResponse.status()).toBe(404);
    expect(getBody).toHaveProperty("mensagem");
    expect(getBody.mensagem.trim()).toBe("Livro não encontrado")
  });

  test("Successfull Book Update with Correct Values in Response Body - API-009", async ({ request }) => {
    const updatedBook = createBookData();

    const response = await request.put(`/livros/${newBookId}`,
      {
        data: updatedBook
      }
    );

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(newBookId);
    expect(body.nome).toBe(updatedBook.nome);
    expect(body.autor).toBe(updatedBook.autor);
    expect(body.paginas).toBe(updatedBook.paginas);
    expect(body.descricao).toBe(updatedBook.descricao);
    expect(body.imagemUrl).toBe(updatedBook.imagemUrl)
  });

  test("Successfull Book Delete with Correct Values in Response Body - API-010", async ({ request }) => {
    const deleteResponse = await request.delete(`/livros/${newBookId}`);

    const deleteBody = await deleteResponse.json();

    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody).toHaveProperty("mensagem");
    expect(deleteBody.mensagem.trim()).toBe("Livro removido com sucesso");


    const getResponse = await request.get(`/livros/${newBookId}`);

    expect(getResponse.status()).toBe(404)
  })
});


test.describe("Add a New Book to Library without Previous POST of a New Book (beforeEach)", () => {
  // test data:
  let newBook2 = {
    "nome": undefined,
    "autor": undefined,
    "paginas": undefined,
    "descricao": undefined,
    "imagemUrl": undefined
  };

  // tests:
  test.beforeEach("New Book Data Creation", async () => {
    newBook2 = createBookData()
  });

  test("Successfull Book Addition to Library with Correct Response Body Properties Available - API-008", async ({ request }) => {
    const response = await request.post("/livros",
      {
        data: newBook2
      }
    );

    const body = await response.json(); 

    expect(response.status()).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("nome");
    expect(body).toHaveProperty("autor");
    expect(body).toHaveProperty("paginas");
    expect(body).toHaveProperty("descricao");
    expect(body).toHaveProperty("imagemUrl");
    expect(body).toHaveProperty("dataCadastro")
  });

  test("Successfull Book Addition to Library with Correct Values in Response Body - API-008", async ({ request }) => {
    const response = await request.post("/livros",
      {
        data: newBook2
      }
    );

    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.nome).toBe(newBook2.nome);
    expect(body.autor).toBe(newBook2.autor);
    expect(body.paginas).toBe(newBook2.paginas);
    expect(body.descricao).toBe(newBook2.descricao);
    expect(body.imagemUrl).toBe(newBook2.imagemUrl);
    expect(body.dataCadastro).toBeDefined()
  })
})