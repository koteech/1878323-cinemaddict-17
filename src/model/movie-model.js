import Observable from '../framework/observable';
import {UpdateType} from '../utils/const';

const TOP_RATED_MOVIE_COUNT_PER_STEP = 2;
const MOST_COMMENTED_MOVIE_COUNT_PER_STEP = 2;

export default class MovieModel extends Observable {
  #movies = [];
  #topRatedMovies = null;
  #mostCommentedMovies = null;
  #api = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  get movies() {
    return this.#movies;
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

  init = async () => {
    try {
      const movies = await this.#api.movies;
      this.#movies = movies.map(this.#adaptMovieToClient);
    } catch (error) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateMovie = async (updateType, update) => {
    const index = this.#checkMovieExisting(update);
    const response = await this.#api.updateMovie(update);
    const updatedMovie = this.#adaptMovieToClient(response);
    this.#setLocalMovieAndNotify(index, updateType, updatedMovie);
  };

  updateLocalMovie = async (updateType, update) => {
    const index = this.#checkMovieExisting(update);
    this.#setLocalMovieAndNotify(index, updateType, update);
  };

  #setLocalMovieAndNotify = (index, updateType, update) => {
    if (update.user_details) {
      update = this.#adaptMovieToClient(update);
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

  #checkMovieExisting = (update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }
    return index;
  };

  #adaptMovieToClient = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      filmInfo: {
        ...movie.film_info,
        ageRating: movie.film_info.age_rating,
        alternativeTitle: movie.film_info.alternative_title,
        totalRating: movie.film_info.total_rating,
        release: {
          date: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date,
          releaseCountry: movie.film_info.release.release_country
        }
      },
      userDetails: {
        ...movie.user_details,
        alreadyWatched: movie.user_details.already_watched,
        watchingDate: movie.user_details.watching_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date
      }
    };

    delete adaptedMovie.filmInfo.age_rating;
    delete adaptedMovie.filmInfo.alternative_title;
    delete adaptedMovie.filmInfo.total_rating;
    delete adaptedMovie.userDetails.already_watched;
    delete adaptedMovie.userDetails.watching_date;

    return adaptedMovie;
  };
}
