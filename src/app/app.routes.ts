import { Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { StockEntryComponent } from './components/stock-entry/stock-entry.component';

export const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent },
  { path: 'stock-entry', component: StockEntryComponent }
];
