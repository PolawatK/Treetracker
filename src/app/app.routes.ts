import { Routes } from '@angular/router';
import { MapView} from './pages/map-view/map-view';
export const routes: Routes = [
  { path: '', component: MapView },   // หน้าแรก = แผนที่
  { path: '**', redirectTo: '' }   
];
