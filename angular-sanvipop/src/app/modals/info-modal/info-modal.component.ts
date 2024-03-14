import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Icons } from '../interfaces/icon';

@Component({
  selector: 'info-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.css'
})
export class InfoModalComponent {
  @Input() title!: string;
  @Input() body!: string;
  @Input() type!: string;

  icons: Icons = {
    error: {
      color: 'text-danger',
      icon: ['fas', 'circle-xmark'],
    },
    success: {
      color: 'text-success',
      icon: ['fas', 'circle-xmark'],
    },
  };
  
  #faIconLibrary = inject(FaIconLibrary);
  activeModal = inject(NgbActiveModal);

  constructor() {
    this.#faIconLibrary.addIcons(faCircleXmark);
  }
}
