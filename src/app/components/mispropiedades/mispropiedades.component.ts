import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Propiedad } from '../../models/Propiedad';
import { PropiedadService } from '../../services/propiedad/propiedad.service';
import { UsuarioService } from '../../services/usuario/usuario.service';  // Import UsuarioService
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, HeaderComponent, RouterModule, FooterComponent],
  templateUrl: './mispropiedades.component.html',
  styleUrls: ['./mispropiedades.component.css']
})
export class MisPropiedadesComponent implements OnInit {
  propiedades: Propiedad[] = [];
  mensaje: string = '';

  constructor(
    private propiedadUsuarioService: PropiedadService,
    private usuarioService: UsuarioService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPropiedadesPorId(); 
  }

  getPropiedadesPorId(): void {
    this.usuarioService.getUsuarioActual().then(usuarioActual => {
      if (usuarioActual && usuarioActual.id) {
        const userId = usuarioActual.id;

        this.propiedadUsuarioService.getPropiedadPorId(userId).subscribe({
          next: (propiedades) => {
            this.propiedades = propiedades;
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
      this.mensaje = `Error al cargar las propiedades: ${err.message || err.toString()}`;
    });
  }

  // Método para desactivar la propiedad
  desactivarPropiedad(propiedadId: number): void {
    this.propiedadUsuarioService.desactivarPropiedad(propiedadId).subscribe({
      next: () => {
        this.mensaje = 'Propiedad desactivada correctamente';
        this.getPropiedadesPorId(); // Refresca la lista de propiedades
      },
      error: (err) => {
        console.error('Error al desactivar la propiedad', err);
        this.mensaje = `Error al desactivar la propiedad: ${err.message || err.toString()}`;
      }
    });
  }

  editarPropiedad(propiedadId: number): void {
    this.router.navigate(['/editar-propiedad', propiedadId]);
  }
}
