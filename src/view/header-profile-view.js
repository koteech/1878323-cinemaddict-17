import AbstractView from '../framework/view/abstract-view';

const profileMap = {
  novice: [1, 10],
  fan: [11, 20],
  'Movie Buff': [21, Infinity]
};

const getProfileName = (length) => Object.entries(profileMap).filter(([, value]) => length >= value[0] && length <= value[1]).flat();

const createProfileTemplate = (length) => `
<section class="header__profile profile">
    ${length !== 0 ? `<p class="profile__rating">${getProfileName(length)[0].charAt(0).toUpperCase() + getProfileName(length)[0].slice(1)}</p>` : ''}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>
`;

export default class HeaderProfileView extends AbstractView {
  #movieWatchedCount = null;

  constructor(movies) {
    super();
    this.#movieWatchedCount = movies.filter((movie) => movie.userDetails.alreadyWatched).length;
  }

  get template() {
    return createProfileTemplate(this.#movieWatchedCount);
  }
}
