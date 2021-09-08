import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { find, take } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { MYDSPACE_ROUTE } from '../../../../+my-dspace-page/my-dspace-page.component';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders pool task object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-pool-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './pool-my-dspace-result-list-element.component.html',
})

@renderElementsFor(PoolTaskMyDSpaceResult, SetViewMode.List)
@renderElementsFor(PoolTask, SetViewMode.List)
export class PoolMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<PoolTaskMyDSpaceResult, PoolTask> implements OnInit {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WAITING_CONTROLLER;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem: WorkflowItem;

  public viewMode: ViewMode = ViewMode.List;

  constructor(@Inject('objectElementProvider') public listable: ListableObject,
              @Inject('indexElementProvider') public index: number,
              private route: ActivatedRoute,
              private router: Router) {
    super(listable, index);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.initWorkflowItem(this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>);
  }

  /**
   * Retrieve workflowitem from result object
   */
  initWorkflowItem(wfi$: Observable<RemoteData<WorkflowItem>>) {
    this.subs.push(
      wfi$.pipe(
        find((rd: RemoteData<WorkflowItem>) => (rd.hasSucceeded && isNotUndefined(rd.payload)))
      ).subscribe((rd: RemoteData<WorkflowItem>) => {
        this.workflowitem = rd.payload;
      })
    );
  }

  view() {
    this.subs.push(
      this.route.queryParams.pipe(
        take(1))
        .subscribe((params) => {
          const pageSize = 1;
          const queryPageSize = params.pageSize || 1;
          const queryPage = params.page || 1;
          const page = ((queryPage - 1) * queryPageSize) + (this.dsoIndex + 1);

          const navigationExtras: NavigationExtras = {
            queryParams: {
              view: ViewMode.Detail,
              page,
              pageSize
            },
            queryParamsHandling: 'merge'
          };
          this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
        })
      );
  }

}