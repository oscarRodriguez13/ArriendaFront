import { Component } from '@angular/core';
import { Alquiler } from '../../models/Alquiler';
import { AlquilerService } from '../../services/alquiler/alquiler.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { OrdenarAlquileresPipe } from '../../shared/pipes/ordenar-alquileres.pipe';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatCardModule,OrdenarAlquileresPipe],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})

export class SolicitudesComponent {
  solicitudes: Alquiler[] = [];
  mensaje: string = '';

  constructor(private router: Router, private alquilerService: AlquilerService,  private usuarioService: UsuarioService,) {}

  ngOnInit(): void {
    this.obtenerSolicitudesPorPropietario();
  }

  obtenerSolicitudesPorPropietario(): void {
    this.usuarioService.getUsuarioActual().then(propietarioActual => {
      if (propietarioActual && propietarioActual.id !== null && propietarioActual.id !== undefined) {
        const propietarioId = propietarioActual.id;
  
        this.alquilerService.getSolicitudesPorPropietario().subscribe({
          next: (solicitudes) => {
            this.solicitudes = solicitudes;
          },
          error: (err) => {
            console.error('Error al obtener las solicitudes', err);
            this.mensaje = `Error al cargar las solicitudes: ${err.message || err.toString()}`;
          }
        });
      } else {
        console.error('No se encontró el propietarioActual o el propietarioId es inválido');
        this.mensaje = 'Error al cargar las solicitudes: No se encontró el propietario actual o el propietarioId es inválido';
      }
    }).catch(err => {
      console.error('Error al obtener el propietario actual', err);
      this.mensaje = `Error al cargar las solicitudes: ${err.message || err.toString()}`;
    });
  }
  

  detallesSolicitud(alquiler: Alquiler): void {
    this.router.navigate([`/solicitudes/${alquiler.id}`]);
  }
}
