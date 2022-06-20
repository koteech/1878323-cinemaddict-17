import {remove, render, replace} from '../framework/render';
import {UpdateType, UserAction} from '../utils/const';
import MovieCardView from '../view/movie-card-view';
import MovieDetailsContainerView from '../view/movie-details-container-view';
import MovieDetailsView from '../view/movie-details-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

const TimeLimit = {
  LOWER_LIMIT: 50,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

export default class MoviePresenter {
  #comments = [];
  #movieContainerElement = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;
  #movieDetailsContainerComponent = null;
  #pageBodyElement = null;
  #commentModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #scrollTopDetails = null;
  #updatedMovie = null;
  #prevMovieCardComponent = null;
  #prevMovieDetailsComponent = null;

  constructor(movieContainerElement, pageBodyElement, commentModel, changeData, changeMode) {
    this.#movieContainerElement = movieContainerElement;
    this.#pageBodyElement = pageBodyElement;
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
      return render(this.#movieCardComponent, this.#movieContainerElement);
    }

    if (this.isOpen()) {
      this.#replaceMovieDetailsComponent(this.#comments);
    } else {
      replace(this.#movieCardComponent, this.#prevMovieCardComponent);
      remove(this.#prevMovieCardComponent);
    }
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleCloseMovieDetailsClick();
    }
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieDetailsComponent);
  };

  partialDestroy = () => {
    remove(this.#movieCardComponent);
  };

  isOpen = () => this.#mode === Mode.OPENED;

  #handleOpenMovieDetailsClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      render(this.#movieDetailsContainerComponent, this.#pageBodyElement);
      render(this.#movieDetailsComponent, this.#movieDetailsContainerComponent.element);
      document.addEventListener('keydown', this.#escKeydownHandler);
      this.#changeMode();
      this.#mode = Mode.OPENED;
      this.#getCommentsAndUpdateDetails();
    }
  };

  #handleCloseMovieDetailsClick = () => {
    this.#mode = Mode.DEFAULT;
    this.#movieDetailsComponent.resetState(this.movie);
    this.#movieDetailsComponent.element.remove();
    this.#movieDetailsContainerComponent.element.remove();
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #rollBackChanges = () => {
    if (this.isOpen()) {
      const resetMovieDetails = () => {
        this.#movieDetailsComponent.updateElement({
          isCommentDeleting: false,
          isCommentAdding: false,
          isMovieUpdating: false
        });
      };
      this.#movieDetailsComponent.shake(resetMovieDetails);
      return;
    }

    const resetMovie = () => {
      this.#movieCardComponent.updateElement({
        isMovieUpdating: false
      });
    };
    this.#movieCardComponent.shake(resetMovie);
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

  #setMovieHandlers = () => {
    this.#movieCardComponent.setMovieCardClickHandler(this.#handleOpenMovieDetailsClick);
    this.#movieCardComponent.setWatchListControlClickHandler(this.#handleWatchListControlClick);
    this.#movieCardComponent.setWatchedControlClickHandler(this.#handleWatchedControlClick);
    this.#movieCardComponent.setFavoriteControlClickHandler(this.#handleFavoriteControlClick);
  };

  #setMovieDetailsHandlers = () => {
    this.#movieDetailsComponent.setCloseButtonClickHandler(this.#handleCloseMovieDetailsClick);
    this.#movieDetailsComponent.setWatchListControlClickHandler(this.#handleWatchListControlClick);
    this.#movieDetailsComponent.setWatchedControlClickHandler(this.#handleWatchedControlClick);
    this.#movieDetailsComponent.setFavoriteControlClickHandler(this.#handleFavoriteControlClick);
    this.#movieDetailsComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    this.#movieDetailsComponent.setCommentAddKeydownHandler(this.#handleCommentAddKeydown);
  };

  #handleWatchListControlClick = async () => {
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

  #handleWatchedControlClick = async () => {
    uiBlocker.block();
    try {
      await this.#changeData(
        UserAction.UPDATE_MOVIE,
        UpdateType.MINOR,
        {
          ...this.movie,
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

  #handleFavoriteControlClick = async () => {
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

  #handleCommentAddKeydown = async (update) => {
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

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      this.#handleCloseMovieDetailsClick();
    }
  };
}
