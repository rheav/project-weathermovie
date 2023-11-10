"use strict";

// Global variables to play with the dynamic data
let userCity;
let userCurrentTime;
let userDayOfTheWeek;
let localWeather;
let localTemperature;
let localWeatherExpression;
let fetchedMovies;
let fetchedGenres = [];
let moviesSuggestedRandom = [];
let movieList = [];
let availableStreamingOptions = [];

//const url = "https://moviebyweather.onrender.com";
const url = "http://localhost:3000";

const promptsAccordingToMood = [
	{
		hipster: `First: DONT SEND ANYTHING ELSE BESIDE MOVIE TITLES! AGAIN, ONLY PLACE MOVIE TITLES IN YOUR RESPONSE. Act as a movie curator with decades of experience in cinema and suggest the perfect 20 movies for a ${localWeather} ${userDayOfTheWeek} ${userCurrentTime}, in a ${localWeatherExpression} weather. FOCUS ON UNKNOW MOVIES THAT MIGHT SURPRISE THE PUBLIC. THIS IS IMPORTANT: AVOID POPULAR MAINSTREAM MOVIES. Also  provide only the movie titles, no subtitles, sinopsis or anything. This is important. Also, please avoid ambiguous movies, I need to be able to find the movies only by the title. Don't rush to the conclusion, take your time and be creative. AND PLEASE JUST POST HERE THE MOVIE TITLES, NOT A SINGLE WORD ADDITIONALLY!`,
	},
	{
		mix: `First: DONT SEND ANYTHING ELSE BESIDE MOVIE TITLES! AGAIN, ONLY PLACE MOVIE TITLES IN YOUR RESPONSE. Act as a movie curator with decades of experience in cinema and suggest the perfect 20 movies for a ${localWeather} ${userDayOfTheWeek} ${userCurrentTime}, in a ${localWeatherExpression} weather. Base your choices on popular data around the internet and how people feel about movies, but also bringing some movies outside the popular radar. FOCUS ON MOVIES OUTSIDE THE MAINSTREAM MEDIA, THE MOST DIFFERENT AND UNKNOWN MOVIES BUT WELL RATED, AS POSSIBLE. AVOID MAINSTREAM MEDIA AT ALL COSTS.  Also  provide only the movie titles, no subtitles, sinopsis or anything. This is important. Also, please avoid ambiguous movies, I need to be able to find the movies only by the title. Don't rush to the conclusion, take your time and be creative. AND PLEASE JUST POST HERE THE MOVIE TITLES, NOT A SINGLE WORD ADDITIONALLY!`,
	},
	{
		mainstream: `First: DONT SEND ANYTHING ELSE BESIDE MOVIE TITLES! AGAIN, ONLY PLACE MOVIE TITLES IN YOUR RESPONSE. Act as a movie curator with decades of experience in cinema and suggest the perfect 20 movies for a ${localWeather} ${userDayOfTheWeek} ${userCurrentTime}, in a ${localWeatherExpression} weather. Base your choices on popular data around the internet and how people feel about movies. FOCUS ON MAINSTREAM MEDIA MOVIES, THE CLASSICS AND MOST AWARDED, POPULAR.  Also  provide only the movie titles, no subtitles, sinopsis or anything. This is important. Also, please avoid ambiguous movies, I need to be able to find the movies only by the title. Don't rush to the conclusion, take your time and be creative. AND PLEASE JUST POST HERE THE MOVIE TITLES, NOT A SINGLE WORD ADDITIONALLY!`,
	},
];

let queryMode = promptsAccordingToMood[1].mix;

// DOM elements to manipulate data into the front
const domMovieGallery = document.getElementById("container-movie-gallery");
const domUserCity = document.getElementById("user-city");
const domUserCurrentTime = document.getElementById("user-current-time");
const domUserDayOfTheWeek = document.getElementById("user-day");
const domLocalWeather = document.getElementById("local-weather");
const domLocalTemperature = document.getElementById("local-temperature");
const domLocalWeatherExpression = document.getElementById("local-weather-expression");
const queryModeRangeInput = document.getElementById("queryModeInput");
const queryModeHipster = document.getElementById("inputHipster");
const queryModeMix = document.getElementById("inputMix");
const queryModeMainstream = document.getElementById("inputMainstream");
const domSkeleton = document.querySelectorAll(".skeleton");

