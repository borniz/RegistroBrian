import { Component, computed, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RecordModel, RecordType } from '../../models/record.model';

interface RecordSummaryTotals {
  ingresos: number;
  egresos: number;
  balance: number;
}

interface EntitySummary extends RecordSummaryTotals {
  entityId: number;
  entityName: string;
}

@Component({
  selector: 'app-record-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './record-summary.html',
  styleUrl: './record-summary.css'
})
export class RecordSummary {
  records = input<RecordModel[]>([]);
  title = input('RESUMEN FINANCIERO');
  scopeLabel = input('TODOS LOS VEHICULOS');
  entityLabels = input<Record<number, string>>({});
  detailOnly = input(false);
  period = input<'weekly' | 'monthly'>('weekly');
  onPeriodSelected = output<'weekly' | 'monthly'>();

  selectedPeriod = signal<'weekly' | 'monthly' | null>(null);

  weeklySummary = computed(() => {
    const start = this.startOfWeek();
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return this.calculateSummary(start, end);
  });

  monthlySummary = computed(() => {
    const now = new Date();
    return this.calculateSummary(
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1)
    );
  });

  selectedSummary = computed(() => {
    const period = this.selectedPeriod() ?? this.period();
    if (period === 'weekly') {
      return this.weeklySummary();
    }
    if (period === 'monthly') {
      return this.monthlySummary();
    }
    return null;
  });

  selectedPeriodLabel = computed(() =>
    (this.selectedPeriod() ?? this.period()) === 'weekly' ? 'REPORTE SEMANAL' : 'REPORTE MENSUAL'
  );

  entitySummaries = computed(() => {
    const range = this.getSelectedRange();
    const summaries = new Map<number, EntitySummary>();

    for (const [entityId, entityName] of Object.entries(this.entityLabels())) {
      const numericEntityId = Number(entityId);
      summaries.set(numericEntityId, {
        entityId: numericEntityId,
        entityName,
        ingresos: 0,
        egresos: 0,
        balance: 0
      });
    }

    for (const record of this.records()) {
      if (!record.create_date || record.price === null || record.price === undefined) {
        continue;
      }

      const date = new Date(record.create_date);
      const amount = Number(record.price);
      if (Number.isNaN(date.getTime()) || !Number.isFinite(amount) || date < range.start || date >= range.end) {
        continue;
      }

      const entityId = record.entity_id;
      const summary = summaries.get(entityId) ?? {
        entityId,
        entityName: this.entityLabels()[entityId] ?? `ENTIDAD ${entityId}`,
        ingresos: 0,
        egresos: 0,
        balance: 0
      };
      if (record.record_type === 'ingreso') {
        summary.ingresos += amount;
      } else {
        summary.egresos += amount;
      }
      summary.balance = summary.ingresos - summary.egresos;
      summaries.set(entityId, summary);
    }

    return Array.from(summaries.values()).sort((first, second) =>
      first.entityName.localeCompare(second.entityName)
    );
  });

  seleccionarPeriodo(period: 'weekly' | 'monthly'): void {
    this.selectedPeriod.set(period);
    this.onPeriodSelected.emit(period);
  }

  private calculateSummary(start: Date, end: Date): RecordSummaryTotals {
    return this.records().reduce((summary, record) => {
      if (!record.create_date || record.price === null || record.price === undefined) {
        return summary;
      }

      const date = new Date(record.create_date);
      if (Number.isNaN(date.getTime()) || date < start || date >= end) {
        return summary;
      }

      const amount = Number(record.price);
      if (!Number.isFinite(amount)) {
        return summary;
      }

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

  private getSelectedRange(): { start: Date; end: Date } {
    if ((this.selectedPeriod() ?? this.period()) === 'weekly') {
      const start = this.startOfWeek();
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { start, end };
    }

    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 1)
    };
  }
}
