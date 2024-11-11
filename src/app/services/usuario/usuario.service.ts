import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioActual: Usuario | null = null;
  private apiUrl = 'http://localhost:8082/api/usuarios'; 

  constructor() {}

  crearUsuario(usuario: Usuario): Promise<Usuario> {
    return axios.post<Usuario>(`${this.apiUrl}`, usuario)
      .then(response => {
        this.setUsuarioActual(response.data);
        return response.data;
      });
  }

// usuario.service.ts

  iniciarSesion(correo: string, contrasenia: string): Promise<Usuario | null> {
    return axios.post<Usuario>(`${this.apiUrl}/login`, { correo, contrasenia })
      .then(response => {
        this.setUsuarioActual(response.data);
        return response.data;
      })
      .catch(() => null); // Devolvemos null si falla la autenticación
  }


  setUsuarioActual(usuario: Usuario) {
    this.usuarioActual = usuario;
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  getUsuarioActual(): Usuario | null {
    if (typeof localStorage !== 'undefined') {
      if (!this.usuarioActual) {
        const storedUsuario = localStorage.getItem('usuarioActual');
        if (storedUsuario) {
          try {
            this.usuarioActual = JSON.parse(storedUsuario);
          } catch (error) {
            console.error("Error al parsear el usuario desde localStorage:", error);
            this.usuarioActual = null;
          }
        }
      }
      return this.usuarioActual;
    } else {
      console.warn("localStorage no está disponible en este entorno.");
      return null;
    }
  }

  updateUsuario(usuario: Usuario): Promise<Usuario> {
    console.log('Usuario a actualizar:', usuario);
    return axios.put<Usuario>(`${this.apiUrl}/${this.usuarioActual?.id}`, usuario)
      .then(response => {
        this.setUsuarioActual(response.data);
        return response.data;
      });
  }


  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
  }
}