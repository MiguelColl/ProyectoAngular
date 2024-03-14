import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GeolocateService } from '../../services/geolocate.service';
import { AuthService } from '../services/auth.service';
import { UserLogin } from '../interfaces/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #geolocation = inject(GeolocateService);
  #modalService = inject(NgbModal);
  #fb = inject(NonNullableFormBuilder);

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    lat: '0',
    lng: '0',
  });

  constructor() {
    this.getGeolocation();
  }

  async getGeolocation(): Promise<void> {
    try {
        const geolocation = await this.#geolocation.getLocation();
        this.loginForm.controls.lat.setValue(geolocation.latitude + '');
        this.loginForm.controls.lng.setValue(geolocation.longitude + '');
    } catch (e) {
      const modalRef = this.#modalService.open(InfoModalComponent);
      modalRef.componentInstance.title = 'Geolocalización denegada';
      modalRef.componentInstance.body = 'Se van a usar valores por defecto';
      modalRef.componentInstance.type = 'error';
    }
  }

  login() {
    const login: UserLogin = {
      ...this.loginForm.getRawValue(),
      lat: +this.loginForm.value.lat!,
      lng: +this.loginForm.value.lng!,
    };

    this.#authService.login(login).subscribe({
      next: () => {
        this.#router.navigate(['/products']);
      },
      error: () => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.title = 'Login incorrecto';
        modalRef.componentInstance.body = 'El email o la contraseña son incorrectos';
        modalRef.componentInstance.type = 'error';
      }
    });
  }

  validClasses(
    formControl: FormControl,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}
