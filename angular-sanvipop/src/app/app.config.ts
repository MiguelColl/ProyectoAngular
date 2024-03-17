import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideBingmapsKey } from './bingmaps/bingmaps.config';
import { provideGoogleId } from './auth/google-login/google-login.config';
import { provideFacebookId } from './auth/facebook-login/facebook-login.config';
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideBingmapsKey(
      'AkNzLhYRWHdv2quBGyOrYORRt-WbpGZTN3lGc0osvU7e3rWMgpcSSYZh3vQFKYLb'
    ),
    provideGoogleId(
      '1066792929235-fm57ku5qv4ncifl4fkvtdsb1j6jvmmsq.apps.googleusercontent.com'
    ),
    provideFacebookId('716921097155288', 'v19.0'),
    provideNgxStripe(
      'pk_test_51OvJsD2MiEg3n1LuqQkpkEvXFGkfaz2MhSeB0jBkSCCmt8mvWMY0HqVv02AQnyXQuGfM63cmLBmXuVXc8plGi7jE00zZwpfLhY'
    ),
  ],
};
