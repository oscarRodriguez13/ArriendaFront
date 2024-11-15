import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlquilerService } from '../../services/alquiler/alquiler.service';
import { Alquiler } from '../../models/Alquiler';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Resenia } from '../../models/Resenia';
import { ReseniaService } from '../../services/resenia/resenia.service';
import { EstadoAlquiler } from '../../models/Alquiler';

@Component({
  selector: 'app-detalles-solicitud',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './detalles-solicitud.component.html',
  styleUrl: './detalles-solicitud.component.css'
})
export class DetallesSolicitudComponent implements OnInit {
  solicitud: Alquiler | null = null;
  resenias: Resenia[] = [];
  mensaje: string = '';
  estadoAlquiler = EstadoAlquiler;


  constructor(
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
    private reseniaService: ReseniaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerDetallesSolicitud(Number(id));
    }
  }
  /*
  public get estadoAlquiler(): typeof EstadoAlquiler {
    return EstadoAlquiler;
  }*/

  obtenerDetallesSolicitud(id: number): void {
    this.alquilerService.getAlquilerPorId(id).subscribe({
      next: (solicitud) => {
        this.solicitud = solicitud;
        if (solicitud.usuarioAsignado && solicitud.usuarioAsignado.id != null) {
          this.obtenerReseniasPorUsuario(solicitud.usuarioAsignado.id);
          console.log('Estado de la solicitud:', this.solicitud?.estado);
          console.log('Estado de la comparacion:', this.estadoAlquiler.PENDIENTE);
          console.log('Comparando con PENDIENTE2:', this.solicitud?.estado.valueOf() === this.estadoAlquiler.PENDIENTE.valueOf());
        }
        
      },
      error: (err) => {
        console.error('Error al obtener los detalles del alquiler', err);
        this.mensaje = `Error al cargar los detalles: ${err.message || err.toString()}`;
      }
    });
  }

  obtenerReseniasPorUsuario(idUsuario: number): void {
    this.reseniaService.getReseniasPorUsuario(idUsuario).subscribe({
      next: (resenias) => {
        this.resenias = resenias;
      },
      error: (err) => {
        console.error('Error al obtener las reseñas', err);
        this.mensaje = `Error al cargar las reseñas: ${err.message || err.toString()}`;
      }
    });
  }

  aprobarSolicitud(): void {
    if (this.solicitud) {
      const solicitudActualizada = { ...this.solicitud, estado: EstadoAlquiler.APROBADO };
      this.alquilerService.aprobarAlquiler(solicitudActualizada).subscribe({
        next: () => {
          console.log('Solicitud aprobada con éxito');
          this.solicitud!.estado = EstadoAlquiler.APROBADO;
        },
        error: (err) => {
          console.error('Error al aprobar la solicitud', err);
          this.mensaje = 'No se pudo aprobar la solicitud. Intenta nuevamente.';
        }
      });
    }
  }

  denegarSolicitud(): void {
    if (this.solicitud) {
      this.alquilerService.rechazarAlquiler(this.solicitud).subscribe({
        next: () => {
          console.log('Solicitud denegar con éxito');
          this.solicitud!.estado = EstadoAlquiler.RECHAZADO;
        },
        error: (err) => {
          console.error('Error al denegar la solicitud', err);
          this.mensaje = 'No se pudo denegar la solicitud. Intenta nuevamente.';
        }
      });
    }
  }
}
