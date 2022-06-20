import {SortType} from '../utils/const';
import AbstractView from '../framework/view/abstract-view';

const createSortTemplate = (currentSortType) => `
<ul class="sort">
    <li><a href="#" class="sort__button${currentSortType === SortType.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.BY_DATE ? ' sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button${currentSortType === SortType.BY_RATING ? ' sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`;

export default class MovieSortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeClickHandler = (callback) => {
    this._callback.SortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeClickHandler);
  };

  #sortTypeClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.SortTypeChange(evt.target.dataset.sortType);
  };
}
