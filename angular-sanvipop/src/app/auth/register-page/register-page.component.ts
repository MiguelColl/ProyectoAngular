import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { matchEmail } from '../../validators/match-email';
import { GeolocateService } from '../../services/geolocate.service';

@Component({
  selector: 'register-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  #router = inject(Router);
  #geolocation = inject(GeolocateService);

  constructor() {
    this.#geolocation.getGeolocation(
      this.registerForm.controls.lat,
      this.registerForm.controls.lng
    );
  }

  #fb = inject(NonNullableFormBuilder);
  registerForm = this.#fb.group({
    name: ['', [Validators.required]],
    emailGroup: this.#fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', [Validators.required, Validators.email]],
      },
      { validators: matchEmail }
    ),
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: ['', [Validators.required]],
    lng: ['', [Validators.required]],
    avatar: ['', [Validators.required]],
  });

  imageBase64 = '';

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imageBase64 = '';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
    });
  }

  createAccount() {
    //this.#router.navigate(['/auth/login']);
    console.log('cuenta creada');
  }

  validClasses(
    formControl: FormControl | FormGroup,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }
}
