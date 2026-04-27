// erasing localStorage
export async function eraseLocalStorage(page) {
  await page.evaluate(() => {
    localStorage.clear()
  })
};

// extracting localStorage
export async function getLocalStorage(page) {
  return await page.evaluate(() => {
    return Object.keys(localStorage)
  })
};

// extracting usuario from localStorage
export async function getUsuarioFromLocalStorage(page) {
  return await page.evaluate(() => {
    const usuario = localStorage.getItem("usuario");
    return JSON.parse(usuario)
  })
}