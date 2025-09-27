import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {
  input: string = '';
  loading = true;
  analysisResult: any = null;
  errorMsg: string = '';

  futureSituationText = '';
  futureAdvice: SafeHtml | null = null;
  selectedMentality: any = null;
  mentalities = [
    { name: 'Gentleman', icon: '🤵' },
    { name: 'Funny', icon: '😂' },
    { name: 'Reserved', icon: '😶' },
    { name: 'Intelligent', icon: '🧠' },
    { name: 'Broad-minded', icon: '🌐' },
    { name: 'Revenge-oriented', icon: '😡' },
    { name: 'Empathetic', icon: '❤️' },
    { name: 'Assertive', icon: '💪' },
    { name: 'Forgiving', icon: '🙏' }
  ];

  constructor(
    private router: Router,
    private analysis: AnalysisService,
    private sanitizer: DomSanitizer
  ) {
    const nav = this.router.getCurrentNavigation();
    this.input = nav?.extras.state?.['input'] || '';
    if (this.input) {
      this.analyze(this.input);
    } else {
      this.router.navigate(['/']);
    }
  }

  analyze(text: string) {
    this.errorMsg = '';
    this.loading = true;
    this.analysis.analyzeSituation(text).subscribe({
      next: (res) => {
        this.analysisResult = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Failed to analyze. Try again later.';
      }
    });
  }

  getSuggestionHtml(suggestion: string): SafeHtml {
    const html = marked.parseInline(suggestion, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  selectMentality(type: any) {
    this.selectedMentality = type;
  }

  analyzeFutureSituation() {
    const advice = this.analysis.getAdvicePoints(
      this.futureSituationText,
      this.selectedMentality?.name
    );
    this.futureAdvice = this.sanitizer.bypassSecurityTrustHtml(
      marked.parse(advice, { async: false }) as string
    );
  }

  // Dynamic placeholder matches previous question
  get dynamicPlaceholder(): string {
    if (this.input && this.input.length > 0) {
      return `Imagine a future situation related to: "${this.input.slice(0, 35)}..."`;
    }
    return "Describe a future scenario relevant to your situation (e.g., facing a similar challenge again...)";
  }
}
