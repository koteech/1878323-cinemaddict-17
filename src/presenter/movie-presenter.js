import MovieFilterView from '../view/movie-filter-view';
import MovieSortView from '../view/movie-sort-view';
import MovieContainerView from '../view/movie-container-view';
import MovieCardView from '../view/movie-card-view.js';
import {render} from '../render';

const ALL_MOVIES_LENGTH = 5;
const TOP_RATED_LENGTH = 2;
const MOST_COMMENTED_LENGTH = 2;

export default class MoviePresenter {

  init = (movieContainer, movies) => {

    render(new MovieFilterView(movies), movieContainer);
    render(new MovieSortView(), movieContainer);
    render(new MovieContainerView(), movieContainer);

    const allMoviesElement = document.querySelector('#all-movies');
    const allMoviesListContainerElement = allMoviesElement.querySelector('.films-list__container');
    const allMoviesListEmptyElement = allMoviesElement.querySelector('.films-list__empty');
    const allMoviesListButtonShowMore = allMoviesElement.querySelector('.films-list__show-more');
    const topRatedElement = document.querySelector('#top-rated');
    const topRatedListContainerElement = topRatedElement.querySelector('.films-list__container');
    const mostCommentedElement = document.querySelector('#most-commented');
    const mostCommentedListContainerElement = mostCommentedElement.querySelector('.films-list__container');

    if (movies.length > 0) {
      allMoviesListEmptyElement.classList.add('visually-hidden');
      allMoviesListButtonShowMore.classList.remove('visually-hidden');
      movies.slice(0, ALL_MOVIES_LENGTH).map((movie) => render(new MovieCardView(movie), allMoviesListContainerElement));
      movies.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, TOP_RATED_LENGTH).map((movie) => render(new MovieCardView(movie), topRatedListContainerElement));
      movies.sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENTED_LENGTH).map((movie) => render(new MovieCardView(movie), mostCommentedListContainerElement));
    }
  };
}
