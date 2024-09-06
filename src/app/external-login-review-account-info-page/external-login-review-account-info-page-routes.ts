import { Route } from '@angular/router';

import { RegistrationDataResolver } from '../external-log-in/resolvers/registration-data.resolver';
import { reviewAccountGuard } from './helpers/review-account.guard';
import { ThemedExternalLoginReviewAccountInfoPageComponent } from './themed-external-login-review-account-info-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginReviewAccountInfoPageComponent,
    canActivate: [reviewAccountGuard],
    resolve: { registrationData: RegistrationDataResolver },
  },
];
