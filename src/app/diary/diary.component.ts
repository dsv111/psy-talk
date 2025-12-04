import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../analysis.service';
import { AccordionComponent } from '../shared/accordion/accordion.component';
import { AccordionItemComponent } from '../shared/accordion-item/accordion-item.component';
interface DiaryEntry {
  date: string;
  text: string;
  mood?: string;
}
// Define a basic interface for a Part
export interface Part {
  id: number;
  isOpen: boolean;       // Controls the open/close state of the accordion item
  name: string;          // Form field 1
  email: string;         // Form field 2
  age: number | null;    // Form field 3
}
// Utility function outside component
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FormsModule,AccordionComponent,AccordionItemComponent],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent {
  entries: DiaryEntry[] = [];
  selectedDate: string = '';
  entryText = '';
  entryMood = '';
  todayStr: string = '';
  moods = [
    { value: 'happy', icon: '😊' },
    { value: 'sad', icon: '😢' },
    { value: 'ok', icon: '😐' },
    { value: 'angry', icon: '😠' },
    { value: 'excited', icon: '🤩' }
  ];
// A counter to ensure unique IDs for new parts (Part 1, Part 2, etc.)
  private nextPartId = 1;
  // The array holding all the parts to be rendered
  parts: Part[] = [];

 constructor(public analysis: AnalysisService) {
  this.addPart(true);
 }

  ngOnInit() {
    const today = new Date();
    this.todayStr = today.toISOString().slice(0, 10);
    this.selectedDate = this.todayStr;
    this.loadEntries();
    this.loadEntry();
  }

  /**
   * Adds a new Part object to the 'parts' array.
   */
  addPart(shouldBeOpen: boolean = false): void {
    const newPart: Part = {
      id: this.nextPartId++,
      isOpen: shouldBeOpen,
      name: '',
      email: '',
      age: null 
    };
    this.parts.push(newPart);
  }

  // Optional: Method to remove a part
  removePart(id: number): void {
    this.parts = this.parts.filter(part => part.id !== id);
  }
  /**
   * Helps Angular optimize rendering when items are added/removed from the list.
   * @param index The index of the item
   * @param part The current Part object
   * @returns The unique ID of the part
   */
  trackByPartId(index: number, part: Part): number {
    return part.id;
  }

  submitAndLogData(): void {
    console.log('--- Submitting & Logging All Dynamic Parts Data ---');
    
    // Log the entire array structure
    console.log(this.parts);
    
    // Optional: Log data for each part individually
    this.parts.forEach((part, index) => {
      console.log(`Part ${index + 1} Data (ID: ${part.id}):`, {
        Name: part.name,
        Email: part.email,
        Age: part.age
      });
    });
    
    console.log('----------------------------------------------------');
  }

  onDateChange() {
    if (this.selectedDate > this.todayStr) this.selectedDate = this.todayStr;
    this.loadEntry();
  }

  loadEntries() {
    this.entries = [];
    if (!isBrowser()) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('diary-')) {
        const entry = JSON.parse(localStorage.getItem(key)!);
        this.entries.push(entry);
      }
    }
    // Sort entries by date, newest first
    this.entries.sort((a, b) => b.date.localeCompare(a.date));
  }

  loadEntry() {
    if (!isBrowser()) {
      this.entryText = '';
      this.entryMood = '';
      return;
    }
    const entryStr = localStorage.getItem('diary-' + this.selectedDate);
    if (entryStr) {
      const entry = JSON.parse(entryStr);
      this.entryText = entry.text;
      this.entryMood = entry.mood || '';
    } else {
      this.entryText = '';
      this.entryMood = '';
    }
  }

  saveEntry() {
    if (!this.entryText.trim() || !isBrowser()) return;
    const entry: DiaryEntry = {
      date: this.selectedDate,
      text: this.entryText.trim(),
      mood: this.entryMood
    }; 
    
    localStorage.setItem('diary-' + this.selectedDate, JSON.stringify(entry));
    this.loadEntries();
    alert('Diary saved for ' + this.selectedDate);
  }

  deleteEntry(date: string) {
    if (!isBrowser()) return;
    localStorage.removeItem('diary-' + date);
    if (this.selectedDate === date) {
      this.entryText = '';
      this.entryMood = '';
    }
    this.loadEntries();
  }

  beginEdit(date: string) {
    this.selectedDate = date;
    this.onDateChange();
  }

  getMoodIcon(moodValue?: string): string {
    if (!moodValue) return '';
    const mood = this.moods.find(m => m.value === moodValue);
    return mood ? mood.icon : '';
  }
}
