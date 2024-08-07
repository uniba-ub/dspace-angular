import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { PaginationService } from '../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { currentPath } from '../../../utils/route.utils';
import { AppliedFilter } from '../../models/applied-filter.model';
import { stripOperatorFromFilterValue } from '../../search.utils';

/**
 * Component that represents the label containing the currently active filters
 */
@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
  styleUrls: ['./search-label.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe, TranslateModule],
})
export class SearchLabelComponent implements OnInit {
  @Input() key: string;
  @Input() value: string;
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilter: AppliedFilter;
  searchLink: string;
  removeParameters$: Observable<Params>;

  /**
   * Initialize the instance variable
   */
  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected searchFilterService: SearchFilterService,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters$ = this.updateRemoveParams();
  }

  /**
   * Calculates the parameters that should change if this {@link appliedFilter} would be removed from the active filters
   */
  updateRemoveParams(): Observable<Params> {
    return this.searchConfigurationService.unselectAppliedFilterParams(this.appliedFilter.filter, this.appliedFilter.value, this.appliedFilter.operator);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Strips authority operator from filter value
   * e.g. 'test ,authority' => 'test'
   *
   * @param value
   */
  normalizeFilterValue(value: string) {
    // const pattern = /,[^,]*$/g;
    const pattern = /,authority*$/g;
    value = value.replace(pattern, '');
    return stripOperatorFromFilterValue(value);
  }

  private getFilterName(): string {
    return this.key.startsWith('f.') ? this.key.substring(2) : this.key;
  }

  getStrippedValue(val) {
    return stripOperatorFromFilterValue(val);
  }
}