const channelImages = {
	disney: "/assets/img/disney.svg",
	hbo: "/assets/img/hbo.png",
	netflix: "/assets/img/netflix.svg",
	prime: "/assets/img/prime.png",
};

const movieGenres = [
	{
		id: 28,
		name: "Action",
	},
	{
		id: 12,
		name: "Adventure",
	},
	{
		id: 16,
		name: "Animation",
	},
	{
		id: 35,
		name: "Comedy",
	},
	{
		id: 80,
		name: "Crime",
	},
	{
		id: 99,
		name: "Documentary",
	},
	{
		id: 18,
		name: "Drama",
	},
	{
		id: 10751,
		name: "Family",
	},
	{
		id: 14,
		name: "Fantasy",
	},
	{
		id: 36,
		name: "History",
	},
	{
		id: 27,
		name: "Horror",
	},
	{
		id: 10402,
		name: "Music",
	},
	{
		id: 9648,
		name: "Mystery",
	},
	{
		id: 10749,
		name: "Romance",
	},
	{
		id: 878,
		name: "Science Fiction",
	},
	{
		id: 10770,
		name: "TV Movie",
	},
	{
		id: 53,
		name: "Thriller",
	},
	{
		id: 10752,
		name: "War",
	},
	{
		id: 37,
		name: "Western",
	},
];

const rangeSliderManagement = () => {
	if (queryModeRangeInput.value < 4000) {
		queryModeHipster.classList.add("opacity-1");
		queryModeHipster.classList.remove("opacity-0");
		queryModeMix.classList.add("opacity-0");
		queryModeMainstream.classList.add("opacity-0");
	} else if (queryModeRangeInput.value > 3000 && queryModeRangeInput.value < 7000) {
		queryModeHipster.classList.add("opacity-0");
		queryModeMix.classList.add("opacity-1");
		queryModeMix.classList.remove("opacity-0");
		queryModeMainstream.classList.add("opacity-0");
	} else {
		queryModeHipster.classList.add("opacity-0");
		queryModeMix.classList.add("opacity-0");
		queryModeMainstream.classList.add("opacity-1");
		queryModeMainstream.classList.remove("opacity-0");
	}
};

const lastValueSlider = () => {
	if (queryModeRangeInput.value < 4000) {
		fetchedMovies;
		fetchedGenres = [];
		moviesSuggestedRandom = [];
		movieList = [];
		availableStreamingOptions = [];
		queryMode = promptsAccordingToMood[0].hipster;
		domMovieGallery.replaceChildren();
		getWeatherInfo();
	} else if (queryModeRangeInput.value > 3000 && queryModeRangeInput.value < 7000) {
		fetchedMovies;
		fetchedGenres = [];
		moviesSuggestedRandom = [];
		movieList = [];
		availableStreamingOptions = [];
		queryMode = promptsAccordingToMood[1].mix;
		domMovieGallery.replaceChildren();
		getWeatherInfo();
	} else {
		fetchedMovies;
		fetchedGenres = [];
		moviesSuggestedRandom = [];
		movieList = [];
		availableStreamingOptions = [];
		queryMode = promptsAccordingToMood[2].mainstream;
		domMovieGallery.replaceChildren();
		getWeatherInfo();
	}
};

window.rangeSliderManagement = rangeSliderManagement;
window.lastValueSlider = lastValueSlider;

//# Ler horário
const getUserTime = function () {
	const today = new Date();
	const timeHour = today.getHours();
	const timeDay = today.getDay();
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	userDayOfTheWeek = days[timeDay];
	//console.log(userDayOfTheWeek);

	domUserDayOfTheWeek.innerText = userDayOfTheWeek.toLowerCase();

	if (timeHour > 5 && timeHour < 12) {
		userCurrentTime = "morning";
	} else if (timeHour >= 12 && timeHour < 18) {
		userCurrentTime = "afternoon";
	} else if (timeHour >= 18 && timeHour < 20) {
		userCurrentTime = "evening";
	} else if (timeHour >= 20 && timeHour <= 23) {
		userCurrentTime = "night";
	} else {
		userCurrentTime = "late night";
	}

	domUserCurrentTime.innerText = userCurrentTime;
};

