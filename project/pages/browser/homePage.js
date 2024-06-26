import { check } from 'k6';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.navBar = page.locator('#narvbarx');
    this.categoriesList = page.locator('.list-group');
    this.pagination = page.locator('#frm');
    this.pageProducts = page.locator('#tbodyid');
    this.card = page.locator('.card');
  }

  async goto() {
    await this.page.goto('https://www.demoblaze.com/index.html', { waitUntil: 'networkidle' })
  }

  getCategoryButton(buttonName = "Phones") {
    return this.page.locator(`//a[text()="${buttonName}"]`);
  }

  getProduct(productName) {
    return this.page.waitForSelector(`//a[text()="${productName}"]`);
  }

  getProductPrice(productName) {
    return this.getProduct(productName).waitForSelector('../../h5');
  }

  getProductDescription(productName) {
    return this.getProduct(productName).waitForSelector('../../p');
  }

  clickNextBtn() {
    page.waitForSelector('//button[text()="Next"]/..').click({force: true});
  }

  clickPreviousBtn() {
    page.waitForSelector('//button[text()="Previous"]/..').click({force: true});
  }

  selectCategory(product) {
    const productCat = (product.cat === 'notebook') 
        ? 'Laptops' 
        : `${product.cat.charAt(0).toUpperCase()}${product.cat.slice(1)}s`;
    this.page.waitForSelector(`//a[text()="${productCat}"]`);
    this.getCategoryButton(productCat).click({force: true});
  }

  selectProduct(product) {
    this.getProduct(product.title).click({force: true});
  }
}

