import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../analysis.service';

interface DiaryEntry {
  date: string;
  text: string;
  mood?: string;
}
// Utility function outside component
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

 constructor(public analysis: AnalysisService) {}

  ngOnInit() {
    const today = new Date();
    this.todayStr = today.toISOString().slice(0, 10);
    this.selectedDate = this.todayStr;
    this.loadEntries();
    this.loadEntry();
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
