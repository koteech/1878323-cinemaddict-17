import AbstractView from '../framework/view/abstract-view';

const filtersMap = {
  watchlist: (arr) => arr.filter((movie) => movie.userDetails.watchlist).length,
  history: (arr) => arr.filter((movie) => movie.userDetails.alreadyWatched).length,
  favorites: (arr) => arr.filter((movie) => movie.userDetails.favorite).length,
};

const getFilters = (films) => Object.entries(filtersMap).map(([filterName, countFilms]) => (
  {
    name: filterName,
    count: countFilms(films),
  }
));

const createFilterItemTemplate = (filter) => `<a href="#${filter.name}" class="main-navigation__item">${filter.name.charAt(0).toUpperCase() + filter.name.slice(1)} <span class="main-navigation__item-count">${filter.count}</span></a>`;

const createFilterTemplate = (filters) => `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  ${filters.map((filter) => createFilterItemTemplate(filter)).join(' ')}
</nav>`;


export default class MovieFilterView extends AbstractView {
  #filters = [];

  constructor(movies) {
    super();
    this.#filters = getFilters(movies);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
