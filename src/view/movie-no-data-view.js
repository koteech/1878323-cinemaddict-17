import AbstractView from '../framework/view/abstract-view';

const createMovieNoDataTemplate = () => (`
<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
</section>`
);

export default class MovieNoDataView extends AbstractView {
  get template() {
    return createMovieNoDataTemplate();
  }
}
