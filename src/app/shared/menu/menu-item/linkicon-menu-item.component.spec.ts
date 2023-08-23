import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LinkIconMenuItemComponent } from './linkicon-menu-item.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../testing/router.stub';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive.stub';

describe('LinkIconMenuItemComponent', () => {
  let component: LinkIconMenuItemComponent;
  let fixture: ComponentFixture<LinkIconMenuItemComponent>;
  let debugElement: DebugElement;
  let text;
  let link;
  let icon;

  describe('with icon and external link', () => {

    function init() {
      text = 'HELLO';
      link = 'https://google.com/';
      icon = 'fa fa-user';
    }

    beforeEach(waitForAsync(() => {
      init();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [LinkIconMenuItemComponent],
        providers: [
          {provide: 'itemModelProvider', useValue: {text: text, link: link, icon: icon}},
          {provide: Router, useValue: RouterStub},
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LinkIconMenuItemComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain the correct text', () => {
      const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
      expect(textContent).toEqual(text);
    });

    it('should have the right href attribute', () => {
      const links = fixture.debugElement.queryAll(By.css('a'));
      expect(links.length).toBe(1);
      expect(links[0].nativeElement.href).toBe(link);
    });

    it('should set the right icon', () => {
      const menuicon = fixture.debugElement.query(By.css('.exploreicon')).query(By.css('span'));
      expect(menuicon.nativeElement.getAttribute('class')).toContain(icon);
    });
  });

  describe('with external link and no icon', () => {
    function init() {
      text = 'HELLO';
      link = 'https://google.com/';
      icon = undefined;
    }

    beforeEach(waitForAsync(() => {
      init();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [LinkIconMenuItemComponent],
        providers: [
          { provide: 'itemModelProvider', useValue: { text: text, link: link, icon: icon } },
          { provide: Router, useValue: RouterStub },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LinkIconMenuItemComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain the correct text', () => {
      const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
      expect(textContent).toEqual(text);
    });

    it('should have the right href attribute', () => {
      const links = fixture.debugElement.queryAll(By.css('a'));
      expect(links.length).toBe(1);
      expect(links[0].nativeElement.href).toBe(link);
    });

    it('should set no icon', () => {
      expect(fixture.debugElement.query(By.css('.exploreicon'))).toBeNull();
    });
  });

  describe('with internal route and icon', () => {
    function init() {
      text = 'HELLO';
      link = '/researcherprofiles';
      icon = 'fa fa-user';
    }

    beforeEach(waitForAsync(() => {
      init();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [LinkIconMenuItemComponent, RouterLinkDirectiveStub],
        providers: [
          { provide: 'itemModelProvider', useValue: { text: text, link: link, icon: icon } },
          { provide: Router, useValue: RouterStub },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LinkIconMenuItemComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain the correct text', () => {
      const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
      expect(textContent).toEqual(text);
    });

    it('should have the right routerLink attribute', () => {
      const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
      const routerLinkQuery = linkDes.map((de) => de.injector.get(RouterLinkDirectiveStub));

      expect(routerLinkQuery.length).toBe(1);
      expect(routerLinkQuery[0].routerLink).toContain(link);
    });

    it('should set the right icon', () => {
      const menuicon = fixture.debugElement.query(By.css('.exploreicon')).query(By.css('span'));
      expect(menuicon.nativeElement.getAttribute('class')).toContain(icon);
    });

  });

  describe('with internal route and no icon', () => {

    function init() {
      text = 'HELLO';
      link = '/researcherprofiles';
      icon = undefined;
    }

    beforeEach(waitForAsync(() => {
      init();
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [LinkIconMenuItemComponent, RouterLinkDirectiveStub],
        providers: [
          { provide: 'itemModelProvider', useValue: { text: text, link: link, icon: icon } },
          { provide: Router, useValue: RouterStub },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LinkIconMenuItemComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should contain the correct text', () => {
      const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
      expect(textContent).toEqual(text);
    });

    it('should have the right routerLink attribute', () => {
      const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
      const routerLinkQuery = linkDes.map((de) => de.injector.get(RouterLinkDirectiveStub));
      expect(routerLinkQuery.length).toBe(1);
      expect(routerLinkQuery[0].routerLink).toContain(link);
    });

    it('should set no icon', () => {
      expect(fixture.debugElement.query(By.css('.exploreicon'))).toBeNull();
    });
  });
});
