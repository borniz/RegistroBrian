import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import { BusinessEntity } from '../models/business-entity.model';

@Injectable({ providedIn: 'root' })
export class BusinessEntityService {
  async getAll(table: string): Promise<BusinessEntity[]> {
    const { data, error } = await supabase.from(table).select('*').order('id');
    if (error) throw error;
    return data as BusinessEntity[];
  }

  async create(table: string, entity: BusinessEntity): Promise<BusinessEntity> {
    const { data, error } = await supabase
      .from(table)
      .insert({ name: entity.name, description: entity.description, creation_date: entity.creation_date })
      .select()
      .single();
    if (error) throw error;
    return data as BusinessEntity;
  }

  async update(table: string, entity: BusinessEntity): Promise<BusinessEntity> {
    if (entity.id === undefined) throw new Error('No se puede actualizar una entidad sin ID');
    const { data, error } = await supabase
      .from(table)
      .update({ name: entity.name, description: entity.description, creation_date: entity.creation_date })
      .eq('id', entity.id)
      .select()
      .single();
    if (error) throw error;
    return data as BusinessEntity;
  }

  async remove(table: string, id: number): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
}
