import ProfileView from '../view/header-profile-view';
import {remove, render, replace} from '../framework/render';
import {ProfileMap} from '../utils/const';


export default class ProfilePresenter {
  #moviesWatchedCount = null;
  #profileName = null;
  #movieModel = null;
  #profileComponent = null;
  #profileContainer = null;

  constructor(profileContainer, movieModel) {
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

  #getProfileName = (length) => Object.entries(ProfileMap)
    .filter(([, value]) => length >= value[0] && length <= value[1])
    .flat();

  #handleModelEvent = () => {
    this.init();
  };
}
