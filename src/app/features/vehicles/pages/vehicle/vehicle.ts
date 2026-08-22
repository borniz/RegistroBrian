import { Component, computed, inject, signal } from '@angular/core';

import { HeaderPage } from '../../../../shared/components/header-page/header-page';

import { CreateEditElement } from '../../../../shared/components/create-edit-element/create-edit-element';

import { VehicleList } from '../../components/vehicle-list/vehicle-list';

import { VehicleForm } from '../../components/vehicle-form/vehicle-form';

import { VehicleService } from '../../services/vehicle-service';

import { VehicleModel } from '../../models/vehicle.model';
import { CreateRecord } from '../../../../shared/components/create-record/create-record';
import { RecordHistory } from '../../../../shared/components/record-history/record-history';
import { RecordSummary } from '../../../../shared/components/record-summary/record-summary';
import { RecordModel, RecordType } from '../../../../shared/models/record.model';
import { RecordService } from '../../../../shared/services/record.service';
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [HeaderPage, CreateEditElement, VehicleList, RecordHistory, RecordSummary, CreateRecord, VehicleForm,],
  templateUrl: './vehicle.html',
  styleUrl: './vehicle.css',
})
export class Vehicle {
  private vehicleService = inject(VehicleService);
  private recordService = inject (RecordService);
  vehicles = signal<VehicleModel[]>([]);

  records = signal<RecordModel[]>([]);

  allVehicleRecords = signal<RecordModel[]>([]);

  vehicleLabels = computed(() => Object.fromEntries(
    this.vehicles()
      .filter(vehicle => vehicle.id !== undefined)
      .map(vehicle => [vehicle.id!, `PLACA: ${vehicle.plate}`])
  ));

  isReportModalOpen = signal(false);

  selectedReportPeriod = signal<'weekly' | 'monthly'>('weekly');

  isCreateRecordOpen = signal(false);

  recordToEdit = signal<RecordModel | null>(null);

  isSavingRecord = signal(false);

  isHistoryModalOpen = signal(false);

  selectedVehicle = signal<VehicleModel | null>(null);

  vehicleToEdit = signal<VehicleModel | null>(null);

  isCreateVehicleOpen = signal(false);

  isEditVehicleOpen = signal(false);

  isSavingVehicle = signal(false);

  async ngOnInit() {
    await this.loadVehicles();
    await this.loadAllVehicleRecords();
  }

  async loadVehicles() {
    try {
      const vehicles = await this.vehicleService.getVehicles();

      this.vehicles.set(vehicles);
    } catch (error) {
      console.error(error);
    }
  }

  async loadAllVehicleRecords() {
    try {
      const records = await this.recordService.getRecordsByEntityType('vehicle');
      this.allVehicleRecords.set(records);
    } catch (error) {
      console.error('Error cargando el resumen de vehículos:', error);
      this.allVehicleRecords.set([]);
    }
  }

  abrirReporte(period: 'weekly' | 'monthly'): void {
    this.selectedReportPeriod.set(period);
    this.isReportModalOpen.set(true);
  }

  cerrarReporte(): void {
    this.isReportModalOpen.set(false);
  }

  abrirModal(): void {
    this.isCreateVehicleOpen.set(true);
  }

  abrirRecordModal() {
    if (!this.selectedVehicle()) {
      return;
    }

    this.isCreateRecordOpen.set(true);
  }

  cerrarModal(): void {
    this.isCreateVehicleOpen.set(false);
  }

  cerrarRecordModal(): void {
    this.isCreateRecordOpen.set(false);
    this.recordToEdit.set(null);
  }

  cerrarHistorialModal(): void {
    // 🔥 NUEVO: Cierra el modal flotante del historial
    this.isHistoryModalOpen.set(false);
  }


  async seleccionarVehiculo(vehi: VehicleModel) {

  if (vehi.id === undefined) {
    return;
  }

  this.selectedVehicle.set(vehi);

  await this.loadRecords(vehi.id);
  this.isHistoryModalOpen.set(true);
}

