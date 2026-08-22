import { Component, input, output } from '@angular/core';

import { VehicleModel } from '../../models/vehicle.model';

import { VehicleCard } from '../vehicle-card/vehicle-card';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [VehicleCard],
  templateUrl: './vehicle-list.html',
})
export class VehicleList {

  vehicles = input.required<VehicleModel[]>();

  selectedVehicle = input<VehicleModel | null>(null);

  onSelectVehicle = output<VehicleModel>();

  onEditVehicle = output<VehicleModel>();

  onDeleteVehicle = output<number>();

  seleccionarVehiculo(vehicle: VehicleModel): void {

    this.onSelectVehicle.emit(vehicle);
  }

  editarVehiculo(vehicle: VehicleModel): void {

    this.onEditVehicle.emit(vehicle);

  }
  
}