import MovieDetailsView from '../view/movie-popup-view';
import MovieDetailsCommentView from '../view/movie-popup-comment-view';
import {render} from '../render';

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
    this.#renderPage();
  };

  #renderPage() {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        closeMovieDetails(evt, this.#movieDetailsComponent);
      }
    };

    const handleCloseButtonClick = (evt) => {
      closeMovieDetails(evt, this.#movieDetailsComponent);
    };

    function closeMovieDetails(evt, component) {
      evt.preventDefault();
      component.element.remove();
      component.removeElement();
      document.removeEventListener('keydown', onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }

    const onCardClick = () => {
      document.body.classList.add('hide-overflow');
      this.#movieDetailsComponent = new MovieDetailsView(this.#movies);
      render(this.#movieDetailsComponent, document.body);
      this.#comments.filter((comment) => this.#movies.comments.includes(comment.id)).forEach((comment) => render(new MovieDetailsCommentView(comment), this.#movieDetailsComponent.element.querySelector('.film-details__comments-list')));
      document.addEventListener('keydown', onEscKeyDown);
      this.#movieDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', handleCloseButtonClick);
    };

    this.#movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', onCardClick);
  }
}
