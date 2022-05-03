import MovieDetailsView from '../view/movie-popup-view.js';
import MovieDetailsCommentView from '../view/movie-popup-comment-view.js';
import {render} from '../render.js';

const getMovieComments = (movie, allComments) => allComments.filter((comment) => movie.comments.includes(comment.id));

export default class MovieDetailsPresenter {

  init = (movieContainer, movies, comments) => {
    const onMovieCardClick = (evt) => {
      const elementId = parseInt(evt.target.closest('.film-card').id, 10);
      const selectedMovie = movies.filter((movie) => movie.id === elementId)[0];
      const selectedMovieComments = getMovieComments(selectedMovie, comments);

      render(new MovieDetailsView(selectedMovie), movieContainer);
      const movieDetainsCommentContainer = document.querySelector('.film-details__comments-list');
      selectedMovieComments.forEach((comment) => render(new MovieDetailsCommentView(comment), movieDetainsCommentContainer));

      document.querySelector('.film-details__close-btn').addEventListener('click', () => document.querySelector('.film-details').remove());
    };

    if (movies.length > 0) {
      document.querySelectorAll('.film-card__link').forEach((element) => element.addEventListener('click', onMovieCardClick));
    }
  };
}
