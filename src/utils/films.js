import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const createDataIds = (size) => Array.from({length: size}, (item, index) => index + 1);

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const generateDate = () => {
  const daysGap = getRandomInteger(-1, -720);

  return dayjs().add(daysGap, 'day').toDate();
};

const getHumanDate = (date) => dayjs(date).format('DD MMMM YYYY');

const getDateForComment = (date) => {
  const dateInner = dayjs(date);
  const dayDiff = dayjs().diff(dateInner, 'days');

  if (dayDiff <= 1) {
    return 'Today';
  }
  if (dayDiff > 1 && dayDiff <= 30) {
    return `${dayDiff} days ago`;
  }
  if (dayDiff > 30) {
    return dayjs(date).format('YYYY/MM/DD HH:MM');
  }

  return dayjs(date).format('YYYY/MM/DD HH:MM');
};


const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

const getWeightForNull = (A, B) => {
  if (A === null && B === null) {
    return 0;
  }

  if (A === null) {
    return 1;
  }

  if (B === null) {
    return -1;
  }
};

const sortMovieByDate = (filmB, filmA) => {
  const weight = getWeightForNull(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));
};

const sortMovieByRating = (filmA, filmB) => {
  const weight = getWeightForNull(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

const addComponentId = (films) => films
  .map((film) => ({
    ...film,
    componentId: `${nanoid()}-${film.id}`,
  }));

export {
  sortMovieByDate,
  sortMovieByRating,
  addComponentId,
  getRandomInteger,
  createDataIds,
  getRandomArrayElement,
  generateDate,
  getHumanDate,
  getTimeFromMins,
  getDateForComment
};
