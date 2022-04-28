import {createElement, render} from '../render.js';
import MovieListView from '../view/movie-list-view';

const ALL_MOVIES_LENGTH = 5;
const TOP_RATED_LENGTH = 2;
const MOST_COMMENTED_LENGTH = 2;
const IS_EXTRA = true;

const createMovieSectionTemplate = () => '<section class="films"></section>';

export default class MovieContainerView {
  getTemplate() {
    return createMovieSectionTemplate();
  }

  updateElement() {
    const element = createElement(this.getTemplate());
    render(new MovieListView('All movies. Upcoming', ALL_MOVIES_LENGTH), element);
    render(new MovieListView('Top rated', TOP_RATED_LENGTH, IS_EXTRA), element);
    render(new MovieListView('Most commented', MOST_COMMENTED_LENGTH, IS_EXTRA), element);
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
