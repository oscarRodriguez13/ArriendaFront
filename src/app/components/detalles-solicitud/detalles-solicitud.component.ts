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
import { PropiedadService } from '../../services/propiedad/propiedad.service'; // Importar el servicio de propiedad
import { Propiedad } from '../../models/Propiedad'; // Importar la clase Propiedad

@Component({
  selector: 'app-detalles-solicitud',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './detalles-solicitud.component.html',
  styleUrls: ['./detalles-solicitud.component.css']
})
export class DetallesSolicitudComponent implements OnInit {
  solicitud: Alquiler | null = null;
  resenias: Resenia[] = [];
  mensaje: string = '';
  estadoAlquiler = EstadoAlquiler;

  constructor(
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
    private reseniaService: ReseniaService,
    private propiedadService: PropiedadService // Inyectar el servicio de propiedad
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerDetallesSolicitud(Number(id));
    }
  }

  obtenerDetallesSolicitud(id: number): void {
    this.alquilerService.getAlquilerPorId(id).subscribe({
      next: (solicitud) => {
        this.solicitud = solicitud;
        if (solicitud.usuarioAsignado && solicitud.usuarioAsignado.id != null) {
          this.obtenerReseniasPorUsuario(solicitud.usuarioAsignado.id);
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
      this.alquilerService.aprobarAlquiler(this.solicitud).subscribe({
        next: (response) => {
          console.log('Solicitud aprobada con éxito');
          this.solicitud!.estado = EstadoAlquiler.APROBADO;

          // Aquí se obtiene la propiedad asociada a la solicitud
          const propiedad: Propiedad = this.solicitud!.propiedad;
          
          // Cambiar la disponibilidad de la propiedad a false
          if (propiedad && propiedad.id != null) {
            propiedad.disponible = false;
            // Actualizar la propiedad en el backend
            this.propiedadService.putPropiedadPorID(propiedad.id, propiedad).subscribe({
              next: () => {
                console.log('Propiedad actualizada con éxito');
                // Opcionalmente, puedes redirigir o mostrar un mensaje de éxito
              },
              error: (error) => {
                console.error('Error al actualizar la propiedad', error);
                this.mensaje = 'Hubo un error al actualizar la disponibilidad de la propiedad.';
              }
            });
          } else {
            console.error('ID de propiedad no válido:', propiedad?.id);
          }
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
          console.log('Solicitud denegada con éxito');
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
