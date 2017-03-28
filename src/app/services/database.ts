import { Injectable } from '@angular/core';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import 'rxjs/add/operator/toArray';


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

  addBook(book: any) {
    this.db.insert('books', [book]);
  }
}
