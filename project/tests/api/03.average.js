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
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

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
    // console.log(`VU: ${__VU}  -  ITER: ${__ITER}`);

    executeStep(openHomePage);
    if (__VU % 2 === 0) {
      PaginationFlow();
    } else {
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

// export function handleSummary(data) {
//   return {
//     "project/results/smoke/02.summary.html": htmlReport(data),
//   };
// }

export function teardown(data) {
  doPurchase(false);
}