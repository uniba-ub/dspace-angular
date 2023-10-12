import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { ConfigurationSearchPageComponent } from '../../../../../search-page/configuration-search-page.component';
import { BehaviorSubject } from 'rxjs';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { environment} from '../../../../../../environments/environment';
import { RelationBoxSelectedEntryConfig} from '../../../../../../config/relationbox-selected.config';
import { hasValue } from 'src/app/shared/empty.util';
import { PaginatedSearchOptions } from 'src/app/shared/search/models/paginated-search-options.model';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-relation-box.component.html',
  styleUrls: ['./cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.RELATION)
export class CrisLayoutRelationBoxComponent extends CrisLayoutBoxModelComponent implements OnInit, AfterViewInit {

  @ViewChild(ConfigurationSearchPageComponent) search: ConfigurationSearchPageComponent;

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;

  selectedOption$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  relationships$: BehaviorSubject<Relationship[]> = new BehaviorSubject<Relationship[]>(null);

  searchprefix = (environment.relationBoxSelected) ? environment.relationBoxSelected.prefix : '';

  searchkey: RelationBoxSelectedEntryConfig;

  appliedSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  /**
   * The width of the sidebar (bootstrap columns)
   */
  // sideBarWidth = 3;

  constructor(public cd: ChangeDetectorRef,
              protected translateService: TranslateService,
              @Inject('boxProvider') public boxProvider: CrisLayoutBox,
              @Inject('itemProvider') public itemProvider: Item
  ){
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.searchFilter = `scope=${this.item.id}`;
    this.configuration = (this.box.configuration as RelationBoxConfiguration)['discovery-configuration'];
    if (environment.relationBoxSelected){
      // follow link to relationships and look if some matches
      this.itemProvider.relationships.subscribe((response: RemoteData<PaginatedList<Relationship>>) => {
        if (response.isSuccess && response.payload.totalElements > 0) {
          this.searchkey = environment.relationBoxSelected.entries.find(value => value.configuration === this.configuration);
          if (hasValue(this.searchkey)) {
            const rel = response.payload.page.filter(value => hasValue(value.leftwardValue) && value.leftwardValue === this.searchkey.relationLeftType);
            if (hasValue(rel) && rel.length > 0) {
              this.relationships$.next(rel);
              this.selectedOption$.next(true);
            }
          }
        }
      });
    }
  }

  ngAfterViewInit(){
  // after child content init
    if ((hasValue(this.relationships$.getValue()) && this.relationships$.getValue().length > 0) && (this.selectedOption$.getValue() === true)) {
      const value = this.search.searchConfigService.paginatedSearchOptions.getValue();
        if (this.search && value != null) {
          this.changeSearchOption(this.searchprefix + this.searchkey.relationLeftType + ':' + this.item.id, value);
          this.appliedSelected$.next(true);
        }
    }
  }

  public onSearchSelected($event: Event) {
    this.changeSearchOption(this.searchprefix + this.searchkey.relationLeftType + ':' + this.item.id);
    this.appliedSelected$.next(true);
    $event.preventDefault();
  }

  public onSearchAll($event: Event) {
    this.changeSearchOption('*');
    this.appliedSelected$.next(false);
    $event.preventDefault();
  }

  protected changeSearchOption(q: string, startopt?: PaginatedSearchOptions) {
    let value = startopt || (this.search.searchOptions$.value);
    let opt =  new PaginatedSearchOptions({configuration:value.configuration, scope:value.scope, query:q, dsoTypes:value.dsoTypes, filters:value.filters, fixedFilter:value.fixedFilter, pagination:value.pagination, sort:value.sort, view:value.view, forcedEmbeddedKeys: value.forcedEmbeddedKeys});
    //this has to be set multiple times. perhaps there will be some easier way in the future.
    this.search.setSearchOptions(opt);
    this.search.changeConfiguration(this.configuration);
    this.search.searchConfigService.searchOptions.next(opt);
    this.search.searchConfigService.paginatedSearchOptions.next(opt);
    this.search.retrieveResults();
  }
}
