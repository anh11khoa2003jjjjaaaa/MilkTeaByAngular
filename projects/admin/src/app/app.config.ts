import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),// gôm các sự kiện lại và xử lý 1 lần
     provideRouter(routes),
     MessageService,
     BrowserAnimationsModule,
     
     ToastModule ,
 
     provideAnimations(),// cung cấp bộ định tuyến--tuyến đường (Quan trọng)
      // provideClientHydration(),// dùng để render nội dung về phía client mà không cần tải lại toàn bộ trang( khá quan trọng)
      provideHttpClient(withFetch()),// cung cấp HTTP(Quan trọng)
      //provideAnimations(),// (dùng hiểu ứng hoạt hình)
      //provideForms()// (sử dụng khi dùng các loại form trong Angular)
    ]
};