import { Routes } from '@angular/router';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'registro', pathMatch: 'full' },
  { path: 'registro', component: RegistroComponent }
];
