import AbstractView from '../framework/view/abstract-view';
import {getDateForComment} from '../utils/movies';
import he from 'he';

const createCommentTemplate = (comment) => `
<li class="film-details__comment" id="${comment.id}">
    <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
	<div>
		<p class="film-details__comment-text">${he.encode(comment.comment)}</p>
		<p class="film-details__comment-info"> <span class="film-details__comment-author">${comment.author}</span>
		    <span class="film-details__comment-day">${getDateForComment(comment.date)}</span>
		    <button class="film-details__comment-delete">Delete</button>
		</p>
	</div>
</li>
`;

export default class MovieCommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
