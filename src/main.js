import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import MovieModel from './model/movie-model';
import StatisticPresenter from './presenter/statistic-presenter';
import FilterPresenter from './presenter/filter-presenter';
import ProfilePresenter from './presenter/profile-presenter';
import MainPresenter from './presenter/main-presenter';
import Api from './utils/api';

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic koteech1';

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const movieModel = new MovieModel(api);
const commentModel = new CommentModel(api);
const filterModel = new FilterModel();

const profilePresenter = new ProfilePresenter(
  siteHeaderElement,
  movieModel
);

const filterPresenter = new FilterPresenter(
  siteMainElement,
  filterModel,
  movieModel
);

const mainPresenter = new MainPresenter(
  siteMainElement,
  siteBodyElement,
  movieModel,
  commentModel,
  filterModel
);

const statisticPresenter = new StatisticPresenter(
  siteFooterStatisticElement,
  movieModel
);

profilePresenter.init();
filterPresenter.init();
mainPresenter.init();
statisticPresenter.init();
movieModel.init();
