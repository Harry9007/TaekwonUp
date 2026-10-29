const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

async function ejecutarFirefox() {
  // Configuración opcional: puedes agregar opciones como el modo headless (sin interfaz gráfica)
  let options = new firefox.Options();
  // options.addArguments('--headless'); // Descomentar si deseas ejecutar Firefox en segundo plano

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  try {
    // Navegar a una página web de prueba
    await driver.get('http://127.0.0.1:5500/Frontend/index.html');

    // Obtener y mostrar el título de la página
    let titulo = await driver.getTitle();
    console.log('El título de la página es:', titulo);

  } finally {
  
  }
}

ejecutarFirefox();
