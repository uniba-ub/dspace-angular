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
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
  } from '../../../core/shared/operators';
import {RemoteData} from '../../../core/data/remote-data';
import {map, switchMap} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/shared/item.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { AlertType } from '../../alert/alert-type';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { hasNoValue } from '../../empty.util';

@Component({
  selector: 'ds-item-unibaversion-change-menu',
  templateUrl: './item-unibaversion-change-menu.component.html',
  styleUrls: ['./item-unibaversion-change-menu.component.scss']
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
/**
 * Display a button triggerng the creation of a new WorkspaceItem with the copy of some metadatavalues.
 * Special modification for university of bamberg, thus unibaversion
 */
export class ItemVersionChangeMainUnibaMenuComponent extends ContextMenuEntryComponent implements OnInit {
  /**
   * Whether the current user is authorized to subscribe the DSpaceObject
   */
  isAuthorized$: Observable<boolean> = observableOf(false);

  /**
   * DSpaceObject that is being viewed
   */
  dso: DSpaceObject;

  dsoitem: Item;

  public processing$ = new BehaviorSubject<boolean>(false);

  public loadingData$ = new BehaviorSubject<boolean>(false);

  public loadingError$ = new BehaviorSubject<boolean>(false);

  public selfreference = false;

  public AlertTypeEnum = AlertType;

  public currentMainVersion: String;

  public versiongroupitems$ = new Observable<Item[]>(null);

  public errors$ = new Observable<String[]>(null);

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;

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
    private versionService: VersionUnibaItemService,
    private modalService: NgbModal,
    protected itemService: ItemDataService,
    protected translationService: TranslateService
  ) {
    super (injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ItemVersionUniba);
    this.dso = injectedContextMenuObject;
  }

  ngOnInit() {
    this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.canChangeMainUnibaVersion, this.contextMenuObject.self);
    this.dsoitem = this.dso as Item;
    this.processing$.next(false);
  }

  versionofMetadata(): string {
    return 'dc.relation.isversionof';
  }
  hasVersionMetadata(): string {
    return 'dc.relation.hasversion';
  }

  openVersionModal(content): void {
    this.loadingData$.next(true);
    this.loadingError$.next(true);
    this.versiongroupitems$ = this.getVersionGroupItems(this.dsoitem.uuid).pipe();
    this.errors$ = this.getVersionGroupErrorItems(this.dsoitem.uuid).pipe();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
        //
      }, (reason) => {
        //
      });
  }

  onSubmit(form: FormGroup): void {
    this.processing$.next(true);
    const newvalue = form.value.setMainFamilyVersion;
    if (hasNoValue(newvalue)) {
      this.notificationService.error(this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.invalid.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.invalid.content'));
      this.processing$.next(false);
    }
      this.createVersion(newvalue).subscribe();
  }

  public getVersionGroupItems(uuid: string): Observable<Item[]> {
    return this.versionService.getVersionGroupIgnoreCheck(uuid).pipe().pipe(getAllCompletedRemoteData(),
      map((rd: RemoteData<any>) => {
        //something went wrong here with the paginated list. no page key, but content key?
        this.loadingData$.next(false);
        if (rd.hasSucceeded) {
          let err = [];
          let val = rd.payload.content as Item[];
          val.forEach(value => err.push(Object.assign(new Item(), value)));
          return err;
        } else {
          return null;
        }
      }));
  }

  public getVersionGroupErrorItems(uuid: string): Observable<String[]> {
    return this.versionService.getVersionGroupErrors(uuid).pipe(getAllCompletedRemoteData()).pipe(
      map((rd: RemoteData<String[]>) => {
        this.loadingError$.next(false);
        if (rd.hasSucceeded) {
          let peyload = rd.payload;
          let err = [];
          Object.keys(peyload).map(function(index){
            err.push(peyload[index]);
          });
          return err;
        } else {
          return null;
        }
      }));
  }

  public createVersion(newvalue: string): Observable<any> {
    return this.versionService.changeVersion(newvalue).pipe(getFirstCompletedRemoteData()).pipe(
      switchMap((rd: RemoteData<Item>) => {
        //invalid structure, cannot apply action
        if (rd.statusCode === 409) {
          this.processing$.next(false);
          this.notificationService.error(this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.conflict.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.conflict.content'));
          return EMPTY;
          //item not found
        } else if (rd.statusCode === 404) {
          this.processing$.next(false);
          this.notificationService.error(this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.notfound.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.notfound.content'));
          return EMPTY;
          //forbidden
        } else if (rd.statusCode === 403) {
          this.processing$.next(false);
          this.notificationService.error(this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.forbidden.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.forbidden.content'));
          return EMPTY;
          //successful
        } else if (rd.hasSucceeded) {
          this.notificationService.info(this.translationService.get('context-menu.actions.unibaversioningchange.notification.success.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.success.content'), {
            clickToClose: true,
            animate: true,
            timeOut: 10000
          });
          this.processing$.next(false);
          return new Observable<never>();
        } else {
          this.processing$.next(false);
          this.notificationService.error(this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.title'), this.translationService.get('context-menu.actions.unibaversioningchange.notification.error.content'));
          return EMPTY;
        }
      }));
  }

  public close(): void {
    //this.modal.close();
    this.modalService.dismissAll();
  }

  checkSelfreference(ref: Item): boolean {
    return (ref.allMetadata([this.versionofMetadata(), this.hasVersionMetadata()]).filter(value => value.authority === ref.uuid).length > 0);
  }

}
