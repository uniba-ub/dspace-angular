import {
  AsyncPipe,
  KeyValuePipe,
  NgFor,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';

import { ObjectKeysPipe } from '../../utils/object-keys-pipe';
import { AppliedFilter } from '../models/applied-filter.model';
import { SearchLabelComponent } from './search-label/search-label.component';
import { SearchLabelLoaderComponent } from './search-label-loader/search-label-loader.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
  standalone: true,
  imports: [NgFor, SearchLabelComponent, AsyncPipe, ObjectKeysPipe, SearchLabelLoaderComponent, KeyValuePipe],
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * The {@link AppliedFilter}s by filter name
   */
  @Input() appliedFilters: Map<string, AppliedFilter[]>;

}
