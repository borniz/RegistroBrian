import { Component, effect, input, output } from '@angular/core';
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

  form: BusinessEntity = { name: '', description: '', creation_date: '' };

  constructor() {
    effect(() => {
      const entity = this.entity();
      this.form = entity ? { ...entity } : { name: '', description: '', creation_date: '' };
    });
  }

  guardar(): void {
    if (!this.form.name.trim() || !this.form.creation_date) return;
    this.onSave.emit({ ...this.form, name: this.form.name.trim() });
  }
}
