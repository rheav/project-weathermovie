const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
require("dotenv").config();

app.use(cors());

app.use(express.json());

// Get user's locale weather info
app.get("/weather", async (req, res) => {
	const userCity = req.query.city;
	const weatherApiKEY = process.env.NODE_ENV_WEATHER_API_KEY;

	const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKEY}&q=${userCity}&aqi=no`;

	const response = await fetch(url);
	const result = await response.json();
	res.json(result);
});

// Get movie suggestions from OpenAI
app.get("/movie-suggestion", async (req, res) => {
	const bearer = `Bearer ${process.env.NODE_ENV_OPEN_AI_API_KEY}`;
	const queryMode = req.query.queryMode;

	const url = "https://api.openai.com/v1/chat/completions";

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: bearer,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: queryMode,
				},
			],
			temperature: 1,
		}),
	});
	const result = await response.json();
	res.json(result);
});

// Get movie data from TMDB
app.get("/movie-info", async (req, res) => {
	const bearer = `Bearer ${process.env.NODE_ENV_TMDB_API_KEY}`;
	const movieTitle = req.query.movieTitle;

	const url = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: bearer,
		},
	};
	const response = await fetch(url, options);
	const result = await response.json();
	res.json(result);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});