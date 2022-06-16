import {SortType} from '../utils/const';
import AbstractView from '../framework/view/abstract-view';

const createSortTemplate = (currentSortType) => `
<ul class="sort">
    <li><a href="#" class="sort__button${currentSortType === SortType.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.BY_DATE ? ' sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.BY_RATING ? ' sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`;

let activeLink;

export default class MovieSortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.SortTypeChange = callback;
    activeLink = document.querySelector('.sort__button--active');
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A' || activeLink === evt.target) {
      return;
    }
    this._callback.SortTypeChange(evt.target.dataset.sortType);
  };
}
