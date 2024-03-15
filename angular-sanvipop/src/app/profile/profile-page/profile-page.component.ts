import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '../../auth/interfaces/user';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {  } from '@fortawesome/free-regular-svg-icons';
import {  } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  @Input() user?: User;
  #faIconLibrary = inject(FaIconLibrary);

  ngOnInit(): void {
    console.log(this.user);
  }
}
