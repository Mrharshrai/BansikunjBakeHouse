import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './core/services/product.service';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer';
import { FooterComponent } from './shared/components/footer/footer';
import { HeaderComponent } from './shared/components/header/header';
import { ToastComponent } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CartDrawerComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly productService = inject(ProductService);

  constructor() {
    this.productService.loadCatalogue();
  }
}
