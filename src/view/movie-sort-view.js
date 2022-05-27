import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../utils/const';

const createBoardTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" id="${SortType.DEFAULT}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" id="${SortType.BY_DATE}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" id="${SortType.BY_RATING}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`;

let sortActiveType = SortType.DEFAULT;

export default class MovieSortView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.SortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    document.getElementById(sortActiveType).classList.remove('sort__button--active');
    sortActiveType = evt.target.dataset.sortType;
    evt.target.classList.add('sort__button--active');
    this._callback.SortTypeChange(evt.target.dataset.sortType);
  };
}
