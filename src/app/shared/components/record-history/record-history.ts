import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RecordModel, RecordType } from '../../models/record.model';

@Component({
  selector: 'app-record-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './record-history.html',
  styleUrl: './record-history.css'
})
export class RecordHistory {

  records = input<RecordModel[]>([]);

  entityName = input<string>('');

  onCreateRecord = output<void>();

  onEditRecord = output<RecordModel>();

  onDeleteRecord = output<string>();

  weeklySummary = computed(() => {
    const startDate = this.startOfWeek();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    return this.calculateSummary(startDate, endDate);
  });

  monthlySummary = computed(() => {
    const now = new Date();
    return this.calculateSummary(
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1)
    );
  });

  private calculateSummary(startDate: Date, endDate: Date) {
    return this.records().reduce((summary, record) => {
      if (!record.create_date || !record.price) {
        return summary;
      }

      const date = new Date(record.create_date);
      if (date < startDate || date >= endDate) {
        return summary;
      }

      const amount = Number(record.price);
      const type: RecordType = record.record_type ?? 'egreso';

      if (type === 'ingreso') {
        summary.ingresos += amount;
      } else {
        summary.egresos += amount;
      }

      summary.balance = summary.ingresos - summary.egresos;
      return summary;
    }, { ingresos: 0, egresos: 0, balance: 0 });
  }

  private startOfWeek(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    return date;
  }


  crearRegistro() {
    this.onCreateRecord.emit();
  }

  editarRegistro(record: RecordModel) {
    this.onEditRecord.emit(record);
  }


  eliminarRegistro(id: string) {
    this.onDeleteRecord.emit(id);
  }
}