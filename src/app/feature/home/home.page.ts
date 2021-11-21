import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FeatureCard, FEATURES_LIST } from './cards';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  features: FeatureCard[];

  constructor(
    private router: Router,
  ) {
    this.features = FEATURES_LIST;
  }

  onClickTile(routeUrl: string) {
    console.log(routeUrl);
    this.router.navigateByUrl(routeUrl);
  }

}
