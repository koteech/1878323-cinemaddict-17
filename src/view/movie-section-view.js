import {createElement} from '../render.js';

const createMovieSectionTemplate = () => '<section class="films"></section>';

export default class MovieSectionView {
  #element = null;

  get template() {
    return createMovieSectionTemplate();
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
