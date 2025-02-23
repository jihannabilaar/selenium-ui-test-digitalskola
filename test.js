const { Builder, By, until } = require("selenium-webdriver");

async function runTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Membuka halaman SauceDemo...");
    await driver.get("https://www.saucedemo.com/");
    await driver.sleep(5000); 

    // Step 1: Login
    console.log("Login dengan user standard_user...");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();
    await driver.sleep(3000); 

    // Step 2: Validasi bahwa user ada di halaman dashboard
    console.log("Memvalidasi user berada di halaman dashboard...");
    await driver.wait(until.urlContains("inventory.html"), 5000);
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("inventory.html")) {
      console.log("Login berhasil! User ada di halaman dashboard.");
    } else {
      throw new Error("Login gagal! Halaman dashboard tidak terbuka.");
    }

    // Step 3: Menambahkan item ke keranjang
    console.log("Menambahkan item ke keranjang...");
    let addToCartButton = await driver.findElement(
      By.xpath("//button[text()='Add to cart']")
    );
    await addToCartButton.click();
    await driver.sleep(2000); 

    // Step 4: Validasi item ada di keranjang
    console.log("Memvalidasi item ada di keranjang...");
    let cartBadge = await driver.wait(
      until.elementLocated(By.className("shopping_cart_badge")),
      5000
    );
    let cartCount = await cartBadge.getText();

    if (cartCount === "1") {
      console.log("Item berhasil ditambahkan ke keranjang!");
    } else {
      throw new Error("Gagal menambahkan item ke keranjang.");
    }

    await driver.sleep(3000);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Menutup browser...");
    await driver.quit();
  }
}

// Jalankan test
runTest();
