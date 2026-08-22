import { Injectable } from '@angular/core';
import { VehicleModel } from '../models/vehicle.model';
import { supabase } from '../../../core/supabase/supabase.client';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  async getVehicles(): Promise<VehicleModel[]> {

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('id');
   if (error) {
      throw error;
    }

    return data as VehicleModel[];
  }

  async createVehicle(vehicle: VehicleModel): Promise<any> {
  // 1. Mapeamos los campos asegurando que coincidan con tus columnas de Supabase
  // CAMBIA 'creation_vehicle' por el nombre EXACTO de tu columna en Supabase (ej: 'created_at' si usas la por defecto)
  const payload = {
    plate: vehicle.plate,
    driver: vehicle.driver,
    creation_vehicle: vehicle.creation_vehicle 
  };


  const { data, error } = await supabase
    .from('vehicles')
    .insert([payload]) // Se recomienda enviarlo dentro de un arreglo []
    .select();         // Esto obliga a Supabase a retornar el registro creado con su ID real

  if (error) {
    console.error('Error interno de Supabase al insertar:', error);
    throw error;
  }

  return data ? data[0] : null;
}

  async updateVehicle(vehicle: VehicleModel): Promise<void> {
  // Mapeamos los campos para que coincidan exactamente con las columnas de Supabase
  const payload = {
    plate: vehicle.plate,
    driver: vehicle.driver,
    creation_vehicle: vehicle.creation_vehicle
  };

  const { error } = await supabase
    .from('vehicles')
    .update(payload)        // Enviamos los datos modificados
    .eq('id', vehicle.id);  // Filtramos estrictamente por el ID del vehículo a editar

  if (error) {
    console.error('Error al actualizar en Supabase:', error);
    throw error;
  }
}

  async deleteVehicle(id: number) {

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("No se pudo eliminar vehiculo",error);
      throw error;
    }
  }
}