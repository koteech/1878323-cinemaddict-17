import Presenter from './presenter/presenter';
import ProfileView from './view/header-profile-view';
import FooterStatisticsView from './view/footer-statistics-view';
// import FilmDetailsView from './view/movie-popup-view';
import {render} from './render';

// const siteBody = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const presenter = new Presenter();

// render(new FilmDetailsView, siteBody);
// siteBody.classList.add('hide-overflow');

render(new ProfileView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterStatisticsElement);

presenter.init(siteMainElement);
