import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resenia } from '../../models/Resenia';
@Injectable({
  providedIn: 'root'
})
export class ReseniaService {
  private apiUrl = 'http://127.0.0.1:8082/api/resenias';

  constructor(private http: HttpClient) { }

  // Obtener reseñas que pertenecen a un usuario (inquilino)
  getReseniasPorUsuario(idUsuario: number): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(`${this.apiUrl}/usuario?idUsuario=${idUsuario}`);
  }

    // Obtener reseñas que pertenecen a una propiedad 
  getReseniasPropiedad(idPropiedad: number): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(`${this.apiUrl}/propiedad?idPropiedad=${idPropiedad}`);
  }


    // Crear una reseña para una propiedad
    crearReseniaPropiedad(resenia: Resenia): Observable<Resenia> {
      return this.http.post<Resenia>(`${this.apiUrl}/propiedad`, resenia);
    }
  
    // Crear una reseña para un usuario (propietario)
    crearReseniaPropietario(resenia: Resenia): Observable<Resenia> {
      return this.http.post<Resenia>(`${this.apiUrl}/usuario`, resenia);
    }

}
