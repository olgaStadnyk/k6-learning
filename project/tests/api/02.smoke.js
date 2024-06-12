import { group } from 'k6';
import { SmokeOptions } from '../../config/load-options.js';
import { loginToApp } from '../../pages/api/login.js';
import { addToCart } from '../../pages/api/add-to-cart.js';
import { isItemAddedToCart, isCartEmpty } from '../../utils/api/cart.js';
import { executeStep } from '../../utils/common-functions.js';
import { doPurchase } from '../../pages/api/do-purchase.js';
import { logout } from '../../pages/api/logout.js';
import { viewProduct } from '../../pages/api/view-product.js';
import { openHomePage } from '../../pages/api/home-page.js';
import { getAllProducts } from '../../pages/api/get-all-products.js';
import { getAllProductsByCat } from '../../pages/api/get-all-products-category.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const PRODUCT_ID = 10;
const PRODUCT_CATEGORY = "monitor";

export const options = {
  vus: SmokeOptions.vus,
  duration: SmokeOptions.duration,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['avg<300', 'p(95)<400'],
    checks: [{threshold: 'rate > 0.9', abortOnFail: true, delayAbortEval: '5s'}]
  },
  cloud: {
    projectID: 3699789,
  },
};

export default function () {
  group('User Journey', function () {
    executeStep(openHomePage);
    executeStep(loginToApp);
    executeStep(getAllProducts);
    executeStep(() => getAllProductsByCat(PRODUCT_CATEGORY, 2));
    executeStep(() => viewProduct(PRODUCT_ID, PRODUCT_CATEGORY));
    executeStep(() => addToCart(PRODUCT_ID));
    executeStep(() => isItemAddedToCart(PRODUCT_ID));
    executeStep(doPurchase);
    executeStep(isCartEmpty);
    executeStep(logout, 0);
  });
}

export function handleSummary(data) {
  return {
    "project/results/smoke/02.summary.html": htmlReport(data),
  };
}