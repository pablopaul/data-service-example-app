import { Observable } from 'rxjs/Observable';
import { Book } from './book';

export interface BooksStore {
  ids: string[],
  entities: Observable<Book[]>;
  selectedBookId: string;
}
