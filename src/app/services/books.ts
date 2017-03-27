import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Book } from '../models/book';
import { BooksStore } from '../models/books-store';
import { CollectionStore } from '../models/collection-store';

import { AppService } from './app';
import { GoogleBooksService } from './google-books';

@Injectable()
export class BooksService {


  idsInCollection: BehaviorSubject<any[]>;
  idsInCollection$: any;
  bookEntities: BehaviorSubject<any[]>;

  selectedBookId: string;


  /////

  booksStore: BooksStore;
  collectionStore: CollectionStore;

  searchResultbooks$: Observable<Book[]>;

  booksBehaveSub: BehaviorSubject<Book[]>;

  collectionBooks$: Observable<Book[]>;

  // Observable string sources
  private searchTerms = new Subject<string>();

  // Observable boolean source
  private isSelectedBookInCollection = new BehaviorSubject(false);
  // Observable boolean stream
  isSelectedBookInCollection$ = this.isSelectedBookInCollection.asObservable();

  constructor(private AppService: AppService,
              private GoogleBooksService: GoogleBooksService) {

    this.idsInCollection = new BehaviorSubject([]);

    this.searchResultbooks$ = this.searchTerms
      // switch to new observable each time the term changes
      .switchMap( (term) => {
        if (term) {
          return this.GoogleBooksService.searchBooks(term);
        }
        else {
          // or the observable of empty books if there was no search term
          return Observable.of<Book[]>([])
        }
      })
      // "Error handling" :)
      .catch(error => {
        console.log(error);
        return Observable.of<Book[]>([]);
      });

    // For book collection
    this.bookEntities = new BehaviorSubject([]);

    this.booksBehaveSub = new BehaviorSubject([]);
    this.collectionBooks$ = this.booksBehaveSub.asObservable();

    this.searchResultbooks$.subscribe({
      next: (books) => {

        this.booksBehaveSub.next(books);

        // Store book entities
        books.map( (book: any) => {
          this.booksStore.entities[book.id] = book;
        });

        // Set loading done
        this.AppService.setIsLoading(false)
      },
      error: () => this.AppService.setIsLoading(false), // Set loading done
      complete: () => this.AppService.setIsLoading(false) // Set loading done
    });

    // Initial bookStore state
    this.booksStore = {
      ids: [],
      entities: this.searchResultbooks$,
      selectedBookId: null
    };

    // Initial bookCollection state
    this.collectionStore = {
      loading: false,
      loaded: false,
      ids: new BehaviorSubject('test')
    };

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

    // Book Id
    let booksIds = this.idsInCollection.getValue();
    booksIds.push(book.id);
    this.idsInCollection.next(booksIds);

    // Trigger "in collection computation"
    this.checkIfSelectedBookIsInCollection();
  }

  removeFromCollection(id: string) {

    this.idsInCollection.next(this.idsInCollection.getValue().filter(idFromIds => id != idFromIds));

    // Trigger "in collection computation"
    this.checkIfSelectedBookIsInCollection();
  }

  checkIfSelectedBookIsInCollection() {
    this.isSelectedBookInCollection.next(this.idsInCollection.getValue().indexOf(this.getSelectedBookId()) > -1);
  }

}
