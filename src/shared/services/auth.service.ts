import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth0Client$ = (from(
    createAuth0Client({
      domain: "iamauth.eu.auth0.com",
      client_id: "erSlmBVmd1lqzFXZibiEgQAaGL2xxPpF",
      redirect_uri: 'http://localhost:4200/profile'
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(res => this.loggedIn = res)
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject$.asObservable();
  public loggedIn: boolean = null;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) {
    this.localAuthSetup();
    this.handleAuthCallback();
  }

  getUser$(options?): Observable<any> {
    this.commonService.changeLoaderVisibility(true);
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap((user) =>  {
        this.userProfileSubject$.next(user);
        this.commonService.changeLoaderVisibility(false);
      })
    );
  }

  private localAuthSetup() {
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          return this.getUser$();
        }
        return of(loggedIn);
      })
    );
    return checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.loginWithRedirect({
        redirect_uri: 'http://localhost:4200/profile',
        appState: { target: redirectPath }
      });
    });
  }

  private handleAuthCallback() {

    console.log('sss')

    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      this.commonService.changeLoaderVisibility(true);
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap(cbRes => {
          // Get and set target redirect route from callback results
          targetRoute ='';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        console.log(user, loggedIn)
        this.commonService.changeLoaderVisibility(false);
        this.router.navigate(['/profile']);
      });
    }
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: "erSlmBVmd1lqzFXZibiEgQAaGL2xxPpF",
        returnTo: 'http://localhost:4200/'
      });
    });
  }

}
