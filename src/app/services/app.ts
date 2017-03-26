import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


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