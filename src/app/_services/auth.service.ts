import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, catchError, combineLatest, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';

const API_URL = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl = '';

  constructor(private http: HttpClient, private tokenService: TokenStorageService) {
    // no const
  }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private static log(message: string): any {
    console.log(message);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      environment.api + '/login',
      {
        email: username,
        password,
      },
      httpOptions
    );
  }

  // TO-DO agregar metodo para eliminar tokens desde el backend
  // removeTokens(): Observable<any> {
  //   return this.http.post(
  //     environment.api + 'login',
  //     {
  //       email: username,
  //       password,
  //     },
  //     httpOptions
  //   );
  // }

  // refreshToken(refreshData: any): Observable<any> {
  //   this.tokenService.removeToken();
  //   this.tokenService.removeRefreshToken();
  //   const body = new HttpParams()
  //     .set('refresh_token', refreshData.refresh_token)
  //     .set('grant_type', 'refresh_token');
  //   return this.http.post<any>(API_URL + 'oauth/token', body, HTTP_OPTIONS)
  //     .pipe(
  //       tap(res => {
  //         this.tokenService.saveToken(res.access_token);
  //         this.tokenService.saveRefreshToken(res.refresh_token);
  //       }),
  //       catchError(AuthService.handleError)
  //     );
  // }

  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }

  register(data: any): Observable<any> {
    return this.http.post(
      environment.api + '/users/new',
      data,
      httpOptions
    );
  }

  secured(): Observable<any> {
    return this.http.get<any>(API_URL + 'secret')
      .pipe(catchError(AuthService.handleError));
  }
}