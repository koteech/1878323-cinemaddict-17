import {render} from '../render';
import MovieFilterView from '../view/movie-filter-view';
import MovieSortView from '../view/movie-sort-view';
import MovieSectionView from '../view/movie-section-view';
import MovieNoDataView from '../view/movie-no-data-view';
import ProfileView from '../view/header-profile-view';
import FooterStatisticsView from '../view/footer-statistics-view';
import MovieContainerView from '../view/movie-container-view';
import MovieListView from '../view/movie-list-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import MovieCardView from '../view/movie-card-view';
import MovieDetailsView from '../view/movie-popup-view';
import MovieDetailsCommentView from '../view/movie-popup-comment-view';

const ALL_MOVIE_COUNT_PER_STEP = 5;
const TOP_RATED_MOVIE_COUNT_PER_STEP = 2;
const MOST_COMMENTED_MOVIE_COUNT_PER_STEP = 2;

const SectionTitle = {
  all: 'All movies. Upcoming',
  topRated: 'Top rated',
  mostCommented: 'Most commented',
};

export default class MainPresenter {
  #mainContainer = null;
  #profileElement = null;
  #footerStatisticsElement = null;
  #comments = null;
  #movies = null;
  #movieModel = null;
  #renderedAllMovieShowen = ALL_MOVIE_COUNT_PER_STEP;

  #movieSortComponent = new MovieSortView();
  #movieSectionComponent = new MovieSectionView();
  #allMovieListComponent = new MovieListView(SectionTitle.all);
  #allMovieListContainerComponent = new MovieContainerView();
  #topRatedMovieListComponent = new MovieListView(SectionTitle.topRated, true);
  #topRatedMovieListContainerComponent = new MovieContainerView();
  #mostCommentedMovieListComponent = new MovieListView(SectionTitle.mostCommented, true);
  #mostCommentedMovieListContainerComponent = new MovieContainerView();
  #loadMoreButtonComponent = new ShowMoreButtonView();
  #movieDetailsComponent = null;

  constructor (mainContainer, profileElement, footerStatisticsElement, movieModel) {
    this.#mainContainer = mainContainer;
    this.#profileElement = profileElement;
    this.#footerStatisticsElement = footerStatisticsElement;
    this.#movieModel = movieModel;
    this.#comments = [...this.#movieModel.comments];
    this.#movies = [...this.#movieModel.movies];
    // this.#movies = [...movies];
  }

  init = () => {
    this.#renderPage();

  };

  #renderPage() {
    render(new ProfileView(this.#movies), this.#profileElement);
    render(new FooterStatisticsView(this.#movies), this.#footerStatisticsElement);
    render(new MovieFilterView(this.#movies), this.#mainContainer);
    render(this.#movieSortComponent, this.#mainContainer);

    render(this.#movieSectionComponent, this.#mainContainer);
    render(this.#allMovieListComponent, this.#movieSectionComponent.element);

    if (this.#movies.length < 1) {
      render(new MovieNoDataView(), this.#allMovieListComponent.element);
      this.#movieSortComponent.element.remove();
      this.#allMovieListComponent.element.firstElementChild.remove();
      return true;
    }

    render(this.#mostCommentedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#topRatedMovieListComponent, this.#movieSectionComponent.element);
    render(this.#allMovieListContainerComponent, this.#allMovieListComponent.element);
    render(this.#topRatedMovieListContainerComponent, this.#topRatedMovieListComponent.element);
    render(this.#mostCommentedMovieListContainerComponent, this.#mostCommentedMovieListComponent.element);

    this.#movies.slice(0, Math.min(this.#movies.length, ALL_MOVIE_COUNT_PER_STEP)).forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));
    if (this.#movies.length > ALL_MOVIE_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#allMovieListComponent.element);
      this.#loadMoreButtonComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
    }
    this.#movies.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, Math.min(this.#movies.length, TOP_RATED_MOVIE_COUNT_PER_STEP)).forEach((movie) => this.#renderMovie(movie, this.#topRatedMovieListContainerComponent.element));
    this.#movies.sort((a, b) => b.comments.length - a.comments.length).slice(0, Math.min(this.#movies.length, MOST_COMMENTED_MOVIE_COUNT_PER_STEP)).forEach((movie) => this.#renderMovie(movie, this.#mostCommentedMovieListContainerComponent.element));
  }

  #renderMovie (movie, MovieCountainerElement) {
    const movieCardComponent = new MovieCardView(movie);
    render(movieCardComponent, MovieCountainerElement);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        closeMovieDetails(evt, this.#movieDetailsComponent);
      }
    };

    const handleCloseButtonClick = (evt) => {
      closeMovieDetails(evt, this.#movieDetailsComponent);
    };

    function closeMovieDetails(evt, component) {
      evt.preventDefault();
      component.element.remove();
      component.removeElement();
      document.removeEventListener('keydown', onEscKeyDown);
      document.body.classList.remove('hide-overflow');
    }

    const onCardClick = () => {
      document.body.classList.add('hide-overflow');
      this.#movieDetailsComponent = new MovieDetailsView(movie);
      render(this.#movieDetailsComponent, document.body);
      this.#comments.filter((comment) => movie.comments.includes(comment.id)).forEach((comment) => render(new MovieDetailsCommentView(comment), this.#movieDetailsComponent.element.querySelector('.film-details__comments-list')));
      document.addEventListener('keydown', onEscKeyDown);
      this.#movieDetailsComponent.element.querySelector('.film-details__close-btn').addEventListener('click', handleCloseButtonClick);
    };

    movieCardComponent.element.querySelector('.film-card__link').addEventListener('click', onCardClick);
  }

  #handleLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#movies.slice(this.#renderedAllMovieShowen, this.#renderedAllMovieShowen + ALL_MOVIE_COUNT_PER_STEP).forEach((movie) => this.#renderMovie(movie, this.#allMovieListContainerComponent.element));
    this.#renderedAllMovieShowen += ALL_MOVIE_COUNT_PER_STEP;
    if (this.#movies.length <= this.#renderedAllMovieShowen) {
      this.#loadMoreButtonComponent.element.remove();
    }
  };
}
