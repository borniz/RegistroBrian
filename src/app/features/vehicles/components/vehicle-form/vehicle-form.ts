import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { VehicleModel } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-form.html',
})
export class VehicleForm {

  vehicle = input<VehicleModel>({
    plate: '',
    driver: '',
    creation_vehicle: ''
  });

  isSaving = input<boolean>(false);

  onSave = output<VehicleModel>();

  validationError = signal('');

  form: VehicleModel = {
    plate: '',
    driver: '',
    creation_vehicle: ''
  };

  constructor() {

    effect(() => {

      const vehicle = this.vehicle();

      this.form = {
        id: vehicle.id,
        plate: vehicle.plate,
        driver: vehicle.driver,
        creation_vehicle: vehicle.creation_vehicle
      };

    });

  }

  guardar(): void {
    const plate = this.form.plate.trim().toUpperCase();
    const creationDate = this.form.creation_vehicle;

    if (!plate) {
      this.validationError.set('La placa es obligatoria.');
      return;
    }

    if (!/^[A-Z0-9-]{3,10}$/.test(plate)) {
      this.validationError.set('La placa debe tener entre 3 y 10 caracteres alfanumericos.');
      return;
    }

    if (!creationDate) {
      this.validationError.set('La fecha de registro es obligatoria.');
      return;
    }

    this.validationError.set('');

    this.onSave.emit({
      ...this.form,
      plate,
      creation_vehicle: creationDate
    });

  }
}