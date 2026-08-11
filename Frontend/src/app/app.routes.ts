import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Bansikunj Cookies | Freshly Baked Goodness',
    loadComponent: () => import('./features/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    title: 'All Cookies | Bansikunj',
    loadComponent: () => import('./features/products/product-list').then((m) => m.ProductListComponent),
  },
  {
    path: 'products/:id',
    title: 'Product | Bansikunj',
    loadComponent: () =>
      import('./features/product-details/product-details').then((m) => m.ProductDetailsComponent),
  },
  {
    path: 'category/:slug',
    title: 'Category | Bansikunj',
    loadComponent: () => import('./features/products/product-list').then((m) => m.ProductListComponent),
  },
  {
    path: 'cart',
    title: 'Your Cart | Bansikunj',
    loadComponent: () => import('./features/cart/cart-page').then((m) => m.CartPageComponent),
  },
  {
    path: 'checkout',
    title: 'Checkout | Bansikunj',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.CheckoutComponent),
  },
  {
    path: 'login',
    title: 'Login | Bansikunj',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Create Account | Bansikunj',
    loadComponent: () => import('./features/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'account',
    title: 'My Account | Bansikunj',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account').then((m) => m.AccountComponent),
  },
  {
    path: 'orders',
    title: 'My Orders | Bansikunj',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/order-list').then((m) => m.OrderListComponent),
  },
  {
    path: 'admin',
    title: 'Admin | Bansikunj',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      {
        path: 'products',
        title: 'Manage Products | Bansikunj Admin',
        loadComponent: () => import('./features/admin/admin-products').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'orders',
        title: 'Manage Orders | Bansikunj Admin',
        loadComponent: () => import('./features/admin/admin-orders').then((m) => m.AdminOrdersComponent),
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found | Bansikunj',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
