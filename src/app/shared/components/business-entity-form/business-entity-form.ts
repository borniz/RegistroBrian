import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessEntity } from '../../models/business-entity.model';

@Component({
  selector: 'app-business-entity-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './business-entity-form.html'
})
export class BusinessEntityForm {
  entity = input<BusinessEntity | null>(null);
  labels = input({ name: 'NOMBRE', description: 'DESCRIPCION' });
  isSaving = input(false);
  onSave = output<BusinessEntity>();

  validationError = signal('');

  form: BusinessEntity = { name: '', description: '', creation_date: '' };

  constructor() {
    effect(() => {
      const entity = this.entity();
      this.form = entity ? { ...entity } : { name: '', description: '', creation_date: '' };
    });
  }

  guardar(): void {
    const name = this.form.name.trim();
    if (!name) {
      this.validationError.set('El nombre es obligatorio.');
      return;
    }
    if (name.length < 2) {
      this.validationError.set('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    if (!this.form.creation_date) {
      this.validationError.set('La fecha de registro es obligatoria.');
      return;
    }
    this.validationError.set('');
    this.onSave.emit({ ...this.form, name });
  }
}
