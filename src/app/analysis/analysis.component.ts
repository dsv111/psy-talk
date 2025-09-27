import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisService } from '../analysis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule], // Only standalone components/pipes/directives here!
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {
  input: string = '';
  loading = true;
  analysisResult: any = null;
  errorMsg: string = '';

  constructor(
    private router: Router,
    private analysis: AnalysisService
  ) {
    const nav = this.router.getCurrentNavigation();
    // Use optional chaining and property access for router state
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
}
