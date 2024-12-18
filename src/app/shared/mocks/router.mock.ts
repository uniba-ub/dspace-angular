import {of as observableOf} from 'rxjs';
import { UrlTree} from '@angular/router';

/**
 * Mock for [[RouterService]]
 */
export class RouterMock {
  public events = observableOf({});
  public routerState = {
    snapshot: {
      url: '',
      root: {
        queryParamMap: null
      }
    }
  };

  // noinspection TypeScriptUnresolvedFunction
  navigate = jasmine.createSpy('navigate');
  navigateByUrl = jasmine.createSpy('navigateByUrl');

  serializeUrl(url: UrlTree): string {
    return url ? url.toString() : '';
  }

  setRoute(route) {
    this.routerState.snapshot.url = route;
  }

  setParams(paramsMap) {
    this.routerState.snapshot.root.queryParamMap = paramsMap;
  }

  createUrlTree(commands, navExtras = {}) {
    return {};
  }

  get url() {
    return this.routerState.snapshot.url;
  }

  parseUrl(url: string): UrlTree {
    return null;
  }
}
