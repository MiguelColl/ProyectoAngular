import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserResponse } from '../../auth/interfaces/responses';
import { User } from '../../auth/interfaces/user';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  #profileUrl = 'users';
  #http = inject(HttpClient);

  getProfile(id: number): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#profileUrl}/${id}`)
      .pipe(map((resp) => resp.user));
  }

  getMyProfile(): Observable<User> {
    return this.#http
      .get<UserResponse>(`${this.#profileUrl}/me`)
      .pipe(map((resp) => resp.user));
  }
}
