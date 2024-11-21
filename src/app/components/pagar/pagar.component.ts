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
import { PropiedadService } from '../../services/propiedad/propiedad.service';


@Component({
  selector: 'app-pagar',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,FormsModule],

  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})
export class PagarComponent implements OnInit {
  alquiler: Alquiler | null = null;
  valorPago: number = 0;
  banco: string = '';
  numeroCuenta: string = '';
  bancos: string[] = ['Bancolombia', 'Banco Agrario', 'Banco de Bogota']; 
  
  
  // Propiedades para reseñas
  calificacionPropiedad: number = 0;
  comentarioPropiedad: string = '';
  calificacionPropietario: number = 0;
  comentarioPropietario: string = '';

  constructor(
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
    private reseniaService: ReseniaService,
    private propiedadService: PropiedadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alquilerService.getAlquilerPorId(Number(id)).subscribe({
        next: (alquiler) => {
          this.alquiler = alquiler;
          this.valorPago = this.calcularTotal();
        },
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

  procesarPago(): void {
    if (this.banco && this.numeroCuenta) {
      console.log('Pago procesado:', {
        valor: this.valorPago,
        banco: this.banco,
        numeroCuenta: this.numeroCuenta
      });
  
      // Llamada para actualizar el estado del alquiler a FINALIZADO
      if (this.alquiler && this.alquiler.propiedad && this.alquiler.propiedad.id !== null && this.alquiler.propiedad.id !== undefined) {

        this.alquiler.propiedad.disponible = true;
        this.propiedadService.putPropiedadPorID(this.alquiler.propiedad.id, this.alquiler.propiedad).subscribe({
          next: () => {
            console.log('Propiedad actualizada con éxito');
          },
          error: (error) => {
            console.error('Error al actualizar la propiedad', error);
          }
        });
        
        this.alquilerService.finalizarAlquiler(this.alquiler).subscribe({
          next: () => {
            console.log('El estado del alquiler se ha actualizado a FINALIZADO');
            alert(`Pago realizado por $${this.valorPago}. El estado del alquiler ha sido actualizado a FINALIZADO.`);
            this.router.navigate(['/']); 
          },
          error: (err) => {
            console.error('Error al actualizar el estado del alquiler', err);
            alert("Hubo un error al finalizar el alquiler.");
          }
        });
      }
    } else {
      alert("Por favor complete todos los datos de pago.");
    }
  }
  


  
  enviarReseniaPropiedad(): void {
    if (this.calificacionPropiedad > 5) {
      alert("La calificación para la propiedad no puede ser mayor a 10.");
      return;
    }

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
    if (this.calificacionPropietario > 5) {
      alert("La calificación para el propietario no puede ser mayor a 10.");
      return;
    }

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

  
}