import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule],
  templateUrl: './map-view.html',
  styleUrls: ['./map-view.css'],
})
export class MapView implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  trees: any[] = [];
  selectedSpecies: string | null = null;
  selectedTreeIndex: number | null = null;
  activeTree: any = null;

  // 🎨 ตัวแปรสำหรับวาด polygon
  drawingPoints: google.maps.LatLngLiteral[] = [];
  drawingEnabled = false;
  polygonComplete = false;

  center = { lat: 13.736717, lng: 100.523186 };
  zoom = 6;
  size = new google.maps.Size(45, 45);

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    restriction: {
      //ล็อคประเทศไทยครับ
      latLngBounds: {
        north: 20.5,
        south: 5.5,
        west: 97.0,
        east: 106.0,
      },
      strictBounds: true,
    },
  };

  constructor(private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.firebaseService.getTrees().subscribe((data) => {
      this.trees = data;
    });
  }

  ngAfterViewInit(): void {
  const googleMap = this.map.googleMap;

  googleMap?.addListener("click", (e: google.maps.MapMouseEvent) => {
    if (!this.drawingEnabled || !e.latLng) return;
    const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    this.drawingPoints.push(point);
    console.log("✅ Click:", point);

    this.cdr.detectChanges();
  });
}


  /** ✅ รายชื่อพันธุ์ต้นไม้ไม่ซ้ำ */
  get speciesList(): string[] {
    return Array.from(new Set(this.trees.map(t => t.species))).sort();
  }

  /** ✅ กรองต้นไม้ตามพันธุ์ + พื้นที่ที่วาด */
  get filteredTrees(): any[] {
    let filtered = this.selectedSpecies
      ? this.trees.filter(t => t.species === this.selectedSpecies)
      : this.trees;

    if (this.polygonComplete && this.drawingPoints.length >= 3) {
      filtered = filtered.filter(tree =>
        this.isPointInPolygon({ lat: tree.latitude, lng: tree.longitude }, this.drawingPoints)
      );
    }
    return filtered;
  }

  /** ✏️ เริ่มวาด */
  startDrawing(): void {
  console.log("✏️ วาดเริ่มทำงานแล้ว");
  this.clearDrawing();
  this.drawingEnabled = true;
  this.polygonComplete = false;
}

  /** คลิกเเล้ว เก็บค่าไว้เเสดงผลเส้นที่วาด*/  
  onMapClick(event: google.maps.MapMouseEvent): void {
  if (!this.drawingEnabled || !event.latLng) return;

  const point = { lat: event.latLng.lat(), lng: event.latLng.lng() };
  this.drawingPoints = [...this.drawingPoints, point];

  console.log('📍 เพิ่มจุด:', point);
}

  /** ปิด Polygon <map-polygon> จะปิดให้โดยการเชื่อมจุดพิกัดเส้นเเรกกับสุดท้าย*/
  finishDrawing(): void {
    if (this.drawingPoints.length < 3) return;
    this.polygonComplete = true;
    this.drawingEnabled = false;
    console.log('✅ ปิดพื้นที่แล้ว');
  }

  /** 🗑️ ล้างพื้นที่ */
  clearDrawing(): void {
    this.drawingPoints = [];
    this.polygonComplete = false;
    this.drawingEnabled = false;
    console.log('🧹 ล้างทั้งหมด');
    this.cdr.detectChanges();
  }

  /** 🔍 ตรวจว่าจุดอยู่ใน polygon หรือไม่ */
  isPointInPolygon(point: google.maps.LatLngLiteral, vs: google.maps.LatLngLiteral[]): boolean {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].lng, yi = vs[i].lat;
      const xj = vs[j].lng, yj = vs[j].lat;
      const intersect =
        yi > point.lat !== yj > point.lat &&
        point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  
  /** 🔎 เปิด Info Window */
  openInfoWindow(marker: MapMarker, tree: any): void {
    this.activeTree = tree;
    this.infoWindow.open(marker);
  }

  /** 🌱 รีเซ็ตเมื่อเปลี่ยนพันธุ์ */
  onSpeciesChange(): void {
    this.selectedTreeIndex = null;
    this.zoom = 6;
    this.center = { lat: 13.736717, lng: 100.523186 };
  }

  /** 🎯 โฟกัสไปต้นไม้ */
  focusOnTree(index: number | null): void {
    if (index === null) return;
    const tree = this.filteredTrees[index];
    this.center = { lat: tree.latitude, lng: tree.longitude };
    this.zoom = 17;
  }
}
