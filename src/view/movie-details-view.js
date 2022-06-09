import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import MovieDetailsCommentView from './movie-comment-view';
import {getHumanDate, getTimeFromMins} from '../utils/movies';

const createMovieDetailsTemplate = (movie, movieComments) => {
  const commentsTemplate = movieComments.map((comment) => new MovieDetailsCommentView(comment).template).join('');
  const commentEmojiTemplate = movie.commentEmoji ?
    `<img src="images/emoji/${movie.commentEmoji}.png" width="55" height="55" alt="emoji-${movie.commentEmoji}}"></img>`
    : '';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${movie.filmInfo.poster}" alt="">
          <p class="film-details__age">${movie.filmInfo.ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${movie.filmInfo.title}</h3>
              <p class="film-details__title-original">${movie.filmInfo.alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${movie.filmInfo.totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${movie.filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${movie.filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${movie.filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getHumanDate(movie.filmInfo.release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimeFromMins(movie.filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${movie.filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${movie.filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${movie.filmInfo.genre.map((item) => `<span class="film-details__genre">${item}</span>`).join(' ')}
                </td>
            </tr>
          </tbody></table>
          <p class="film-details__film-description">
            ${movie.filmInfo.description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${movie.userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${movie.userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${movie.userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
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
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${movie.commentText ? movie.commentText : ''}</textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  </section>`;

};


export default class MovieDetailsView extends AbstractStatefulView {
  #movieComments = null;

  constructor(movie, comments) {
    super();
    this._state = this.#convertMovieToState(movie);
    this.#movieComments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createMovieDetailsTemplate(this._state, this.#movieComments);
  }

  #convertMovieToState = (movie) => ({
    ...movie,
    commentEmoji: null,
    commentText: null,
    scrollTop: null
  });

  #convertStateToMovie = (state) => {
    const movie = {...state};

    delete movie.commentEmoji;
    delete movie.commentText;
    delete movie.scrollTop;

    return movie;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
  };

  #restorePosition = () => {
    this.element.scrollTop = this._state.scrollTop;
    this.element.querySelector('.film-details__comment-input').scrollTop = this._state.localCommentScrollTop;
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
    this.#restorePosition();
  };

  #localCommentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      commentText: evt.target.value,
      scrollTop: this.element.scrollTop,
    });
    this.#restorePosition();
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((element) => element.addEventListener('click', this.#localCommentEmojiClickHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#localCommentInputHandler);
  };

  #setOuterHandlers = () => {
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.remove('hide-overflow');
    this._callback.click();
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  reset = (movie) => {
    this.updateElement(
      this.#convertMovieToState(movie)
    );
  };
}
