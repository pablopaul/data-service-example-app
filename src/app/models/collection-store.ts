import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface CollectionStore {
  loading: boolean,
  loaded: boolean,
  ids: BehaviorSubject<any>;
}
