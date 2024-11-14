import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Usuario } from '../../models/Usuario';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://http://127.0.0.1/api';

  constructor() {}

  crearUsuario(usuario: Usuario): Promise<Usuario> {
    return axios.post<Usuario>(`${this.apiUrl}/auth/register`, usuario)
      .then(response => response.data);
  }

  iniciarSesion(correo: string, contrasenia: string): Promise<string | null> {
    return axios.post<{ token: string }>(`${this.apiUrl}/auth/login`, { correo, contrasenia })
      .then(response => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('token', token); 
        }
        return token;
      })
      .catch(() => null);
  }

  getUsuarioActual(): Promise<Usuario | null> {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return axios.get<Usuario>(`${this.apiUrl}/usuarios/${decoded.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      })
        .then(response => response.data)
        .catch(() => null);
    } 
    return Promise.resolve(null);
  }

  updateUsuario(usuario: Usuario): Promise<Usuario> {
    const token = localStorage.getItem('token');
    console.log("PUT token " + token);
    if (!token) {
      return Promise.reject('No hay token disponible');
    }
    const decoded: any = jwtDecode(token);

    return this.getUsuarioActual()
      .then(async usuarioOriginal => {
        if (!usuarioOriginal) {
          throw new Error('No se pudo obtener el usuario actual');
        }

        return axios.put<Usuario>(`${this.apiUrl}/usuarios/${usuario.id}`, usuario, {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        })
        .then(async response => {
          // Si el correo ha sido modificado
          if (usuario.correo !== usuarioOriginal.correo && usuario.correo != null) {
            console.log("Correo original " + usuarioOriginal.correo);
            console.log("Correo nuevo " + usuario.correo);
            console.log("Contra " + decoded.contra);

            // Realizar nuevo login con el nuevo correo
            const nuevoToken = await this.iniciarSesion(usuario.correo, decoded.contra);
            if (!nuevoToken) {
              throw new Error('Error al actualizar el token con el nuevo correo');
            }
            localStorage.setItem('token', nuevoToken);
          }
          return response.data;
        });
    });
}
  logout() {
    localStorage.removeItem('token');
  }
}
