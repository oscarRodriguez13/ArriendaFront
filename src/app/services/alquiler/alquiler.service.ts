import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alquiler, EstadoAlquiler } from '../../models/Alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  private baseUrl = 'http://127.0.0.1:8082/api/alquileres';

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


  getAlquileresPorUsuario(): Observable<Alquiler[]> {
    const headers = this.createHeaders();
    return this.http.get<Alquiler[]>(`${this.baseUrl}/usuario/usuarioActual`, { headers });
  }

  getSolicitudesPorPropietario(): Observable<Alquiler[]> {
    const headers = this.createHeaders();
    return this.http.get<Alquiler[]>(`${this.baseUrl}/usuario/usuarioActual/solicitudes`, { headers });
  }
  

  getAlquilerPorId(id: number): Observable<Alquiler> {
    const headers = this.createHeaders();
    return this.http.get<Alquiler>(`${this.baseUrl}/${id}`, { headers });
  }

  crearAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const headers = this.createHeaders();
    return this.http.post<Alquiler>(this.baseUrl, alquiler, { headers });
  }

  aprobarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const headers = this.createHeaders();
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}/aprobar`, alquiler, { headers });
  }

  rechazarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const headers = this.createHeaders();
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}/rechazar`, alquiler, { headers });
  }

  finalizarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const alquilerActualizado = { ...alquiler, estado: EstadoAlquiler.FINALIZADO };
    const headers = this.createHeaders();
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}`, alquilerActualizado, { headers });
  }
  


  
}
