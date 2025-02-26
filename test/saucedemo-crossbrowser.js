const { Builder, By, until, Browser } = require("selenium-webdriver");
const assert = require("assert");

async function runTest() {
  const browsers = ['chrome', 'firefox', 'MicrosoftEdge'];

  for (let browser of browsers) {
    let driver = await new Builder().forBrowser(browser).build();

    try {
      await driver.get("https://www.saucedemo.com/");
      await driver.wait(until.elementLocated(By.id("user-name")), 5000); 
  
      // Login
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      console.log("Logged in");
  
      // Validating that the user is on the dashboard page
      let menuButton = await driver.findElement(By.id("react-burger-menu-btn"));
      assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible");
  
      // Adding an item to the cart
      let addToCartButton = await driver.findElement(
        By.xpath("//button[text()='Add to cart']")
      );
      await addToCartButton.click();
      console.log("Item added to cart!");
  
      // Validating that the item is in the cart...
      let cartBadge = await driver.wait(
        until.elementLocated(By.className("shopping_cart_badge")),
        5000
      );
      let cartCount = await cartBadge.getText();
      assert.strictEqual(cartCount, "1", "Failed to add item to the cart!");
      console.log("Test passed! with browser " + browser);
    }
  
    finally {
      console.log("Closing browser...");
      await driver.quit();
    }
  }
}

runTest();