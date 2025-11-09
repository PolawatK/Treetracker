import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { FirebaseService } from '../../services/firebase.service';
@Component({
  selector: 'app-map-view',
  imports: [CommonModule, GoogleMapsModule,FormsModule],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  trees: any[] = [];
  center = { lat: 13.736717, lng: 100.523186 }; // กรุงเทพฯ
  zoom = 6;
  selectedTreeIndex: number | null = null;
  selectedTree: any = null;
  activeTree: any = null;
  size = new google.maps.Size(45, 45);

  mapOptions: google.maps.MapOptions = {
    restriction: {
      latLngBounds: {
        north: 20.5,
        south: 5.5,
        west: 97.0,
        east: 106.0
      },
      strictBounds: true
    },
    mapTypeId: 'roadmap',
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    minZoom: 5,
    maxZoom: 18
  };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getTrees().subscribe((data) => {
      this.trees = data;
    });
  }

  focusOnTree(index: number | null): void {
    if (index === null) {
      this.selectedTree = null;
      this.zoom = 6;
      this.center = { lat: 13.736717, lng: 100.523186 };
      return;
    }

    const tree = this.trees[index];
    if (tree && tree.latitude && tree.longitude) {
      this.center = {
        lat: Number(tree.latitude),
        lng: Number(tree.longitude)
      };
      this.zoom = 17;
      this.selectedTree = tree;
    }
  }

  openInfoWindow(marker: MapMarker, tree: any): void {
    this.activeTree = tree;
    this.infoWindow.open(marker);
  }
}