import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BooksService } from '../services/books';

import * as fromRoot from '../reducers';
import { Book } from '../models/book';


@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>My Collection</md-card-title>
    </md-card>

    <bc-book-preview-list [books]="books$ | async"></bc-book-preview-list>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [`
    md-card-title {
      display: flex;
      justify-content: center;
    }
  `]
})
export class CollectionPageComponent implements OnInit {
  books: any;
  books$: any;
  collectionBookIds$: Observable<string>;

  constructor(private BooksService: BooksService) {

    //this.books$ = store.select(fromRoot.getBookCollection);
    this.books$ = this.BooksService.bookEntities.asObservable();
  }

  ngOnInit() {

  }


}
