# API-to-Frontend Feature Mapping (Bansikunj API v0.1.0)
Base URL: `https://bansikunj-api.onrender.com/api/v1`. Responses: `{ success, message, data }`.

## Supported & mapped
- **Auth** `/auth`: register, login, refresh, logout, logout-all, me, forgot-password, reset-password, verify-email, resend-verification.
- **Users** `/users/me`: GET/PUT/PATCH profile (full_name, phone), POST change-password.
- **Products** `/products`: GET paginated (q,category,tag,min_price,max_price,is_best_seller,in_stock,sort,page,limit), GET tags, GET `{ref}`; admin POST/PUT/PATCH/DELETE `{ref}`, PATCH `{ref}/stock`, GET inventory.
- **Categories** `/categories`: GET (admin can include_inactive), POST; GET `{slug}`; admin PUT/PATCH/DELETE `{id}`, POST `{id}/deactivate`.
- **Cart** `/cart/items` (Bearer): GET, POST add, DELETE clear; PUT/DELETE `{product_id}`.
- **Orders** `/orders` (Bearer): POST place, GET mine (page,limit), GET `{id}`, POST `{id}/cancel`. Admin: GET admin/all, GET admin/{id}, PATCH admin/{id}/status.
- **Payments** `/payments`: GET orders/{id}, POST orders/{id}/razorpay, POST orders/{id}/verify (Bearer); POST orders/{id}/refund (admin). Webhook server-only.
- **Addresses** `/addresses` (Bearer): GET/POST, GET/PUT/PATCH/DELETE `{id}`, POST `{id}/default`.
- **Banners** `/banners`: GET public; admin POST, GET/PUT/PATCH/DELETE `{id}`.

## Backend gaps (no API) - UI must mark unavailable, no fake data
Wishlist, reviews/ratings submission, coupons/discounts, shipping settings, payment settings, customer admin/user management, sales analytics/charts, tracking events beyond status, product image upload endpoint.
