import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Propiedad } from '../../models/Propiedad';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  private apiUrl = 'http://127.0.0.1/api/propiedades';

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('token'); 
  }

  private createHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getPropiedadPorAlquilerNoAprobado(): Observable<Propiedad[]> {
    const headers = this.createHeaders();
    return this.http.get<Propiedad[]>(`${this.apiUrl}/usuario/propietario/sin-alquiler-aprobado`, { headers });
  }

  getPropiedadPorId(): Observable<Propiedad[]> {
    const headers = this.createHeaders();
    return this.http.get<Propiedad[]>(`${this.apiUrl}/usuario/propietario`, { headers });
  }

  getPropiedadPorSuId(propiedadId: number): Observable<Propiedad> {
    const headers = this.createHeaders();
    return this.http.get<Propiedad>(`${this.apiUrl}/${propiedadId}`, { headers });
  }


  putPropiedadPorID(propiedadId: number, propiedad: Propiedad): Observable<Propiedad> {
    const headers = this.createHeaders();
    return this.http.put<Propiedad>(`${this.apiUrl}/${propiedadId}`, propiedad, { headers });
  }

  crearPropiedad(propiedad: Propiedad): Observable<Propiedad> {
    const headers = this.createHeaders();
    return this.http.post<Propiedad>(`${this.apiUrl}`, propiedad, { headers });
  }

  getInfoPropiedadById(propiedadId: number): Observable<Propiedad> {
    const headers = this.createHeaders();
    return this.http.get<Propiedad>(`${this.apiUrl}/${propiedadId}`, { headers });
  }

  desactivarPropiedad(propiedadId: number): Observable<void> {
    const headers = this.createHeaders();
    return this.http.put<void>(`${this.apiUrl}/${propiedadId}/desactivar`, null, { headers });
  }
}
