const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(
	cors({
		origin: ["https://moviebyweather-un1s.onrender.com", "http://127.0.0.1:5501"],
	})
);
app.use(express.json());

// Get user's locale weather info
app.get("/weather", async (req, res) => {
	try {
		const userCity = req.query.city;
		const weatherApiKEY = process.env.NODE_ENV_WEATHER_API_KEY;

		const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKEY}&q=${userCity}&aqi=no`;

		const response = await fetch(url);
		const result = await response.json();
		res.json(result);
	} catch (error) {
		console.log(error);
		console.error("Error in /weather route:", error);
		res.status(500).json({ error: "An error occurred" });
	}
});

// Get movie suggestions from OpenAI
app.get("/movie-suggestion", async (req, res) => {
	try {
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
				temperature: 0.5,
			}),
		});
		const result = await response.json();
		console.log(result);
		res.json(result);
	} catch (error) {
		console.error("Error in /movie-suggestion route:", error);
		res.status(500).json({ error: "An error occurred" });
	}
});

// Get movie data from TMDB
app.get("/movie-info", async (req, res) => {
	try {
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
		res.json(result); // Send the response once
	} catch (error) {
		console.error("Error in /movie-info route:", error);
		res.status(500).json({ error: "An error occurred" });
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
