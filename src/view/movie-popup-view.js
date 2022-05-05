import {createElement} from '../render';
import {getHumanDate} from '../utils';

const createMovieDetailsTemplate = (movieInfo, movieCommentsIds, userDetails) => `
<section class="film-details">
	<form class="film-details__inner" action="" method="get">
		<div class="film-details__top-container">
			<div class="film-details__close">
				<button class="film-details__close-btn" type="button">close</button>
			</div>
			<div class="film-details__info-wrap">
				<div class="film-details__poster">
				    <img class="film-details__poster-img" src="./${movieInfo.poster}" alt="">
					  <p class="film-details__age">${movieInfo.ageRating}+</p>
				</div>
				<div class="film-details__info">
					<div class="film-details__info-head">
						<div class="film-details__title-wrap">
							<h3 class="film-details__title">${movieInfo.title}</h3>
							<p class="film-details__title-original">${movieInfo.alternativeTitle}</p>
						</div>
						<div class="film-details__rating">
							<p class="film-details__total-rating">${movieInfo.totalRating}</p>
						</div>
					</div>
					<table class="film-details__table">
						<tbody>
							<tr class="film-details__row">
								<td class="film-details__term">Director</td>
								<td class="film-details__cell">${movieInfo.director}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Writers</td>
								<td class="film-details__cell">${movieInfo.writers.join(', ')}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Actors</td>
								<td class="film-details__cell">${movieInfo.actors.join(', ')}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Release Date</td>
								<td class="film-details__cell">${getHumanDate(movieInfo.release.date)}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Runtime</td>
								<td class="film-details__cell">${movieInfo.runtime}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Country</td>
								<td class="film-details__cell">${movieInfo.release.releaseCountry}</td>
							</tr>
							<tr class="film-details__row">
								<td class="film-details__term">Genres</td>
							  <td class="film-details__cell">${movieInfo.genre.reduce((total, item) => `${total} <span class="film-details__genre">${item}</span>` , '')} </td>
							</tr>
						</tbody>
					</table>
					<p class="film-details__film-description">${movieInfo.description} </p>
				</div>
			</div>
			<section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? 'film-details__control-button--active' : null}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : null}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : null}" id="favorite" name="favorite">Add to favorites</button>
	  	</section>
		</div>
		<div class="film-details__bottom-container">
			<section class="film-details__comments-wrap">
				<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movieCommentsIds.length}</span></h3>
				<ul class="film-details__comments-list"> </ul>
				<div class="film-details__new-comment">
					<div class="film-details__add-emoji-label"></div>
					<label class="film-details__comment-label">
						<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
					</label>
					<div class="film-details__emoji-list">
						<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
						<label class="film-details__emoji-label" for="emoji-smile"> <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji"> </label>
						<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
						<label class="film-details__emoji-label" for="emoji-sleeping"> <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji"> </label>
						<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
						<label class="film-details__emoji-label" for="emoji-puke"> <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji"> </label>
						<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
						<label class="film-details__emoji-label" for="emoji-angry"> <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji"> </label>
					</div>
				</div>
			</section>
		</div>
	</form>
</section>
`;


export default class MovieDetailsView {
  constructor(movie) {
    this.filmInfo = movie.filmInfo;
    this.movieCommentsIds = movie.comments;
    this.userDetails = movie.userDetails;
  }

  getTemplate() {
    return createMovieDetailsTemplate(this.filmInfo, this.movieCommentsIds, this.userDetails);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
