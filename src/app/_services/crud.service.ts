import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient) { }

  get(endpoint: string, id: string = ""): Observable<any> {
    const url = id ? `${environment.api}/${endpoint}/${id}` : `${environment.api}/${endpoint}`;
    return this.http.get(url, { responseType: 'json' });
  }

  post(body: any = {}): Observable<any> {
    return this.http.post(environment.api + '/all', { responseType: 'json' });
  }

  put(body: any = {}, id: string = ""): Observable<any> {
    return this.http.put(environment.api + '/all', { responseType: 'json' });
  }

  delete(id: string = ""): Observable<any> {
    return this.http.delete(environment.api + '/all', { responseType: 'json' });
  }
}