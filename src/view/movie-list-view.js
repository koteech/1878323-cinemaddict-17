import {createElement, render} from '../render';
import MovieCardView from './movie-card-view';
import MovieShowMoreButtonView from './movie-show-more-button-view';

const createMovieListTemplate = (title, isExtra) => `
<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">${title}</h2>
    <div class="films-list__container"></div>
</section>`;

export default class MovieListView {
  constructor(title, count, isExtra) {
    this.title = title;
    this.count = count;
    this.isExtra = isExtra;
  }

  getTemplate() {
    return createMovieListTemplate(this.title, this.isExtra);
  }

  updateElement() {
    const element = createElement(this.getTemplate());
    const container = element.querySelector('.films-list__container');
    Array.from({length: this.count},() => {render(new MovieCardView(),container);});
    if (!this.isExtra) {render(new MovieShowMoreButtonView, element);}
    return element;
  }

  getElement() {
    if (!this.element) {
      this.element = this.updateElement();
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
