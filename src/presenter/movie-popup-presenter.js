import {render} from '../render';
import MoviePopupCommentView from '../view/movie-popup-comment-view';
import MoviePopupView from '../view/movie-popup-view';

export default class MoviePopupPresenter {
  #movies = null;
  #comments = null;
  #movieCardComponent = null;
  #moviePopupComponent = null;


  constructor(movieCardComponent, movies, comments) {
    this.#movieCardComponent = movieCardComponent;
    this.#movies = movies;
    this.#comments = comments;
  }

  init = () => {
    this.#renderMoviePopup();
  };

  #renderMoviePopup() {
    const documentKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        closeMoviePopup(evt, this.#moviePopupComponent);
      }
    };

    const moviePopupCloseButtonClickHandler = (evt) => {
      closeMoviePopup(evt, this.#moviePopupComponent);
    };

    function closeMoviePopup(evt, component) {
      evt.preventDefault();
      component.element.remove();
      component.removeElement();
      document.removeEventListener('keydown', documentKeydownHandler);
      document.body.classList.remove('hide-overflow');
    }

    const movieCardClickHandler = () => {
      document.body.classList.add('hide-overflow');
      this.#moviePopupComponent = new MoviePopupView(this.#movies);
      render(this.#moviePopupComponent, document.body);
      this.#comments.filter((comment) => this.#movies.comments.includes(comment.id)).forEach((comment) => render(new MoviePopupCommentView(comment), this.#moviePopupComponent.element.querySelector('.film-details__comments-list')));
      document.addEventListener('keydown', documentKeydownHandler);
      this.#moviePopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', moviePopupCloseButtonClickHandler);
    };

    this.#movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', movieCardClickHandler);
  }
}
