import {remove, render, replace} from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import MovieDetailsView from '../view/movie-details-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export default class MoviePresenter {
  #comments = null;
  #movieCountainerElement = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;
  #pageBodyElement = null;
  #movieModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(movieCountainerElement, pageBodyElement, movieModel, changeData, changeMode) {
    this.#movieCountainerElement = movieCountainerElement;
    this.#pageBodyElement = pageBodyElement;
    this.#movieModel = movieModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(movie) {
    this.movie = movie;
    this.#comments = this.#movieModel.getCommentsByMovie(movie.id);

    const prevMovieCardComponent = this.#movieCardComponent;
    const prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new MovieCardView(this.movie);
    this.#movieDetailsComponent = new MovieDetailsView(this.movie, this.#comments);

    this.#movieCardComponent.setClickHandler(this.#openMovieDetails);
    this.#movieCardComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieDetailsComponent.setCloseButtonClickHandler(this.#closeMovieDetails);
    this.#movieDetailsComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieDetailsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevMovieCardComponent === null) {
      return render(this.#movieCardComponent, this.#movieCountainerElement);
    }

    replace(this.#movieCardComponent, prevMovieCardComponent);
    remove(prevMovieCardComponent);
    if (this.#mode === Mode.OPENED) {
      replace(this.#movieDetailsComponent, prevMovieDetailsComponent);
      remove(prevMovieDetailsComponent);
    }
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  #openMovieDetails = () => {
    render(this.#movieDetailsComponent, this.#pageBodyElement);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#changeMode();
    this.#mode = Mode.OPENED;

  };

  #closeMovieDetails = () => {
    this.#mode = Mode.DEFAULT;
    this.#movieDetailsComponent.reset(this.movie);
    this.#movieDetailsComponent.element.remove();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      this.#closeMovieDetails();
    }
  };

  #handleWatchListClick = () => {
    this.#changeData({
      ...this.movie,
      userDetails: {
        ...this.movie.userDetails,
        watchlist: !this.movie.userDetails.watchlist,
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      ...this.movie,
      userDetails: {
        ...this.movie.userDetails,
        alreadyWatched: !this.movie.userDetails.alreadyWatched,
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      ...this.movie,
      userDetails: {
        ...this.movie.userDetails,
        favorite: !this.movie.userDetails.favorite,
      }
    });
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeMovieDetails();
    }
  };
}

