import Observable from '../framework/observable';

export default class CommentModel extends Observable {
  #comments = [];
  #api = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  getCommentsById = async (movieId) => {
    try {
      this.#comments = await this.#api.getComments(movieId);
    } catch {
      this.#comments = [];
      throw new Error('Can\'t get comments by movie ID');
    }

    return this.#comments;
  };

  get comments() {
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  deleteComment = async (updateType, id) => {
    const index = this.#comments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      throw new Error('Can\'t detele unexisting comment');
    }

    try {
      await this.#api.deleteComment(id);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch {
      throw new Error('Can\'t detele comment');
    }
  };

  addComment = async (movieId, update) => {
    try {
      const updatedData = await this.#api.addComment(movieId, update);
      this.#comments = updatedData.comments;
      return updatedData.movie;
    } catch {
      throw new Error('Can\'t add comment');
    }
  };
}
