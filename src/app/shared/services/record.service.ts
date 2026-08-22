import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import {
  RecordEntityType,
  RecordModel
} from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  async getRecords(
    entityId: number,
    entityType: RecordEntityType
  ): Promise<RecordModel[]> {

    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .order('create_date', {
        ascending: false
      });

    if (error) {
      throw error;
    }

    return data as RecordModel[];
  }

  async getRecordsByEntityType(
    entityType: RecordEntityType
  ): Promise<RecordModel[]> {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('entity_type', entityType)
      .order('create_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data as RecordModel[];
  }


  async createRecord(
    record: RecordModel
  ): Promise<RecordModel> {

    const { data, error } = await supabase
      .from('records')
      .insert(record)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as RecordModel;
  }


  async updateRecord(
    record: RecordModel
  ): Promise<RecordModel> {

    if (!record.id) {
      throw new Error(
        'No se puede actualizar un registro sin ID'
      );
    }

    const { data, error } = await supabase
      .from('records')
      .update({
        description: record.description,
        price: record.price,
        record_type: record.record_type
      })
      .eq('id', record.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as RecordModel;
  }


  async deleteRecord(
    id: string
  ): Promise<void> {

    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}