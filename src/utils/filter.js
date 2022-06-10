import {FilterType} from './const';

export const filter = {
  [FilterType.ALL]: (arr) => arr,
  [FilterType.WATCH_LIST]: (arr) => arr.filter((movie) => movie.userDetails.watchlist),
  [FilterType.HISTORY]: (arr) => arr.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (arr) => arr.filter((movie) => movie.userDetails.favorite),
};
