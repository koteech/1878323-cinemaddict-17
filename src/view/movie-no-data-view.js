import {NoDataText} from '../utils/const';
import AbstractView from '../framework/view/abstract-view';

const createMovieNoDataTemplate = (noDataText) => (`
<section class="films-list">
    <h2 class="films-list__title">${noDataText}</h2>
</section>`
);

export default class MovieNoDataView extends AbstractView {
  #noDataText = null;

  constructor(filter) {
    super();
    this.#noDataText = NoDataText[filter];
  }

  get template() {
    return createMovieNoDataTemplate(this.#noDataText);
  }
}
