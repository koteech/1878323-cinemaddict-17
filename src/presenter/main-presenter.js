import {remove, render} from '../framework/render';
import {sortMovieByDate, sortMovieByRating} from '../utils/movies';
import {SortType} from '../utils/const';
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
  #pageBodyElement = null;
  #sourcedMovies = null;
  #movies = null;
  #movieModel = null;
  #moviePresenter = new Map();
  #currentSortType = null;
  #renderedAllMovieShowen = ALL_MOVIE_COUNT_PER_STEP;

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
    this.#sourcedMovies = [...this.#movieModel.movies];
    this.#movies = this.#movieModel.movies;
    this.#currentSortType = SortType.DEFAULT;
    this.#renderPage();
  };

  #renderPage() {
    render(new ProfileView(this.#movieModel.movies), this.#profileElement);
    render(new FooterStatisticsView(this.#movieModel.movies), this.#footerStatisticsElement);
    this.#renderMovieFilterComponent();
    this.#renderMovieSortComponent();
    render(this.#movieSectionComponent, this.#mainContainer);
    render(this.#allMovieListComponent, this.#movieSectionComponent.element);

    if (this.#movieModel.movies < 1) {
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

    this.#renderMovieCards();
  }

  #renderMovieCards() {
    this.#renderAllMovieCards();
    this.#renderTopRatedMovieCards();
    this.#renderMostCommentedMovieCards();
  }

  #renderMovie(movie, movieContainer) {
    const moviePresenter = new MoviePresenter(movieContainer, this.#pageBodyElement, this.#movieModel, this.#changeData, this.#changeMode);
    moviePresenter.init(movie);
    if (this.#moviePresenter.has(movie.id)) {
      this.#moviePresenter.get(movie.id).push(moviePresenter);
      return;
    }
    this.#moviePresenter.set(movie.id, [moviePresenter]);
  }

  #clearMovieCards = () => {
    this.#moviePresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.destroy()));
    this.#moviePresenter.clear();
    this.#renderedAllMovieShowen = ALL_MOVIE_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #renderAllMovieCards() {
    this.#movies
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

  #renderMovieSortComponent() {
    render(this.#movieSortComponent, this.#mainContainer);
    this.#movieSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderMovieFilterComponent() {
    render(new MovieFilterView(this.#movieModel.movies), this.#mainContainer);
  }

  #changeData = (updatedMovie) => {
    this.#moviePresenter.get(updatedMovie.id)
      .forEach((presenter) => presenter.init(updatedMovie));
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#movies.sort(sortMovieByDate);
        break;
      case SortType.BY_RATING:
        this.#movies.sort(sortMovieByRating);
        break;
      default:
        this.#movies = [...this.#sourcedMovies];
    }

    this.#currentSortType = sortType;
  };

  #changeMode = () => {
    this.#moviePresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.resetView()));
  };

  #loadMoreButtonClickHandler = () => {
    this.#movies
      .slice(this.#renderedAllMovieShowen, this.#renderedAllMovieShowen += ALL_MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));

    if (this.#sourcedMovies.length <= this.#renderedAllMovieShowen) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMovieCards();
    this.#renderMovieCards();
  };

}
