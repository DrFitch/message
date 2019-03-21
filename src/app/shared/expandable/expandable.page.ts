import { AfterViewInit, Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';

@Component({
  selector: 'expandable',
  templateUrl: './expandable.page.html',
  styleUrls: ['./expandable.page.scss'],
})

export class ExpandableComponent implements AfterViewInit {

  @ViewChild('expandWrapper', { read: ElementRef }) expandWrapper;
  // tslint:disable-next-line:no-input-rename
  @Input('expanded') expanded;
  // tslint:disable-next-line:no-input-rename
  @Input('expandWidth') expandWidth;

  constructor(public renderer: Renderer) { }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'width', this.expandWidth + 'px');
  }

}
