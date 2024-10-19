import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../../../../admin/src/app/models/account .model';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // API URL

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}
  private loggedIn = new BehaviorSubject<boolean>(false);
  // Login method
  login(userName: string, passWord: string): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/login`, { userName, passWord }).pipe(
      tap((account: Account) => {
        console.log('Token received:', account.token);
        this.setToken(account.token);
        this.loggedIn.next(true);  // Save token to local storage
      })
    );
  }

  // Save token to local storage
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
      console.log('Token saved to localStorage:', token);
    }
  }

  // Get token from local storage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      console.log('Token retrieved from localStorage:', token);
      return token;
    }
    return null;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null; 
  }

  isLoggedInNew(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  // Logout method
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken'); 
      console.log('Token removed from localStorage');
    }
  }

  // Parse the JWT token to extract user details
  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  // Get the userID from the token
  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const parsedToken = this.parseJwt(token);
    return parsedToken ? parsedToken.userID : null;
  }

  // Get the username from the token
  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const parsedToken = this.parseJwt(token);
    return parsedToken ? parsedToken.sub : null;
  }
}
