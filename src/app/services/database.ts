import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';

import * as collection from '../actions/collection';
import { Book } from '../models/book';


@Injectable()
export class DbService {

  constructor(private db: Database) { }

  openDB$: Observable<any> = defer(() => {
    return this.db.open('books_app');
  });

  loadCollection() {
    return this.db.query('books')
    .toArray()
    .catch(error => Observable.of(error));
  }
}
