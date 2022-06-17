import {getHumanDate, getTimeFromMins} from '../utils/movies';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import MovieDetailsCommentView from './movie-comment-view';

const createMovieDetailsTemplate = (state, movieComments) => {
  const commentsTemplate = movieComments.map((comment) => new MovieDetailsCommentView(comment, state.isCommentDeleting).template).join('');

  const commentEmojiTemplate = state.commentEmoji ?
    `<img src="images/emoji/${state.commentEmoji}.png" width="55" height="55" alt="emoji-${state.commentEmoji}}">`
    : '';

  return `<form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${state.filmInfo.poster}" alt="">
          <p class="film-details__age">${state.filmInfo.ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${state.filmInfo.title}</h3>
              <p class="film-details__title-original">${state.filmInfo.alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${state.filmInfo.totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${state.filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${state.filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${state.filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getHumanDate(state.filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimeFromMins(state.filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${state.filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${state.filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${state.filmInfo.genre.map((item) => `<span class="film-details__genre">${item}</span>`).join(' ')}
                </td>
            </tr>
          </tbody></table>
          <p class="film-details__film-description">
            ${state.filmInfo.description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${state.userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist" ${state.isMovieUpdating ? ' disabled' : ''}>Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${state.userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched" ${state.isMovieUpdating ? ' disabled' : ''}>Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${state.userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite" ${state.isMovieUpdating ? ' disabled' : ''}>Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movieComments.length}</span></h3>
        <ul class="film-details__comments-list">
        ${commentsTemplate}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${commentEmojiTemplate}</div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${state.isCommentAdding ? ' disabled' : ''}>${state.commentText ? state.commentText : ''}</textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${state.isCommentAdding ? ' disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${state.isCommentAdding ? ' disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${state.isCommentAdding ? ' disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${state.isCommentAdding ? ' disabled' : ''}>
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>`;
};


export default class MovieDetailsView extends AbstractStatefulView {
  #movieComments = [];

  constructor(movie, comments) {
    super();
    this._state = this.#convertMovieToState(movie);
    this.#movieComments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._state, this.#movieComments);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
  };

  resetState = (movie) => {
    this.updateElement(
      this.#convertMovieToState(movie)
    );
  };

  restorePosition = () => {
    this.element.scrollTop = this._state.scrollTop;
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchListControlClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListControlClickHandler);
  };

  setWatchedControlClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedControlClickHandler);
  };

  setFavoriteControlClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteControlClickHandler);
  };

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((element) => element.addEventListener('click', this.#commentDeleteClickHandler));
  };

  setCommentAddKeydownHandler = (callback) => {
    this._callback.commentAdd = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentAddKeydownHandler);
  };

  #convertMovieToState = (movie) => ({
    ...movie,
    commentEmoji: null,
    commentText: null,
    scrollTop: null,
    isCommentDeleting: false,
    isCommentAdding: false,
    isFilmUpdating: false
  });

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((element) => element.addEventListener('click', this.#localCommentEmojiClickHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#localCommentInputClickHandler);
  };

  #setOuterHandlers = () => {
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchListControlClickHandler(this._callback.watchListClick);
    this.setWatchedControlClickHandler(this._callback.watchedClick);
    this.setFavoriteControlClickHandler(this._callback.favoriteClick);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setCommentAddKeydownHandler(this._callback.commentAdd);
  };

  #localCommentEmojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      commentEmoji: evt.target.value,
      scrollTop: this.element.scrollTop
    });
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((elem) => {
        elem.checked = false;
      });
    this.element.querySelector(`#${evt.target.id}`).checked = true;
    this.restorePosition();
  };

  #localCommentInputClickHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
      scrollTop: this.element.scrollTop,
    });
    this.restorePosition();
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.remove('hide-overflow');
    this._callback.click();
  };

  #watchListControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isMovieUpdating: true,
    });
    this._callback.watchListClick();
  };

  #watchedControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isMovieUpdating: true,
    });
    this._callback.watchedClick();
  };

  #favoriteControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isMovieUpdating: true,
    });
    this._callback.favoriteClick();
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.closest('.film-details__comment').id;
    this.updateElement({
      scrollTop: this.element.scrollTop,
      isCommentDeleting: true,
    });
    this.element.querySelector(`.film-details__comment[id="${commentId}"]`).querySelector('.film-details__comment-delete').textContent = 'Deleting...';
    this._callback.commentDeleteClick(evt.target.closest('.film-details__comment').id);
  };

  #commentAddKeydownHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter' && this._state.commentEmoji) {
      this.updateElement({
        scrollTop: this.element.scrollTop,
        isCommentAdding: true,
      });
      this._callback.commentAdd({
        comment: this._state.commentText,
        emotion: this._state.commentEmoji
      });
    }
  };
}