// Fade in nos skeleton
const fadeInSkeleton = () => {
	domSkeleton.forEach((element) => {
		element.classList.remove("opacity-0");
	});
};

// Fade out nos skeleton
const fadeOutSkeleton = () => {
	domSkeleton.forEach((element) => {
		element.classList.add("opacity-0");
	});
};

//# Ler IP
const getIpInfo = async function () {
	const fetchUrl = `https://ipapi.co/json`;
	const response = await fetch(fetchUrl);
	const result = await response.json();
	console.log(result);

	// Pass data to the DOM
	userCity = result.city;
	domUserCity.innerText = userCity;

	// Call getWeather to access the City
	getWeatherInfo();
};

//# Obter clima e temperatura
const getWeatherInfo = async function () {
	const fetchUrl = `${url}/weather?city=${userCity}`;
	const response = await fetch(fetchUrl);
	const result = await response.json();
	console.log(result);
	// Passar dados para o DOM
	localWeather = result.current.condition.text;
	domLocalWeather.innerText = localWeather.toLowerCase();

	// Tratar a temperatura e usar expressão baseado na temperatura atual
	localTemperature = result.current.feelslike_c;

	if (localTemperature >= 29) {
		localWeatherExpression = "hot";
	} else if (localTemperature < 29 && localTemperature >= 26) {
		localWeatherExpression = "warm";
	} else if (localTemperature < 26 && localTemperature >= 23) {
		localWeatherExpression = "mild";
	} else if (localTemperature < 23 && localTemperature >= 15) {
		localWeatherExpression = "chilly";
	} else if (localTemperature < 15) {
		localWeatherExpression = "freezing";
	}

	domLocalWeatherExpression.innerText = localWeatherExpression;

	getMovieSuggestions();
};

//# Passar query para OpenAI e obter sugestões de filmes
const getMovieSuggestions = async function () {
	const fetchUrl = `${url}/movie-suggestion?queryMode=${queryMode}`;
	//console.log(queryMode);

	const response = await fetch(fetchUrl);

	const result = await response.json();
	result.choices[0].message.content;

	//  Tratando retorno da OpenAI e transformando em array limpa
	fetchedMovies = result.choices[0].message.content.split("\n").map((movie) => movie.replace(/^\d+\.\s+/, "").replace(/^"(.*)"$/, "$1")); // removing listing numbers and extra quotation marks

	const randomMoviePicker = (movieCount) => {
		const moviesCopy = [...fetchedMovies]; // Create a copy of the original movies array

		for (let i = 0; i < movieCount; i++) {
			if (moviesCopy.length === 0) {
				// If all movies have been picked, break out of the loop
				break;
			}

			const randomIndex = Math.floor(Math.random() * moviesCopy.length);
			const randomMovie = moviesCopy.splice(randomIndex, 1)[0]; // Remove the selected movie from the copy
			moviesSuggestedRandom.push(randomMovie);
		}

		return moviesSuggestedRandom;
	};

	randomMoviePicker(12);
	//console.log(moviesSuggestedRandom);

	fetchMoviesAsync(moviesSuggestedRandom);
	//console.log(moviesSuggestedRandom);
};

const fetchMoviesAsync = async (moviesToBeSearched) => {
	for (const movieTitle of moviesToBeSearched) {
		await getMovie(movieTitle);
	}
	fadeOutSkeleton();
	domMovieGallery.replaceChildren();

	movieList.map((movie, index) => {
		cardBuilder(movie, index);
	});
};

// Agora eu vou buscar os filmes pelo título, e pra cada título vou fazer uma query. Vou usar um map na função de getMovieSuggestions pra cada movie da array
//# Buscar os filmes a partir do título na TMDBmovieTitle
const getMovie = async function (movieTitle) {
	const fetchUrl = `${url}/movie-info?movieTitle=${movieTitle}`;

	// Make request, storing response
	const response = await fetch(fetchUrl);

	// Decode JSON response
	const result = await response.json();
	//console.log(result);

	const movieData = result.results[0];
	// Output in console
	movieList.push(movieData);
};

