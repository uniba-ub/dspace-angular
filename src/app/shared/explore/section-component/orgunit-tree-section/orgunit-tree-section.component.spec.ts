import { SearchService } from '../../../../core/shared/search/search.service';
import { waitForAsync } from '@angular/core/testing';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunittreeSectionComponent } from './orgunit-tree-section.component';
import { NativeWindowService } from '../../../../core/services/window.service';
// import { NativeWindowMockFactory } from 'src/app/shared/mocks/mock-native-window-ref';
import { NativeWindowMockFactory } from '../../../mocks/mock-native-window-ref';

xdescribe('OrgunittreeSectionComponent', () => {
  let component: OrgunittreeSectionComponent;
  let fixture: ComponentFixture<OrgunittreeSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgunittreeSectionComponent ],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: NativeWindowService, useFactory: NativeWindowMockFactory },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunittreeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
