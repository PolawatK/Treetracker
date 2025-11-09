import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-tree-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tree-input.html',
  styleUrls: ['./tree-input.css']
})
export class TreeInput implements OnInit {
  treeData = {
    name: '',
    species: '',
    circumference: 0,
    height: 0,
    latitude: 0,
    longitude: 0,
  };

  successMsg = '';
  errorMsg = '';
  locating = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  /** ✅ ดึงตำแหน่งจาก GPS */
  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.errorMsg = '❌ เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง (GPS)';
      return;
    }

    this.locating = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.treeData.latitude = position.coords.latitude;
        this.treeData.longitude = position.coords.longitude;
        this.locating = false;
        this.successMsg = '📍 ดึงตำแหน่งปัจจุบันสำเร็จแล้ว';
        console.log('ตำแหน่ง GPS:', this.treeData);
      },
      (error) => {
        this.locating = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorMsg = '⚠️ โปรดอนุญาตให้เข้าถึงตำแหน่ง';
            break;
          case error.POSITION_UNAVAILABLE:
            this.errorMsg = '📡 ไม่สามารถระบุตำแหน่งได้';
            break;
          case error.TIMEOUT:
            this.errorMsg = '⌛ การค้นหาตำแหน่งใช้เวลานานเกินไป';
            break;
          default:
            this.errorMsg = '❌ เกิดข้อผิดพลาดในการค้นหาตำแหน่ง';
        }
      }
    );
  }

  /** ✅ บันทึกข้อมูลต้นไม้ */
  addTree(): void {
    if (!this.treeData.name || !this.treeData.species) {
      this.errorMsg = 'กรุณากรอกชื่อและพันธุ์ต้นไม้';
      this.successMsg = '';
      return;
    }

    this.firebaseService.addTree(this.treeData)
      .then(() => {
        console.log("กำลังบันทึก")
        this.successMsg = '✅ เพิ่มข้อมูลต้นไม้เรียบร้อยแล้ว!';
        this.errorMsg = '';
        this.treeData = {
          name: '',
          species: '',
          circumference: 0,
          height: 0,
          latitude: 0,
          longitude: 0,
        };
        alert("เพิ่มข้อมูลต้นไม้เรียบร้อยแล้ว!");
      })
      .catch(() => {
        this.errorMsg = '❌ เกิดข้อผิดพลาดในการบันทึก';
        this.successMsg = '';
      });
  }
}
