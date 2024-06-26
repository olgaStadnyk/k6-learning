import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';
import { HomePage } from '../../pages/browser/homePage.js';
import { ProductPage } from '../../pages/browser/productPage.js';

const jsonData = JSON.parse(open('../../data/products.json')).products;

function getRandomProduct() {
  return jsonData[Math.floor(Math.random() * jsonData.length)];
}

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 2,
      iterations: 2,
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
  }
};

export default async function () {
  webJourney();
}

export async function webJourney() {
  const page = browser.newPage();
  const product = getRandomProduct();

  const homepage = new HomePage(page)
  await homepage.goto();

  sleep(1);

  check(page, {
    'navBar': p => homepage.navBar.isVisible(),
    'categoriesList': p => homepage.categoriesList.isVisible(),
    'pagination': p => homepage.pagination.isVisible(),
    'pageProducts': p => homepage.pageProducts.isVisible(),
  });

  homepage.selectCategory(product);
  sleep(2);
  page.screenshot({ path: `screenshots/0.png` });
  homepage.selectProduct(product);
  sleep(1);

  const productPage = new ProductPage(page);
  sleep(1);
  productPage.isOnPage();
  page.screenshot({ path: `screenshots/1.png` });

  check(page, {
    'picture': p => productPage.picture.isVisible(),
    'title': p => productPage.title.isVisible(),
    'title text': p => productPage.title.textContent() === product.title,
    'price': p => productPage.price.isVisible(),
    'moreInfo': p => productPage.moreInfo.isVisible(),
    'addToCartBtn': p => productPage.addToCartBtn.isEnabled(),
  });

  productPage.addToCart();
  page.close();
}