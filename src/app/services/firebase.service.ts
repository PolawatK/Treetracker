import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  getTrees(): Observable<any[]> {
    const treeCollection = collection(this.firestore, 'tree');
    return collectionData(treeCollection, { idField: 'id' }) as Observable<any[]>;
  }
}
