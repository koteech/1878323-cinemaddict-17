import {remove, render, replace} from '../framework/render';
import FooterStatisticsView from '../view/footer-statistics-view';

export default class StatisticPresenter {
  #movieModel = null;
  #statisticComponent = null;
  #statisticContainer = null;

  constructor(statisticContainer, movieModel) {
    this.#statisticContainer = statisticContainer;
    this.#movieModel = movieModel;
  }

  init = () => {
    const movies = this.#movieModel.movies;
    const movieCount = movies.length;
    const prevStatisticComponent = this.#statisticComponent;
    this.#movieModel.addObserver(this.#handleModelEvent);

    this.#statisticComponent = new FooterStatisticsView(movieCount);

    if (prevStatisticComponent === null) {
      render(this.#statisticComponent, this.#statisticContainer);
      return;
    }

    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
