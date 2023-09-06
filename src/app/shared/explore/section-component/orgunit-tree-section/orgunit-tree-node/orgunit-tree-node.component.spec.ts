import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitTreeNodeComponent } from './orgunit-tree-node.component';

describe('OrgunitTreeNodeComponent', () => {
  let component: OrgunitTreeNodeComponent;
  let fixture: ComponentFixture<OrgunitTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgunitTreeNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
