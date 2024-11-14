import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HeaderComponent } from '../header/header.component';
import { Usuario } from '../../models/Usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {

  usuarioActual: Usuario | null = null;

  constructor(private router: Router, private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    this.usuarioActual = await this.usuarioService.getUsuarioActual();
  }

  editProfile(): void {
    this.router.navigate(['/editarPerfil']);
  }
}
