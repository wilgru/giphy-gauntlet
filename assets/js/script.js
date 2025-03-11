// elements
const gifContainers = document.querySelectorAll(".gif-container")
const headerRow = document.getElementById("header-row")
const headerTitle = document.getElementById("header-title")
const assignableTitle = document.getElementById("assignable-title")
const timeInfo = document.querySelector(".time-info")
const scoreInfo = document.querySelector(".score-info")
const guessform = document.getElementById("guess-form")
const guessInput = document.getElementById("guess-input")
const shuffleBtn = document.getElementById("shuffle-btn")
const submitBtn = document.getElementById("submit-btn")

// Add API key here
const GIPHY_API_KEY = "";

// global static vars
const delay = 100
const numGifContainers = gifContainers.length
const totalTime = 60;

const themes = [
	{
		light: "rgb(249, 242, 184)",
		mid: "rgb(192, 187, 142)",
		dark: "rgb(115, 112, 78)",
	},
	{
		light: "rgb(243, 184, 249)",
		mid: "rgb(185, 142, 192)",
		dark: "rgb(114, 78, 115)",
	},
	{
		light: "rgb(189, 249, 184)",
		mid: "rgb(149, 192, 142)",
		dark: "rgb(78, 115, 80)",
	},
	{
		light: "rgb(213, 247, 255)",
		mid: "rgb(159, 203, 213)",
		dark: "rgb(255, 154, 40)",
	},
	{
		light: "rgb(250, 233, 189)",
		mid: "rgb(211, 197, 143)",
		dark: "rgb(13, 100, 36)",
	},
	{
		light: "rgb(233, 182, 255)",
		mid: "rgb(177, 133, 200)",
		dark: "rgb(33, 118, 117)",
	},
	{
		light: "rgb(255, 255, 255)",
		mid: "rgb(201, 201, 201)",
		dark: "rgb(80, 83, 84)",
	}
]

let GG_DATA
// {
// 	config: {
// 		ms: false,
// 		roundDisplay: "simple",
// 		theme: 0
// 	},
// 	stats: {
// 		highestScore: 0,
// 		highestScoreDate: 0,
// 		guessesCorrect: 0,
// 		guessesIncorrect: 0,
// 		gps: 0,
// 		numGames: 0,
// 	}
// }

// const headerChildren = {
// 	title: {
// 		element: headerRow.children[0],
// 		shadow: false
// 	},
// 	roundInfoSimple: {
// 		element: headerRow.children[1],
// 		shadow: true
// 	},
// 	roundInfoAdvanced: {
// 		element: headerRow.children[2],
// 		shadow: true
// 	},
// 	gameOverTitle: {
// 		element: headerRow.children[3],
// 		shadow: true
// 	},
// 	assignableTitle: {
// 		element: headerRow.children[4],
// 		shadow: true
// 	}
// }
const headerChildren = {
	title: {
		element: headerRow.children[0],
		shadow: false
	},
	roundInfo: {
		element: headerRow.children[1],
		shadow: true
	},
	gameOverTitle: {
		element: headerRow.children[2],
		shadow: true
	},
	assignableTitle: {
		element: headerRow.children[3],
		shadow: true
	}
}

