import {FilterType} from '../utils/const';
import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = (movieFilter, currentFilter) => `
  <a id="${movieFilter.type}" href="#${movieFilter.name}" class="main-navigation__item${movieFilter.type === currentFilter ? ' main-navigation__item--active' : ''}">
  ${movieFilter.type !== FilterType.ALL ?
    `${movieFilter.name.charAt(0).toUpperCase() + movieFilter.name.slice(1)}
    <span class="main-navigation__item-count">${movieFilter.count}</span>`
    : 'All movies'}
  </a>`;

const createFilterTemplate = (filters, currentFilter) => `<nav class="main-navigation">
  ${filters.map((movieFilter) => createFilterItemTemplate(movieFilter, currentFilter)).join(' ')}
</nav>`;

export default class MovieFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((element) => element.addEventListener('click', this.#filterTypeClickHandler));
  };

  #filterTypeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.currentTarget.id);
  };
}
