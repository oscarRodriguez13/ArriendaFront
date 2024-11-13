import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alquiler, EstadoAlquiler } from '../../models/Alquiler';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  private baseUrl = 'http://127.0.0.1:8082/api/alquileres';

  constructor(private http: HttpClient) { }

  getAlquileresPorUsuario(userId: number): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(`${this.baseUrl}/usuario/${userId}`);
  }

  getSolicitudesPorPropietario(propietarioId: number): Observable<Alquiler[]> {
    return this.http.get<Alquiler[]>(`${this.baseUrl}/usuario/${propietarioId}/solicitudes`);
  }

  getAlquilerPorId(id: number): Observable<Alquiler> {
    return this.http.get<Alquiler>(`${this.baseUrl}/${id}`);
  }

  crearAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    return this.http.post<Alquiler>(this.baseUrl, alquiler);
  }

  aprobarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const alquilerActualizado = { ...alquiler, estado: EstadoAlquiler.APROBADO };
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}`, alquilerActualizado);
  }

  rechazarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const alquilerActualizado = { ...alquiler, estado: EstadoAlquiler.RECHAZADO };
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}`, alquilerActualizado);
  }

  finalizarAlquiler(alquiler: Alquiler): Observable<Alquiler> {
    const alquilerActualizado = { ...alquiler, estado: EstadoAlquiler.FINALIZADO };
    return this.http.put<Alquiler>(`${this.baseUrl}/${alquiler.id}`, alquilerActualizado);
  }
  


  
}
