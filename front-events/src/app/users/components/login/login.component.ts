import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
declare const grecaptcha: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    (window as any).captchaResolved = this.onCaptchaResolved.bind(this); // opcional si usas callback

    this.loadRecaptcha().then(() => {
      this.renderCaptcha();
    }).catch(() => {
      console.error('Error al cargar reCAPTCHA');
    });
  }

  private fb = inject(FormBuilder);
  public usuarioService = inject(UsuarioService);
  private email = '';
  captchaToken: string = '';
  captchaValido = false; // bandera para controlar el botón


  loginForm: FormGroup = this.fb.group({
    email: ['davidlrj9999@gmail.com', [Validators.required, Validators.email]],
    pass: ['12345678', [Validators.required, Validators.minLength(6)]]
  });

  codigoForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, pass } = this.loginForm.value;
    this.email = email;
    this.usuarioService.loginUsuario(email, pass).subscribe({
      next: () => {
        // Aquí va tu lógica si el login es exitoso, por ejemplo:
        console.log('Login exitoso');
      },
      error: () => {
        // Si el login falla, resetea el CAPTCHA y desactiva el botón
        grecaptcha.reset();
        this.captchaValido = false;
      }
    });
  }

  verificar() {
    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    const { codigo } = this.codigoForm.value;
    this.usuarioService.verificarCodigo(this.email, codigo).subscribe();
  }

  onCaptchaResolved() {
    const token = grecaptcha.getResponse();

    if (token) {
      this.captchaToken = token;
      this.captchaValido = true;
    } else {
      this.captchaToken = '';
      this.captchaValido = false;
    }
  }

  private loadRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('recaptcha-script')) {
        return resolve(); // ya está cargado
      }

      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      (window as any).onRecaptchaLoad = () => {
        resolve();
      };

      script.onerror = reject;
    });
  }

  private renderCaptcha(): void {
    (window as any).grecaptcha.render('recaptcha-container', {
      sitekey: '6LcieGYrAAAAAMBHa4bDMRpi_gjHPATTry-WrDmX',
      callback: () => {
        this.captchaValido = true;
      }
    });
  }


}
