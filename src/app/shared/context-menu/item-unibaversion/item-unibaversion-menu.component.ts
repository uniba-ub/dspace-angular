import {Component, Inject, OnInit} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, of as observableOf} from 'rxjs';
import {DSpaceObjectType} from '../../../core/shared/dspace-object-type.model';
import {DSpaceObject} from '../../../core/shared/dspace-object.model';
import {ContextMenuEntryComponent} from '../context-menu-entry.component';
import {rendersContextMenuEntriesForType} from '../context-menu.decorator';
import {ContextMenuEntryType} from '../context-menu-entry-type';
import {AuthorizationDataService} from '../../../core/data/feature-authorization/authorization-data.service';
import {FeatureID} from '../../../core/data/feature-authorization/feature-id';
import {NotificationsService} from '../../notifications/notifications.service';
import {VersionUnibaItemService} from '../../../core/data/version-uniba-data.service';
import { getAllCompletedRemoteData } from '../../../core/shared/operators';
import {RemoteData} from '../../../core/data/remote-data';
import {switchMap} from 'rxjs/operators';
import {WorkspaceItem} from '../../../core/submission/models/workspaceitem.model';
import {NotificationType} from '../../notifications/models/notification-type';
import {hasValue} from '../../empty.util';


@Component({
  selector: 'ds-item-unibaversion-menu',
  templateUrl: './item-unibaversion-menu.component.html',
  styleUrls: ['./item-unibaversion-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
/**
 * Display a button triggerng the creation of a new WorkspaceItem with the copy of some metadatavalues.
 * Special modification for university of bamberg, thus unibaversion
 */
export class ItemVersionUnibaMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Whether the current user is authorized to subscribe the DSpaceObject
   */
  isAuthorized$: Observable<boolean> = observableOf(false);

  /**
   * DSpaceObject that is being viewed
   */
  dso: DSpaceObject;

  entitytype: string;

  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {AuthService} authService
   */
  constructor(
    @Inject('contextMenuObjectProvider') public injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    private notificationService: NotificationsService,
    private versionService: VersionUnibaItemService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ItemVersionUniba);
    this.dso = injectedContextMenuObject;
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.canCreateUnibaVersion, this.contextMenuObject.self);
    this.entitytype = this.dso.firstMetadataValue('dspace.entity.type') || '';
  }

  createVersionAction(): void {
    this.createVersion().subscribe();
  }

  createVersion(): Observable<any>{
    let messagePrefix = (hasValue(this.entitytype) && this.entitytype === 'Publication') ? '.Publication' : '';
    this.processing$.next(true);
    // disable button
    // Call service
    return this.versionService.createVersion(this.dso.id).pipe(getAllCompletedRemoteData()).pipe(
      switchMap((rd: RemoteData<WorkspaceItem>) => {
        if (rd.hasSucceeded) {
          let peyload = rd.payload;
          this.processing$.next(false);
          //this.notificationService.info('created version', peyload);
          this.notificationService.notificationWithAnchor(NotificationType.Info, {clickToClose : true, animate : true, timeOut : 10000}, '/workspaceitems/' + peyload.id + '/edit',
            'context-menu.actions.unibaversioning.notification.success.title',
            'context-menu.actions.unibaversioning.notification.success.content' + messagePrefix,
            'here');
          return new Observable<never>();
        } else {
          this.processing$.next(false);
          this.notificationService.error('context-menu.actions.unibaversioning.notification.error.title', 'context-menu.actions.unibaversioning.notification.error.content' + messagePrefix);
          return EMPTY;
        }
      }));
  }

}
