import {render} from '../render';
import MovieDetailsCommentView from '../view/movie-popup-comment-view';
import MovieDetailsView from '../view/movie-popup-view';

export default class MovieDetailsPresenter {
  #movies = null;
  #comments = null;
  #movieCardComponent = null;
  #movieDetailsComponent = null;


  constructor(movieCardComponent, movies, comments) {
    this.#movieCardComponent = movieCardComponent;
    this.#movies = movies;
    this.#comments = comments;
  }

  init = () => {
    this.#renderMovieDetails();
  };

  #renderMovieDetails() {
    const documentKeydownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        closeMovieDetails(evt, this.#movieDetailsComponent);
      }
    };

    const movieDetailsCloseButtonClickHandler = (evt) => {
      closeMovieDetails(evt, this.#movieDetailsComponent);
    };

    function closeMovieDetails(evt, component) {
      evt.preventDefault();
      component.element.remove();
      component.removeElement();
      document.removeEventListener('keydown', documentKeydownHandler);
      document.body.classList.remove('hide-overflow');
    }

    const onCardClick = () => {
      document.body.classList.add('hide-overflow');
      this.#movieDetailsComponent = new MovieDetailsView(this.#movies);
      render(this.#movieDetailsComponent, document.body);
      this.#comments.filter((comment) => this.#movies.comments.includes(comment.id)).forEach((comment) => render(new MovieDetailsCommentView(comment), this.#movieDetailsComponent.element.querySelector('.film-details__comments-list')));
      document.addEventListener('keydown', documentKeydownHandler);
      this.#movieDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', movieDetailsCloseButtonClickHandler);
    };

    this.#movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', onCardClick);
  }
}
