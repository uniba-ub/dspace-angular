import { FullFileSectionComponent } from './full-file-section.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { FileSizePipe } from '../../../../shared/utils/file-size-pipe';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { of as observableOf } from 'rxjs';
import { MockBitstreamFormat1 } from '../../../../shared/mocks/item.mock';
import { By } from '@angular/platform-browser';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../../shared/testing/notifications-service.stub';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../../../shared/testing/pagination-service.stub';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

describe('FullFileSectionComponent', () => {
  let comp: FullFileSectionComponent;
  let fixture: ComponentFixture<FullFileSectionComponent>;

  const mockBitstream: Bitstream = Object.assign(new Bitstream(),
    {
      sizeBytes: 10201,
      content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
      format: observableOf(MockBitstreamFormat1),
      bundleName: 'ORIGINAL',
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713'
        },
        content: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content'
        }
      },
      id: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
      uuid: 'cf9b0c8e-a1eb-4b65-afd0-567366448713',
      type: 'bitstream',
      metadata: {
        'dc.title': [
          {
            language: null,
            value: 'test_word.docx'
          }
        ]
      }
    });

  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    showableByItem: createSuccessfulRemoteDataObject$(createPaginatedList([mockBitstream, mockBitstream, mockBitstream])),
  });

  const authorizedDataService = jasmine.createSpyObj('authorizedDataService',{
    isAuthorized: observableOf(false),
  });

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [FullFileSectionComponent, VarDirective, FileSizePipe, MetadataFieldWrapperComponent],
      providers: [
        { provide: BitstreamDataService, useValue: bitstreamDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: PaginationService, useValue: paginationService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: AuthorizationDataService, useValue: authorizedDataService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FullFileSectionComponent);
    comp = fixture.componentInstance;
    comp.item = new Item();
    fixture.detectChanges();
  }));

  describe('when the full file section gets loaded with bitstreams available', () => {
    it('should contain a list with bitstreams', () => {
      const fileSection = fixture.debugElement.queryAll(By.css('.file-section'));
      expect(fileSection.length).toEqual(6);
    });

    it('and the title should be wrapped', () => {
      const fileNameElement = fixture.debugElement.query(By.css('[data-test="file-name"]')).nativeElement;
      expect(fileNameElement.classList).toContain('text-break');
    });

    it('canDownload should return an observable with false value, if user is not authorized to download bitstream', waitForAsync(() => {
      authorizedDataService.isAuthorized.and.returnValue(observableOf(false));
      comp.canDownload(mockBitstream).subscribe(canDownload => expect(canDownload).toBeFalse());
    }));

    it('canDownload should return an observable with true value, if user is authorized to download bitstream', waitForAsync(() => {
      authorizedDataService.isAuthorized.and.returnValue(observableOf(true));
      comp.canDownload(mockBitstream).subscribe(canDownload => expect(canDownload).toBeTrue());
    }));
  });
});
