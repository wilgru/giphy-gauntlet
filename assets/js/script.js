// elements
const gifContainers = document.querySelectorAll(".gif-container")
const headerRow = document.getElementById("header-row")
const headerTitle = document.getElementById("header-title")
const timeInfo = document.querySelector(".time-info")
const scoreInfo = document.querySelector(".score-info")
const guessform = document.getElementById("guess-form")
const guessInput = document.getElementById("guess-input")
const headerChildren = {
	title: {
		element: headerRow.children[0],
		shadow: false
	},
	roundInfoSimple: {
		element: headerRow.children[1],
		shadow: true
	},
	roundInfoAdvanced: {
		element: headerRow.children[2],
		shadow: true
	},
	gameOverTitle: {
		element: headerRow.children[3],
		shadow: true
	}
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
		{key: "playAgainBtn", text: "Play Again", id: "play-again-btn"},
		{key: "gameStatsBtn", text: "Game Stats", id: "game-over-stats-btn"},
		{key: "homeBtn", text: "Home", id: "home-btn"},
		{key: "otherBtn", text: "", id: "other-btn"}
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
	"music",
	"computer"
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
	homeScreen()
}
init()

// start game function
function startGame() {
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		blockAndWait(hideButtons, fadeGifsIn, startCountdown, loadNextRound, prepareNextRound)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["roundInfoSimple"])
			elementFadeIn(guessInput)
		}, 250)
	}, 500);
}

// home screen
function homeScreen() {
	prepareNextRound()
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		showButtons(buttons.home)
		cascade(gifContainers, el => elementFadeIn(el), false)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["title"])
		}, 250)
	}, 500);
}

// call at end of game
function gameOver() {
	fadeGifsOut()
	elementFadeOut(guessInput)

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		showButtons(buttons.gameOver)
		cascade(gifContainers, el => elementFadeIn(el), false)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["gameOverTitle"])
		}, 250)
	}, 500);
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

// start the game countdown
function startCountdown() {
	timeLeft = totalTime

	const timer = setInterval(() => {
		timeLeft--
		timeInfo.innerHTML = (timeLeft/100).toFixed(2)
		if (timeLeft === 0){
			clearInterval(timer)
			gameOver()
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
		el.style.opacity = 1
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
			el.style.opacity = 0
		}, 100);
	})
}

// choose which child of te header tag to display
function switchHeaderDisplay(headerEl) {
	const desiredEl = headerEl.element
	for (header in headerChildren) {
		headerChildren[header].element.style.display = "none"
	}
	desiredEl.style.display = "flex"
}

// fade header in
function headerFadeIn(headerEl) {
	switchHeaderDisplay(headerEl)
	headerEl.element.style.opacity = 1
	setTimeout(() => {
		if (headerEl.shadow) headerEl.element.style.boxShadow = "var(--dark) 5px 5px"
	}, 100);
}

// fade header out
function headerFadeOut() {
	for(header in headerChildren){
		if (headerChildren[header].shadow) headerChildren[header].element.style.boxShadow = "var(--dark) 0 0"
	}
	setTimeout(() => {
		for(header in headerChildren){
			headerChildren[header].element.style.opacity = 0
		}
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
	const cleanWord = word.toLowerCase().trim()
	return cleanWord
}

// check input
function checkGuessCorrect(guess) {
	if (guess === currentRoundWord){
		console.log("Correct!")
		tempStyler(guessInput, "backgroundColor", "green")
		roundTransition()
	} else {
		console.log("Incorrect!")
		tempStyler(guessInput, "backgroundColor", "red")
	}
}

// temporary styling for given element
function tempStyler(el, styleProp, value) {
	originalValue = el.style[styleProp]

	el.style[styleProp] = value

	setTimeout(() => {
		el.style[styleProp] = originalValue
	}, 500);
}

// event listeners
gifContainers.forEach(container => {
	container.addEventListener("click", (event) => {
		const clickedContainer = event.target

		if (clickedContainer.id === "play-btn") {
			startGame()
		}

		switch (clickedContainer.id) {
			case "play-btn":
				startGame()
				break;
			case "play-again-btn":
				startGame()
				break;
			case "home-btn":
				homeScreen()
				break;
		}
	})
})

guessform.addEventListener("submit", (event) => {
	event.preventDefault()
	let guess = cleanInput(guessInput.value)
	guessInput.value = ""

	checkGuessCorrect(guess)
})