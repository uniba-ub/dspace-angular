import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { SiteStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component';
import { StatisticsTableComponent } from '../../../../../app/statistics-page/statistics-table/statistics-table.component';
import {
  CrisStatisticsPageModule
} from '../../../../../app/statistics-page/cris-statistics-page/cris-statistics-page.module';

@Component({
  selector: 'ds-themed-site-statistics-page',
  // styleUrls: ['./site-statistics-page.component.scss'],
  styleUrls: ['../../../../../app/statistics-page/site-statistics-page/site-statistics-page.component.scss'],
  // templateUrl: './site-statistics-page.component.html',
  templateUrl: '../../../../../app/statistics-page/statistics-page/statistics-page.component.html',
  standalone: true,
  imports: [CommonModule, VarDirective, ThemedLoadingComponent, StatisticsTableComponent, TranslateModule, CrisStatisticsPageModule],
})

/**
 * Component representing the site-wide statistics page.
 */
export class SiteStatisticsPageComponent extends BaseComponent {}

