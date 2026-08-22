import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecordModel, RecordType } from '../../models/record.model';
import { NumberFormatDirective } from '../../directives/number-format';

@Component({
  selector: 'app-create-record',
  standalone: true,
  imports: [
    FormsModule,
    NumberFormatDirective
  ],
  templateUrl: './create-record.html',
  styleUrl: './create-record.css'
})
export class CreateRecord {
  vehiclePlate = input.required<string>();

  record = input<RecordModel | null>(null);

  isSaving = input<boolean>(false);

  onClose = output<void>();

  onSubmitRecord = output<{
    description: string;
    price?: number;
    record_type: RecordType;
  }>();


  description = signal('');

  price = signal<number | null>(null);

  recordType = signal<RecordType>('egreso');

  constructor() {
    effect(() => {
      const record = this.record();
      this.description.set(record?.description ?? '');
      this.price.set(record?.price ?? null);
      this.recordType.set(record?.record_type ?? 'egreso');
    });
  }


  cerrar() {
    this.onClose.emit();
  }


  guardar(): void {
    const description = this.description().trim();

    if (!description) {
      return;
    }

    this.onSubmitRecord.emit({
      description,
      price: this.price() ?? undefined,
      record_type: this.recordType()
    });
  }

}