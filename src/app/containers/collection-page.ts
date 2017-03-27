import { Component, ChangeDetectionStrategy } from '@angular/core';
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
export class CollectionPageComponent {
  books: any;
  books$: any;

  constructor(private BooksService: BooksService) {

    this.books = new BehaviorSubject([]);

    this.BooksService.idsInCollection$.subscribe({
      next: (idsInCollection: any) => {
        idsInCollection.map( (id: any) => {
          this.BooksService.bookEntities.getValue().filter( entity => {
            return entity.id === id
          }).map( entity => {
            let bookEntities = this.books.getValue();
            bookEntities.push(entity);
            this.books.next(bookEntities);
          })
        });
        this.books$ = this.books;
      }
    });

  }

}
