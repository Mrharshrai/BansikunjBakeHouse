import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';

export interface Banner { id:string; title:string; subtitle?:string|null; image_url:string; link_url?:string|null; is_active:boolean; display_order:number; starts_at?:string|null; ends_at?:string|null; }
export interface BannerList { banners: Banner[]; }
export interface SingleBanner { banner: Banner; }

@Injectable({ providedIn: 'root' })
export class BannerService {
  private readonly api = inject(ApiService);
  list() { return this.api.get<BannerList>('/banners').pipe(map(d=>d.banners)); }
  create(body: any) { return this.api.post<SingleBanner>('/banners', body).pipe(map(d=>d.banner)); }
  update(id: string, body: any) { return this.api.patch<SingleBanner>(`/banners/${id}`, body).pipe(map(d=>d.banner)); }
  remove(id: string) { return this.api.delete(`/banners/${id}`); }
}
