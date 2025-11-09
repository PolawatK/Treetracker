import { Routes } from '@angular/router';
import { MapView} from './pages/map-view/map-view';
import { TreeInput } from './pages/tree-input/tree-input';

export const routes: Routes = [
  { path: '', redirectTo: 'map-view', pathMatch: 'full' },
  { path: 'map-view', component: MapView },
  { path: 'add-tree', component: TreeInput },
  { path: '**', redirectTo: 'map-view' }
];
