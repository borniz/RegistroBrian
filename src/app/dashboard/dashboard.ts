import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RecordModel, RecordType } from '../shared/models/record.model';
import { RecordService } from '../shared/services/record.service';

interface DashboardSummary {
  label: string;
  icon: string;
  records: number;
  ingresos: number;
  egresos: number;
  balance: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private recordService = inject(RecordService);
  private records = signal<RecordModel[]>([]);

  summaries = computed<DashboardSummary[]>(() => [
    this.createSummary('VEHICULOS', '🚖', 'vehicle'),
    this.createSummary('RESTAURANTES', '🍽️', 'restaurant'),
    this.createSummary('STORE', '🔨', 'store')
  ]);

  async ngOnInit(): Promise<void> {
    try {
      const records = await Promise.all([
        this.recordService.getRecordsByEntityType('vehicle'),
        this.recordService.getRecordsByEntityType('restaurant'),
        this.recordService.getRecordsByEntityType('store')
      ]);
      this.records.set(records.flat());
    } catch (error) {
      console.error('Error cargando los balances del dashboard:', error);
      this.records.set([]);
    }
  }

  private createSummary(
    label: string,
    icon: string,
    entityType: RecordModel['entity_type']
  ): DashboardSummary {
    const entityRecords = this.records().filter(record => record.entity_type === entityType);
    const ingresos = this.totalByType(entityRecords, 'ingreso');
    const egresos = this.totalByType(entityRecords, 'egreso');

    return {
      label,
      icon,
      records: entityRecords.length,
      ingresos,
      egresos,
      balance: ingresos - egresos
    };
  }

  private totalByType(records: RecordModel[], type: RecordType): number {
    return records.reduce((total, record) => {
      if ((record.record_type ?? 'egreso') !== type || record.price === null || record.price === undefined) {
        return total;
      }
      return total + Number(record.price);
    }, 0);
  }
}
