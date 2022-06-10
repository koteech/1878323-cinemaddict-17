import MoviePresenter from './movie-presenter';
import MovieSectionView from '../view/movie-section-view';
import MovieListView from '../view/movie-list-view';
import {filter} from '../utils/filter';
import SortView from '../view/movie-sort-view';
import MovieNoDataView from '../view/movie-no-data-view';
import MovieListContainerView from '../view/movie-container-view';
import LoadMoreButtonView from '../view/show-more-button-view';
import LoadingView from '../view/loading-view';
import {SectionSettings, SortType, UpdateType, UserAction} from '../utils/const';
import {remove, render} from '../framework/render';
import {sortMovieByDate, sortMovieByRating} from '../utils/movies';

const ALL_MOVIE_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #mainContainer = null;
  #pageBodyElement = null;
  #movieModel = null;
  #commentModel = null;
  #filterModel = null;
  #moviePresenter = new Map();
  #openMoviePresenter = null;
  #renderedAllMovies = ALL_MOVIE_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #pagePosition = null;
  #prevAllMoviesCount = null;
  #sortComponent = null;
  #noMovieComponent = null;
  #isLoading = true;

  #loadingComponent = new LoadingView();
  #movieSectionComponent = new MovieSectionView();
  #allMovieListComponent = new MovieListView(SectionSettings.ALL.TITLE);
  #allMovieListContainerComponent = new MovieListContainerView();
  #topRatedMovieListComponent = new MovieListView(SectionSettings.TOP_RATED.TITLE, true);
  #topRatedMovieListContainerComponent = new MovieListContainerView();
  #mostCommentedMovieListComponent = new MovieListView(SectionSettings.MOST_COMMENTED.TITLE, true);
  #mostCommentedMovieListContainerComponent = new MovieListContainerView();
  #showMoreButtonComponent = new LoadMoreButtonView();

  constructor(mainContainer, pageBodyElement, movieModel, commentModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#pageBodyElement = pageBodyElement;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#movieModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...filteredMovies].sort(sortMovieByDate);
      case SortType.BY_RATING:
        return [...filteredMovies].sort(sortMovieByRating);
    }

    return filteredMovies;
  }

  init = () => {
    this.#renderPage();
  };

  #renderPage = () => {
    render(this.#movieSectionComponent, this.#mainContainer);
    render(this.#allMovieListComponent, this.#movieSectionComponent.element);

    if (this.#isLoading) {
      render(this.#loadingComponent, this.#allMovieListComponent.element);
      this.#allMovieListComponent.element.firstElementChild.remove();
      return;
    }

    const movies = this.movies;
    const movieCount = movies.length;

    this.#renderSortComponent();
    render(this.#movieSectionComponent, this.#mainContainer);
    render(this.#allMovieListComponent, this.#movieSectionComponent.element);

    if (movieCount === 0) {
      this.#renderNoMovies();
      remove(this.#sortComponent);
      return;
    }

    render(this.#mostCommentedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#topRatedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#allMovieListContainerComponent, this.#allMovieListComponent.element);
    render(this.#topRatedMovieListContainerComponent, this.#topRatedMovieListComponent.element);
    render(this.#mostCommentedMovieListContainerComponent, this.#mostCommentedMovieListComponent.element);

    this.#updateOpenMoviePresenter();
    this.#renderMovieCards();

    if (this.movies.length > this.#renderedAllMovies) {
      render(this.#showMoreButtonComponent, this.#allMovieListComponent.element);
      this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
    }

    if (this.#pagePosition) {
      window.scrollTo(0, this.#pagePosition);
    }
  };

  #renderMovie(movie, container) {
    const moviePresenter = new MoviePresenter(container, this.#pageBodyElement, this.#movieModel, this.#commentModel, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(movie);
    if (this.#moviePresenter.has(movie.id)) {
      this.#moviePresenter.get(movie.id).push(moviePresenter);
      return;
    }
    this.#moviePresenter.set(movie.id, [moviePresenter]);
  }

  #renderMovieCards() {
    this.#renderAllMovieCards();
    this.#renderTopRatedMovieCards();
    this.#renderMostCommentedMovieCards();
  }

  #renderAllMovieCards() {
    this.movies
      .slice(0, this.#renderedAllMovies)
      .forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));
  }

  #renderTopRatedMovieCards() {
    this.#movieModel.topRatedMovies.forEach((movie) => this.#renderMovie(movie, this.#topRatedMovieListContainerComponent.element));
  }

  #renderMostCommentedMovieCards() {
    this.#movieModel.mostCommentedMovies.forEach((movie) => this.#renderMovie(movie, this.#mostCommentedMovieListContainerComponent.element));
  }

  #renderSortComponent() {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderNoMovies = () => {
    this.#noMovieComponent = new MovieNoDataView(this.#filterModel.filter);
    render(this.#noMovieComponent, this.#allMovieListComponent.element);
  };

  #showMoreButtonClickHandler = () => {
    this.movies
      .slice(this.#renderedAllMovies, this.#renderedAllMovies += ALL_MOVIE_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));

    if (this.movies.length <= this.#renderedAllMovies) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPage({resetRenderedAllMovies: true});
    this.#renderPage();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        try {
          await this.#movieModel.updateMovie(updateType, update);
        } catch {
          throw new Error('Can\'t update movie');
        }
        break;
      case UserAction.DELETE_COMMENT:
      case UserAction.ADD_COMMENT:
        this.#movieModel.updateLocalMovie(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenter.get(data.id)
          .forEach((presenter) => presenter.init(data));
        break;
      case UpdateType.MINOR:
        this.#clearPage();
        this.#renderPage();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage();
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetRenderedAllMovies: true, resetSortType: true});
        this.#renderPage();
        break;
    }
  };

  #handleModeChange = () => {
    this.#moviePresenter
      .forEach((value) => value
        .forEach((presenter) => presenter.resetView()));
    if (this.#openMoviePresenter) {
      this.#openMoviePresenter.resetView();
    }
  };

  #clearPage = ({resetRenderedAllMovies = false, resetSortType = false} = {}) => {
    const movieCount = this.movies.length;

    this.#pagePosition = document.documentElement.scrollTop;

    this.#moviePresenter
      .forEach((presenters) =>
        presenters.forEach((presenter) => {
          if (presenter.isOpen()) {
            this.#openMoviePresenter = presenter;
            return presenter.partialDestroy();
          }
          presenter.destroy();
        })
      );

    this.#moviePresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#movieSectionComponent);
    remove(this.#allMovieListComponent);
    remove(this.#loadingComponent);
    remove(this.#mostCommentedMovieListComponent);
    remove(this.#topRatedMovieListComponent);

    if (this.#noMovieComponent) {
      remove(this.#noMovieComponent);
    }

    this.#prevAllMoviesCount = this.#renderedAllMovies;

    this.#renderedAllMovies = resetRenderedAllMovies ? ALL_MOVIE_COUNT_PER_STEP : Math.min(movieCount, this.#renderedAllMovies);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #updateOpenMoviePresenter = () => {
    if (!this.#openMoviePresenter) {
      return;
    }

    if (!this.#openMoviePresenter.isOpen) {
      this.#openMoviePresenter = null;
    }

    const updateMovie = this.#movieModel.movies.filter((movie) => movie.id === this.#openMoviePresenter.movie.id)[0];
    this.#openMoviePresenter.init(updateMovie);
  };

}
