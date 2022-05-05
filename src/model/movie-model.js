import {generateMovies} from '../mock/movie';
import {generateComments} from '../mock/comments';

const MOVIES_COUNT = 40;
const TOTAL_COMMENTS_COUNT = 40;

export default class MovieModel {

  getComments() {
    if (!this.comments) {
      this.comments = generateComments(TOTAL_COMMENTS_COUNT);
    }

    return this.comments;
  }

  getMovies() {
    if (!this.movies) {
      this.movies = generateMovies(MOVIES_COUNT, this.comments);
    }

    return this.movies;
  }
}
