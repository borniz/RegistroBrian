export type RecordEntityType =
  | 'vehicle'
  | 'restaurant'
  | 'store';

export type RecordType = 'ingreso' | 'egreso';

export interface RecordModel {
  id?: string;
  entity_id: number;
  entity_type: RecordEntityType;
  description: string;
  price?: number | null;
  record_type?: RecordType;
  create_date?: string;
}