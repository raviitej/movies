const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeDbServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3001, () => {});
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbServer();

const convertToCamelCase = (object) => {
  return {
    movieId: object.movie_id,
    directorId: object.director_id,
    movieName: object.movie_name,
    leadActor: object.lead_actor,
  };
};
const movieToCamelCase = (object) => {
  return {
    movieName: object.movie_name,
  };
};
const directorToCamelCase = (object) => {
  return {
    directorId: object.director_id,
    directorName: object.director_name,
  };
};
// API1
app.get("/movies/", async (request, response) => {
  const dbQuery = "SELECT movie_name FROM movie";
  const teamData = await db.all(dbQuery);

  response.send(teamData.map((each) => movieToCamelCase(each)));
});

// API2
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postQuery = `INSERT INTO  movie (director_id,movie_name,lead_actor) VALUES (${directorId},'${movieName}','${leadActor}');`;
  const postResponse = await db.run(postQuery);
  const playerId = postResponse.lastID;
  console.log(playerId);
  response.send("Movie Successfully Added");
});
// API3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const playerQuery = `SELECT
        *
        FROM
        movie
        WHERE
        movie_id = ${movieId};`;
  const playerHistory = await db.get(playerQuery);

  response.send(convertToCamelCase(playerHistory));
});
// API4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateQuery = `UPDATE movie SET director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' WHERE  player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Movie Details Updated");
});
// API5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});
//API6
app.get("/directors/", async (request, response) => {
  const dbQuery = "SELECT * FROM director";
  const teamData = await db.all(dbQuery);

  response.send(teamData.map((each) => directorToCamelCase(each)));
});

//API7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const dbQuery = "SELECT movie_name,director_id FROM movie";
  const teamData = await db.all(dbQuery);

  response.send(teamData);
});

module.exports = express;
