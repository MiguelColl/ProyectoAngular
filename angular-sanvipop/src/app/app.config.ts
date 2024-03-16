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
  ],
};
