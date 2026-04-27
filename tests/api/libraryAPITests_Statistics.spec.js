// @ts-check
import { test, expect } from '@playwright/test';

//tests:
test("Successfull Listing of all Library Statistics with Correct Response Body Properties Available - API-011", async ({ request }) => {
  const response = await request.get("/estatisticas");

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body).toHaveProperty("totalLivros");
  expect(body).toHaveProperty("totalPaginas");
  expect(body).toHaveProperty("totalUsuarios")
});

test("Successfull Listing of all Library Statistics with Correct Values in Response Body - API-011", async ({ request }) => {
  const getLivrosResponse = await request.get("/livros");

  const getLivrosBody = await getLivrosResponse.json();

  expect(getLivrosResponse.status()).toBe(200);

  let paginasSum = 0;
  for (let livro of getLivrosBody) {
    paginasSum += livro.paginas
  };


  const getEstatisticasResponse = await request.get("/estatisticas");

  const getEstatisticasBody = await getEstatisticasResponse.json();

  expect(getEstatisticasResponse.status()).toBe(200);
  expect(Number.isInteger(getEstatisticasBody.totalLivros)).toBe(true);
  expect(getEstatisticasBody.totalLivros).toBeGreaterThanOrEqual(0);
  expect(getEstatisticasBody.totalLivros).toBe(getLivrosBody.length);
  expect(Number.isInteger(getEstatisticasBody.totalPaginas)).toBe(true);
  expect(getEstatisticasBody.totalPaginas).toBeGreaterThanOrEqual(0);
  expect(getEstatisticasBody.totalPaginas).toBe(paginasSum);
  expect(Number.isInteger(getEstatisticasBody.totalUsuarios)).toBe(true);
  expect(getEstatisticasBody.totalUsuarios).toBeGreaterThanOrEqual(0)
})