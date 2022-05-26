import MovieModel from './model/movie-model';
import MainPresenter from './presenter/main-presenter';

const boardPresenter = new MainPresenter(
  document.querySelector('.main'),
  document.querySelector('.header'),
  document.querySelector('.footer__statistics'),
  document.body,
  new MovieModel()
);

boardPresenter.init();
