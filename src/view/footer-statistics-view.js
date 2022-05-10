import {createElement} from '../render';

const createFooterStatisticsTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class FooterStatisticsView {
  #moviesCount = null;
  #element = null;

  constructor(movies) {
    this.#moviesCount = movies.length;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#moviesCount);
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
