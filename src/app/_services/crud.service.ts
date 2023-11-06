import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    return this.http.get(environment.api + '/all', { responseType: 'json' });
  }

  post(): Observable<any> {
    return this.http.post(environment.api + '/all', { responseType: 'json' });
  }

  put(): Observable<any> {
    return this.http.put(environment.api + '/all', { responseType: 'json' });
  }

  delete(): Observable<any> {
    return this.http.delete(environment.api + '/all', { responseType: 'json' });
  }
}