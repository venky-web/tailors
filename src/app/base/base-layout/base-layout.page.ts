import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.page.html',
  styleUrls: ['./base-layout.page.scss'],
})
export class BaseLayoutPage implements OnInit {

  platforms: string[];
  isDesktop: boolean;

  constructor(
		private platform: Platform,
  ) {
    this.platforms = this.platform.platforms();
		this.isDesktop = this.platforms.includes('desktop');
  }

  ngOnInit() {
  }

}
