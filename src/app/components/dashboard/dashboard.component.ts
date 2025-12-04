
import { Component, OnInit } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { AccordionItemComponent } from '../../shared/accordion-item/accordion-item.component';


// Reusing your Part interface
export interface Part {
  id: number;
  isOpen: boolean; 
  type: 'Engine' | 'Stand' | 'Helicopter' | 'Other'; // New field for radio buttons
  engineModel: string;
  standType: string;
  actualWeight: number | null;
  dimensions: string;
  sn: string;
  pn: string;
  po: string;
  instruction: string;
  // Options
  insurance: boolean;
  additionalcover: boolean;
  trackingDevice: boolean;
  purgeCertificate: boolean; // Pre-checked in wireframe
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Use CSS for grid layout
  imports: [CommonModule, FormsModule, AccordionComponent, AccordionItemComponent]
})
export class DashboardComponent implements OnInit {
  
  // Array to hold all dynamic Part accordions
  parts: Part[] = [];
  private nextPartId = 1;

  ngOnInit(): void {
    // Initialize the form with Part 1 open by default
    this.addPart(true); 
  }

  addPart(shouldBeOpen: boolean = false): void {
    const newPart: Part = {
      id: this.nextPartId++,
      isOpen: shouldBeOpen,
      type: 'Engine', // Default selection
      engineModel: '',
      standType: '',
      actualWeight: null,
      dimensions: '',
      sn: '',
      pn: '',
      po: '',
      instruction: 'Flat bed Air Ride Truck Mandatory.',
      insurance: false,
      trackingDevice: false,
      additionalcover: false,
      purgeCertificate: true // As seen in the wireframe
    };
    this.parts.push(newPart);
  }

  removePart(id: number): void {
    this.parts = this.parts.filter(part => part.id !== id);
  }
  
  submitQuote(): void {
    console.log('--- Final Quote Data (All Parts) ---');
    console.log(this.parts);
  }
  
  trackByPartId(index: number, part: Part): number {
    return part.id;
  }
}