import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  editProfileForm: FormGroup;
  usuarioActual: Usuario | null = null;
  mensaje: string = '';
  userId: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService) {
    this.editProfileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [, Validators.minLength(6)]],
      confirmarContrasenia: ['',],
      edad: ['', [Validators.required, Validators.min(18)]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadUserData();
  }
  async loadUserData(): Promise<void> {
    try {
      this.usuarioActual = await this.usuarioService.getUsuarioActual();
      if (this.usuarioActual) {
        this.userId = this.usuarioActual.id ?? 0;
        
        this.editProfileForm.patchValue({
          nombre: this.usuarioActual.nombre,
          apellido: this.usuarioActual.apellido,
          correo: this.usuarioActual.correo,
          edad: this.usuarioActual.edad
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.mensaje = 'Error al cargar los datos del usuario.';
    }
  }
  

  saveProfile(): void {
    if (this.editProfileForm.valid) {
      const nombre = this.editProfileForm.get('nombre')?.value;
      const apellido = this.editProfileForm.get('apellido')?.value;
      const correo = this.editProfileForm.get('correo')?.value;
      const edad = this.editProfileForm.get('edad')?.value;

      const updatedUser: Usuario = {
        id: this.userId,
        nombre,
        apellido,
        correo,
        edad
      };

      this.usuarioService.updateUsuario(updatedUser).then(() => {
        this.router.navigate(['/perfil']);
      }).catch(error => {
        this.mensaje = 'Error al actualizar el perfil: ' + error.message;
      });
    }
  }
}
