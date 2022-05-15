import {render} from '../framework/render';
import MoviePopupCommentView from '../view/movie-popup-comment-view';
import MoviePopupView from '../view/movie-popup-view';

export default class MoviePopupPresenter {
  #movie = null;
  #comments = null;
  #movieCardComponent = null;
  #moviePopupComponent = null;


  constructor(movieCardComponent, movie, comments) {
    this.#movieCardComponent = movieCardComponent;
    this.#movie = movie;
    this.#comments = comments;
  }

  init = () => {
    this.#renderMoviePopup();
  };

  #renderMoviePopup() {
    const movieCardClickHandler = () => {
      this.#renderMovieDetails(this.#movie);
    };

    this.#movieCardComponent.setClickHandler(movieCardClickHandler);
  }

  #renderMovieDetails() {
    this.#moviePopupComponent = new MoviePopupView(this.#movie);
    render(this.#moviePopupComponent, document.body);
    this.#getCommentsByMovie().forEach((comment) => render(new MoviePopupCommentView(comment), this.#moviePopupComponent.element.querySelector('.film-details__comments-list')));

    const documentKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#moviePopupComponent.element.remove();
        this.#moviePopupComponent.removeElement();
        document.removeEventListener('keydown', documentKeydownHandler);
        document.body.classList.remove('hide-overflow');
      }
    };

    document.addEventListener('keydown', documentKeydownHandler);
    this.#moviePopupComponent.setCloseButtonClickHandler(this.#handleClosefilmDetails);
  }


  #handleClosefilmDetails = () => {
    this.#moviePopupComponent.element.remove();
    this.#moviePopupComponent.removeElement();
  };

  #getCommentsByMovie() {
    return this.#comments.filter((comment) => this.#movie.comments.includes(comment.id));
  }

}
