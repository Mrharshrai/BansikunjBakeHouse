import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { LoaderComponent } from '../../shared/components/loader/loader';

@Component({
  selector: 'app-admin-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, LoaderComponent],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
})
export class AdminProductsComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);

  protected readonly inStockCount = computed(() => this.productService.products().filter((p) => p.inStock).length);

  protected readonly editingId = signal<string | null>(null);
  protected readonly editorOpen = signal(false);
  protected readonly saving = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    mrp: [0, [Validators.required, Validators.min(0)]],
    category: ['soft-chewy', Validators.required],
    image: ['', Validators.required],
    weight: [''],
    tags: [''],
    isBestSeller: [false],
    inStock: [true],
  });

  openCreate(): void {
    this.editingId.set(null);
    this.editorOpen.set(true);
    this.form.reset({
      category: 'soft-chewy',
      price: 0,
      mrp: 0,
      isBestSeller: false,
      inStock: true,
    });
  }

  openEdit(product: Product): void {
    this.editingId.set(product.id);
    this.editorOpen.set(true);
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp ?? 0,
      category: product.category,
      image: product.image,
      weight: product.weight ?? '',
      tags: product.tags.join(', '),
      isBestSeller: product.isBestSeller,
      inStock: product.inStock,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: Product = {
      id: this.editingId() ?? `p-${Date.now()}`,
      name: value.name,
      description: value.description,
      price: value.price,
      mrp: value.mrp > value.price ? value.mrp : undefined,
      category: value.category,
      categoryName: this.productService.categoryBySlug(value.category)?.name,
      image: value.image,
      rating: 4.5,
      reviewCount: 12,
      tags: value.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      isBestSeller: value.isBestSeller,
      inStock: value.inStock,
      weight: value.weight || undefined,
    };

    this.saving.set(true);
    const request = this.editingId() ? this.productService.updateProduct(payload) : this.productService.createProduct(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.editorOpen.set(false);
        this.editingId.set(null);
        this.toast.show('Product saved');
      },
      error: () => {
        this.saving.set(false);
        this.toast.show('Could not save the product.', 'error');
      },
    });
  }

  cancel(): void {
    this.editorOpen.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  delete(product: Product): void {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }
    this.productService.deleteProduct(product.id).subscribe({
      next: () => this.toast.show('Product deleted', 'info'),
      error: () => this.toast.show('Could not delete the product.', 'error'),
    });
  }
}
