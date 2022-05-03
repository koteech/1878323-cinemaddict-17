import {createDataIds, generateDate, getRandomArrayElement, getRandomInteger, getTimeFromMins} from '../utils.js';

const TITLE = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Made for Each Other',
  'The Great Flamarion',
];

const DESCRIPTIONS = [
  'Burlesque comic Ralph \'Skid\' Johnson (Skelly), and dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a train station, when he\'s thrown out and she\'s rejected from the same show.The two things they have in life are dancing and each other, if she could only keep him away from the booze, long enough to keep dancing.A tragi-comedic, burlesque version of All That Jazz (film), from an earlier era.',
  'Sentenced for a murder he did not commit, John Brant escapes from prison determined to find the real killer. By chance Brant\'s narrow escape from lawmen is witnessed by Joseph Conlon who goes by the name of "Jones". Giving Brant the name of "Smith" Conlon, Jones gets him into his outlaw gang hiding out in an abandoned mine. Brant attempts to disrupt the outlaw gang\'s robberies and comes closer to finding his man.',
  'Frankie Machine is released from the federal Narcotic Farm in Lexington, Kentucky, with a set of drums and a new outlook on life, and returns to his run-down neighborhood on the North Side of Chicago. A drug addict (the drug is never named, but heroin is strongly implied), Frankie became clean in prison. On the outside, he greets friends and acquaintances.',
  'The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar ("Girl Martian") and Bomar ("Boy Martian") are watching too much Earth television, most notably station KID-TV\'s interview with Santa Claus in his workshop at Earth\'s North Pole.',
  'In this short, Sindbad the Sailor (presumably Bluto playing a "role") proclaims himself, in song, to be the greatest sailor, adventurer and lover in the world and "the most remarkable, extraordinary fellow," a claim that is inadvertently challenged by Popeye as he innocently sings his usual song while sailing by within earshot of Sindbads island with Olive Oyl and J. Wellington Wimpy on board',
  'John Mason (James Stewart) is a young attorney in New York City and a milquetoast. He has been doing his job well, and he has a chance of being made a partner in his law firm, especially if he marries Eunice (Ruth Weston), the daughter of his employer, Judge Doolittle. However, John meets Jane (Carole Lombard) during a business trip, and they fall in love and marry immediately.',
  'The film opens following a murder at a cabaret in Mexico City in 1936; a shot is heard, but the body of the female victim (Connie) has been strangled. The police take the woman\'s husband into custody, assuming he is the murderer.',
];

const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Romance',
];

const POSTERS = [
  'the-dance-of-life.jpg',
  'sagebrush-trail.jpg',
  'the-man-with-the-golden-arm.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'popeye-meets-sinbad.png',
  'made-for-each-other.png',
  'the-great-flamarion.jpg',
];

const WRITERS = [
  'George Manker Watters',
  'Lindsley Parsons',
  'Nelson Algren',
  'Glenville Mareth',
  'Izzy Sparber',
  'Jo Swerling',
  'Anne Wigton',
];

const ACTORS = [
  'Chris Pratt',
  'Bryce Dallas Howard',
  'Sam Neill',
  'Laura Dern',
  'Jeff Goldblum',
  'Mamoudou Athie',
  'Scott Haze',
];

const generateMovie = (id, comments) => ({
  id: id,
  comments: Array.from({length: getRandomInteger(0, 6)}, () => getRandomArrayElement(comments.map((comment) => comment.id))),
  filmInfo: {
    title: getRandomArrayElement(TITLE),
    alternativeTitle: getRandomArrayElement(TITLE),
    totalRating: getRandomInteger(10, 100) / 10,
    poster: `images/posters/${getRandomArrayElement(POSTERS)}`,
    ageRating: getRandomInteger(0, 18),
    director: Array.from({length: getRandomInteger(1, 3)}, () => getRandomArrayElement(WRITERS)),
    writers: Array.from({length: getRandomInteger(1, 3)}, () => getRandomArrayElement(WRITERS)),
    actors: Array.from({length: getRandomInteger(1, 3)}, () => getRandomArrayElement(ACTORS)),
    release: {
      date: generateDate(),
      releaseCountry: 'England'
    },
    runtime: getTimeFromMins(getRandomInteger(40, 180)),
    genre: Array.from({length: getRandomInteger(1, 3)}, () => getRandomArrayElement(GENRES)),
    description: getRandomArrayElement(DESCRIPTIONS)
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateDate(),
    favorite: Boolean(getRandomInteger(0, 1))
  }
});

export const generateMovies = (size, comments = []) => createDataIds(size).map((id) => generateMovie(id, comments));
