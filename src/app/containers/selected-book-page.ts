import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BooksService } from '../services/books';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import * as fromRoot from '../reducers';
import * as collection from '../actions/collection';
import { Book } from '../models/book';

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

  constructor(private store: Store<fromRoot.State>,
              private BooksService: BooksService) {

    // Check if current book is in collection
    this.BooksService.checkIfSelectedBookIsInCollection();
    this.isSelectedBookInCollection$ = this.BooksService.isSelectedBookInCollection$;

    this.BooksService.bookEntities.subscribe({
      next: (bookArray: any) => {

        // Get the currently selected book
        const selectedBookArray = bookArray.filter( (book: any) => book.id === this.BooksService.getSelectedBookId() );

        // Make the selected book available for the Angular async pipe
        this.book$ = Observable.from(selectedBookArray);
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
