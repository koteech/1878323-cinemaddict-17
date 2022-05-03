import {render} from './render';
import ProfileView from './view/header-profile-view';
import MovieModel from './model/movie-model';
import MoviePresenter from './presenter/movie-presenter';
import FooterStatisticsView from './view/footer-statistics-view';
import MovieDetailsPresenter from './presenter/movie-details-presenter';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const moviePresenter = new MoviePresenter();
const movieDetailsPresenter = new MovieDetailsPresenter();

const dataModel = new MovieModel();
const comments = dataModel.getComments();
const movies = dataModel.getMovies();

render(new ProfileView(movies), siteHeaderElement);
render(new FooterStatisticsView(movies), siteFooterStatisticsElement);

moviePresenter.init(siteMainElement, movies);
movieDetailsPresenter.init(document.body, movies, comments);
