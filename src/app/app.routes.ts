import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AnalysisComponent } from './analysis/analysis.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: '**', redirectTo: '' },
];
