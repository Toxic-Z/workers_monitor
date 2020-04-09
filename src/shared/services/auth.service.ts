import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError, Subscription } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth0Client$ = (from(
    createAuth0Client({
      domain: 'iamauth.eu.auth0.com',
      client_id: 'erSlmBVmd1lqzFXZibiEgQAaGL2xxPpF',
      redirect_uri: 'http://localhost:4200/profile',
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

  getTokenSilently$(options?): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getTokenSilently(options)))
    );
  }

  getUser$(options?): Observable<User> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap((user) =>  {
        this.userProfileSubject$.next(user);
        this.commonService.changeLoaderVisibility(false);
      })
    );
  }

  private localAuthSetup(): Subscription {
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

  login(redirectPath: string = '/'): void {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.loginWithRedirect({
        redirect_uri: 'http://localhost:4200/profile',
        appState: { target: redirectPath }
      });
    });
  }

  private handleAuthCallback(): void {
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      this.commonService.changeLoaderVisibility(true);
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        tap(cbRes => {
          targetRoute = '';
        }),
        concatMap(() => {
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      authComplete$.subscribe(([user, loggedIn]) => {
        this.commonService.changeLoaderVisibility(false);
        this.router.navigate(['/profile']);
      });
    }
  }

  logout(): void {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.logout({
        client_id: 'erSlmBVmd1lqzFXZibiEgQAaGL2xxPpF',
        returnTo: 'http://localhost:4200/'
      });
    });
  }

}
