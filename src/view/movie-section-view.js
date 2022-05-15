import AbstractView from '../framework/view/abstract-view';

const createMovieSectionTemplate = () => '<section class="films"></section>';

export default class MovieSectionView extends AbstractView {
  get template() {
    return createMovieSectionTemplate();
  }
}
