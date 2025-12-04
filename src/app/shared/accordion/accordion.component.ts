import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [],
  // templateUrl: './accordion.component.html',
  template: `<ng-content></ng-content>`,
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {

}
