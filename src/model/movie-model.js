import {generateMovies} from '../mock/movie';
import {generateComments} from '../mock/comments';

const MOVIES_COUNT = 70;
const TOTAL_COMMENTS_COUNT = 40;

export default class MovieModel {
  #comments = null;
  #movies = null;

  get comments() {
    if (!this.#comments) {
      this.#comments = generateComments(TOTAL_COMMENTS_COUNT);
    }
    return this.#comments;
  }

  get movies() {
    if (!this.#movies) {
      this.#movies = generateMovies(MOVIES_COUNT, this.#comments);
    }
    return this.#movies;
  }
}
