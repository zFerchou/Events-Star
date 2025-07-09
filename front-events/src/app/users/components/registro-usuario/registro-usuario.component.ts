import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrls:['../login/login.component.css','./registro-usuario.component.css']

})
export class RegistroUsuarioComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  // Patrones de validación
  private emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  private phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;

  // Definir el validador primero
  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pass = control.get('pass');
    const rpass = control.get('rpass');
    return pass && rpass && pass.value !== rpass.value ? { passwordsNotMatch: true } : null;
  };

  // Luego definir el FormGroup que lo usa
  registroForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastN: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    pass: ['', [Validators.required, Validators.minLength(6)]],
    rpass: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.pattern(this.phonePattern)]]
  }, { validators: this.passwordMatchValidator });

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const { name, lastN, email, pass, address, phone } = this.registroForm.value;

    const userData = {
      name,
      lastN,
      email,
      pass,
      address,
      ...(phone && { phone })
    };

    this.usuarioService.registrarUsuario(userData).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log('Usuario registrado:', res.data);
          this.registroForm.reset();
        } else {
          alert(res.msg || 'Error en el registro');
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Ocurrió un error al registrar el usuario');
      }
    });
  }
}

<!-- Cambio de prueba -->
