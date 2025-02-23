const { Builder, By, until } = require("selenium-webdriver");

async function runTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Opening Saucedemo Page");
    await driver.get("https://www.saucedemo.com/");
    await driver.sleep(5000); 

    // Login
    console.log("Logging in with user standard_user");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();
    await driver.sleep(3000); 

    // Validasi bahwa user ada di halaman dashboard
    console.log("Validating that the user is on the dashboard page...");
    await driver.wait(until.urlContains("inventory.html"), 5000);
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("inventory.html")) {
      console.log("Login success!");
    } else {
      throw new Error("Login failed!");
    }

    // Menambahkan item ke keranjang
    console.log("Adding an item to the cart...");
    let addToCartButton = await driver.findElement(
      By.xpath("//button[text()='Add to cart']")
    );
    await addToCartButton.click();
    await driver.sleep(2000); 

    // Validasi item ada di keranjang
    console.log("Validating that the item is in the cart...");
    let cartBadge = await driver.wait(
      until.elementLocated(By.className("shopping_cart_badge")),
      5000
    );
    let cartCount = await cartBadge.getText();

    if (cartCount === "1") {
      console.log("Item successfully added to the cart!");
    } else {
      throw new Error("Failed to add item to the cart.");
    }

    await driver.sleep(3000);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Closing browser...");
    await driver.quit();
  }
}

// Jalankan test
runTest();
