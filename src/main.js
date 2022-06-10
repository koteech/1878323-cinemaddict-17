import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import MovieModel from './model/movie-model';
import FilterPresenter from './presenter/filter-presenter';
import ProfilePresenter from './presenter/profile-presenter';
import MainPresenter from './presenter/main-presenter';
import {generateMovies} from './mock/movie';
import {generateComments} from './mock/comments';

const TOTAL_COMMENTS_COUNT = 100;
const MOVIES_COUNT = 25;

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticElement = document.querySelector('.footer__statistics');

const movieModel = new MovieModel();
const commentModel = new CommentModel();
const filterModel = new FilterModel();

const setData = () => {
  const comments = generateComments(TOTAL_COMMENTS_COUNT);
  const movies = generateMovies(MOVIES_COUNT, comments);
  movieModel.movies = movies;
  commentModel.comments = comments;
};

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
  siteFooterStatisticElement,
  siteBodyElement,
  movieModel,
  commentModel,
  filterModel
);

setData();
profilePresenter.init();
filterPresenter.init();
mainPresenter.init();
