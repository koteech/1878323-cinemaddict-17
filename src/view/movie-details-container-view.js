import AbstractView from '../framework/view/abstract-view';

const createMovieDetailsContainerTemplate = () => `<section class="film-details">
</section>`;

export default class MovieDetailsContainerView extends AbstractView {
  get template() {
    return createMovieDetailsContainerTemplate();
  }
}