const pages = {
	home: {
		pageType: "top",
		pageName: "home",
		headerEl: headerChildren.title,
		tileType: "buttons",
		tileTypeKey: "home",
		showInput: false
	},
	gamePlay: {
		pageType: "top",
		pageName: "gamePlay",
		headerEl: headerChildren.roundInfo,
		tileType: "gifs",
		tileTypeKey: "none",
		showInput: true
	},
	gameOver: {
		pageType: "top",
		pageName: "gameOver",
		headerEl: headerChildren.gameOverTitle,
		tileType: "buttons",
		tileTypeKey: "gameOver",
		showInput: false
	},
	homeStats: {
		pageType: "sub",
		pageName: "homeStats",
		headerEl: headerChildren.assignableTitle,
		headerText: "Stats",
		tileType: "cards",
		tileTypeKey: "homeStats",
		showInput: false
	},
	settings: {
		pageType: "sub",
		pageName: "settings",
		headerEl: headerChildren.assignableTitle,
		headerText: "settings",
		tileType: "toggles",
		tileTypeKey: "settings",
		showInput: false
	},
	about: {
		pageType: "sub",
		pageName: "about",
		headerEl: headerChildren.assignableTitle,
		headerText: "About",
		tileType: "cards",
		tileTypeKey: "about",
		showInput: false
	},
	gameOverStats: {
		pageType: "sub",
		pageName: "gameOverStats",
		headerEl: headerChildren.assignableTitle,
		headerText: "This game's stats",
		tileType: "cards",
		tileTypeKey: "gameOverStats",
		showInput: false
	},
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

// css root
const root = document.documentElement;
let themeIndex

//page vars
let currentTopPage = "home"
let currentPageSchedule = []
let toggleTilesEls = {}

//game vars
let currentRound = {}
let currentRoundWord = ""
let nextRound = {}
let timeLeft = 60
let nextRoundPrepared = false
let gameInSession = false
let score = 0
let correctGuesses = 0
let incorrectGuesses = 0

// cards ad buttons vars
let cards
let buttons
let toggles

// initial function
;(function init() {
	getStorage()

	guessInput.disabled = true
	themeIndex = GG_DATA.config.theme
	
	setTheme(themeIndex)
	prepareNextRound()
	updateCardsData()
	updateButtonsData()
	removeCurrentPage(pages.home)
})()

// get GG_DATA from local storage if it exists
function getStorage() {
	GG_DATA = JSON.parse(localStorage.getItem("GG_DATA"))
	if (GG_DATA === null) {
		initGG_DATA()
	}
}

// initialise a GG_DATA object if one doesnt exist in local storage
function initGG_DATA() {
	GG_DATA =
	{
		config: {
			ms: false,
			roundDisplay: "simple",
			theme: 0
		},
		stats: {
			highestScore: 0,
			highestScoreDate: "--/--/--",
			guessesCorrect: 0,
			guessesIncorrect: 0,
			accuracy: 0,
			gps: 0,
			avgScore: 0,
			numGames: 0
		}
	}
}

// set local sotrage with updated data
function setStorage(config, stats) {
	if (config) {
		GG_DATA.config.ms = false,
		GG_DATA.config.roundDisplay = "simple",
		GG_DATA.config.theme = themeIndex
	}

	if (stats) {
		GG_DATA.stats.guessesCorrect += correctGuesses
		GG_DATA.stats.guessesIncorrect += incorrectGuesses
		GG_DATA.stats.accuracy = roundToDecimalPlace(100*(GG_DATA.stats.guessesCorrect/(GG_DATA.stats.guessesCorrect+GG_DATA.stats.guessesIncorrect)), 2)
		GG_DATA.stats.numGames++
		GG_DATA.stats.gps = roundToDecimalPlace(GG_DATA.stats.guessesCorrect/(GG_DATA.stats.numGames*60), 2)

		// if a higher score has been made
		if  (score > GG_DATA.stats.highestScore || (score > 0 && GG_DATA.stats.highestScore === "--")) {
			const today = new Date()
			GG_DATA.stats.highestScore = score
			GG_DATA.stats.highestScoreDate = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear()
		}

		// if there is an average score
		if (GG_DATA.stats.avgScore > 0) {
			GG_DATA.stats.avgScore = roundToDecimalPlace((GG_DATA.stats.avgScore + score) / 2, 2)
		} else {
			GG_DATA.stats.avgScore = score
		}

	}
	localStorage.setItem("GG_DATA", JSON.stringify(GG_DATA))
}

// round a given number to a given nnumber of decimal places
function roundToDecimalPlace(float, places) {
	let placeModifier = 1
	for (i = 0; i < places; i++) {
		placeModifier += "0"
	}
	placeModifier = parseInt(placeModifier)
	return Math.round(float * placeModifier) / placeModifier
}

// convert stats and enter placeholder value is stats are not set to anytihng/ set to 0
function convertStats() {
	let convertedStats = {}

	// overall stats
	convertedStats.localHighScore = GG_DATA.stats.highestScore || "--"
	convertedStats.localHighScoreDate = GG_DATA.stats.highestScoreDate || "--/--/--"
	convertedStats.localAccuracy = GG_DATA.stats.accuracy || "--"
	convertedStats.localGuessesCorrect = GG_DATA.stats.guessesCorrect || "--"
	convertedStats.localGuessesIncorrect = GG_DATA.stats.guessesIncorrect || "--"
	convertedStats.localGps = GG_DATA.stats.gps || "--"
	convertedStats.localAvgScore = GG_DATA.stats.avgScore || "--"

	// game over stats
	convertedStats.localPostGameAccuracy = roundToDecimalPlace(100*(correctGuesses/(correctGuesses+incorrectGuesses)), 2) || "--"
	convertedStats.localPostGameGps = roundToDecimalPlace(score/60, 2) || "--"
	convertedStats.localScore = score || "--"

	// game over comparison stats
	convertedStats.compareScore = roundToDecimalPlace(convertedStats.localScore - GG_DATA.stats.avgScore, 2) || "--"
	convertedStats.compareAccuracy = roundToDecimalPlace(convertedStats.localPostGameAccuracy - GG_DATA.stats.accuracy, 2) || "--"
	convertedStats.compareGps = roundToDecimalPlace((convertedStats.localGuessesCorrect/60) - GG_DATA.stats.gps, 2) || "--"

	return convertedStats
}

// update the text in each button set (if they can be)
function updateButtonsData() {
	buttons = {
		home: [
			{key: "playBtn", text: "Play", id: "play-btn"},
			{key: "statsBtn", text: "Stats", id: "homepage-stats-btn"},
			{key: "settingsBtn", text: "Settings", id: "settings-btn"},
			{key: "aboutBtn", text: "about", id: "about-btn"}
		],
		settings: [
			{key: "msToggleBtn", text: "Toggle ms", id: "ms-deptoggleth-btn"},
			{key: "roundDisplayBtn", text: "Round Display", id: "round-display-btn"},
			{key: "themeBtn", text: "Theme", id: "theme-btn"},
			{key: "backBtn", text: "Back", id: "back-btn"}
		],
		gameOver: [
			{key: "playAgainBtn", text: "Play Again", id: "play-again-btn"},
			{key: "gameStatsBtn", text: "Game Stats", id: "game-over-stats-btn"},
			{key: "settingsBtn", text: "Settings", id: "settings-btn"},
			{key: "homeBtn", text: "Home", id: "home-btn"}
		]
	}
}

// update the text in each toggle set (if they can be)
function updateTogglesData() {
	toggles = {
		settings: [
			{key: "msToggleBtn", text: {title: "Toggle ms", status: GG_DATA.config.ms}, id: "ms-toggle-btn"},
			{key: "roundDisplayBtn", text: {title: "Round Display", status: GG_DATA.config.roundDisplay}, id: "round-display-btn"},
			{key: "themeBtn", text: {title: "Theme", status: ""}, id: "theme-btn"},
			{key: "backBtn", text: "Back", id: "back-btn"},
		],
	}
}

// update the text in each card set (if they can be)
function updateCardsData(){
	const statsData = convertStats()

	cards = {
	homeStats: [
		{key: "highScoreCard", text: {title: "High Score:", data: `${statsData.localHighScore}`, subTitle: `${statsData.localHighScoreDate}`}, id: "high-score-card"},
		{key: "accuracyCard", text: {title: "Accuracy:", data: `${statsData.localAccuracy}%`, subTitle: `✔︎ ${statsData.localGuessesCorrect} | ✗ ${statsData.localGuessesIncorrect}` }, id: "accuracy-card"},
		{key: "gifsPerSecCard", text: {title: "Gifs per Sec:", data: `${statsData.localGps}`, subTitle: `Avg score: ${statsData.localAvgScore}` }, id: "gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	gameOverStats: [
		{key: "gameOverScoreCard", text: {title: "Score:", data: `${statsData.localScore}`, subTitle: `${statsData.compareScore}` }, id: "game-over-score-card"},
		{key: "gameOverAccuracyCard", text: {title: "Accuracy:", data: `${statsData.localPostGameAccuracy}%`, subTitle: `${statsData.compareAccuracy}` }, id: "game-over-accuracy-card"},
		{key: "gameOverGifsPerSecCard", text: {title: "Gifs per Sec:", data: `${statsData.localPostGameGps}`, subTitle: `${statsData.compareGps}` }, id: "game-over-gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	about: [
		{key: "authorCard", text: {title: "Author", data: "William Gruszka", subTitle: "" }, id: "game-over-score-card"},
		{key: "Api", text: {title: "Gifs from", data: "<a href='https://giphy.com/'>Giphy.com</a>", subTitle: "" }, id: "game-over-gifs-per-sec-card"},
		{key: "linksCard", text: {title: "Find out more:", data: "<a href='https://github.com/wilgru/Gipher'>Github.com</a>", subTitle: "" }, id: "game-over-accuracy-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	]
}}

// remove all elements of the current page
function removeCurrentPage(page) {
	let index = currentPageSchedule.length -1

	const pageCascader = setInterval(()=>{
		if (index >= 0) {
			elementFadeOut(currentPageSchedule[index].element, currentPageSchedule[index].shadow)
		} else if (index === -1) {
			// basically just wait an iteration
		} else {
			clearInterval(pageCascader)
			pageSetup(page)
		}
		index--
	}, 100)
}

// get everytihg in order for the next page before rendering the next page
function pageSetup(page) {
	unsetTiles()

	if (page.pageType === "top") currentTopPage = page.pageName
	currentPageSchedule = []

	switchHeaderDisplay(page.headerEl)
	if (page.headerEl.element.id === "assignable-title") { // CLEAN THIS
		assignableTitle.children[0].children[0].innerHTML = page.headerText
	}
	const roundHeaderType = GG_DATA.config.roundDisplay === "advanced" ? "advanced" : "simple" // CLEAN THIS
	document.getElementById("advanced").style.display = "none" // CLEANN THISs
	document.getElementById("simple").style.display = "none" // CLEANN THISs
	document.getElementById(roundHeaderType).style.display = "flex" // CLEANN THISs

	currentPageSchedule.push(page.headerEl)

	for (let i = 0; i < numGifContainers; i++) {
		currentPageSchedule.push({element: gifContainers[i], shadow: true})
	}

	switch (page.tileType) {
		case "buttons":
			updateButtonsData()
			setButtons(buttons[page.tileTypeKey])
			break;
		case "cards":
			updateCardsData()
			setCards(cards[page.tileTypeKey])
			break;
		case "toggles":
			updateTogglesData()
			setToggles(toggles[page.tileTypeKey])
			break;
		case "gifs":
			setGifs()
			startCountdown()
			break;
	}

	if (page.showInput) {
		currentPageSchedule.push({element: guessInput, shadow: true}, {element: submitBtn, shadow: true}, {element: shuffleBtn, shadow: true})
	}

	renderCurrentPage()
}

// render the page usinng whatever data has been prepared
function renderCurrentPage() {
	let index = 0
	const pageScheduleLength = currentPageSchedule.length

	const pageCascader = setInterval(()=>{
		if (index < pageScheduleLength) {
			elementFadeIn(currentPageSchedule[index].element, currentPageSchedule[index].shadow)
		} else {
			clearInterval(pageCascader)
		}
		index++
	}, 100)
}

// remove any inner tile content from tiles
function unsetTiles() {
	gifContainers.forEach(container => container.innerHTML = "")
}

// set cards into gif containers
function setCards(cardSet) {
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
			}
			gifContainers[3].innerHTML = btnBlockTemplate
		}
	)
}

// show the buttons that have been parsed
function setButtons(btnSet) {
	const btnBlockTemplate = ({ text, id }) => `
	<btn class="col-container btn-block" id="${id}">
		${text}
	</btn>
	`
	gifContainers.forEach(
		(container, index) => {
				container.innerHTML = btnBlockTemplate(btnSet[index])
			}
		)
}

// set cards into gif containers
function setToggles(cardSet) {
	toggleTilesEls = {}
	const cardTemplate = ({ text, id }) => `
	<btn class="col-container toggle-block" id="${id}">
		<p>${text.title}</p>
		<h3>${text.status}</h3>
	</btn>
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
				toggleTilesEls[cardSet[index].id] = document.getElementById(cardSet[index].id)
			}
			gifContainers[3].innerHTML = btnBlockTemplate
		}
	)
}

// set cards into gif containers
function setGifs() {
	currentRound = nextRound
	currentRoundWord = currentRound.answer

	const gifTemplate = (url) => `
	<div class="col-container gif-block" style='background-image: url("${url}");'>
	</div>
	`

	gifContainers.forEach(
		(container, index) => {
			container.innerHTML = gifTemplate(currentRound.urls[index].images.original.url)
		}
	)

	prepareNextRound()
}

// transition between round
function roundTransition() {
	fadeTilesOut()
	score++
	// scoreInfo.innerHTML = `Score: ${score}`
	// updateRoundDisplay()

	// wait an inital 500ms (for the fade out to complete) then begin to wait for next round to be ready to load. dot do this if the game has ended whist this was waiting
	setTimeout(() => {
		if (gameInSession === true) {
			blockAndWait(setGifs, fadeTilesIn)
		}
	}, 500);
}

// start the game countdown
function startCountdown() {
	timeLeft = totalTime;

	(function loop() {
		setTimeout(function() {
			// timeInfo.innerHTML = timeLeft
			updateRoundDisplay()
			if (timeLeft == 0){
				setStorage(false, true)
				removeCurrentPage(pages.gameOver);
				guessInput.disabled = true
				gameInSession = false
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

// fade element in with box shadow
function elementFadeIn(el, shadow) {
	el.style.opacity = 1
	setTimeout(() => {
		if (shadow) el.style.boxShadow = "var(--dark) 5px 5px"
	}, delay);
}

// fade element out
function elementFadeOut(el, shadow) {
	if (shadow) el.style.boxShadow = "var(--dark) 0 0"
	setTimeout(() => {
		el.style.opacity = 0
	}, delay);
}

// choose which child of te header tag to display
function switchHeaderDisplay(headerEl) {
	const desiredEl = headerEl.element
	for (key in headerChildren) {
		headerChildren[key].element.style.display = "none"
	}
	desiredEl.style.display = "flex"
}

// update the info in the round display
function updateRoundDisplay() {
	const timeInfoEls = document.querySelectorAll(".time-info")
	const scoreInfoEls = document.querySelectorAll(".score-info")
	const accuracyInfoEl = document.querySelector(".accuracy-info")
	const gpsInfoEl = document.querySelector(".gps-info")

	timeInfoEls.forEach(el => {el.textContent = timeLeft})
	scoreInfoEls.forEach(el => {el.textContent = score})
	accuracyInfoEl.textContent = (roundToDecimalPlace(100*((correctGuesses||1)/((correctGuesses||1) + incorrectGuesses)), 2) || '100') + '%'
	gpsInfoEl.textContent = roundToDecimalPlace(correctGuesses/(totalTime - timeLeft), 2) || 0
}

// cascade fade the gifs out
function fadeTilesOut() {
	cascade(gifContainers, el => elementFadeOut(el), true)
}

// cascade fade the gifs in
function fadeTilesIn() {
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

//
function setTheme() {
	root.style.setProperty('--light', themes[themeIndex].light);
	root.style.setProperty('--mid', themes[themeIndex].mid);
	root.style.setProperty('--dark', themes[themeIndex].dark);
}

//
function switchTheme() {
	themeIndex++
	if (themeIndex > themes.length-1) themeIndex = 0
	setTheme()
	setStorage(true, false)
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
		correctGuesses++
		console.log("Correct!")
		tempStyler(guessInput, "backgroundColor", "green")
		roundTransition()
	} else {
		incorrectGuesses++
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
				guessInput.disabled = false
				gameInSession = true
				// scoreInfo.innerHTML = `${score}`
				score = 0
				correctGuesses = 0
				incorrectGuesses = 0
				updateRoundDisplay()
				removeCurrentPage(pages.gamePlay)
				break;
			case "play-again-btn":
				guessInput.disabled = false
				gameInSession = true
				// scoreInfo.innerHTML = `${score}`
				score = 0
				correctGuesses = 0
				incorrectGuesses = 0
				updateRoundDisplay()
				removeCurrentPage(pages.gamePlay)
				break;
			case "home-btn":
				removeCurrentPage(pages.home)
				break;
			case "homepage-stats-btn":
				removeCurrentPage(pages.homeStats)
				break;
			case "game-over-stats-btn":
				removeCurrentPage(pages.gameOverStats)
				break;
			case "about-btn":
				removeCurrentPage(pages.about)
				break;
			case "settings-btn":
				removeCurrentPage(pages.settings)
				break;
			case "theme-btn":
				switchTheme()
				break;
			case "ms-toggle-btn":
				if (GG_DATA.config.ms) {GG_DATA.config.ms = false} else {GG_DATA.config.ms = true}
				toggleTilesEls["ms-toggle-btn"].children[1].textContent = GG_DATA.config.ms
				setStorage()
				updateTogglesData()
				break;
			case "round-display-btn":
				if (GG_DATA.config.roundDisplay === "simple") {GG_DATA.config.roundDisplay = "advanced"} else {GG_DATA.config.roundDisplay = "simple"}
				toggleTilesEls["round-display-btn"].children[1].textContent = GG_DATA.config.roundDisplay
				setStorage()
				updateTogglesData()
				break;
			case "back-btn":
				removeCurrentPage(pages[currentTopPage])
				break;
		}
	})
})

guessform.addEventListener("submit", (event) => {
	event.preventDefault()
	let guess = cleanInput(guessInput.value)
	guessInput.value = ""

	checkGuessCorrect(guess)
	updateRoundDisplay()
})