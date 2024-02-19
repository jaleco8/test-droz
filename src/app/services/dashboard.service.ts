import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getUsers(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }

    return this.httpClient.get<any>(`${this.apiUrl}/users`, httpOptions);
  }

  getVentas(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }
    return this.httpClient.get<any>(`${this.apiUrl}/ventas`, httpOptions);
  }
}
