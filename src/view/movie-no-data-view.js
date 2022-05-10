import {createElement} from '../render.js';

const createMovieNoDataTemplate = () => (`
<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
</section>`
);

export default class MovieNoDataView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMovieNoDataTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
