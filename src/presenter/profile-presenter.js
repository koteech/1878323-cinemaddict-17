import AbstractView from '../framework/view/abstract-view';
import ProfileView from '../view/header-profile-view';
import {remove, render, replace} from '../framework/render';

const profileMap = {
  novice: [0, 10],
  fan: [11, 20],
  'Movie Buff': [21, Infinity]
};

export default class ProfilePresenter extends AbstractView {
  #moviesWatchedCount = null;
  #profileName = null;
  #movieModel = null;
  #profileComponent = null;
  #profileContainer = null;

  constructor(profileContainer, movieModel) {
    super();
    this.#profileContainer = profileContainer;
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#moviesWatchedCount = this.#getWatchedMoviesCount(this.#movieModel.movies);
    this.#profileName = this.#getProfileName(this.#moviesWatchedCount)[0];
    const prevProfileComponent = this.#profileComponent;
    this.#movieModel.addObserver(this.#handleModelEvent);

    this.#profileComponent = new ProfileView(this.#profileName);

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#profileContainer);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  };

  #getWatchedMoviesCount = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched).length;

  #getProfileName = (length) => Object.entries(profileMap)
    .filter(([, value]) => length >= value[0] && length <= value[1])
    .flat();

  #handleModelEvent = () => {
    this.init();
  };

  get template() {
    return '';
  }
}
