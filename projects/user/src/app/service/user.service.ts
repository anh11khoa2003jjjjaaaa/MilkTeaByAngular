import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,private authService:AuthService) {}

  searchUser(displayName: string): Observable<any> {

    const token = this.authService.getToken(); // Lấy token
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const apiurl=`http://localhost:8080/public/user/convertUserIDtodisplayName?displayName=${displayName}`
    return this.http.get<any[]>(apiurl,{headers});
  }
// user.service.ts
searchUserID(userID: string): Observable<any> {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const apiUrl = `http://localhost:8080/public/user/getusser/${userID}`;

    return this.http.get<{ displayName: string }>(apiUrl, { headers }).pipe(
      map(response => {
        const displayName = response.displayName;
        // Lưu displayName vào localStorage
        localStorage.setItem('displayName', displayName);
        console.log("Tên được lưu tạm: ",localStorage.setItem('displayName', displayName));
        return displayName;
      })
    );
  }

  
  
}
