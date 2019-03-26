import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.page.html',
  styleUrls: ['./gallery-modal.page.scss'],
})
export class GalleryModalPage implements OnInit {

  @Input() value;

  constructor() { }

  ngOnInit() {
    console.log('values', this.value);
  }

}
