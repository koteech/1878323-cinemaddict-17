import Observable from '../framework/observable';

export default class CommentModel extends Observable {
  #comments = [];
  #api = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  getCommentsById = async (movieId) => {
    try {
      this.#comments = await this.#api.getComments(movieId);
    } catch (error) {
      this.#comments = [];
      throw new Error(error.message);
    }

    return this.#comments;
  };

  deleteComment = async (updateType, id) => {
    await this.#api.deleteComment(id);
    this.#comments = this.#comments.filter((comment) => comment.id !== id);
  };

  addComment = async (movieId, update) => {
    const updatedData = await this.#api.addComment(movieId, update);
    this.#comments = updatedData.comments;
    return updatedData.movie;
  };
}