/* const getStreamingAvailability = async (tmdbId) => {
	const fetchUrl = `https://streaming-availability.p.rapidapi.com/get/basic?country=br&tmdb_id=movie%2F${tmdbId}&output_language=en`;
	const options = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": apiKeys.streamingAvalKEY,
			"X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
		},
	};

	try {
		const response = await fetch(fetchUrl, options);
		const result = await response.json();
		let streamingChannelsReturned;
		streamingChannelsReturned = Object.keys(result.streamingInfo);
		//console.log(streamingChannelsReturned);
		return streamingChannelsReturned;
	} catch (error) {
		console.error(error);
	}
}; */

//! Criação dos cards dos filmes
const cardBuilder = async function (chosenMovie, index) {
	/* const streamingChannelsReturned = await getStreamingAvailability(chosenMovie.id);

	console.log(streamingChannelsReturned); */
	// Bloco principal do Card
	const card = document.createElement("article");
	card.setAttribute(
		"class",
		"relative flex flex-col h-full transition duration-300 ease-in w-full max-w-[400px] mx-auto cursor-pointer group border-4 border-transparent rounded-xl hover:border-4 hover:border-[rgba(120,119,198,0.8)] hover:shadow-xl hover:shadow-[rgba(120,119,198,0.8)] "
	);
	card.classList.add("opacity-0");

	// Imagem poster do filme
	const cardPosterImg = document.createElement("img");
	cardPosterImg.setAttribute("src", `${chosenMovie?.poster_path ? `https://image.tmdb.org/t/p/w500/${chosenMovie.poster_path}` : "/assets/img/placeholderPoster.jpeg"}`);
	cardPosterImg.setAttribute("class", "object-contain	w-full h-auto max-w-full max-h-full transition duration-300 ease-in rounded-t-lg");
	cardPosterImg.classList.add("opacity-0");

	// Bloco do título, tags e sinopse
	const cardInfo = document.createElement("div");
	cardInfo.setAttribute(
		"class",
		" flex px-3 pt-3 pb-4 w-full flex-col rounded-b-lg h-44 md:h-52 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]  transition duration-300 ease-in"
	);
	cardInfo.classList.add("opacity-0");

	// Bloco para Notas e Popularidade
	const cardInfoVotesAndPop = document.createElement("div");
	cardInfoVotesAndPop.setAttribute("class", "flex items-center mb-1");

	// Popularidade
	const cardInfoPop = document.createElement("span");
	cardInfoPop.setAttribute(
		"class",
		`${parseFloat(chosenMovie.popularity.toPrecision(4)) < 50 ? "text-red-400" : chosenMovie.popularity.toPrecision(4) <= 60 ? "text-white" : "text-lime-400"} text-xs font-bold mr-4`
	);
	cardInfoPop.innerText = chosenMovie.popularity.toPrecision(4);

	// Popularidade Icon
	const popIcon = document.createElement("i");
	popIcon.setAttribute(
		"class",
		`${
			parseFloat(chosenMovie.popularity.toPrecision(4)) < 50 ? "text-red-400" : parseFloat(chosenMovie.popularity.toPrecision(4)) <= 60 ? "text-white" : "text-lime-400"
		} tiny material-icons mr-1 scale-75 `
	);
	popIcon.innerHTML = `${parseFloat(chosenMovie.popularity.toPrecision(4)) < 50 ? "trending_down" : chosenMovie.popularity.toPrecision(4) <= 60 ? "trending_flat" : "trending_up"}`;

	// Votos (nota)
	const cardInfoVotes = document.createElement("span");
	cardInfoVotes.setAttribute("class", "text-xs font-bold text-amber-200");
	3;
	cardInfoVotes.innerText = chosenMovie.vote_average.toPrecision(3);

	// Votes Icon
	const votesIcon = document.createElement("i");
	votesIcon.setAttribute("class", "tiny material-icons mr-1 scale-75 text-amber-200");

	votesIcon.innerHTML = `${parseFloat(chosenMovie.vote_average.toPrecision(3)) < 4 ? "star_border" : chosenMovie.vote_average.toPrecision(3) <= 6 ? "star_half" : "star"}`;

	// Título
	const cardInfoTitle = document.createElement("h2");
	cardInfoTitle.setAttribute("class", "col-span-4 text-lg xl:text-xl font-bold text-white whitespace-normal mb-1 transition duration-300 group-hover:text-[rgb(159, 157, 255)]");
	cardInfoTitle.innerText = chosenMovie.title;

	// Lançamento
	const cardInfoReleaseDate = document.createElement("h6");
	cardInfoReleaseDate.setAttribute("class", "basis-full col-span-4 text-sm xl:text-normal mb-4 font-thin text-white whitespace-normal transition duration-300");

	cardInfoReleaseDate.innerText = chosenMovie.release_date.slice(0, 4);

	// Grupo de tags do gênero
	const cardInfoGenres = document.createElement("div");
	cardInfoGenres.setAttribute("class", "flex  flex-wrap");

	// Tag de gênero
	chosenMovie.genre_ids.map((moviesGenreId) => {
		const cardInfoGenresTag = document.createElement("span");
		cardInfoGenresTag.setAttribute(
			"class",
			" justify-center col-span-1 px-2 py-1 mb-1 mr-2 text-[0.625rem] xl:text-xs font-base text-white border border-[rgba(120,119,198,0.5)] rounded-lg transition duration-300 group-hover:bg-[rgba(120,119,198,0.6)]"
		);

		let matchedGenre = movieGenres.find((genre) => genre.id === moviesGenreId);
		matchedGenre ? (cardInfoGenresTag.innerText = matchedGenre.name) : (cardInfoGenresTag.innerText = "teste");

		cardInfoGenres.appendChild(cardInfoGenresTag);
	});

	// Streamings disponíveis
	/* 	const cardInfoStreamings = document.createElement("div");
	cardInfoStreamings.setAttribute("class", "flex items-center flex-wrap");

	streamingChannelsReturned.map((streaming) => {
		const cardInfoStreamingTag = document.createElement("span");
		cardInfoStreamingTag.setAttribute("class", "justify-start col-span-1 px-2 py-1 mb-1 mr-2");
		cardInfoStreamingTag.innerText = streaming;

		// Check if the channel name exists in the channelImages object
		if (channelImages[streaming]) {
			const channelImage = document.createElement("img");
			channelImage.setAttribute("class", "w-[50px] transition duration-300 hover:scale-125");
			channelImage.setAttribute("src", channelImages[streaming]);
			channelImage.setAttribute("alt", streaming);

			// Append the image element to the tag element
			cardInfoStreamingTag.appendChild(channelImage);
		}

		cardInfoStreamings.appendChild(cardInfoStreamingTag);
	}); */

	// Container Sinopse do filme
	const cardSinopse = document.createElement("div");
	cardSinopse.setAttribute(
		"class",
		"absolute top-0 flex z-50 px-4 py-8 text-sm font-normal transition duration-300 ease-in bg-[rgba(120,119,198,0.5)] opacity-0 backdrop-blur-md  border border-[rgba(120,119,198,0.5)] rounded-t-lg shadow-xl group-hover:bg-opacity-40 group-hover:opacity-100 group-hover:backdrop-blur-md"
	);

	// Conteúdo Sinopse
	const cardSinopseContent = document.createElement("caption");
	cardSinopseContent.setAttribute("class", "text-left text-white");
	cardSinopseContent.innerText = chosenMovie.overview;

	// Card dentro da galeria
	domMovieGallery.appendChild(card);

	// Imagem poster dentro do bloco
	card.appendChild(cardPosterImg);

	// Bloco do título, tags e sinopse dentro do card
	card.appendChild(cardInfo);

	// Votes e Popularidade dentro do Info
	cardInfo.appendChild(cardInfoVotesAndPop);

	// Popularidade no votesAndPop
	cardInfoVotesAndPop.appendChild(popIcon);
	cardInfoVotesAndPop.appendChild(cardInfoPop);

	// Votes no votesAndPop
	cardInfoVotesAndPop.appendChild(votesIcon);
	cardInfoVotesAndPop.appendChild(cardInfoVotes);

	// Título dentro do Information
	cardInfo.appendChild(cardInfoTitle);

	// Release Date
	cardInfo.appendChild(cardInfoReleaseDate);

	// Tags Gênero dentro do Information
	cardInfo.appendChild(cardInfoGenres);

	/* // Tags Streaming disponíveis dentro do Information
	cardInfo.appendChild(cardInfoStreamings); */

	// Container Sinopse
	card.appendChild(cardSinopse);

	// Conteúdo Sinopse
	cardSinopse.appendChild(cardSinopseContent);

	setTimeout(() => {
		card.classList.remove("opacity-0");
		cardPosterImg.classList.remove("opacity-0");
		cardInfo.classList.remove("opacity-0");
	}, 700); // Adjust the delay as needed
};

const createMovieArticle = () => {
	// Card do filme
	const skeletonCard = document.createElement("article");
	skeletonCard.className = "relative flex flex-col h-full transition duration-700 ease-in-out w-full max-w-[400px] mx-auto cursor-pointer group border-4 border-transparent rounded-xl ";

	// Movie poster do skeleton
	const skeletonPoster = document.createElement("img");
	skeletonPoster.src = "https://raw.githubusercontent.com/rheav/project-weathermovie/main/assets/img/placeholderPoster.jpeg";
	skeletonPoster.className = "object-contain w-full h-auto max-w-full max-h-full transition duration-700 ease-in rounded-t-lg brightness-50 animate-pulse";

	// Bloco de info do skeleton
	const skeletonInfo = document.createElement("div");
	skeletonInfo.className =
		"flex px-3 pt-6 pb-4 w-full flex-col rounded-b-lg h-44 md:h-52 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] transition duration-700 ease-in";

	// bloco de votos e popularidade dentro do info
	const skeletonVotesNPop = document.createElement("div");
	skeletonVotesNPop.className = "flex items-center gap-6 mb-1 animate-pulse";

	// div pra cada vote N pop
	const voteNpop1 = document.createElement("div");
	voteNpop1.className = "col-span-4 h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4";
	const voteNpop2 = document.createElement("div");
	voteNpop2.className = "col-span-4 h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4";

	// title skeleton
	const skeletonTitle = document.createElement("div");
	skeletonTitle.className = "col-span-4 h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-3/4 my-4 animate-pulse";

	// year skeleton
	const skeletonYear = document.createElement("div");
	skeletonYear.className = "col-span-4 h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4 animate-pulse";

	// genre badges wrapper skeleton
	const skletonGenreBadWrapper = document.createElement("div");
	skletonGenreBadWrapper.className = "flex flex-wrap gap-4 mt-[5.5rem] animate-pulse";

	// genre badges skeleton
	const genreBadge1 = document.createElement("div");
	genreBadge1.className = "h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4";
	const genreBadge2 = document.createElement("div");
	genreBadge2.className = "h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4";
	const genreBadge3 = document.createElement("div");
	genreBadge3.className = "h-2 bg-[rgba(120,119,198,0.3)] rounded-full w-1/4";

	domMovieGallery.appendChild(skeletonCard);
	skeletonCard.appendChild(skeletonPoster);
	skeletonCard.appendChild(skeletonInfo);
	skeletonInfo.appendChild(skeletonVotesNPop);
	skeletonInfo.appendChild(skeletonTitle);
	skeletonInfo.appendChild(skeletonYear);
	skeletonInfo.appendChild(skletonGenreBadWrapper);
	skeletonVotesNPop.appendChild(voteNpop1);
	skeletonVotesNPop.appendChild(voteNpop2);
	skletonGenreBadWrapper.appendChild(genreBadge1);
	skletonGenreBadWrapper.appendChild(genreBadge2);
	skletonGenreBadWrapper.appendChild(genreBadge3);
};

// Invoking all functions
setTimeout(fadeInSkeleton, 500);

getIpInfo();
getUserTime();
const createMovieArticlesRepeatedly = () => {
	// Call createMovieArticle eight times with a delay of 500ms between each call
	for (let i = 0; i < 8; i++) {
		setTimeout(createMovieArticle, i * 500);
	}
};

createMovieArticlesRepeatedly();
