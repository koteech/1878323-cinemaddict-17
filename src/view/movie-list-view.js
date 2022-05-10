import {createElement} from '../render.js';

const createMovieListTemplate = (title, isExtra) => `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
<h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">${title}</h2>
</section>`;

export default class MovieListView {
  #title = null;
  #isExtra = null;
  #element = null;

  constructor(title, isExtra) {
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get template() {
    return createMovieListTemplate(this.#title, this.#isExtra);
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
