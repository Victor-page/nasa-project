const fs = require('fs');
const path = require('path');

const { parse } = require('csv-parse');

const habitablePlanets = [];

const isHabitablePlanet = ({ koi_disposition, koi_insol, koi_prad }) =>
  koi_disposition === 'CONFIRMED' &&
  koi_insol > 0.36 &&
  koi_insol < 1.11 &&
  koi_prad < 1.6;

const loadPlanetsData = () =>
  new Promise((resolve, reject) =>
    fs
      .createReadStream(
        path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
      )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on(
        'data',
        (data) => isHabitablePlanet(data) && habitablePlanets.push(data)
      )
      .on('error', reject)
      .on('end', resolve)
  );

module.exports = { loadPlanetsData, planets: habitablePlanets };
