import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropiedadService } from '../../services/propiedad/propiedad.service';
import { Propiedad } from '../../models/Propiedad';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';  

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, HeaderComponent, FooterComponent],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent implements OnInit {
  propiedades: Propiedad[] = [];
  propiedadesFiltradas: Propiedad[] = [];
  busqueda: string = '';

  constructor(
    private propiedadService: PropiedadService,
    private usuarioService: UsuarioService,  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPropiedades();
  }

  cargarPropiedades(): void {
    this.usuarioService.getUsuarioActual().then(usuarioActual => {
      if (usuarioActual && usuarioActual.id) {
        const userId = usuarioActual.id;

        this.propiedadService.getPropiedadPorAlquilerNoAprobado(userId).subscribe({
          next: (data: Propiedad[]) => {
            this.propiedades = data;
            this.propiedadesFiltradas = data;
          },
          error: (err) => {
            console.error('Error al obtener las propiedades', err);
          }
        });
      } else {
        console.error('No se encontró el usuario actual');
      }
    }).catch(err => {
      console.error('Error al obtener el usuario actual', err);
    });
  }

  filtrarPropiedades(): void {
    const normalize = (str: string): string =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.propiedadesFiltradas = this.propiedades.filter(propiedad => {
      const propietarioNombre = propiedad.propietario?.nombre || '';
      const area = propiedad.area !== null && propiedad.area !== undefined ? propiedad.area.toString() : '0'; // Valor por defecto para area
      const valorNoche = propiedad.valorNoche !== null && propiedad.valorNoche !== undefined ? propiedad.valorNoche.toString() : '0'; // Valor por defecto para valorNoche

      return (
        normalize(propiedad.ciudad || '') 
          .includes(normalize(this.busqueda)) ||
        normalize(propiedad.descripcion || '') 
          .includes(normalize(this.busqueda)) ||
        normalize(propietarioNombre) 
          .includes(normalize(this.busqueda)) ||
        area.includes(normalize(this.busqueda)) || 
        valorNoche.includes(normalize(this.busqueda)) 
      );
    });
  }

  aplicar(propiedad: Propiedad): void {
    console.log('Propiedad a enviar:', propiedad);
    this.router.navigateByUrl('/solicitar-arriendo', {
      state: { propiedad: propiedad }
    });
  }
}
