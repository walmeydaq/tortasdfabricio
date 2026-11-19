import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  enviado = false;

  form = this.fb.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]]
  });

  constructor(private fb: FormBuilder) {}

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enviado = false;
      return;
    }

    this.enviado = true;
  }
}
