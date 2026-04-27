import { faker } from '@faker-js/faker';

// creation of a new user data with random data or not
export function createUserData(nome = undefined, email = undefined, senha = undefined) {
  let newUser = {
    "nome": nome,
    "email": email,
    "senha": senha
  };

  if (newUser.nome == undefined) {
    newUser.nome = faker.person.fullName()
  };
  if (newUser.email == undefined) {
    newUser.email = faker.internet.email({ firstName: newUser.nome })
  };
  if (newUser.senha == undefined) {
    newUser.senha = faker.internet.password({ length: 6 })
  };

  return newUser
};

// creation of a new book with random data or not
export function createBookData(nome = undefined, autor = undefined, paginas = undefined, descricao = undefined, imagemUrl = undefined) {  
  let newBook = {
    "nome": nome,
    "autor": autor,
    "paginas": paginas,
    "descricao": descricao,
    "imagemUrl": imagemUrl
  };

  if (newBook.nome == undefined) {
    newBook.nome = faker.book.title()
  };
  if (newBook.autor == undefined) {
    newBook.autor = faker.book.author()
  };
  if (newBook.paginas == undefined) {
    newBook.paginas = faker.number.int({ max: 400 })
  };
  if (newBook.descricao == undefined) {
    newBook.descricao = faker.lorem.sentence(5)
  };
  if (newBook.imagemUrl == undefined) {
    newBook.imagemUrl = faker.image.url()
  };

  return newBook
}