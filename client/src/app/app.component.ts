import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalContainerComponent } from './components/shared/modal-container/modal-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-modal-container></app-modal-container>
  `,
  styles: []
})
export class AppComponent {
  title = 'File Management Portal';
}
