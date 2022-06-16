import Api from './utils/api';
import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import MainPresenter from './presenter/main-presenter';
import MovieModel from './model/movie-model';
import ProfilePresenter from './presenter/profile-presenter';
import StatisticPresenter from './presenter/statistic-presenter';

const AUTHORIZATION = 'Basic koteech1';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyElement = document.querySelector('body');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

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
