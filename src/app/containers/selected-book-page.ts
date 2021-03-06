import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import { Book } from '../models/book';

import { BooksService } from '../services/books';


@Component({
  selector: 'bc-selected-book-page',
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `
})
export class SelectedBookPageComponent {
  book$: any;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private BooksService: BooksService) {

    // Check if current book is in collection
    this.BooksService.checkIfSelectedBookIsInCollection();
    this.isSelectedBookInCollection$ = this.BooksService.isSelectedBookInCollection$;

    this.BooksService.bookEntities.subscribe({
      next: (bookArray: any) => {

        if(bookArray.length) {

          // Get the currently selected book from book entities
          const selectedBook = bookArray.filter((book: any) => book.id === this.BooksService.getSelectedBookId());

          // Make the selected book available as Observable
          this.book$ = Observable.from(selectedBook);
        }
      }
    });
  }

  addToCollection(book: Book) {
    this.BooksService.addToCollection(book);
  }

  removeFromCollection(book: Book) {
    this.BooksService.removeFromCollection(book.id);
  }
}
