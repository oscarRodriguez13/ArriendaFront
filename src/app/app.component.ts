import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AnadirPropiedadComponent } from './components/anadir-propiedad/anadir-propiedad.component';
import { BuscarComponent } from './components/buscar/buscar.component';
import { DetallesAlquilerComponent } from './components/detalles-alquiler/detalles-alquiler.component';
import { DetallesSolicitudComponent } from './components/detalles-solicitud/detalles-solicitud.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { MisAlquileresComponent } from './components/mis-alquileres/mis-alquileres.component';
import { MisPropiedadesComponent } from './components/mispropiedades/mispropiedades.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SolicitarArriendoComponent } from './components/solicitar-arriendo/solicitar-arriendo.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RegistroComponent, BuscarComponent, LoginComponent, CommonModule, MisPropiedadesComponent,
    MisAlquileresComponent, HeaderComponent, SolicitarArriendoComponent, MiPerfilComponent, EditarPerfilComponent, AnadirPropiedadComponent,
    SolicitudesComponent, DetallesSolicitudComponent, DetallesAlquilerComponent, FooterComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ArriendaTuFincaFront';
  showHeaderFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = !['/login', '/registro','/carrusel','/solicitar-arriendo'].includes(event.url);
      }
    });
  }
}
