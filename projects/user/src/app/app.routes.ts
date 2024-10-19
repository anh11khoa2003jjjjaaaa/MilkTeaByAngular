import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartsComponent } from './components/carts/carts.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CategoryUserComponent } from './components/category-user/category-user.component';
import { SearchComponent } from './components/search/search.component';
 // Ensure the correct path to the component

export const routes: Routes = [
  { path: 'home', component: HomeComponent },      
  { path: 'about', component: AboutComponent },
  { path: 'loginUser', component: LoginUserComponent },  
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartsComponent },
  { path: 'order-confirm/:userID', component: OrderConfirmationComponent },
  { path: 'DisplayListProductCategory_CategoryID/:categoryID', component: CategoryUserComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'search', component: SearchComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }    

];
