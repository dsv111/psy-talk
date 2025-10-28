import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { HistoryComponent } from './history/history.component';
import { DiaryComponent } from './diary/diary.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutusComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'diary', component: DiaryComponent },
  { path: '**', redirectTo: '' },
];
