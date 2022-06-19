import {filter} from '../utils/filter';
import {FilterType, UpdateType} from '../utils/const';
import {remove, render, replace} from '../framework/render';
import FilterView from '../view/movie-filter-view';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filterModel = null;
  #movieModel = null;

  constructor(filterContainer, filterModel, movieModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#movieModel = movieModel;
    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#movieModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'all',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCH_LIST,
        name: 'watchlist',
        count: filter[FilterType.WATCH_LIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.movieFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.movieFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
