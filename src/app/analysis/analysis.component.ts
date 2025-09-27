import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent {
  input: string = '';
  loading = true;
  analysisResult: any = null;
  errorMsg: string = '';

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
      },
    });
  }

  // This function transforms markdown into HTML and marks it safe for Angular rendering
  getSuggestionHtml(suggestion: string): SafeHtml {
    // Marked 5.x synchronous option
    const html = marked.parse(suggestion, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
