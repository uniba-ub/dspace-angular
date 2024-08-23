import {
  Component,
  Renderer2,
} from '@angular/core';

import { BaseEmbeddedHtmlMetricComponent } from '../base-embedded-html-metric.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { RedirectWithHrefDirective } from '../../../../directives/redirect/redirect-href.directive';

@Component({
    selector: 'ds-metric-embedded-download',
    templateUrl: './metric-embedded-download.component.html',
    styleUrls: ['./metric-embedded-download.component.scss', '../../metric-loader/base-metric.component.scss'],
    standalone: true,
    imports: [
        RedirectWithHrefDirective,
        NgIf,
        TranslateModule,
    ],
})
export class MetricEmbeddedDownloadComponent extends BaseEmbeddedHtmlMetricComponent {

  constructor(protected render: Renderer2) {
    super(render);
  }

}
