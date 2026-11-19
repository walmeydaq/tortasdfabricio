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
    nombreCompleto: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    telefono: ['', [Validators.required]]
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
