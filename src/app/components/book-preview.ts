import { Component, Input } from '@angular/core';
import { Book } from '../models/book';
import { Observable } from "rxjs";

import { BooksService } from '../services/books';

@Component({
  selector: 'bc-book-preview',
  template: `
    <a [routerLink]="['/book', id]" (click)="bookOnClick(id)">
      <md-card>
        <md-card-title-group>
          <img md-card-sm-image *ngIf="thumbnail" [src]="thumbnail" />
          <md-card-title>{{ title | bcEllipsis:35 }}</md-card-title>
          <md-card-subtitle *ngIf="subtitle">{{ subtitle | bcEllipsis:40 }}</md-card-subtitle>
        </md-card-title-group>
        <md-card-content>
          <p *ngIf="description">{{ description | bcEllipsis }}</p>
        </md-card-content>
        <md-card-footer>
          <bc-book-authors [book]="book"></bc-book-authors>
        </md-card-footer>
      </md-card>
    </a>
  `,
  styles: [`
    md-card {
      width: 400px;
      height: 300px;
      margin: 15px;
    }
    @media only screen and (max-width: 768px) {
      md-card {
        margin: 15px 0 !important;
      }
    }
    md-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    md-card-title {
      margin-right: 10px;
    }
    md-card-title-group {
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    md-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    span {
      display: inline-block;
      font-size: 13px;
    }
    md-card-footer {
      padding: 0 25px 25px;
    }
  `]
})
export class BookPreviewComponent {
  @Input() book: Book;

  constructor(private BooksService: BooksService) {}

  // Set selected book
  bookOnClick(id: string) {

    this.BooksService.setSelectedBook(id);

    // Add new entity
    // if entity is not already available
    const bookIsAlreadyAnEntity = this.BooksService.bookEntities.getValue().find(book => book.id === id);

    if(!bookIsAlreadyAnEntity) {

      // Get all book entities
      let newBookEntities = <any>[];

      // Add all old entities
      this.BooksService.bookEntities.getValue().map( (book) => {
        newBookEntities.push(book)
      });

      // Add the new entity
      newBookEntities.push(this.book);

      // Publish the result as new entities
      this.BooksService.bookEntities.next(newBookEntities);
    }
  }

  get id() {
    return this.book.id;
  }

  get title() {
    return this.book.volumeInfo.title;
  }

  get subtitle() {
    return this.book.volumeInfo.subtitle;
  }

  get description() {
    return this.book.volumeInfo.description;
  }

  get thumbnail(): string | boolean {
    if (this.book.volumeInfo.imageLinks) {
      return this.book.volumeInfo.imageLinks.smallThumbnail;
    }

    return false;
  }
}
