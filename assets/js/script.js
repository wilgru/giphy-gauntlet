const gifContainers = document.querySelectorAll(".gif-container")
// const buttons = {
// 	home: {
// 		startBtn: document.getElementById("start-game-btn"),
// 		statsBtn: document.getElementById("homepage-stats-btn"),
// 		colourBtn: document.getElementById("colour-btn"),
// 		aboutBtn: document.getElementById("about-btn")
// 	},
// 	gameOver : {

// 	}
// }

const buttons = {
	home: [
		{key: "playBtn", text: "Play", id: "play-btn"},
		{key: "statsBtn", text: "Stats", id: "homepage-stats-btn"},
		{key: "colourBtn", text: "Colour", id: "colour-btn"},
		{key: "aboutBtn", text: "about", id: "about-btn"}
	],
	gameOver: [
		{text: "Play Again", id: "play-again-btn"},
		{text: "Game Stats", id: "game-over-stats-btn"},
		{text: "Home", id: "home-btn"},
		{text: "", id: "other-btn"}
	]
}

const cards = {
	homeStats: [

	],
	gameOverStats: [

	]
}

let dynamicBlockElements = {}

const numGifs = gifContainers.length
let currentRound = {}
let nextRound = {}
const words = [
	"happy",
	"sad",
	"angry",
	"scared",
	"excited",
	"love",
	"lonely",
	"cringe",
	"book",
	"water",
	"nature",
	"justice",
	"hell",
	"heaven",
	"car",
	"baby",
	"space",
	"chair"
]

// initial function
function init() {
	showButtons(buttons.home)
	cascade(
		0,
		1,
		4, 
		index => elementFadeIn(gifContainers[index]),
		()=>{}
	)
}
init()

// start game function
function startGame() {
	hideButtons()
	
	prepareNextRound()
	setTimeout(() => {
		roundTransition()
	}, 500);
}

// start the game countdown
function startCountdown() {

}

// return random/s word from a given list
function returnRandomFromArray(wordsArray, num) {
	var randomIndex;

	if (num === 1) {
		var randomWord;
		while(randomWord === undefined) {
			randomIndex = Math.floor(Math.random() * wordsArray.length);
			randomWord = wordsArray[randomIndex]
			return randomWord;
		}
	} else {
		var randomWordList = [];
		while(randomWordList.length < num) {
			randomIndex = Math.floor(Math.random() * wordsArray.length);
			randomWord = wordsArray[randomIndex]
			if (!randomWordList.includes(randomWord)) {
				randomWordList.push(randomWord);
			}
		}
		return randomWordList;
	}
}

// show the buttons that have been parsed
function showButtons(btnSet) {
	const btnBlockTemplate = ({ text, id }) => `
	<btn class="col-container btn-block" id="${id}">
			${text}
	</btn>
	`

	gifContainers.forEach(
		(container, index) => {
				container.innerHTML = btnBlockTemplate(btnSet[index])
				dynamicBlockElements[btnSet[index].key] = document.getElementById(btnSet[index].id)
			}
		)
}

// hide any buttons currently on the page
function hideButtons() {
	for (const btnKey in dynamicBlockElements) {
		dynamicBlockElements[btnKey].style.display = "none";
	}

	dynamicBlockElements = {}
}

// fade element in with box shadow
function elementFadeIn(el) {
	el.style.opacity = "100"

	setTimeout(() => {
		el.style.boxShadow = "var(--dark) 5px 5px"
	}, 100);
}

// fade element out
function elementFadeOut(el) {
	el.style.boxShadow = "var(--dark) 0 0"

	setTimeout(() => {
		el.style.opacity = "0" 
	}, 100);
}

// cascade fade the gifs out
function fadeGifsOut() {
	cascade(
		numGifs-1,
		-1,
		numGifs, 
		index => elementFadeOut(gifContainers[index]),
		loadNextRound
	)
}

// cascade fade the gifs in
function fadeGifsIn() {
	cascade(
		0,
		1,
		numGifs, 
		index => elementFadeIn(gifContainers[index]),
		prepareNextRound
	)
}

// 
function roundTransition() {
	fadeGifsOut()

	setTimeout(() => {
		fadeGifsIn()
	}, 500);
}

// do the api call to giphy api, ready for next round
function prepareNextRound() {
	nextRound = {}

	const randomWord = returnRandomFromArray(words, 1)
	nextRound.answer = randomWord

	fetch("https://api.giphy.com/v1/gifs/search?api_key="+GIPHY_API_KEY+"&q="+randomWord+"&limit=50&offset=0&rating=g&lang=en")
	.then(res => res.json())
	.then(
		data => {
			nextRound.urls = returnRandomFromArray(data.data, 4)
		}
	)
}

// get everything all the gifs that were prepared and load them 
function loadNextRound() {
	gifContainers.forEach(
		(item, key) => item.style.backgroundImage = `url("${nextRound.urls[key].images.original.url}")`
	)
}

// execute a parsed function in intervals
function cascade(start, increment, max, funct, callb) {
	let index = start;

	function innerCascade(max, funct, callb) {
		setTimeout(() => {
		if (max > 0) {
			funct(index)
			index = index + increment

			innerCascade(max-1, funct, callb)
		} else {
			callb()
			}
		}, 100)
	}
	innerCascade(max, funct, callb)
}