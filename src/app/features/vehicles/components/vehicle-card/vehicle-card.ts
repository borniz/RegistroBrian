import { Component, input, output } from '@angular/core';
import { VehicleModel } from '../../models/vehicle.model';
import { Vehicle } from '../../pages/vehicle/vehicle';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-card.html',
})
export class VehicleCard {

  vehicle = input.required<VehicleModel>();

  selected = input<boolean>(false);

  onSelect = output<VehicleModel>();

  onEdit = output<VehicleModel>();

  onDelete = output<number>();
  seleccionar(): void {
    this.onSelect.emit(this.vehicle());
  }

  editar(event: Event): void {

    event.stopPropagation();
    this.onEdit.emit(this.vehicle());
  }
  deleteVehicle(event: Event): void {
  event.stopPropagation(); // 👈 Evita que se seleccione la tarjeta al hacer clic en borrar
  const id = this.vehicle().id;
  if (id) {
    this.onDelete.emit(id); // 👈 Emite el ID hacia la lista
  }
}
}