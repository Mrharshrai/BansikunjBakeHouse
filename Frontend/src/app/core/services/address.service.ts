import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from './api.service';

export interface Address { id:string; user_id:string; label:string; full_name:string; phone:string; line1:string; line2?:string|null; city:string; state:string; pincode:string; country:string; is_default:boolean; created_at:string; updated_at:string; }
export interface AddressList { addresses: Address[]; }
export interface SingleAddress { address: Address; }

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly api = inject(ApiService);
  list() { return this.api.get<AddressList>('/addresses').pipe(map(d=>d.addresses)); }
  get(id: string) { return this.api.get<SingleAddress>(`/addresses/${id}`).pipe(map(d=>d.address)); }
  create(body: any) { return this.api.post<SingleAddress>('/addresses', body).pipe(map(d=>d.address)); }
  update(id: string, body: any) { return this.api.patch<SingleAddress>(`/addresses/${id}`, body).pipe(map(d=>d.address)); }
  remove(id: string) { return this.api.delete(`/addresses/${id}`); }
  setDefault(id: string) { return this.api.post<SingleAddress>(`/addresses/${id}/default`, {}).pipe(map(d=>d.address)); }
}
