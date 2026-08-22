import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';

@Component({
  selector: 'app-header-page',
  imports: [CommonModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.css',
})
export class HeaderPage {
  titlePage = input.required<string>();
  headingPage = input.required<string>();
  createElement = input.required<string>();
  elementUnit=input.required<string>();
  elementAssets=input.required<number>();

onOpenModal = output<void>();

  abrirModal() {
    this.onOpenModal.emit();
  }
}
