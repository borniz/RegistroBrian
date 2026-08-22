import { Directive, HostListener, ElementRef, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberFormat]',
  standalone: true
})
export class NumberFormatDirective {

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private control: NgControl // @Optional evita errores si no usas formularios reactivos
  ) {}

    @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = this.el.nativeElement;
    
    // 1. Guardar la posición del cursor para evitar saltos molestos al escribir
    let cursorPosition = input.selectionStart ?? 0;
    let oldLength = input.value.length;

    // 2. Extraer solo los dígitos numéricos
    let rawValue = input.value.replace(/\D/g, '');

    if (!rawValue) {
      input.value = '';
      if (this.control?.control) this.control.control.setValue(null);
      return;
    }

    // 3. Formatear inmediatamente con puntos de miles
    const formattedValue = new Intl.NumberFormat('de-DE').format(Number(rawValue));

    // 4. Forzar el valor visual en la pantalla en tiempo real
    input.value = formattedValue;

    // 5. Ajustar dinámicamente la posición del cursor
    let newLength = formattedValue.length;
    cursorPosition = cursorPosition + (newLength - oldLength);
    input.setSelectionRange(cursorPosition, cursorPosition);

    // 6. Sincronizar con los formularios de Angular enviando solo el número limpio
    if (this.control?.control) {
      this.control.control.setValue(Number(rawValue), { emitEvent: false });
    }
  }


  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    
    if (allowedKeys.includes(event.key) || (event.ctrlKey || event.metaKey)) {
      return; // Permitir comandos del sistema (copiar, pegar, borrar)
    }

    // Bloquear cualquier tecla que no sea un número del 0 al 9
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
