import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';

// Observable class extensions
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/last';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as book from '../actions/book';
import { Book } from '../models/book';

import { AppService } from '../services/app';
import { BooksService } from '../services/books';

@Component({
  selector: 'bc-find-book-page',
  template: `
    <bc-book-search [searching]="loading$ | async" (search)="search($event)"></bc-book-search>
    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `
})
export class FindBookPageComponent {
  books$: Observable<Book[]>;
  loading$: Observable<boolean>;

  constructor(private BooksService: BooksService,
              private AppService: AppService) {

    // Set loading indicator
    this.loading$ = AppService.loading$;

    // Get books from book service
    this.books$ = BooksService.books$;
  }

  // Act on the search query
  search(query: string) {

    // Kick off the next book search
    this.BooksService.search(query);
  }

}
