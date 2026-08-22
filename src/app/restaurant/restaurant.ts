import { Component, computed, inject, signal } from '@angular/core';
import { HeaderPage } from '../shared/components/header-page/header-page';
import { CreateEditElement } from '../shared/components/create-edit-element/create-edit-element';
import { BusinessEntityForm } from '../shared/components/business-entity-form/business-entity-form';
import { BusinessEntityList } from '../shared/components/business-entity-list/business-entity-list';
import { RecordHistory } from '../shared/components/record-history/record-history';
import { RecordSummary } from '../shared/components/record-summary/record-summary';
import { CreateRecord } from '../shared/components/create-record/create-record';
import { BusinessEntity } from '../shared/models/business-entity.model';
import { RecordModel, RecordType } from '../shared/models/record.model';
import { RecordService } from '../shared/services/record.service';
import { BusinessEntityService } from '../shared/services/business-entity.service';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [HeaderPage, CreateEditElement, BusinessEntityForm, BusinessEntityList, RecordHistory, RecordSummary, CreateRecord],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.css',
})
export class Restaurant {
  private entityService = inject(BusinessEntityService);
  private recordService = inject(RecordService);
  readonly table = 'restaurants';
  entities = signal<BusinessEntity[]>([]);
  records = signal<RecordModel[]>([]);
  allRecords = signal<RecordModel[]>([]);
  selected = signal<BusinessEntity | null>(null);
  entityToEdit = signal<BusinessEntity | null>(null);
  recordToEdit = signal<RecordModel | null>(null);
  isEntityModalOpen = signal(false);
  isEditEntityModalOpen = signal(false);
  isHistoryModalOpen = signal(false);
  isRecordModalOpen = signal(false);
  isReportModalOpen = signal(false);
  isSaving = signal(false);
  reportPeriod = signal<'weekly' | 'monthly'>('weekly');
  entityLabels = computed(() => Object.fromEntries(this.entities().filter(item => item.id !== undefined).map(item => [item.id!, item.name])));

  async ngOnInit() { await this.loadEntities(); await this.loadAllRecords(); }
  async loadEntities() { try { this.entities.set(await this.entityService.getAll(this.table)); } catch (error) { console.error(error); } }
  async loadAllRecords() { try { this.allRecords.set(await this.recordService.getRecordsByEntityType('restaurant')); } catch (error) { console.error(error); } }
  openCreate() { this.entityToEdit.set(null); this.isEntityModalOpen.set(true); }
  openEdit(entity: BusinessEntity) { this.entityToEdit.set(entity); this.isEditEntityModalOpen.set(true); }
  closeEntityModal() { this.isEntityModalOpen.set(false); this.isEditEntityModalOpen.set(false); this.entityToEdit.set(null); }
  async saveEntity(entity: BusinessEntity) { this.isSaving.set(true); try { if (entity.id === undefined) await this.entityService.create(this.table, entity); else await this.entityService.update(this.table, entity); await this.loadEntities(); this.closeEntityModal(); } catch (error) { console.error(error); } finally { this.isSaving.set(false); } }
  async removeEntity(id: number) { if (!confirm('Desea eliminar el restaurante')) return; try { await this.entityService.remove(this.table, id); await this.loadEntities(); } catch (error) { console.error(error); } }
  async selectEntity(entity: BusinessEntity) { if (entity.id === undefined) return; this.selected.set(entity); this.records.set(await this.recordService.getRecords(entity.id, 'restaurant')); this.isHistoryModalOpen.set(true); }
  closeHistory() { this.isHistoryModalOpen.set(false); }
  openCreateRecord() { this.recordToEdit.set(null); this.isRecordModalOpen.set(true); }
  editRecord(record: RecordModel) { this.recordToEdit.set(record); this.isRecordModalOpen.set(true); }
  closeRecord() { this.isRecordModalOpen.set(false); this.recordToEdit.set(null); }
  async saveRecord(data: { description: string; price?: number; record_type: RecordType }) { const entity = this.selected(); if (!entity?.id) return; this.isSaving.set(true); try { const current = this.recordToEdit(); const record = current?.id ? await this.recordService.updateRecord({ ...current, ...data }) : await this.recordService.createRecord({ entity_id: entity.id, entity_type: 'restaurant', ...data }); this.records.update(items => current?.id ? items.map(item => item.id === record.id ? record : item) : [record, ...items]); await this.loadAllRecords(); this.closeRecord(); } catch (error) { console.error(error); } finally { this.isSaving.set(false); } }
  async deleteRecord(id: string) { if (!confirm('Desea eliminar el registro')) return; try { await this.recordService.deleteRecord(id); this.records.update(items => items.filter(item => item.id !== id)); await this.loadAllRecords(); } catch (error) { console.error(error); } }
  openReport(period: 'weekly' | 'monthly') { this.reportPeriod.set(period); this.isReportModalOpen.set(true); }
  closeReport() { this.isReportModalOpen.set(false); }
}
