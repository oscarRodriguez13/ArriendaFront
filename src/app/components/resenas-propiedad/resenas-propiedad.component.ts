import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Resenia } from '../../models/Resenia';
import { ReseniaService } from '../../services/resenia/resenia.service';
import { Propiedad } from '../../models/Propiedad';
import { PropiedadService } from '../../services/propiedad/propiedad.service';

@Component({
  selector: 'app-resenas-propiedad',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './resenas-propiedad.component.html',
  styleUrl: './resenas-propiedad.component.css'
})
export class ResenasPropiedadComponent implements OnInit{
  propiedad: Propiedad | null = null;
  resenias: Resenia[] = [];
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    private reseniaService: ReseniaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerDetallesPropiedad(Number(id));
    }
  }

  obtenerDetallesPropiedad(id: number): void {
    this.propiedadService.getPropiedadPorSuId(id).subscribe({
      next: (propiedad) => {
        this.propiedad = propiedad;
        if(propiedad.id != null)
        this.obtenerReseniasDePropiedad(propiedad.id);
        
      },
      error: (err) => {
        console.error('Error al obtener los detalles de la propiedad', err);
        this.mensaje = `Error al cargar los detalles: ${err.message || err.toString()}`;
      }
    });
  }

  obtenerReseniasDePropiedad(idPropiedad: number): void {
    this.reseniaService.getReseniasPropiedad(idPropiedad).subscribe({
      next: (resenias) => {
        this.resenias = resenias;
      },
      error: (err) => {
        console.error('Error al obtener las reseñas', err);
        this.mensaje = `Error al cargar las reseñas: ${err.message || err.toString()}`;
      }
    });
  }
}
