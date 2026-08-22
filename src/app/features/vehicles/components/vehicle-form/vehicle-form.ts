import { Component, effect, input, output } from '@angular/core';
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

    this.onSave.emit({
      ...this.form
    });

  }
}