import MovieModel from './model/movie-model';
import MoviePresenter from './presenter/movie-presenter';

const dataModel = new MovieModel();

const moviePresenter = new MoviePresenter(
  document.querySelector('.main'),
  document.querySelector('.header'),
  document.querySelector('.footer__statistics'),
  dataModel
);

moviePresenter.init();
