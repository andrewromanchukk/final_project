import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  constructor() {}

  isOpen: boolean;
  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Навігація',
        items: [
          { label: 'Учні', icon: 'pi  pi-users', routerLink: ['students'] },
          {
            label: 'Вчителі',
            icon: 'pi pi-user-minus',
            routerLink: ['teachers']
          },
          { label: 'Предмети', icon: 'pi pi-pencil', routerLink: ['subjects'] },
          { label: 'Класи', icon: 'pi pi-folder', routerLink: ['groups'] },
          {
            label: 'Розклад уроків',
            icon: 'pi pi-info',
            routerLink: ['class-schedule']
          },
          {
            label: 'Редагувати розклад',
            icon: 'pi pi-pencil',
            routerLink: ['correct-schedule']
          },
          {
            label: 'Перехід на новий навчальний рік',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['new-studying-year']
          },
          {
            label: 'Додати вчителя до журналу',
            icon: 'pi pi-user-plus',
            routerLink: ['attach-teacher']
          }
        ]
      }
    ];
  }

  showNavigation() {
    this.isOpen = true;
  }

  closeNavigation() {
    this.isOpen = false;
  }
}
