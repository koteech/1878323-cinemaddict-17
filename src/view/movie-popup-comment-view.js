import {createElement} from '../render';
import {getDateForComment} from '../utils';

const createMovieDetailsCommentTemplate = (comment) => `
<li class="film-details__comment">
    <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
	<div>
		<p class="film-details__comment-text">${comment.comment}</p>
		<p class="film-details__comment-info"> <span class="film-details__comment-author">${comment.author}</span> <span class="film-details__comment-day">${getDateForComment(comment.date)}</span>
			<button class="film-details__comment-delete">Delete</button>
		</p>
	</div>
</li>
`;

export default class MovieDetailsCommentView {
  #element = null;
  #comment = null;

  constructor(comment) {
    this.#comment = comment;
  }

  get template() {
    return createMovieDetailsCommentTemplate(this.#comment);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
