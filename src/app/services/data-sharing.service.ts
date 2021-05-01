import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private showToasts = new Subject<Object>();

  public notify(severity: string, summary: string, detail: string, sticky?: boolean): void {
    this.showToasts.next({ severity, summary, detail, sticky });
  }

  public getToasts(): Observable<Object> {
    return this.showToasts.asObservable();
  }
}
