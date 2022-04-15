// elements
const gifContainers = document.querySelectorAll(".gif-container")
const headerRow = document.getElementById("header-row")
const headerTitle = document.getElementById("header-title")
const timeInfo = document.querySelector(".time-info")
const scoreInfo = document.querySelector(".score-info")
const guessform = document.getElementById("guess-form")
const guessInput = document.getElementById("guess-input")
const headerChildren = {
	title: headerRow.children[0],
	roundInfoSimple: headerRow.children[1],
	roundInfoAdvanced: headerRow.children[2]
}
//this is an array of the elements in the headerchildren object. It exists so that it can be spread out as arguenments for the fade in/out functions. 
//this is done so that the switch header display function only worries about changing the element currently displayed, but does not interefere with the opacity at all.
const headerChildrenArrayOfEls = Object.values(headerChildren)

// global static vars
const numGifContainers = gifContainers.length
const totalTime = 6000;
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

// game play vars
let score = 0
let dynamicBlockElements = {}
let currentRound = {}
let currentRoundWord = ""
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

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		elementFadeOut(...headerChildrenArrayOfEls) 
		blockAndWait(hideButtons, fadeGifsIn, startCountdown, loadNextRound, prepareNextRound)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			switchHeaderDisplay("roundInfoSimple")

			// wait 50ms for header to be changed then fade in new header
			setTimeout(()=>{
				elementFadeIn(...headerChildrenArrayOfEls)
				elementFadeIn(guessInput)
			}, 50)
		}, 250)
	}, 500);
}

// start the game countdown
function startCountdown() {
	timeLeft = totalTime

	const timer = setInterval(() => {
		timeLeft--
		timeInfo.innerHTML = (timeLeft/100).toFixed(2)

		if (timeLeft === 0){
			clearInterval(timer)
		}
	}, 10);
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

// choose which child of te header tag to display
function switchHeaderDisplay(childIndex) {
	const desiredEl = headerChildren[childIndex]
	for (key in headerChildren) {
		headerChildren[key].style.display = "none"
	}
	desiredEl.style.display = "flex"
}

// hide any buttons currently on the page
function hideButtons() {
	for (const btnKey in dynamicBlockElements) {
		dynamicBlockElements[btnKey].style.display = "none";
	}
	dynamicBlockElements = {}
}

// fade element in with box shadow
function elementFadeIn(...els) {
	els.forEach(el => {
		el.style.opacity = "1"

		setTimeout(() => {
			el.style.boxShadow = "var(--dark) 5px 5px"
		}, 100);
	})
}

// fade element out
function elementFadeOut(...els) {
	els.forEach(el => {
		el.style.boxShadow = "var(--dark) 0 0"

		setTimeout(() => {
			el.style.opacity = "0" 
		}, 100);
	})
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
	score++
	scoreInfo.innerHTML = `Score: ${score}`

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
	currentRound = nextRound
	currentRoundWord = currentRound.answer

	gifContainers.forEach(
		(item, key) => item.style.backgroundImage = `url("${currentRound.urls[key].images.original.url}")`
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

// cleanup input
function cleanInput(word) {
	const cleanWord = word.toLowerCase.trim()
	return cleanWord
}

// event listeners
gifContainers.forEach(container => {
	container.addEventListener("click", (event) => {
		const clickedContainer = event.target

		if (clickedContainer.id === "play-btn") {
			startGame()
		}
	})
})

guessform.addEventListener("submit", (event) => {
	event.preventDefault()
	let guess = cleanInput(guessInput.value)
	
})