import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AlquilerService } from '../../services/alquiler/alquiler.service';
import { Alquiler } from '../../models/Alquiler';
import { RouterModule } from '@angular/router';
import { EstadoAlquiler } from '../../models/Alquiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalles-alquiler',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './detalles-alquiler.component.html',
  styleUrl: './detalles-alquiler.component.css'
})
export class DetallesAlquilerComponent {
  alquiler: Alquiler | null = null;
  mensaje: string = '';

  EstadoAlquiler = EstadoAlquiler;

  constructor(
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerDetallesAlquiler(Number(id));
    }
  }

  obtenerDetallesAlquiler(id: number): void {
    this.alquilerService.getAlquilerPorId(id).subscribe({
      next: (alquiler) => {
        this.alquiler = alquiler;
      },
      error: (err) => {
        console.error('Error al obtener los detalles del alquiler', err);
        this.mensaje = `Error al cargar los detalles: ${err.message || err.toString()}`;
      }
    });
  }

  isVencida(fechaFin: Date): boolean {
    const fechaActual = new Date();
    return fechaFin < fechaActual;
  }

  mostrarBotonPagar(): boolean {
    if (!this.alquiler) {
      return false;
    }

 

    if (!this.alquiler.fechaFin) {
      console.log("Fecha de fin no disponible.");
      return false;
    }

    const fechaVencida = this.isVencida(this.alquiler.fechaFin);
    const estadoPendiente = this.alquiler.estado === EstadoAlquiler.PENDIENTE;

/*
    console.log("Fecha de Fin:", this.alquiler.fechaFin);
    console.log("Estado del Alquiler:", this.alquiler.estado);
    console.log("¿Estado es PENDIENTE?", estadoPendiente);
    console.log("¿Fecha fin está vencida?", fechaVencida);

    */
    
    // Devuelve el resultado de la condición final
    return !fechaVencida;
  }
  
}
