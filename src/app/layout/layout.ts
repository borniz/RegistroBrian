import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

   isMenuOpen = signal<boolean>(false);
  isSystemOnline = signal<boolean>(true);

  menuItems = [
    { path: '/', label: 'INICIO', icon: '📁' },
    { path: '/vehicle', label: 'REGISTRO VEHICULAR', icon: '🚖' },
    { path: '/store', label: 'REGISTRO DE ALMACENAMIENTO', icon: '🔨' },
  ];

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}

