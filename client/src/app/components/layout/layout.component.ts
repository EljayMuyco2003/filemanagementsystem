import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-spotify-black">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto bg-spotify-black md:ml-0">
        <div class="container mx-auto p-4 md:p-8 pt-16 md:pt-8">
          <ng-content></ng-content>
        </div>
      </main>
    </div>
  `
})
export class LayoutComponent {}