  async openCreateRecord(data?: { description: string; price?: number; record_type: RecordType }) {
    if (!data) {
      this.recordToEdit.set(null);
      this.isCreateRecordOpen.set(true);
      return;
    }

    const vehicle = this.selectedVehicle();

    if (!vehicle?.id) {
      return;
    }

    this.isSavingRecord.set(true);

    try {
      const recordToEdit = this.recordToEdit();

      if (recordToEdit?.id) {
        const record = await this.recordService.updateRecord({
          ...recordToEdit,
          description: data.description,
          price: data.price,
          record_type: data.record_type,
        });

        this.records.update(records => records.map(item =>
          item.id === record.id ? record : item
        ));
        await this.loadAllVehicleRecords();
      } else {
        const record = await this.recordService.createRecord({
          entity_id: vehicle.id,
          entity_type: 'vehicle',
          description: data.description,
          price: data.price,
          record_type: data.record_type,
        });

        this.records.update(records => [record, ...records]);
        await this.loadAllVehicleRecords();
      }

      this.cerrarRecordModal();
    } catch (error) {
      console.error('Error creando el registro:', error);
    } finally {
      this.isSavingRecord.set(false);
    }
  }

  editarRegistro(record: RecordModel): void {
    this.recordToEdit.set(record);
    this.isCreateRecordOpen.set(true);
  }
  async loadRecords(vehicleId: number) {

  try {

    const records = await this.recordService.getRecords(
      vehicleId,
      'vehicle'
    );

    this.records.set(records);

  } catch (error) {

    console.error(
      'Error cargando registros:',
      error
    );

    this.records.set([]);

  }
}
  async deleteRecord(id: string) {
    if(confirm("Desea eliminar el registro")){

      try {
    
        await this.recordService.deleteRecord(id);
    
        this.records.update(records =>
          records.filter(record => record.id !== id)
        );
        await this.loadAllVehicleRecords();
    
      } catch (error) {
    
        console.error(
          'No se pudo eliminar el registro:',
          error
        );
    
      }
    }
}
  editarVehiculo(vehicle: VehicleModel): void {
    this.vehicleToEdit.set(vehicle);

    this.isEditVehicleOpen.set(true);
  }

  cerrarEditar(): void {
    this.isEditVehicleOpen.set(false);

    this.vehicleToEdit.set(null);
  }

  async guardarVehiculo(vehicle: VehicleModel): Promise<void> {
    console.log('estamos en guardar vehicle')
    this.isSavingVehicle.set(true);
    try {
      await this.vehicleService.createVehicle(vehicle);

      // Esto vuelve a traer la lista fresca de Supabase con el nuevo vehículo incluido:
      await this.loadVehicles();

      this.cerrarModal();
    } catch (error) {
      console.error('Error capturado en el componente:', error);
    } finally {
      this.isSavingVehicle.set(false);
    }
  }

  async actualizarVehiculo(vehicle: VehicleModel): Promise<void> {
    this.isSavingVehicle.set(true);
    try {
      await this.vehicleService.updateVehicle(vehicle);
      await this.loadVehicles(); // Recarga la lista reflejando los cambios

      // Si el vehículo que acabas de editar estaba seleccionado, actualiza sus detalles abajo
      if (this.selectedVehicle()?.id === vehicle.id) {
        this.selectedVehicle.set(vehicle);
      }
      this.cerrarEditar();
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
    } finally {
      this.isSavingVehicle.set(false);
    }
  }

  async eliminarVehiculo(id: number):Promise<void>{
    if(confirm("Desea eliminar el vehiculo"))
    {
      try {
    await this.vehicleService.deleteVehicle(id);
    
    // Si el vehículo eliminado estaba seleccionado visualmente, limpiamos la selección
    if (this.selectedVehicle()?.id === id) {
      this.selectedVehicle.set(null);
    }

    // 4. Refrescamos la lista inmediatamente para que desaparezca de la tabla
    await this.loadVehicles();
    
    console.log('Vehículo eliminado con éxito.');
  } catch (error) {
    console.error('Error al intentar eliminar el vehículo:', error);
    alert('Hubo un error al eliminar el vehículo. Inténtalo de nuevo.');
  }
    }
  }
}
