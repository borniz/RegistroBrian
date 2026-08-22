import { Component, input, output } from '@angular/core';
import { BusinessEntity } from '../../models/business-entity.model';

@Component({
  selector: 'app-business-entity-list',
  standalone: true,
  templateUrl: './business-entity-list.html'
})
export class BusinessEntityList {
  entities = input<BusinessEntity[]>([]);
  selected = input<BusinessEntity | null>(null);
  entityLabel = input('ELEMENTO');
  onSelect = output<BusinessEntity>();
  onEdit = output<BusinessEntity>();
  onDelete = output<number>();

  editar(event: Event, entity: BusinessEntity): void {
    event.stopPropagation();
    this.onEdit.emit(entity);
  }

  eliminar(event: Event, entity: BusinessEntity): void {
    event.stopPropagation();
    if (entity.id !== undefined) this.onDelete.emit(entity.id);
  }
}
