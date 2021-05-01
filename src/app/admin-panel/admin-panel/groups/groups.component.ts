import { Component, OnInit } from '@angular/core';
import { isString, isNumber } from 'util';
import { Group } from '../../../models/group.model';
import { AdmingroupsService } from 'src/app/services/admingroups.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  providers: [PageTitleService]
})
export class GroupsComponent implements OnInit {
  showInactive: boolean;
  cols: Array<object>;
  groups: Group[];
  activeGroups: Group[];
  inactiveGroups: Group[];
  showEditDialog = false;
  editGroupOriginal: Group;
  editGroup: any;
  defaultActive = '1';

  showDialog(rowData?: Group) {
    if (!rowData) {
      rowData = new Group(this.defaultActive);
    }
    this.editGroupOriginal = rowData;
    this.editGroup = Object.assign({}, rowData);
    this.showEditDialog = true;
  }

  saveGroup() {
    // hack to convert string value set by radio button to bool
    if (isString(this.editGroup.isActive)) {
      this.editGroup.isActive = this.editGroup.isActive === '1';
    }
    this.groupService.saveClass(this.editGroup)
      .subscribe(group => {
        const isActiveChanged = this.editGroupOriginal.isActive !== this.editGroup.isActive;
        Object.assign(this.editGroupOriginal, this.editGroup);
        const newGroup = !isNumber(this.editGroup.id);
        if (newGroup) {
          this.groups.push(this.editGroup);
        }
        if (isActiveChanged || newGroup) {
          this.filterGroups();
          this.notificationToasts.notify('success', 'Успішно виконано', 'Зміни збережено');
        }
        this.showEditDialog = false;
      }, error => {
        this.notificationToasts.notify('error', 'Відхилено', 'Невдалось зберегти зміни, або введений клас уже існує');
      });
  }

  constructor(
    private groupService: AdmingroupsService,
    private notificationToasts: DataSharingService,
    private pageTitle: PageTitleService) {
    this.editGroup = new Group(this.defaultActive);
  }

  ngOnInit() {
    this.pageTitle.setTitle('Католицька Школа - Класи');
    this.groupService.getClasses()
      .subscribe(data => {
        this.groups = data;
        this.filterGroups();
      });

    this.cols = [
      { field: 'className', header: 'Клас' },
      { field: 'classYear', header: 'Рік' }
    ];
  }

  filterGroups() {
    this.activeGroups = this.groups.filter(g => g.isActive)
      .sort( (gr1, gr2) => parseInt(gr1.className, 10) - parseInt(gr2.className, 10));
    this.inactiveGroups = this.groups.filter(g => !g.isActive)
      .sort( (gr1, gr2) => parseInt(gr1.className, 10) - parseInt(gr2.className, 10));
  }
}
