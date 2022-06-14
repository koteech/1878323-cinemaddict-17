import AbstractView from '../framework/view/abstract-view';

const createFooterStatisticsTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #moviesCount = null;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#moviesCount);
  }
}
