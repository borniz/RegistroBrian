import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-edit-element',
  imports: [FormsModule],
  templateUrl: './create-edit-element.html',
  styleUrl: './create-edit-element.css',
})
export class CreateEditElement {
  isOpen = input.required<boolean>();
  modalTitle = input.required<string>();
  modalSubtitle = input<string>('Modifique los datos y guarde los cambios');
  isSaving = input<boolean>(false);
  size = input<string>('max-w-md');
  showSubmit = input<boolean>(true);
  // Outputs para notificar cierres y envíos
  onClose = output<void>();
  onSubmitForm = output<void>();

  cerrar() {
    this.onClose.emit();
  }

  enviarFormulario() {
    this.onSubmitForm.emit();
  }
}
