import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private http: HttpClient) { }

  get<T>(endpoint?: string, params: any = {}, options?: any): Observable<T> {
    const paramsStr = {};
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramsStr[key] = JSON.stringify(params[key]);
      }
    }
    const opts = {
      ...{
        responseType: "json",
      },
      ...options,
      ...{ params: paramsStr },
    };
    return this.http.get<T>(endpoint, opts).pipe(map((r: any) => r));
  }

  getMany(endpoint: string, id: string = "", params: any): Observable<any> {
    const url = id ? `${environment.api}/${endpoint}/${id}` : `${environment.api}/${endpoint}`;
    const options = { responseType: 'json' };
    return this.get<any>(url, params, options);
  }

  post(body: any = {}, endpoint: string = "", id: string = ""): Observable<any> {
    return this.http.post(`${environment.api}/${endpoint}`, body, { responseType: 'json' });
  }

  put(body: any = {}, id: string = ""): Observable<any> {
    return this.http.put(environment.api + '/all', { responseType: 'json' });
  }

  delete(id: string = ""): Observable<any> {
    return this.http.delete(environment.api + '/all', { responseType: 'json' });
  }
}