import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlquilerService } from '../../services/alquiler/alquiler.service';
import { Alquiler } from '../../models/Alquiler';
import { Resenia } from '../../models/Resenia';
import { ReseniaService } from '../../services/resenia/resenia.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pagar',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,FormsModule],

  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})
export class PagarComponent implements OnInit {
  alquiler: Alquiler | null = null;
  calificacionPropiedad: number = 0;
  comentarioPropiedad: string = '';
  calificacionPropietario: number = 0;
  comentarioPropietario: string = '';

  constructor(
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
    private reseniaService: ReseniaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alquilerService.getAlquilerPorId(Number(id)).subscribe({
        next: (alquiler) => (this.alquiler = alquiler),
        error: () => console.error('Error al cargar el alquiler.')
      });
    }
  }

  calcularTotal(): number {
    if (this.alquiler) {
      const dias = (new Date(this.alquiler.fechaFin ?? 0).getTime() - new Date(this.alquiler.fechaInicio ?? 0).getTime()) / (1000 * 3600 * 24);
      return (this.alquiler.propiedad.valorNoche ?? 0) * dias;
    }
    return 0;
  }

  enviarReseniaPropiedad(): void {
    if (this.alquiler) {
      const reseniaPropiedad: Resenia = {
        id: 0,
        usuarioCalificadorId: { 
          id: this.alquiler.usuarioAsignado.id ?? 0, 
          nombre: this.alquiler.usuarioAsignado.nombre ?? '',
          apellido: this.alquiler.usuarioAsignado.apellido ?? ''
        },
        propiedadObjetivoId: { 
          id: this.alquiler.propiedad.id ?? 0, 
          nombre: this.alquiler.propiedad.nombre ?? '' 
        },
        usuarioObjetivoId: null,
        calificacion: this.calificacionPropiedad,
        comentario: this.comentarioPropiedad,
      };
      this.reseniaService.crearReseniaPropiedad(reseniaPropiedad).subscribe(() => {
        console.log('Reseña de propiedad enviada');
        this.calificacionPropiedad = 0;
        this.comentarioPropiedad = '';
      });
    }
  }

  enviarReseniaPropietario(): void {
    if (this.alquiler?.usuarioAsignado?.id && this.alquiler?.propiedad?.propietario?.id) {
      const reseniaPropietario: Resenia = {
        id: 0,
        usuarioCalificadorId: { 
          id: this.alquiler.usuarioAsignado.id, 
          nombre: this.alquiler.usuarioAsignado.nombre ?? '',
          apellido: this.alquiler.usuarioAsignado.apellido ?? ''
        },
        usuarioObjetivoId: { 
          id: this.alquiler.propiedad.propietario.id ?? 0, 
          nombre: this.alquiler.propiedad.propietario.nombre ?? '',
          apellido: this.alquiler.propiedad.propietario.apellido ?? ''
        },
        propiedadObjetivoId: null,
        calificacion: this.calificacionPropietario,
        comentario: this.comentarioPropietario,
      };
      
      this.reseniaService.crearReseniaPropietario(reseniaPropietario).subscribe(() => {
        console.log('Reseña de propietario enviada');
        this.calificacionPropietario = 0;
        this.comentarioPropietario = '';
      });
    } else {
      console.error("Datos incompletos para enviar la reseña del propietario");
    }
  }

  procesarPago(): void {
    alert(`Pago realizado por $${this.calcularTotal()}`);
    this.router.navigate(['/']);
  }
}