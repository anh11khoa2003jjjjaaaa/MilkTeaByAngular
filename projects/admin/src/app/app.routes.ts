import { Routes } from '@angular/router';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { IngredientManagementComponent } from './ingredient-management/ingredient-management.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard'; // If you have a guard
import { AboutComponent } from '../../../user/src/app/components/about/about.component';
import { OrderDetailManagementComponent } from './order-detail-management/order-detail-management.component';
import { PromotionManagementComponent } from './promotion-management/promotion-management.component';
import { PromotionDetailComponent } from './promotion-detail-management/promotion-detail-management.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // { path: 'logout', component: LogoutComponent },
    { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
    { path: 'categories', component: CategoryManagementComponent,canActivate: [AuthGuard] },
    { path: 'products', component: ProductListComponent,canActivate: [AuthGuard] },
    { path: 'employees', component: EmployeeManagementComponent,canActivate: [AuthGuard] },
    { path: 'ingresdients', component: IngredientManagementComponent,canActivate: [AuthGuard] },
    { path: 'order-detail', component: OrderDetailManagementComponent,canActivate: [AuthGuard] },
    // { path: 'promotion', component: PromotionManagementComponent,canActivate: [AuthGuard] },
    // { path: 'promotion-detail', component: PromotionDetailComponent,canActivate: [AuthGuard] },
   
    { path: '', redirectTo: '/home', pathMatch: 'full' }// cấu hình đường dẫn trang hiện mặc định đầu tiên khi chạy dự án

   
];
