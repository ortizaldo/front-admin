import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  canActivateProtectedRoutes$: Observable<boolean> = combineLatest([this.isAuthenticated$, this.isDoneLoading$]).pipe(
    map((values) => values.every((b) => b))
  );

  constructor(private http: HttpClient, private router: Router) {
    window.addEventListener("storage", (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== "access_token" && event.key !== null) {
        return;
      }

      console.warn("Noticed changes to access_token (most likely from another tab), updating isAuthenticated");
      // this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

      // if (!this.oauthService.hasValidAccessToken()) {
      //   this.navigateToLoginPage();
      // }
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  // login(targetUrl?: string) {
  //   // Note: before version 9.1.0 of the library you needed to
  //   // call encodeURIComponent on the argument to the method.
  //   this.oauthService.initLoginFlow(targetUrl || this.router.url, {
  //     prompt: "login",
  //   });
  // }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  public get apiPrefixUrl() {
    // return `${environment.api}${environment.api_prefix}/api/${this.accountId}`;
    return `${environment.api}/`;
  }

  navigateToLoginPage() {
    // TODO: Remember current URL
    // this.router.navigateByUrl('/should-login');
    this.router.navigateByUrl(`/auth/login`);
  }
}