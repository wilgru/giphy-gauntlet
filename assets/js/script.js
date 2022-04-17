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
// const headerChildrenArrayOfEls = Object.values(headerChildren)
// GG_DATA = {
// 	highestScore: 0,
// 	highestScoreDate: 0,
// 	guessesCorrect: 0,
// 	guessesIncorrect: 0,
// 	gps: 0
// }

// 
const pages = {
	home: {
		headerEl: "",
		tileType: "buttons",
		typeSet: buttons.home,
		showInput: false
	}
}

currentPageSchhedule = []

function renderPage(page) {

}

// global static vars
const delay = 100
const numGifContainers = gifContainers.length
const totalTime = 60;
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
		{key: "highScoreCard", text: {title: "High Score:", data: "--", subTitle: "--/--/--"}, id: "high-score-card"},
		{key: "accuracyCard", text: {title: "Accuracy:", data: "--", subTitle: "✔︎ -- | ✗ --" }, id: "accuracy-card"},
		{key: "gifsPerSecCard", text: {title: "Gifs per Sec:", data: "--", subTitle: "gps" }, id: "gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	gameOverStats: [
		{key: "gameOverScoreCard", text: {title: "Score:", data: "--", subTitle: "+/-" }, id: "game-over-score-card"},
		{key: "gameOveraccuracyCard", text: {title: "Accuracy:", data: "--", subTitle: "+/-" }, id: "game-over-accuracy-card"},
		{key: "gameOvergifsPerSecCard", text: {title: "Gifs per Sec:", data: "--", subTitle: "+/-" }, id: "game-over-gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	aboutInfo: [
		{key: "authorCard", text: {title: "Author", data: "William Gruszka", subTitle: "" }, id: "game-over-score-card"},
		{key: "linksCard", text: {title: "Find out more", data: "<a href='https://github.com'>Github.com</a>", subTitle: "" }, id: "game-over-accuracy-card"},
		{key: "Api", text: {title: "made using", data: "<a href='https://giphy.com'>Giphy API</a>", subTitle: "" }, id: "game-over-gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
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

// game play ad page vars
let dynamicBlockElements = {}
let currentTopPage = "home"
let currentRound = {}
let currentRoundWord = ""
let score = 0
let nextRound = {}
let nextRoundPrepared = false

// initial function
function init() {
	homeScreen()
}
init()

// home screen
function homeScreen() {
	currentTopPage = "home"
	prepareNextRound()
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		showButtons(buttons.home)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["title"])
			fadeGifsIn()
		}, 500)
	}, 650);
}

// start game function
function startGame() {
	currentTopPage = "game"
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["roundInfoSimple"])
			elementFadeIn(guessInput)
			blockAndWait(hideButtons, fadeGifsIn, startCountdown, loadNextRound, prepareNextRound)
		}, 500)
	}, 650);
}

// call at end of game
function gameOver() {
	currentTopPage = "game over"
	fadeGifsOut()
	elementFadeOut(guessInput)

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		clearBackgroundGifs()
		headerFadeOut() 
		showButtons(buttons.gameOver)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["gameOverTitle"])
			fadeGifsIn()
		}, 500)
	}, 650);
}

// render submenu
function submenu(cardSet) {
	fadeGifsOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		renderCards(cardSet)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["title"])
			cascade(gifContainers, el => elementFadeIn(el), false)
		}, 500)
	}, 650);
}

// go back to the page before 
function goBack() {
	switch (currentTopPage) {
		case "home":
			homeScreen()
			break;
		case "game over":
			gameOver()
			break;
	}
}

// render cards into gif containers
function renderCards(cardSet) {
	hideButtons()

	const cardTemplate = ({ text, id }) => `
	<div class="col-container card-block" id="${id}">
		<h3>${text.title}</h3>
		<p>${text.data}</p>
		<h3>${text.subTitle}</h3>
	</div>
	`
	const btnBlockTemplate = `
	<btn class="col-container btn-block" id="back-btn" data-back-destination="home">
			Back
	</btn>
	`

	gifContainers.forEach(
		(container, index) => {
			if (cardSet[index].key != "backBtn") {
				container.innerHTML = cardTemplate(cardSet[index])
				dynamicBlockElements[cardSet[index].key] = document.getElementById(cardSet[index].id)
			} else {
				gifContainers[3].innerHTML = btnBlockTemplate
				dynamicBlockElements["back"] = document.getElementById("back-btn")
			}
		}
	)
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
	timeLeft = totalTime;

	// var timer = setInterval(function() {
	// 	timeLeft--
	// 	// timeInfo.innerHTML = (timeLeft/100).toFixed(2)
	// 	timeInfo.innerHTML = timeLeft
	// 	if (timeLeft === 0){
	// 		clearInterval(timer)
	// 		gameOver()
	// 	}
	// }, 1000);

	(function loop() {
		setTimeout(function() {
			timeInfo.innerHTML = timeLeft
			if (timeLeft == 0){
				gameOver();
			} else {
				timeLeft--
				loop();
			}
		}, 1000);
	})();
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
		}, delay);
	})
}

// fade element out
function elementFadeOut(...els) {
	els.forEach(el => {
		el.style.boxShadow = "var(--dark) 0 0"
		setTimeout(() => {
			el.style.opacity = 0
		}, delay);
	})
}

// choose which child of te header tag to display
function switchHeaderDisplay(headerEl) {
	const desiredEl = headerEl.element
	for (key in headerChildren) {
		headerChildren[key].element.style.display = "none"
	}
	desiredEl.style.display = "flex"
}

// fade header in
function headerFadeIn(headerEl) {
	switchHeaderDisplay(headerEl)
	setTimeout(() => {
		headerEl.element.style.opacity = 1
		setTimeout(() => {
			if (headerEl.shadow) headerEl.element.style.boxShadow = "var(--dark) 5px 5px"
		}, delay);
	}, 1);
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
	}, delay);
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

// clear any gifs set as backgrounds for the gif comtainers
function clearBackgroundGifs() {
	gifContainers.forEach(
		(item, key) => item.style.backgroundImage = "none"
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
	}, delay)
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
			case "homepage-stats-btn":
				submenu(cards.homeStats)
				break;
			case "game-over-stats-btn":
				submenu(cards.gameOverStats)
				break;
			case "about-btn":
				submenu(cards.aboutInfo)
				break;
			case "back-btn":
				goBack()
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