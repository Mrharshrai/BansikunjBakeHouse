import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { IconComponent } from '../../shared/components/icon/icon';
import { LoaderComponent } from '../../shared/components/loader/loader';
import { asNumber } from '../../core/utils/format';

@Component({
  selector: 'app-admin-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, LoaderComponent],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
})
export class AdminProductsComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);
  protected readonly asNumber = asNumber;
  protected readonly inStockCount = computed(() => this.productService.products().filter((p) => p.in_stock).length);
  protected readonly editingId = signal<string | null>(null);
  protected readonly editorOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required], description: ['', Validators.required], price: [0, [Validators.required, Validators.min(0)]], mrp: [0], category: ['', Validators.required], image_url: ['', Validators.required], weight: [''], tags: [''], stock_quantity: [0], is_best_seller: [false], is_active: [true],
  });

  constructor(){ this.productService.fetchCategories(true).subscribe(); this.productService.fetchProducts({limit:100, page:1}); }

  openCreate(): void { this.editingId.set(null); this.editorOpen.set(true); this.form.reset({ category: this.productService.categories()[0]?.slug||'', price:0,mrp:0,stock_quantity:0,is_best_seller:false,is_active:true }); }
  openEdit(p: Product): void { this.editingId.set(p.id); this.editorOpen.set(true); this.form.patchValue({ name:p.name, description:p.description, price:asNumber(p.price), mrp:asNumber(p.mrp), category:p.category_slug||p.category||'', image_url:p.image_url, weight:p.weight||'', tags:(p.tags||[]).join(', '), stock_quantity:p.stock_quantity, is_best_seller:p.is_best_seller, is_active:p.is_active }); }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const payload: any = { name:v.name, description:v.description, price:v.price, mrp:v.mrp||null, category:v.category, image_url:v.image_url, weight:v.weight||null, tags:v.tags.split(',').map(t=>t.trim()).filter(Boolean), stock_quantity:v.stock_quantity, is_best_seller:v.is_best_seller, is_active:v.is_active };
    this.saving.set(true);
    const req = this.editingId() ? this.productService.updateProduct(this.editingId()!, payload) : this.productService.createProduct(payload);
    req.subscribe({ next:()=>{ this.saving.set(false); this.editorOpen.set(false); this.editingId.set(null); this.toast.show('Product saved'); this.productService.fetchProducts({limit:100}); }, error:(e)=>{ this.saving.set(false); this.toast.show(e?.error?.message||'Save failed','error'); } });
  }
  cancel(): void { this.editorOpen.set(false); this.editingId.set(null); }
  delete(p: Product): void { if(!confirm(`Delete "${p.name}"?`)) return; this.productService.deleteProduct(p.id).subscribe({ next:()=>{this.toast.show('Product delisted','info'); this.productService.fetchProducts({limit:100});}, error:(e)=>this.toast.show(e?.error?.message||'Delete failed','error') }); }
}
