import { group } from 'k6';
import { AverageStages } from '../../config/load-options.js';
import { loginToApp } from '../../pages/api/login.js';
import { addToCart } from '../../pages/api/add-to-cart.js';
import { isItemAddedToCart, isCartEmpty } from '../../pages/api/cart.js';
import { executeStep } from '../../utils/common-functions.js';
import { doPurchase } from '../../pages/api/do-purchase.js';
import { logout } from '../../pages/api/logout.js';
import { viewProduct } from '../../pages/api/view-product.js';
import { openHomePage } from '../../pages/api/home-page.js';
import { getAllProducts } from '../../pages/api/get-all-products.js';
import { getAllProductsByCat } from '../../pages/api/get-all-products-category.js';
import { NavigateToNextPage } from '../../pages/api/pagination.js';
import { csvData } from '../../pages/api/login.js';

const jsonData = JSON.parse(open('../../data/products.json')).products;

function getRandomProduct() {
  return jsonData[Math.floor(Math.random() * jsonData.length)];
}

export const options = {
  stages: AverageStages,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<300', 'p(95)<400'],
    checks: [{threshold: 'rate > 0.9', abortOnFail: true, delayAbortEval: '5s'}]
  },
  cloud: {
    projectID: 3699789,
  },
};

export default function() {
  userJourney();
  
}

export function userJourney() {
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

function PurchaseFlow() {
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

function PaginationFlow() {
  const product = getRandomProduct();

  executeStep(getAllProducts);
  executeStep(() => getAllProductsByCat("notebook"));
  executeStep(() => NavigateToNextPage(9));
  executeStep(() => NavigateToNextPage(1));
  executeStep(() => viewProduct(product));
}

export function teardown(data) {
  doPurchase(false);
}