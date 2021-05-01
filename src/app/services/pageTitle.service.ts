import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class PageTitleService {
  public constructor(private pageTitleService: Title ) { }

  public setTitle( newTitle: string) {
    this.pageTitleService.setTitle( newTitle );
  }
}
