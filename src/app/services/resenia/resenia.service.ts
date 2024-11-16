import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resenia } from '../../models/Resenia';
@Injectable({
  providedIn: 'root'
})
export class ReseniaService {
  private apiUrl = 'http://127.0.0.1/api/resenias';

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

  getReseniasPorUsuario(idUsuario: number): Observable<Resenia[]> {
    const headers = this.createHeaders();
    return this.http.get<Resenia[]>(`${this.apiUrl}/usuario?idUsuario=${idUsuario}`, { headers });
  }

  getReseniasPropiedad(idPropiedad: number): Observable<Resenia[]> {
    const headers = this.createHeaders();
    return this.http.get<Resenia[]>(`${this.apiUrl}/propiedad?idPropiedad=${idPropiedad}`, { headers });
  }

  crearReseniaPropiedad(resenia: Resenia): Observable<Resenia> {
      const headers = this.createHeaders();
      return this.http.post<Resenia>(`${this.apiUrl}/propiedad`, resenia, { headers });
  }
  
  crearReseniaPropietario(resenia: Resenia): Observable<Resenia> {
    const headers = this.createHeaders();
    return this.http.post<Resenia>(`${this.apiUrl}/usuario`, resenia, { headers });
  }

}
