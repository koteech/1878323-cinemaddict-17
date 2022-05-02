import Presenter from './presenter/presenter';
import ProfileView from './view/header-profile-view';
import FooterStatisticsView from './view/footer-statistics-view';
import {render} from './render';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const presenter = new Presenter();

render(new ProfileView(), siteHeaderElement);
render(new FooterStatisticsView(), siteFooterStatisticsElement);

presenter.init(siteMainElement);
