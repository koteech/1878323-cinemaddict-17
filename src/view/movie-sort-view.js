import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../utils/const';

const createBoardTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`;

let activeLink;

export default class MovieSortView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.SortTypeChange = callback;
    activeLink = document.querySelector('.sort__button--active');
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    if (activeLink === evt.target) {
      return;
    }
    activeLink.classList.remove('sort__button--active');
    activeLink = evt.target;
    activeLink.classList.add('sort__button--active');
    this._callback.SortTypeChange(evt.target.dataset.sortType);
  };
}
