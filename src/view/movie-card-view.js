import AbstractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';

const createBoardTemplate = (movie) => `
<article class="film-card" id=${movie.id}>
	<a class="film-card__link">
		<h3 class="film-card__title">${movie.filmInfo.title}</h3>
		<p class="film-card__rating">${movie.filmInfo.totalRating}</p>
		<p class="film-card__info">
		    <span class="film-card__year">${dayjs(movie.filmInfo.release.date).year()}</span>
		    <span class="film-card__duration">${movie.filmInfo.runtime}</span>
		    <span class="film-card__genre">${movie.filmInfo.genre[0]}</span>
		</p>
		<img src="${movie.filmInfo.poster}" alt="" class="film-card__poster">
		<p class="film-card__description">${movie.filmInfo.description.length > 140 ? `${movie.filmInfo.description.slice(0, 139)}...` : movie.filmInfo.description}</p>
		<span class="film-card__comments">${movie.comments.length} ${movie.comments.length === 1 ? 'comment' : 'comments'}
		</span>
	</a>
	<div class="film-card__controls">
		<button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${movie.userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
		<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${movie.userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
		<button class="film-card__controls-item film-card__controls-item--favorite ${movie.userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
	</div>
</article>
`;

export default class MovieCardView extends AbstractView {
  #movie = {};

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createBoardTemplate(this.#movie);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    document.body.classList.add('hide-overflow');
    this._callback.click();
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
