// #rgnpcrz Kjo logjike ka me u bo update
// export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
// export const API_URL = `${BACKEND_URL}/api`;

export const API_URL = import.meta.env.VITE_API_URL || 'https://pw-backend-staging.diesea.de/api';
export const BACKEND_URL = API_URL.replace(/\/api$/, '');
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
export const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE || 'pummmys';
export const CONSOLE_LOG = import.meta.env.VITE_CONSOLE_LOG === 'true';
export const GIFTCARD_PRODUCT_ID = parseInt(
  import.meta.env.VITE_GIFTCARD_PRODUCT_ID || 8009132998969,
);
export const CLARITY_TOKEN = import.meta.env.VITE_CLARITY_ID || 'm9c2bux91s';
export const ENVIRONMENT = import.meta.env.VITE_FRONT_ENV || 'production';
export const ONE_ORDER_RULE_ID = parseInt(import.meta.env.VITE_ONE_ORDER_RULE_ID || 11);
