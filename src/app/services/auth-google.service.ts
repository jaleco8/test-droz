import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  apiUrl = environment.apiUrl;

  constructor(
    private oauthService: OAuthService,
    private httpClient: HttpClient
  ) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.clientGoogle,
      redirectUri: window.location.origin + '/dashboard',
      scope: 'openid profile email',
    };

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }

  getToken() {
    return this.oauthService.getIdToken();
  }

  authUser(): Observable<any> {
    const tokenId = this.getToken();
    return this.httpClient.post<any>(`${this.apiUrl}/loginGoogle`, { token: tokenId });
  }
}
