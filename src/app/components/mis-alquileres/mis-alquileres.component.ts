import { Component, OnInit } from '@angular/core';
import { Alquiler } from '../../models/Alquiler';
import { AlquilerService } from '../../services/alquiler/alquiler.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service'; 

@Component({
  selector: 'app-mis-alquileres',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatCardModule],
  templateUrl: './mis-alquileres.component.html',
  styleUrls: ['./mis-alquileres.component.css']  
})
export class MisAlquileresComponent implements OnInit {
  alquileres: Alquiler[] = [];
  mensaje: string = '';

  constructor(
    private router: Router,
    private alquilerService: AlquilerService,
    private usuarioService: UsuarioService  // Inject UsuarioService
  ) {}

  ngOnInit(): void {
    this.obtenerAlquileresPorUsuario();
  }

  obtenerAlquileresPorUsuario(): void {
    this.usuarioService.getUsuarioActual().then(usuarioActual => {
      if (usuarioActual && usuarioActual.id) {
        const userId = usuarioActual.id;

        this.alquilerService.getAlquileresPorUsuario().subscribe({
          next: (alquileres) => {
            this.alquileres = alquileres;
          },
          error: (err) => {
            console.error('Error al obtener los alquileres', err);
            this.mensaje = `Error al cargar los alquileres: ${err.message || err.toString()}`;
          }
        });
      } else {
        console.error('No se encontró el usuario actual');
        this.mensaje = 'No se encontró el usuario actual.';
      }
    }).catch(err => {
      console.error('Error al obtener el usuario actual', err);
    });
  }

  revisarAlquiler(alquiler: Alquiler): void {
    this.router.navigate([`/alquileres/${alquiler.id}`]);
  }
}
