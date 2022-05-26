import {generateMovies} from '../mock/movie';
import {generateComments} from '../mock/comments';
import {addComponentId} from '../utils/films';

const MOVIES_COUNT = 12;
const TOTAL_COMMENTS_COUNT = 400;
const TOP_RATED_FILM_COUNT_PER_STEP = 2;
const MOST_COMMENTED_FILM_COUNT_PER_STEP = 2;

export default class MovieModel {
  #comments = null;
  #movies = null;
  #topRatedMovies = null;
  #mostCommentedMovies = null;

  get comments() {
    if (!this.#comments) {
      this.#comments = generateComments(TOTAL_COMMENTS_COUNT);
    }
    return this.#comments;
  }

  get movies() {
    if (!this.#movies) {
      this.#movies = generateMovies(MOVIES_COUNT, this.comments);
    }
    return this.#movies;
  }

  get topRatedMovies() {
    if (!this.#topRatedMovies) {
      this.#topRatedMovies = addComponentId(this.movies)
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0, Math.min(this.movies.length, TOP_RATED_FILM_COUNT_PER_STEP));
    }

    return this.#topRatedMovies;
  }

  get mostCommentedMovies() {
    if (!this.#mostCommentedMovies) {
      this.#mostCommentedMovies = addComponentId(this.movies)
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, Math.min(this.movies.length, MOST_COMMENTED_FILM_COUNT_PER_STEP));
    }

    return this.#mostCommentedMovies;
  }

  getCommentsByMovie(movieId) {
    const selectedMovie = this.movies.find((film) => film.id === movieId);
    return this.comments.filter((comment) => selectedMovie.comments.includes(comment.id));
  }
}
