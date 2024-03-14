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

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  #router = inject(Router);
  #geolocation = inject(GeolocateService);

  #fb = inject(NonNullableFormBuilder);
  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    lat: '0',
    lng: '0',
  });

  constructor() {
    this.#geolocation.getGeolocation(
      this.loginForm.controls.lat,
      this.loginForm.controls.lng
    );
  }

  login() {
    //this.#router.navigate(['/products']);
    console.log('logeado');
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
