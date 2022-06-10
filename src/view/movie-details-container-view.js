import AbstractView from '../framework/view/abstract-view.js';

const createMovieDetailsContainerTemplate = () => `<section class="film-details">
</section>`;

export default class MovieDetailsContainerView extends AbstractView {
  get template() {
    return createMovieDetailsContainerTemplate();
  }
}
