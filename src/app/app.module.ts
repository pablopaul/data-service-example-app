import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { DBModule } from '@ngrx/db';
import { MaterialModule } from '@angular/material';

import { ComponentsModule } from './components';

import { AppComponent } from './containers/app';
import { FindBookPageComponent } from './containers/find-book-page';
import { ViewBookPageComponent } from './containers/view-book-page';
import { SelectedBookPageComponent } from './containers/selected-book-page';
import { CollectionPageComponent } from './containers/collection-page';
import { NotFoundPageComponent } from './containers/not-found-page';

import { DbService } from './services/database';
import { GoogleBooksService } from './services/google-books';
import { AppService } from './services/app';
import { BooksService } from './services/books';
import { WindowRef } from './services/WindowRef';

import { routes } from './routes';
import { schema } from './db';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    MaterialModule,
    ComponentsModule,
    RouterModule.forRoot(routes, { useHash: true }),

    /**
     * `provideDB` sets up @ngrx/db with the provided schema and makes the Database
     * service available.
     */
    DBModule.provideDB(schema),
  ],
  declarations: [
    AppComponent,
    FindBookPageComponent,
    SelectedBookPageComponent,
    ViewBookPageComponent,
    CollectionPageComponent,
    NotFoundPageComponent
  ],
  providers: [
    GoogleBooksService,
    AppService,
    BooksService,
    DbService,
    WindowRef
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
