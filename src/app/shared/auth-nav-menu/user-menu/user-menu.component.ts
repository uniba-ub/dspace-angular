import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { EPerson } from '../../../core/eperson/models/eperson.model';
import { AppState } from '../../../app.reducer';
import { isAuthenticationLoading } from '../../../core/auth/selectors';
import { MYDSPACE_ROUTE } from '../../../my-dspace-page/my-dspace-page.component';
import { AuthService } from '../../../core/auth/auth.service';
import { getProfileModuleRoute, getSubscriptionsModuleRoute } from '../../../app-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { getProcessListRoute } from '../../../process-page/process-page-routing.paths';

/**
 * This component represents the user nav menu.
 */
@Component({
  selector: 'ds-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  /**
   * The input flag to show user details in navbar expandable menu
   */
  @Input() inExpandableNavbar = false;

  /**
   * True if the authentication is loading.
   * @type {Observable<boolean>}
   */
  public loading$: Observable<boolean>;

  /**
   * The authenticated user.
   * @type {Observable<EPerson>}
   */
  public user$: Observable<EPerson>;

  /**
   * The mydspace page route.
   * @type {string}
   */
  public mydspaceRoute = MYDSPACE_ROUTE;

  /**
   * The profile page route
   */
  public profileRoute = getProfileModuleRoute();

  /**
   * The processes page route
   */
  public processesRoute = getProcessListRoute();

  /**
   * The profile page route
   */
  public subscriptionsRoute = getSubscriptionsModuleRoute();

  constructor(
    protected store: Store<AppState>,
    protected authService: AuthService,
    public dsoNameService: DSONameService,
  ) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {

    // set loading
    this.loading$ = this.store.pipe(select(isAuthenticationLoading));

    // set user
    this.user$ = this.authService.getAuthenticatedUserFromStore();

  }
}
