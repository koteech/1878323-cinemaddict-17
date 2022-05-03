import {createElement} from '../render.js';

const createFooterStatisticsTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class FooterStatisticsView {
  constructor(movies) {
    this.moviesCount = movies.length;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this.moviesCount);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
