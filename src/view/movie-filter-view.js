import {createElement} from '../render.js';

const getFilters = (movies) => {
  const filtersMap = {
    watchlist: (arr) => arr.filter((movie) => movie.userDetails.watchlist).length,
    history: (arr) => arr.filter((movie) => movie.userDetails.alreadyWatched).length,
    favorites: (arr) => arr.filter((movie) => movie.userDetails.favorite).length,
  };

  return Object.entries(filtersMap).map(([filterName, countMovies]) => (
    {
      name: filterName,
      count: countMovies(movies),
    }
  ));
};

const createFilterItemTemplate = (filter) => `<a href="#${filter.name}" class="main-navigation__item">${filter.name.charAt(0).toUpperCase() + filter.name.slice(1)} <span class="main-navigation__item-count">${filter.count}</span></a>`;

const createFilterTemplate = (filters) => `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  ${filters.map((filter) => createFilterItemTemplate(filter)).join(' ')}
</nav>`;


export default class MovieFilterView {
  #filters = [];
  #element = null;

  constructor(movies) {
    this.#filters = getFilters(movies);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
