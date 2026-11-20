import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe ser invalido cuando no se ingresan datos requeridos', () => {
    expect(component.form.invalid).toBeTrue();
    expect(component.form.get('nombreCompleto')?.hasError('required')).toBeTrue();
    expect(component.form.get('correo')?.hasError('required')).toBeTrue();
    expect(component.form.get('telefono')?.hasError('required')).toBeTrue();
  });

  it('debe rechazar un correo con formato incorrecto', () => {
    component.form.patchValue({
      nombreCompleto: 'Ana Perez',
      correo: 'correo-invalido',
      telefono: '987654321'
    });

    expect(component.form.get('correo')?.hasError('email')).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('debe rechazar un telefono que no cumple la regla de negocio', () => {
    component.form.patchValue({
      nombreCompleto: 'Ana Perez',
      correo: 'ana@tortasfabricio.com',
      telefono: '12345'
    });

    expect(component.form.get('telefono')?.hasError('pattern')).toBeTrue();
    expect(component.form.invalid).toBeTrue();
  });

  it('debe ser valido cuando todos los datos cumplen las condiciones', () => {
    component.form.patchValue({
      nombreCompleto: 'Ana Perez',
      correo: 'ana@tortasfabricio.com',
      telefono: '12345'
    });

    expect(component.form.valid).toBeTrue();
  });
});
