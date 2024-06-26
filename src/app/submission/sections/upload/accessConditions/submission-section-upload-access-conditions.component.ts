import { Component, Input, OnInit } from '@angular/core';

import { find } from 'rxjs/operators';

import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { ResourcePolicy } from '../../../../core/resource-policy/models/resource-policy.model';
import { hasValue, isEmpty } from '../../../../shared/empty.util';
import { Group } from '../../../../core/eperson/models/group.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';

/**
 * This component represents a badge that describe an access condition
 */
@Component({
  selector: 'ds-submission-section-upload-access-conditions',
  templateUrl: './submission-section-upload-access-conditions.component.html',
})
export class SubmissionSectionUploadAccessConditionsComponent implements OnInit {

  /**
   * The list of resource policy
   * @type {Array}
   */
  @Input() accessConditions: ResourcePolicy[];

  /**
   * The list of access conditions
   * @type {Array}
   */
  public accessConditionsList: ResourcePolicy[] = [];

  constructor(
    public dsoNameService: DSONameService,
    protected groupService: GroupDataService,
  ) {
  }

  /**
   * Retrieve access conditions list
   */
  ngOnInit() {
    this.accessConditions.forEach((accessCondition: ResourcePolicy) => {
      if (isEmpty(accessCondition.name) && hasValue(accessCondition._links?.group.href)) {
        this.groupService.findByHref(accessCondition._links.group.href).pipe(
          find((rd: RemoteData<Group>) => !rd.isResponsePending && rd.hasSucceeded))
          .subscribe((rd: RemoteData<Group>) => {
            const group: Group = rd.payload;
            const accessConditionEntry = Object.assign({}, accessCondition);
            accessConditionEntry.name = this.dsoNameService.getName(group);
            this.accessConditionsList.push(accessConditionEntry);
          });
      } else {
        this.accessConditionsList.push(accessCondition);
      }
    });
  }
}
