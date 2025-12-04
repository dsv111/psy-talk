import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css'
})
export class AccordionItemComponent {
@Input() title: string = '';
// 💡 CRITICAL FIX: The component must declare 'open' as an Input!
  @Input() open: boolean = false; 

  @Output() toggleEvent = new EventEmitter<void>();
  
toggle() {
  this.open = !this.open;
}
}
