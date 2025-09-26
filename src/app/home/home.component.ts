import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  situationText: string = '';
  recording = false;
  recognition: any;
  manuallyStopped = false; // Track manual stop

  constructor(private router: Router, private zone: NgZone) {}

  analyzeSituation() {
    if (this.situationText.trim()) {
      this.router.navigate(['/analysis'], {
        state: { input: this.situationText },
      });
    }
  }

  toggleRecording() {
    if (this.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.manuallyStopped = false;
    if (
      !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      alert('Sorry, voice input is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true; // Keep listening!
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.zone.run(() => (this.recording = true));
    };
    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      this.zone.run(() => {
        this.situationText = transcript;
      });
    };
    this.recognition.onerror = () => {
      this.zone.run(() => (this.recording = false));
    };
    this.recognition.onend = () => {
      this.zone.run(() => {
        this.recording = false;
        if (!this.manuallyStopped) {
          // Restart if not manually stopped
          this.startRecording();
        }
      });
    };
    this.recognition.start();
  }

  stopRecording() {
    this.manuallyStopped = true;
    if (this.recognition) {
      this.recognition.stop();
    }
    this.recording = false;
  }
  clearText() {
  this.situationText = '';
}
}
