import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { FooterUserComponent } from './components/footer-user/footer-user.component';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-milk',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,          // Import FormsModule cho các form
    HttpClientModule,      // Import HttpClientModule để dùng cho HTTP requests
    HeaderUserComponent,
    FooterUserComponent,
    HomeComponent          // Import HomeComponent để có thể sử dụng nó trong template
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'User';

 
  
}
