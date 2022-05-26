import {remove, render} from '../framework/render.js';
import {addComponentId} from '../utils/common';
import FooterStatisticsView from '../view/footer-statistics-view';
import MovieContainerView from '../view/movie-container-view';
import MoviePresenter from './movie-presenter';
import MovieFilterView from '../view/movie-filter-view';
import MovieListView from '../view/movie-list-view';
import MovieNoDataView from '../view/movie-no-data-view';
import MovieSectionView from '../view/movie-section-view';
import MovieSortView from '../view/movie-sort-view';
import ProfileView from '../view/header-profile-view';
import ShowMoreButtonView from '../view/show-more-button-view';

const ALL_MOVIE_COUNT_PER_STEP = 5;
export const SECTION_EXTRA_TYPE = 'extra';

export const SectionSettings = {
  ALL: {
    TITLE: 'All movies. Upcoming',
  },
  TOP_RATED: {
    TITLE: 'Top rated',
    TYPE: SECTION_EXTRA_TYPE,
  },
  MOST_COMMENTED: {
    TITLE: 'Most commented',
    TYPE: SECTION_EXTRA_TYPE,
  },
};


export default class MainPresenter {
  #mainContainer = null;
  #profileElement = null;
  #footerStatisticsElement = null;
  #sourcedMovies = null;
  #movieModel = null;
  #movies = null;
  #renderedAllMovieShowen = ALL_MOVIE_COUNT_PER_STEP;
  #moviePresenter = new Map();
  #pageBodyElement = null;

  #movieSortComponent = new MovieSortView();
  #movieSectionComponent = new MovieSectionView();
  #allMovieListComponent = new MovieListView(SectionSettings.ALL.TITLE);
  #allMovieListContainerComponent = new MovieContainerView();
  #topRatedMovieListComponent = new MovieListView(SectionSettings.TOP_RATED.TITLE, true);
  #topRatedMovieListContainerComponent = new MovieContainerView();
  #mostCommentedMovieListComponent = new MovieListView(SectionSettings.MOST_COMMENTED.TITLE, true);
  #mostCommentedMovieListContainerComponent = new MovieContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();


  constructor(mainContainer, profileElement, footerStatisticsElement, pageBodyElement, movieModel) {
    this.#mainContainer = mainContainer;
    this.#profileElement = profileElement;
    this.#footerStatisticsElement = footerStatisticsElement;
    this.#pageBodyElement = pageBodyElement;
    this.#movieModel = movieModel;
    this.#movies = [...this.#movieModel.movies];
    this.#sourcedMovies = [...this.#movies];
  }

  init = () => {
    this.#renderPage();
    this.#renderAllMovieCards();
    this.#renderTopRatedMovieCards();
    this.#renderMostCommentedMovieCards();
  };

  #renderPage() {
    render(new ProfileView(this.#movies), this.#profileElement);
    render(new FooterStatisticsView(this.#movies), this.#footerStatisticsElement);
    render(new MovieFilterView(this.#movies), this.#mainContainer);
    render(this.#movieSortComponent, this.#mainContainer);
    render(this.#movieSectionComponent, this.#mainContainer);
    render(this.#allMovieListComponent, this.#movieSectionComponent.element);

    if (this.#movies.length < 1) {
      render(new MovieNoDataView(), this.#allMovieListComponent.element);
      this.#movieSortComponent.element.remove();
      this.#allMovieListComponent.element.firstElementChild.remove();
      return true;
    }

    render(this.#mostCommentedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#topRatedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#allMovieListContainerComponent, this.#allMovieListComponent.element);
    render(this.#topRatedMovieListContainerComponent, this.#topRatedMovieListComponent.element);
    render(this.#mostCommentedMovieListContainerComponent, this.#mostCommentedMovieListComponent.element);
  }

  #renderMovie(movie, movieContainer) {
    const moviePresenter = new MoviePresenter(movieContainer, this.#pageBodyElement, this.#movieModel, this.#changeData, this.#changeMode);
    moviePresenter.init(movie);

    this.#moviePresenter.set(movie.componentId, moviePresenter);
  }

  #clearMovieCards = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedAllMovieShowen = ALL_MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderAllMovieCards() {
    addComponentId(this.#movieModel.movies)
      .slice(0, Math.min(this.#sourcedMovies.length, ALL_MOVIE_COUNT_PER_STEP))
      .forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));

    if (this.#movieModel.movies.length > ALL_MOVIE_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#allMovieListComponent.element);
      this.#showMoreButtonComponent.setClickHandler(this.#loadMoreButtonClickHandler);
    }
  }

  #renderTopRatedMovieCards() {
    this.#movieModel.topRatedMovies.forEach((movie) => this.#renderMovie(movie, this.#topRatedMovieListContainerComponent.element));
  }

  #renderMostCommentedMovieCards() {
    this.#movieModel.mostCommentedMovies.forEach((movie) => this.#renderMovie(movie, this.#mostCommentedMovieListContainerComponent.element));
  }

  #changeData = (updatedMovie) => {
    [...this.#moviePresenter.values()]
      .filter((presenter) => presenter.movie.id === updatedMovie.id)
      .forEach((presenter) => presenter.init(updatedMovie));
  };

  #changeMode = () => {
    [...this.#moviePresenter.values()].forEach((presenter) => presenter.resetView());
  };

  #loadMoreButtonClickHandler = () => {
    addComponentId(this.#movieModel.movies)
      .slice(this.#renderedAllMovieShowen, this.#renderedAllMovieShowen += ALL_MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));

    if (this.#sourcedMovies.length <= this.#renderedAllMovieShowen) {
      remove(this.#showMoreButtonComponent);
    }
  };

}
