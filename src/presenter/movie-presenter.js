import {remove, render, replace} from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import MovieDetailsView from '../view/movie-details-view';
import {UpdateType, UserAction} from '../utils/const';

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
  #commentModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #scrollTopDetails = null;

  constructor(movieCountainerElement, pageBodyElement, movieModel, commentModel, changeData, changeMode) {
    this.#movieCountainerElement = movieCountainerElement;
    this.#pageBodyElement = pageBodyElement;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(movie) {
    this.movie = movie;
    this.#comments = this.#getCommentsByMovie();

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
    this.#movieDetailsComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    this.#movieDetailsComponent.setCommentAddHandler(this.#handleCommentAdd);

    if (prevMovieCardComponent === null && prevMovieDetailsComponent === null) {
      return render(this.#movieCardComponent, this.#movieCountainerElement);
    }

    replace(this.#movieCardComponent, prevMovieCardComponent);
    remove(prevMovieCardComponent);

    if (this.#mode === Mode.OPENED) {
      this.#scrollTopDetails = prevMovieDetailsComponent.element.scrollTop;
      replace(this.#movieDetailsComponent, prevMovieDetailsComponent);
      this.#movieDetailsComponent.element.scrollTop = this.#scrollTopDetails;
      remove(prevMovieDetailsComponent);
    }
  }

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  partialDestroy = () => {
    remove(this.#movieCardComponent);
  };

  #openMovieDetails = () => {
    if (this.#mode === Mode.DEFAULT) {
      render(this.#movieDetailsComponent, this.#pageBodyElement);
      document.addEventListener('keydown', this.#escKeydownHandler);
      this.#changeMode();
      this.#mode = Mode.OPENED;
    }
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
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.movie,
        userDetails: {
          ...this.movie.userDetails,
          watchlist: !this.movie.userDetails.watchlist,
        }
      });
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.movie,
        userDetails: {
          ...this.movie.userDetails,
          alreadyWatched: !this.movie.userDetails.alreadyWatched,
        }
      });
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {
        ...this.movie,
        userDetails: {
          ...this.movie.userDetails,
          favorite: !this.movie.userDetails.favorite,
        }
      });
  };

  #handleCommentDeleteClick = (commentId) => {
    this.#commentModel.deleteComment(
      UpdateType.MINOR,
      commentId
    );

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        ...this.movie,
        comments: this.movie.comments.filter((movieCommentId) => movieCommentId !== commentId),
      }
    );
  };

  #handleCommentAdd = (update) => {
    this.#commentModel.addComment(
      UpdateType.MINOR,
      update
    );

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        ...this.movie,
        comments: [...this.movie.comments, update.id],
      }
    );
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeMovieDetails();
    }
  };

  #getCommentsByMovie() {
    return this.#commentModel.comments.filter((comment) => this.movie.comments.includes(comment.id));
  }

  isOpen = () => this.#mode === Mode.OPENED;
}
