import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { Context } from '../../../../core/shared/context.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { followLink } from '../../../utils/follow-link-config.model';

/**
 * This component renders workspaceitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-other-workspace-item-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss', './other-workspace-item-search-result-list-element.component.scss'],
  templateUrl: './other-workspace-item-search-result-list-element.component.html',
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement, Context.OtherWorkspace)
export class OtherWorkspaceItemSearchResultListElementComponent extends SearchResultListElementComponent<WorkspaceItemSearchResult, WorkspaceItem> {

  contextType = Context;

  /**
   * The item object that belonging to the result object
   */
  item$: Observable<Item>;

  /**
   * Represent item's status
   */
  status = MyDspaceItemStatusType.WORKSPACE;

  constructor(
    protected truncatableService: TruncatableService,
    protected linkService: LinkService
  ) {
    super(truncatableService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('item'), followLink('submitter'));
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    this.item$ = item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload)),
      map((rd: RemoteData<Item>) => rd.payload)
    );
  }
}
