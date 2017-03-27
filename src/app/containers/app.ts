import { Component, ChangeDetectionStrategy } from '@angular/core';

import * as fromRoot from '../reducers';
import * as layout from '../actions/layout';

import { DbService } from '../services/database';
import { BooksService } from '../services/books';
import { Observable } from "rxjs";

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
    
      <bc-sidenav [open]="showSideNav">
        <bc-nav-item (activate)="closeSidenav()" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (activate)="closeSidenav()" routerLink="/book/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>
      </bc-sidenav>
      
      <bc-toolbar (openMenu)="openSidenav()">
        Book Collection
      </bc-toolbar>
            
      <router-outlet></router-outlet>
    </bc-layout>
  `
})

export class AppComponent {
  showSideNav: Boolean;

  constructor(private dbService: DbService, private booksService: BooksService) {

    const localBookCollection$ = this.dbService.loadCollection();

    // Load each book from index db into BooksService
    localBookCollection$.subscribe({
      next: (bookArray) => {

        // Put bookArray into booksService
        this.booksService.bookEntities.next(bookArray);

        // Push id to array to check if already in collection
        bookArray.forEach(
          (book: any) => {
            let newIds = this.booksService.idsInCollection.getValue();
            newIds.push(book.id);
            this.booksService.idsInCollection.next(newIds);

            this.booksService.checkIfSelectedBookIsInCollection();
          }
        )
      }
    });

    // Sidenav closed by default
    this.showSideNav = false;
  }

  closeSidenav() {
    this.showSideNav = false;
  }

  openSidenav() {
    this.showSideNav = true;
  }

}
