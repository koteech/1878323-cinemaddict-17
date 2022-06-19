import Observable from '../framework/observable';
import {FilterType} from '../utils/const';


export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get movieFilter() {
    return this.#filter;
  }

  setMovieFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
