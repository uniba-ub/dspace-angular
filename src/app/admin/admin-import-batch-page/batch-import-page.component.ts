import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BATCH_IMPORT_SCRIPT_NAME, ScriptDataService } from '../../core/data/processes/script-data.service';
import { Router } from '@angular/router';
import { ProcessParameter } from '../../process-page/processes/process-parameter.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../../process-page/processes/process.model';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import {
  ImportBatchSelectorComponent
} from '../../shared/dso-selector/modal-wrappers/import-batch-selector/import-batch-selector.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { SwitchColor, SwitchOption } from '../../shared/switch/switch.component';

@Component({
  selector: 'ds-batch-import-page',
  templateUrl: './batch-import-page.component.html'
})
export class BatchImportPageComponent {
  /**
   * The current value of the file
   */
  fileObject: File;

  /**
   * The validate only flag
   */
  validateOnly = true;

  /**
   * dso object for community or collection
   */
  dso: DSpaceObject = null;

  /**
   * The flag between upload and url
   */
  isUpload = true;

  /**
   * File URL when flag is for url
   */
  fileURL: string;

  /**
   * The custom options for the 'ds-switch' component
   */
  switchOptions: SwitchOption[] = [
    { value: 'upload', icon: 'fa fa-upload', label: 'admin.metadata-import.page.toggle.upload', iconColor: SwitchColor.Primary },
    { value: 'url', icon: 'fa fa-link', label: 'admin.metadata-import.page.toggle.url', iconColor: SwitchColor.Primary },
  ];

  public constructor(private location: Location,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     private scriptDataService: ScriptDataService,
                     private router: Router,
                     private modalService: NgbModal,
                     private dsoNameService: DSONameService) {
  }

  /**
   * Set file
   * @param file
   */
  setFile(file) {
    this.fileObject = file;
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    this.location.back();
  }

  public selectCollection() {
    const modalRef = this.modalService.open(ImportBatchSelectorComponent);
    modalRef.componentInstance.response.pipe(take(1)).subscribe((dso) => {
      this.dso = dso || null;
    });
  }

  /**
   * Starts import-metadata script with --zip fileName (and the selected file)
   */
  public importMetadata() {
    if (this.fileObject == null && isEmpty(this.fileURL)) {
      if (this.isUpload) {
        this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFile'));
      } else {
        this.notificationsService.error(this.translate.get('admin.metadata-import.page.error.addFileUrl'));
      }
    } else {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '--add' })
      ];
      if (this.isUpload) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--zip', value: this.fileObject.name }));
      } else {
        this.fileObject = null;
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--url', value: this.fileURL }));
      }
      if (this.dso) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '--collection', value: this.dso.uuid }));
      }
      if (this.validateOnly) {
        parameterValues.push(Object.assign(new ProcessParameter(), { name: '-v', value: true }));
      }

      this.scriptDataService.invoke(BATCH_IMPORT_SCRIPT_NAME, parameterValues, [this.fileObject]).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((rd: RemoteData<Process>) => {
        if (rd.hasSucceeded) {
          const title = this.translate.get('process.new.notification.success.title');
          const content = this.translate.get('process.new.notification.success.content');
          this.notificationsService.success(title, content);
          if (isNotEmpty(rd.payload)) {
            this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
          }
        } else {
          if (rd.statusCode === 413) {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.max-upload.content');
            this.notificationsService.error(title, content);
          } else {
            const title = this.translate.get('process.new.notification.error.title');
            const content = this.translate.get('process.new.notification.error.content');
            this.notificationsService.error(title, content);
          }
        }
      });
    }
  }

  /**
   * return selected dspace object name
  */
  getDspaceObjectName(): string {
    if (this.dso) {
      return this.dsoNameService.getName(this.dso);
    }
    return null;
  }

  /**
   * remove selected dso object
   */
  removeDspaceObject(): void {
    this.dso = null;
  }

  /**
   * toggle the flag between upload and url
   */
  toggleUpload() {
    this.isUpload = !this.isUpload;
  }

}
