import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

  if (dayDiff <= 30) {
    return dayjs(date).fromNow();
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

const sortMovieByDate = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.release.date, movieB.filmInfo.release.date);
  return weight ?? dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
};

const sortMovieByRating = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);
  return weight ?? movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;
};

const getCheckedAttribute = (flag) => flag ? 'checked' : '';

export {
  sortMovieByDate,
  sortMovieByRating,
  getRandomInteger,
  getRandomArrayElement,
  generateDate,
  getHumanDate,
  getTimeFromMins,
  getDateForComment,
  getCheckedAttribute
};
