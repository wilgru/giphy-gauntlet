const gifContainers = document.querySelectorAll(".gif-container")

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
	"chair",
	"video game",
	"animal",
	"music"
]
const numGifContainers = gifContainers.length
const time = 60000;

let score = 0
let dynamicBlockElements = {}
let currentRound = {}
let nextRound = {}
let nextRoundPrepared = false

// initial function
function init() {
	prepareNextRound()
	showButtons(buttons.home)
	cascade(gifContainers, el => elementFadeIn(el), false)
}
init()

// start game function
function startGame() {
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then begin to wait for next round to be ready to load
	setTimeout(() => {
		blockAndWait(hideButtons, fadeGifsIn, startCountdown, loadNextRound, prepareNextRound)
	}, 500);
}

// start the game countdown
function startCountdown() {

}

// execute parsed function once the next round is finished preparing
function blockAndWait(...functionArray) {
	const waiter = setInterval(() => {
		if (nextRoundPrepared === true) {
			nextRoundPrepared = false;
			clearInterval(waiter)
			functionArray.forEach(funct => funct())
		}
	}, 100)
}

// return random word/s from a given list
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
	cascade(gifContainers, el => elementFadeOut(el), true)
}

// cascade fade the gifs in
function fadeGifsIn() {
	cascade(gifContainers, el => elementFadeIn(el), false)
}

// transition between round
function roundTransition() {
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then begin to wait for next round to be ready to load
	setTimeout(() => {
		blockAndWait(loadNextRound, fadeGifsIn, prepareNextRound)
	}, 500);
}

// do the api call to giphy api, ready for next round
function prepareNextRound() {
	console.log("preparing next round...")

	const randomWord = returnRandomFromArray(words, 1)
	nextRound = {}
	nextRound.answer = randomWord

	fetch("https://api.giphy.com/v1/gifs/search?api_key="+GIPHY_API_KEY+"&q="+randomWord+"&limit=50&offset=0&rating=g&lang=en")
	.then(res => res.json())
	.then(
		data => {
			nextRound.urls = returnRandomFromArray(data.data, numGifContainers)
			nextRoundPrepared = true
			console.log("Next round ready!")
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
function cascade(array, forEachLikeFunc, reverse=false) {
	let localArray = [...array]
	var index = 0

	if (reverse===true) {
		localArray.reverse()
	}

	const cascadeInterval = setInterval(() => {
		forEachLikeFunc(localArray[index])	
		index++

		if (index === localArray.length) {
			clearInterval(cascadeInterval)
		}
	}, 100)
}