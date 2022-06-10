import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class Api extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptMovieToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptMovieToServer = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      'film_info': {
        ...movie.filmInfo,
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'total_rating': movie.filmInfo.totalRating,
        release: {
          date: movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
          'release_country': movie.filmInfo.release.releaseCountry
        }
      },
      'user_details': {
        ...movie.userDetails,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate instanceof Date ? movie.userDetails.watchingDate.toISOString() : null
      }
    };

    delete adaptedMovie.film_info.ageRating;
    delete adaptedMovie.film_info.alternativeTitle;
    delete adaptedMovie.film_info.totalRating;
    delete adaptedMovie.user_details.alreadyWatched;
    delete adaptedMovie.user_details.watchingDate;

    return adaptedMovie;
  };

  getComments = (movieId) => this._load({url: `comments/${movieId}`})
    .then(ApiService.parseResponse);

  addComment = async (movieId, comment) => {
    const response = await this._load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (commentId) => await this._load(
    {
      url: `comments/${commentId}`,
      method: Method.DELETE
    }
  );
}
