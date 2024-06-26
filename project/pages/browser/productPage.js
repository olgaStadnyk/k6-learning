import { check } from 'k6';
import { expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";

export class ProductPage {
  constructor(page) {
    this.page = page;
    this.picture = page.locator('.item > img');
    this.title = page.locator('.name');
    this.price = page.locator('.price-container');
    this.moreInfo = page.locator('#more-information');
    this.addToCartBtn = page.locator('.btn-success');
  }

  addToCart() {
    this.addToCartBtn.click({force: true});
  }

  isOnPage() {
    this.page.waitForSelector(`.name`);
    if (!this.title.isVisible()) {
      console.log("element is NOT visible");
    }
  }
}

