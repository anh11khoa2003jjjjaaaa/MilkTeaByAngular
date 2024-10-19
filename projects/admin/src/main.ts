import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { provideHttpClient } from '@angular/common/http';

import { appConfig } from './app/app.config'; // Import cấu hình

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
// bootstrapApplication(AppComponent, {
//  providers:[
//   provideRouter(routes),
//   // provideClientHydration(), nguyên nhân dẫn đến load lại trang (Single Pages)
//   provideHttpClient(),
//  ]
// })
//   .catch((err) => console.error(err));