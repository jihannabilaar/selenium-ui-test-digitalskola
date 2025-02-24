const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://www.saucedemo.com/");
    await driver.sleep(3000); 

    // Login
    console.log("Logging in with user standard_user");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();
    await driver.sleep(3000); 

    // Validating that the user is on the dashboard page
    let menuButton = await driver.findElement(By.id("react-burger-menu-btn"));
    assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible");

    // Adding an item to the cart
    let addToCartButton = await driver.findElement(
      By.xpath("//button[text()='Add to cart']")
    );
    await addToCartButton.click();
    await driver.sleep(2000); 

    // Validating that the item is in the cart...
    let cartBadge = await driver.wait(
      until.elementLocated(By.className("shopping_cart_badge")),
      5000
    );
    let cartCount = await cartBadge.getText();
    assert.strictEqual(cartCount, "1", "Failed to add item to the cart!");

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
