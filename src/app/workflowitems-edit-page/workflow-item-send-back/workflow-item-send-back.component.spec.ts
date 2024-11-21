import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { RequestService } from '../../core/data/request.service';
import { RouteService } from '../../core/services/route.service';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { ModifyItemOverviewComponent } from '../../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { LocationStub } from '../../shared/testing/location.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../shared/testing/router.stub';
import { VarDirective } from '../../shared/utils/var.directive';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back.component';

describe('WorkflowItemSendBackComponent', () => {
  let component: WorkflowItemSendBackComponent;
  let fixture: ComponentFixture<WorkflowItemSendBackComponent>;
  let wfiService;
  let wfi;
  let itemRD$;
  let id;

  function init() {
    wfiService = jasmine.createSpyObj('workflowItemService', {
      sendBack: observableOf(true),
    });
    itemRD$ = createSuccessfulRemoteDataObject$(itemRD$);
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    id = 'de11b5e5-064a-4e98-a7ac-a1a6a65ddf80';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), WorkflowItemSendBackComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, { wfi: createSuccessfulRemoteDataObject(wfi) }) },
        { provide: Router, useClass: RouterStub },
        { provide: RouteService, useValue: {} },
        { provide: Location, useValue: new LocationStub() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: WorkflowItemDataService, useValue: wfiService },
        { provide: RequestService, useValue: getMockRequestService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(WorkflowItemSendBackComponent, { remove: { imports: [ModifyItemOverviewComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemSendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendBack on the workflow-item service when sendRequest is called', () => {
    component.sendRequest(id);
    expect(wfiService.sendBack).toHaveBeenCalledWith(id);
  });
});
