import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import { Book } from '../models/book';

import { AppService } from './app';
import { GoogleBooksService } from './google-books';
import { DbService } from './database';

@Injectable()
export class BooksService {

  bookEntities: BehaviorSubject<any[]>;

  searchTerms = new Subject<string>();
  searchResultbooks$: Observable<Book[]>;

  idsInCollection: BehaviorSubject<any[]>;
  idsInCollection$: any;

  selectedBookId: string;
  isSelectedBookInCollection = new BehaviorSubject(false);
  isSelectedBookInCollection$ = this.isSelectedBookInCollection.asObservable();

  constructor(private AppService: AppService,
              private GoogleBooksService: GoogleBooksService,
              private dbService: DbService) {

    // Book collection
    this.bookEntities = new BehaviorSubject([]);

    this.idsInCollection = new BehaviorSubject([]);

    this.searchResultbooks$ = this.searchTerms
      // Switch to a new observable each time the search term changes
      .switchMap( (term) => {
        if (term) {
          return this.GoogleBooksService.searchBooks(term);
        }
        else {
          // or the observable of empty books if there was no search term
          return Observable.of<Book[]>([])
        }
      })
      // "Error handling"
      .catch(error => {
        console.log(error);
        return Observable.of<Book[]>([]);
      });

    this.searchResultbooks$.subscribe({
      next: (books) => {
        this.AppService.setIsLoading(false) // Set loading done
      },
      error: () => this.AppService.setIsLoading(false) // Set loading done
    });

    this.idsInCollection$ = Observable.from(this.idsInCollection);
  }

  // Act on the search query
  search(query: string) {
    this.AppService.setIsLoading(true);

    // Kick off the next book search
    this.searchTerms.next(query);
  }

  getSelectedBook():Observable<Book> {
    return Observable.from([this.searchResultbooks$[this.selectedBookId]]);
  }

  getSelectedBookId():string {
    return this.selectedBookId;
  }

  setSelectedBook(id: string):void {
    this.selectedBookId = id;
  }

  addToCollection(book: any) {

    // Add book id into collection
    let booksIds = this.idsInCollection.getValue();
    booksIds.push(book.id);
    this.idsInCollection.next(booksIds);

    // Trigger "in collection computation"
    this.checkIfSelectedBookIsInCollection();

    // Remove from Indexed Db
    this.dbService.addBook(book);
  }

  removeFromCollection(id: string) {
    // Remove book id from collection
    this.idsInCollection.next(this.idsInCollection.getValue().filter(idFromIds => id != idFromIds));

    // Trigger "in collection computation"
    this.checkIfSelectedBookIsInCollection();

    // Remove from Indexed Db
    this.dbService.removeBook(id);
  }

  checkIfSelectedBookIsInCollection() {
    this.isSelectedBookInCollection.next(this.idsInCollection.getValue().indexOf(this.getSelectedBookId()) > -1);
  }

}
