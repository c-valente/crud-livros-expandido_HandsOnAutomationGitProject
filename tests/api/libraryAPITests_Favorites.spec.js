// @ts-check
import { test, expect } from '@playwright/test';
import { createUserData, createBookData } from '../resources/common/testDataCreation';

// test data:
let newUser = {
  "nome": undefined,
  "email": undefined,
  "senha": undefined
};
let newUserId = 0; // it is an integer, see swagger

let newBook = {
    "nome": undefined,
    "autor": undefined,
    "paginas": undefined,
    "descricao": undefined,
    "imagemUrl": undefined
  };
let newBookId = 0; // it is an integer, see swagger

//tests:
test.beforeEach("User Registration and New Book Data Creation", async ({ request }) => {
  newUser = createUserData();

  const postRegistroResponse = await request.post("/registro",
    {
      data: newUser
    }
  );

  const postRegistroBody = await postRegistroResponse.json();
  newUserId = postRegistroBody.usuario.id;

  expect(postRegistroResponse.status()).toBe(201);


  newBook = createBookData();

  const postLivrosResponse = await request.post("/livros",
    {
      data: newBook
    }
  );

  const postLivrosBody = await postLivrosResponse.json();
  newBookId = postLivrosBody.id;

  expect(postLivrosResponse.status()).toBe(201)
});

test("Successfull Book Addition to Favorites with Correct Message in Response Body - API-012", async ({ request }) => {
  const response = await request.post("/favoritos",
    {
      data: {
        "usuarioId": newUserId,
        "livroId": newBookId
      }
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body).toHaveProperty("mensagem");
  expect(body.mensagem.trim()).toBe("Livro adicionado aos favoritos")
});

test("Successfull Listing of Favorite Books of the User with Correct Values/Format in Response Body - API-013", async ({ request }) => {
   const postFavoritosResponse = await request.post("/favoritos", 
    {
      data: {
        "usuarioId": newUserId,
        "livroId": newBookId
      }
    }
  );
  
  expect(postFavoritosResponse.status()).toBe(201);
  
  
  const getFavoritosResponse = await request.get(`/favoritos/${newUserId}`); 
  
  const getFavoritosBody = await getFavoritosResponse.json();

  expect(getFavoritosResponse.status()).toBe(200);

  
  const deleteFavoritosResponse = await request.delete("/favoritos",
    {
      data: {
        "usuarioId": newUserId,
        "livroId": newBookId
        
      }
    }
  );
  
  expect(deleteFavoritosResponse.status()).toBe(200);
  
  
  const getFavoritosResponseAfterDelete = await request.get(`/favoritos/${newUserId}`);

  const geFavoritosBodyAfterDelete = await getFavoritosResponseAfterDelete.json();

  expect(geFavoritosBodyAfterDelete.length).toEqual(getFavoritosBody.length-1);

  let foundAfterDelete = false;
  for (let livro of geFavoritosBodyAfterDelete) {
    if (livro.id == newBookId) {
      foundAfterDelete = true;
      break
    }
  };
  expect(foundAfterDelete).toBeFalsy();

  expect(getFavoritosResponseAfterDelete.status()).toBe(200);
  expect(Array.isArray(geFavoritosBodyAfterDelete)).toBe(true)
})