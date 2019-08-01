import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AdFormService {
  constructor(
    private http: HttpClient,
  ) { }

  postData(data): Observable<any> {
    return this.http.post('https://js.dump.academy/keksobooking', data);
  }
}
