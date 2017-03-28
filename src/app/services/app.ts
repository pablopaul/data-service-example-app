import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AppService{

  // Observable boolean source
  private loading = new Subject<boolean>();

  // Observable boolean stream
  loading$ = this.loading.asObservable();

  // Service message commands
  setIsLoading(loading: boolean) {
    this.loading.next(loading);
  }
}
