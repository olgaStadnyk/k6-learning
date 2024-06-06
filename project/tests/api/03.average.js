import { group, check } from 'k6';
import { AverageStages } from '../../config/load-options.js';
import { loginToApp } from '../../utils/api/login.js';
import { addToCart } from '../../utils/api/add-to-cart.js';
import { isItemAddedToCart, isCartEmpty } from '../../utils/api/cart.js';
import { executeStep, getProductById } from '../../utils/common-functions.js';
import { doPurchase } from '../../utils/api/do-purchase.js';
import { logout } from '../../utils/api/logout.js';
import { viewProduct } from '../../utils/api/view-product.js';
import { openHomePage } from '../../utils/api/home-page.js';
import { getAllProducts } from '../../utils/api/get-all-products.js';
import { getAllProductsByCat } from '../../utils/api/get-all-products-category.js';
import { NavigateToNextPage } from '../../utils/api/pagination.js';
import { csvData } from '../../utils/api/login.js';

const jsonData = JSON.parse(open('../../data/products.json')).products;

function getRandomProduct() {
  return jsonData[Math.floor(Math.random() * jsonData.length)];
}

export const options = {
  stages: AverageStages,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<400', 'p(95)<500'],
    checks: [{threshold: 'rate > 0.9', abortOnFail: true, delayAbortEval: '5s'}]
  },
  cloud: {
    projectID: 3699789,
  },
};

export default function () {

  group('User Journey', function () {
    executeStep(openHomePage);
    if ((Math.floor((__VU - 1)/csvData.length) % 2 === 1) || (__ITER % 2 === 0)) {
      // console.log(`PaginationFlow VU: ${__VU}  -  ITER: ${__ITER}`);
      PaginationFlow();
    } else {
      // console.log(`PurchaseFlow VU: ${__VU}  -  ITER: ${__ITER}`);
      PurchaseFlow();
    }
  });
}

export function PurchaseFlow() {
  const product = getRandomProduct();

  executeStep(loginToApp, 2);
  executeStep(getAllProducts);
  executeStep(() => getAllProductsByCat(product.cat));
  executeStep(() => viewProduct(product));
  let loggedIn = executeStep(() => addToCart(product.id));
  if (loggedIn) {
    loggedIn = executeStep(() => isItemAddedToCart(product.id));
    if (loggedIn) {
      executeStep(doPurchase);
      executeStep(isCartEmpty);
      executeStep(logout, 0);
    }
  } else {
    PaginationFlow();
  }
}

export function PaginationFlow() {
  const product = getRandomProduct();

  getAllProducts();
  getAllProductsByCat("notebook");
  NavigateToNextPage(9);
  NavigateToNextPage(1);
  viewProduct(product);
}

export function teardown(data) {
  doPurchase(false);
}