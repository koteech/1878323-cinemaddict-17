import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';

const DESCRIPTION_LENGTH = 140;

const createMovieCardTemplate = (state) => `
<article class="film-card" id=${state.id}>
	<a class="film-card__link">
		<h3 class="film-card__title">${state.filmInfo.title}</h3>
		<p class="film-card__rating">${state.filmInfo.totalRating}</p>
		<p class="film-card__info">
		    <span class="film-card__year">${dayjs(state.filmInfo.release.date).year()}</span>
		    <span class="film-card__duration">${state.filmInfo.runtime}</span>
		    <span class="film-card__genre">${state.filmInfo.genre[0]}</span>
		</p>
		<img src="${state.filmInfo.poster}" alt="" class="film-card__poster">
		<p class="film-card__description">${state.filmInfo.description.length > DESCRIPTION_LENGTH ? `${state.filmInfo.description.slice(0, DESCRIPTION_LENGTH-1)}...` : state.filmInfo.description}</p>
		<span class="film-card__comments">${state.comments.length} ${state.comments.length === 1 ? 'comment' : 'comments'}
		</span>
	</a>
	<div class="film-card__controls">
		<button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${state.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
		<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${state.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
		<button class="film-card__controls-item film-card__controls-item--favorite ${state.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
	</div>
</article>
`;

export default class MovieCardView extends AbstractStatefulView {

  constructor(movie) {
    super();
    this._state = this.#convertMovieToState(movie);
  }

  get template() {
    return createMovieCardTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchListControlClickHandler(this._callback.watchListClick);
    this.setWatchedControlClickHandler(this._callback.watchedClick);
    this.setFavoriteControlClickHandler(this._callback.favoriteClick);
  };

  setMovieDetailsClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#movieDetailsClickHandler);
  };

  setWatchListControlClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListControlClickHandler);
  };

  setWatchedControlClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedControlClickHandler);
  };

  setFavoriteControlClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteControlClickHandler);
  };

  #convertMovieToState = (movie) => ({
    ...movie,
    isMovieUpdating: false
  });

  #movieDetailsClickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.add('hide-overflow');
    this._callback.click();
  };

  #watchListControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isMovieUpdating: true,
    });
    this._callback.watchListClick();
  };

  #watchedControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isMovieUpdating: true,
    });
    this._callback.watchedClick();
  };

  #favoriteControlClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isMovieUpdating: true,
    });
    this._callback.favoriteClick();
  };
}
