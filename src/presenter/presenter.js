import FilterView from '../view/navigation-view';
import MovieSortView from '../view/movie-sort-view';
import MovieContainerView from '../view/movie-container-view';
import {render} from '../render';

export default class Presenter {

  init = (Container) => {

    render(new FilterView(), Container);
    render(new MovieSortView(), Container);
    render(new MovieContainerView(), Container);
  };
}
