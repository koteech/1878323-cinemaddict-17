import MovieModel from './model/movie-model';
import MoviePresenter from './presenter/movie-presenter';
// import MovieDetailsPresenter from './presenter/movie-details-presenter'

const dataModel = new MovieModel();
const comments = dataModel.comments;
const movies = dataModel.movies;
//
// console.log(dataModel)
// console.log(comments)
// console.log(movies)

const moviePresenter = new MoviePresenter(
  document.querySelector('.main'),
  document.querySelector('.header'),
  document.querySelector('.footer__statistics'),
  dataModel
);
// const movieDetailsPresenter = new MovieDetailsPresenter(
//   document.body,
//   movies,
//   comments);

moviePresenter.init();
// movieDetailsPresenter.init();


// import {render} from './render';
// import ProfileView from './view/header-profile-view';
// import MovieModel from './model/movie-model';
// import MoviePresenter from './presenter/movie-presenter';
// import FooterStatisticsView from './view/footer-statistics-view';
// import MovieDetailsPresenter from './presenter/movie-details-presenter';
//
//
// const siteMainElement = document.querySelector('.main');
// const siteHeaderElement = document.querySelector('.header');
// const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
//
// const moviePresenter = new MoviePresenter();
// const movieDetailsPresenter = new MovieDetailsPresenter();
//
// const dataModel = new MovieModel();
// const comments = dataModel.comments;
// const movies = dataModel.movies;
//
// render(new ProfileView(movies), siteHeaderElement);
// render(new FooterStatisticsView(movies), siteFooterStatisticsElement);
//
// moviePresenter.init();
// movieDetailsPresenter.init();
// // moviePresenter.init(siteMainElement, movies);
// // movieDetailsPresenter.init(document.body, movies, comments);
