import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

const DAY_DIFF_COUNT = 30;
const SECONDS = 60;

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

const getDateForComment = (date) => {
  const dateInner = dayjs(date);
  const dayDiff = dayjs().diff(dateInner, 'days');

  if (dayDiff <= DAY_DIFF_COUNT) {
    return dayjs(date).fromNow();
  }

  if (dayDiff > DAY_DIFF_COUNT) {
    return dayjs(date).format('YYYY/MM/DD HH:MM');
  }

  return dayjs(date).format('YYYY/MM/DD HH:MM');
};

const getHumanDate = (date) => dayjs(date).format('DD MMMM YYYY');

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins / SECONDS);
  const minutes = mins % SECONDS;
  return `${hours}h ${minutes}m`;
};

const sortMovieByDate = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.release.date, movieB.filmInfo.release.date);
  return weight ?? dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
};

const sortMovieByRating = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);
  return weight ?? movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;
};

export {
  getDateForComment,
  getHumanDate,
  getTimeFromMins,
  sortMovieByDate,
  sortMovieByRating
};
