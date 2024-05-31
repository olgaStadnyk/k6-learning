import { group } from 'k6';
import { SmokeOptions } from '../../config/load-options.js';
import { loginToApp } from '../../utils/login.js';
import { addToCart } from '../../utils/add-to-cart.js';
import { isItemAddedToCart, isCartEmpty } from '../../utils/cart.js';
import { waitTime } from '../../utils/common-functions.js';
import { doPurchase } from '../../utils/do-purchase.js';
import { logout } from '../../utils/logout.js';
import { viewProduct } from '../../utils/view-product.js';
import { openHomePage } from '../../utils/home-page.js';
import { getAllProducts } from '../../utils/get-all-products.js';
import { getAllProductsByCat } from '../../utils/get-all-products-category.js';

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
};

export default function () {
  group('User Journey', function () {
    openHomePage();
    waitTime(1);
    loginToApp(); 
    waitTime(1);
    getAllProducts();
    waitTime(1); 
    getAllProductsByCat(PRODUCT_CATEGORY, 2);
    waitTime(1); 
    viewProduct(PRODUCT_ID, PRODUCT_CATEGORY);
    waitTime(1); 
    addToCart(PRODUCT_ID);
    isItemAddedToCart(PRODUCT_ID);
    waitTime(1);
    doPurchase();
    waitTime(1);
    isCartEmpty();
    waitTime(1);
    logout();
  });
}