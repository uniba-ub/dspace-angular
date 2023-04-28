import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { SearchObjects } from '../../../search/models/search-objects.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { SectionComponent } from '../../../../core/layout/models/section.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../../../search/models/paginated-search-options.model';
import { Router } from '@angular/router';
import { hasValue } from '../../../empty.util';

@Component({
  selector: 'ds-counters-section',
  templateUrl: './counters-section.component.html'
})
export class CountersSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  countersSection: CountersSection;

  counterData$: Observable<CounterData[]>;
  isLoading$ = new BehaviorSubject(true);

  pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'counters-pagination',
    pageSize: 1,
    currentPage: 1
  });


  constructor(private searchService: SearchService, private router: Router) {

  }

  ngOnInit() {
    this.counterData$ = forkJoin(
      this.countersSection.counterSettingsList.map((counterSettings: CountersSettings) =>
        this.searchService.search(new PaginatedSearchOptions({
          configuration: counterSettings.discoveryConfigurationName,
          pagination: this.pagination})).pipe(
          getFirstSucceededRemoteDataPayload(),
          map((rs: SearchObjects<DSpaceObject>) => rs.totalElements),
          map((total: number) => {
            return {
              count: total.toString(),
              label: counterSettings.entityName,
              icon: counterSettings.icon,
              link: counterSettings.link

            };
          })
        )));
    this.counterData$.subscribe(() => this.isLoading$.next(false));
  }

  getLinkQueryParams(link: string): any {
    return this.router.parseUrl(link).queryParams || null;
  }

  getLinkSegment(link: string): string {
    if (hasValue(link) && link.includes('?')) {
      return link.split('?')[0];
    }
    return link;
  }

}



export interface CountersSection extends SectionComponent {
  componentType: 'counters';
  counterSettingsList: CountersSettings[];
}

export interface CountersSettings {
  discoveryConfigurationName: string;
  entityName: string;
  icon: string;
  link: string;
}

export interface CounterData {
  label: string;
  count: string;
  icon: string;
  link: string;
}
