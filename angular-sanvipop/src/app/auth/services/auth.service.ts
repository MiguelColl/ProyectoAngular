import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { UserLogin, UserRegister } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #userUrl = 'auth'
  #logged = signal(false);

  get logged() {
    return this.#logged.asReadonly();
  }

  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>(`${this.#userUrl}/login`, data).pipe(
      map((res) => {
        localStorage.setItem('token', res.accessToken);
        this.#logged.set(true);
        console.log("logueado"); // MOSTRAR VENTANA MODAL
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#logged.set(false);
  }

  isLogged(): Observable<boolean> {
    if (this.logged()) {
      return of(true);
    } else {
      if (!localStorage.getItem('token')) {
        return of(false);
      } else {
        return this.#http.get<void>(`${this.#userUrl}/validate`).pipe(
          map(() => {
            this.#logged.set(true);
            return true;
          }),
          catchError(() => {
            return of(false);
          })
        );
      }
    }
  }

  register(data: UserRegister): Observable<void> {
    return this.#http.post<void>(`${this.#userUrl}/register`, data).pipe(
      map(() => {
        console.log("cuenta creada"); // MOSTRAR VENTANA MODAL
      })
    );
  }
}
