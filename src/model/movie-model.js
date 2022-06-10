import Observable from '../framework/observable';

const TOP_RATED_MOVIE_COUNT_PER_STEP = 2;
const MOST_COMMENTED_MOVIE_COUNT_PER_STEP = 2;

export default class MovieModel extends Observable {
  #movies = null;
  #topRatedMovies = null;
  #mostCommentedMovies = null;

  get movies() {
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }

  get topRatedMovies() {
    if (!this.#topRatedMovies) {
      this.#topRatedMovies = [...this.movies]
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0, Math.min(this.movies.length, TOP_RATED_MOVIE_COUNT_PER_STEP));
    }

    return this.#topRatedMovies;
  }

  get mostCommentedMovies() {
    if (!this.#mostCommentedMovies) {
      this.#mostCommentedMovies = [...this.movies]
        .sort((a, b) => b.comments.length - a.comments.length)
        .slice(0, Math.min(this.movies.length, MOST_COMMENTED_MOVIE_COUNT_PER_STEP));
    }

    return this.#mostCommentedMovies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this.#mostCommentedMovies = null;
    this.#topRatedMovies = null;

    this._notify(updateType, update);
  };
}
