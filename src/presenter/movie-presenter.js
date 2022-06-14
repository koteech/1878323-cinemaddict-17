import {remove, render, replace} from '../framework/render';
import MovieCardView from '../view/movie-card-view';
import MovieDetailsView from '../view/movie-details-view';
import {UpdateType, UserAction} from '../utils/const';
import MovieDetailsContainerView from '../view/movie-details-container-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

export default class MoviePresenter {
  #comments = [];
  #movieCountainerElement = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;
  #movieDetailsContainerComponent = null;
  #pageBodyElement = null;
  #movieModel = null;
  #commentModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #scrollTopDetails = null;
  #updatedMovie = null;
  #prevMovieCardComponent = null;
  #prevMovieDetailsComponent = null;

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
    this.#comments = this.#commentModel.comments;
    this.#prevMovieCardComponent = this.#movieCardComponent;
    this.#prevMovieDetailsComponent = this.#movieDetailsComponent;

    this.#movieCardComponent = new MovieCardView(this.movie);
    this.#setMovieHandlers();
    this.#movieDetailsComponent = new MovieDetailsView(this.movie, []);
    this.#setMovieDetailsHandlers();
    this.#movieDetailsContainerComponent = new MovieDetailsContainerView();

    if (this.#prevMovieCardComponent === null && this.#prevMovieDetailsComponent === null) {
      return render(this.#movieCardComponent, this.#movieCountainerElement);
    }

    if (this.isOpen()) {
      this.#replaceMovieDetailsComponent(this.#comments);
    } else {
      replace(this.#movieCardComponent, this.#prevMovieCardComponent);
      remove(this.#prevMovieCardComponent);
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
      render(this.#movieDetailsContainerComponent, this.#pageBodyElement);
      render(this.#movieDetailsComponent, this.#movieDetailsContainerComponent.element);
      document.addEventListener('keydown', this.#escKeydownHandler);
      this.#changeMode();
      this.#mode = Mode.OPENED;
      this.#getCommentsAndUpdateDetails();
    }
  };

  #closeMovieDetails = () => {
    this.#mode = Mode.DEFAULT;
    this.#movieDetailsComponent.reset(this.movie);
    this.#movieDetailsComponent.element.remove();
    this.#movieDetailsContainerComponent.element.remove();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      this.#closeMovieDetails();
    }
  };

  #handleWatchListClick = async () => {
    uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {
          ...this.movie,
          userDetails: {
            ...this.movie.userDetails,
            watchlist: !this.movie.userDetails.watchlist,
          }
        }
      );
    } catch {
      this.#rollBackChanges();
      uiBlocker.unblock();
    }
    uiBlocker.unblock();
  };

  #handleWatchedClick = async () => {
    uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {...this.movie,
          userDetails: {
            ...this.movie.userDetails,
            alreadyWatched: !this.movie.userDetails.alreadyWatched,
          }
        }
      );
    } catch {
      uiBlocker.unblock();
      this.#rollBackChanges();
    }
    uiBlocker.unblock();
  };

  #handleFavoriteClick = async() => {
    uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {
          ...this.movie,
          userDetails: {
            ...this.movie.userDetails,
            favorite: !this.movie.userDetails.favorite,
          }
        }
      );
    } catch {
      uiBlocker.unblock();
      this.#rollBackChanges();
    }
    uiBlocker.unblock();
  };

  #handleCommentDeleteClick = async (commentId) => {
    uiBlocker.block();
    try {
      await this.#commentModel.deleteComment(
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
    } catch {
      uiBlocker.unblock();
      this.#rollBackChanges();
    }
    uiBlocker.unblock();
  };

  #handleCommentAdd = async (update) => {
    uiBlocker.block();
    try {
      this.#updatedMovie = await this.#commentModel.addComment(this.movie.id, update);

      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        this.#updatedMovie
      );
    } catch {
      uiBlocker.unblock();
      this.#rollBackChanges();
    }
    uiBlocker.unblock();
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeMovieDetails();
    }
  };

  isOpen = () => this.#mode === Mode.OPENED;

  #setMovieHandlers = () => {
    this.#movieCardComponent.setClickHandler(this.#openMovieDetails);
    this.#movieCardComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #setMovieDetailsHandlers = () => {
    this.#movieDetailsComponent.setCloseButtonClickHandler(this.#closeMovieDetails);
    this.#movieDetailsComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#movieDetailsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#movieDetailsComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    this.#movieDetailsComponent.setCommentAddHandler(this.#handleCommentAdd);
  };

  #getCommentsAndUpdateDetails = async () => {
    const comments = await this.#commentModel.getCommentsById(this.movie.id);
    this.#prevMovieDetailsComponent = this.#movieDetailsComponent;
    this.#replaceMovieDetailsComponent(comments);
  };

  #replaceMovieDetailsComponent = (comments) => {
    this.#scrollTopDetails = this.#prevMovieDetailsComponent.element.scrollTop;
    this.#movieDetailsComponent = new MovieDetailsView(this.movie, comments);
    this.#setMovieDetailsHandlers();
    replace(this.#movieDetailsComponent, this.#prevMovieDetailsComponent);
    this.#movieDetailsComponent.element.scrollTop = this.#scrollTopDetails;
    remove(this.#prevMovieDetailsComponent);
  };

  #rollBackChanges = () => {
    if (this.isOpen) {
      const resetMovieDetails = () => {
        this.#movieDetailsComponent.updateElement({
          isCommentDeleting: false,
          isCommentAdding: false
        });
      };

      this.#movieDetailsComponent.shake(resetMovieDetails);
    }
  };
}
