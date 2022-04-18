// elements
const gifContainers = document.querySelectorAll(".gif-container")
const headerRow = document.getElementById("header-row")
const headerTitle = document.getElementById("header-title")
const timeInfo = document.querySelector(".time-info")
const scoreInfo = document.querySelector(".score-info")
const guessform = document.getElementById("guess-form")
const guessInput = document.getElementById("guess-input")

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
	},
	{
		light: "rgb(255, 0, 0)",
		mid: "rgb(0, 0, 255)",
		dark: "rgb(0, 255, 0)",
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

function getStorage() {
	GG_DATA = JSON.parse(localStorage.getItem("GG_DATA"))
	if (GG_DATA === null) {
		initGG_DATA()
	}
}

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
			highestScoreDate: 0,
			guessesCorrect: 0,
			guessesIncorrect: 0,
			gps: 0,
			avgScore: 0,
			numGames: 0,
		}
	}
}

function setStorage(config, stats) {
	if (config) {
		GG_DATA.config.ms = false,
		GG_DATA.config.roundDisplay = "simple",
		GG_DATA.config.theme = themeIndex
	}

	if (stats) {
		const today = new Date()
		GG_DATA.stats.guessesCorrect += correctGuesses
		GG_DATA.stats.guessesIncorrect += incorrectGuesses
		GG_DATA.stats.numGames++
		// GG_DATA.stats.gps = (GG_DATA.stats.gps + (score/60)) / 2
		if  (score > GG_DATA.stats.highestScore) {
			GG_DATA.stats.highestScore = score
			if (GG_DATA.stats.avgScore === 0) {
				GG_DATA.stats.avgScore = score
			} else {
				GG_DATA.stats.avgScore = (GG_DATA.stats.avgScore + score) / 2
			}
			GG_DATA.stats.highestScoreDate = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear()
		}
	}
	localStorage.setItem("GG_DATA", JSON.stringify(GG_DATA))
}

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

function updateCardsData(){
	cards = {
	homeStats: [
		{key: "highScoreCard", text: {title: "High Score:", data: `${GG_DATA.stats.highestScore}`, subTitle: `${GG_DATA.stats.highestScoreDate}`}, id: "high-score-card"},
		{key: "accuracyCard", text: {title: "Accuracy:", data: `${Math.round(100*(GG_DATA.stats.guessesCorrect/(GG_DATA.stats.guessesCorrect+GG_DATA.stats.guessesIncorrect)))+"%"}`, subTitle: `✔︎ ${GG_DATA.stats.guessesCorrect} | ✗ ${GG_DATA.stats.guessesIncorrect}` }, id: "accuracy-card"},
		{key: "gifsPerSecCard", text: {title: "Gifs per Sec:", data: `${(GG_DATA.stats.guessesCorrect/(GG_DATA.stats.numGames*60)).toString().slice(0, 4).slice(0, 4)}`, subTitle: `Avg. score: ${GG_DATA.stats.avgScore}` }, id: "gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	gameOverStats: [
		{key: "gameOverScoreCard", text: {title: "Score:", data: `${score}`, subTitle: "+/-" }, id: "game-over-score-card"},
		{key: "gameOverAccuracyCard", text: {title: "Accuracy:", data: `${Math.round(100*(correctGuesses/(correctGuesses+incorrectGuesses)))+"%"}`, subTitle: "+/-" }, id: "game-over-accuracy-card"},
		{key: "gameOverGifsPerSecCard", text: {title: "Gifs per Sec:", data: `${(score/60).toString().slice(0, 4)}`, subTitle: "+/-" }, id: "game-over-gifs-per-sec-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	],
	about: [
		{key: "authorCard", text: {title: "Author", data: "William Gruszka", subTitle: "" }, id: "game-over-score-card"},
		{key: "Api", text: {title: "made with", data: "<a href='https://developers.giphy.com/'>Giphy API</a>", subTitle: "" }, id: "game-over-gifs-per-sec-card"},
		{key: "linksCard", text: {title: "Find out more:", data: "<a href='https://github.com/wilgru/Gipher'>Github.com</a>", subTitle: "" }, id: "game-over-accuracy-card"},
		{key: "backBtn", text: "Back", id: "back-btn"},
	]
}}

const pages = {
	home: {
		pageType: "top",
		pageName: "home",
		headerEl: headerChildren.title,
		tileType: "buttons",
		tileTypeKey: "home",
		// typeSet: buttons.home,
		showInput: false
	},
	gamePlay: {
		pageType: "top",
		pageName: "gamePlay",
		headerEl: headerChildren.roundInfoSimple,
		tileType: "gifs",
		tileTypeKey: "none",
		// typeSet: "none",
		showInput: true
	},
	gameOver: {
		pageType: "top",
		pageName: "gameOver",
		headerEl: headerChildren.gameOverTitle,
		tileType: "buttons",
		tileTypeKey: "gameOver",
		// typeSet: buttons.gameOver,
		showInput: false
	},
	homeStats: {
		pageType: "sub",
		pageName: "homeStats",
		headerEl: headerChildren.title,
		tileType: "cards",
		tileTypeKey: "homeStats",
		// typeSet: cards.homeStats,
		showInput: false
	},
	settings: {
		pageType: "sub",
		pageName: "settings",
		headerEl: headerChildren.title,
		tileType: "buttons",
		tileTypeKey: "settings",
		// typeSet: buttons.settings,
		showInput: false
	},
	about: {
		pageType: "sub",
		pageName: "about",
		headerEl: headerChildren.title,
		tileType: "cards",
		tileTypeKey: "about",
		// typeSet: cards.aboutInfo,
		showInput: false
	},
	gameOverStats: {
		pageType: "sub",
		pageName: "gameOverStats",
		headerEl: headerChildren.title,
		tileType: "cards",
		tileTypeKey: "gameOverStats",
		// typeSet: cards.gameOverStats,
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
let dynamicBlockElements = {}
let currentTopPage = "home"
let currentPageSchedule = []

//game vars
let currentRound = {}
let currentRoundWord = ""
let nextRound = {}
let nextRoundPrepared = false
let score = 0
let correctGuesses = 0
let incorrectGuesses = 0

// cards ad buttons vars
let cards
let buttons

// initial function
;(function init() {
	getStorage()
	updateCardsData()
	updateButtonsData()
	themeIndex = GG_DATA.config.theme
	setTheme(themeIndex)
	prepareNextRound()
	removeCurrentPage(pages.home)
})()

// 
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

//
function pageSetup(page) {
	unsetTiles()

	if (page.pageType === "top") currentTopPage = page.pageName
	currentPageSchedule = []

	switchHeaderDisplay(page.headerEl)
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
		case "gifs":
			setGifs()
			startCountdown()
			break;
	}

	if (page.showInput) {
		currentPageSchedule.push({element: guessInput, shadow: true})
	}

	renderCurrentPage()
}

//
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

//
function unsetTiles() {
	gifContainers.forEach(container => container.innerHTML = "")
}

//
function updateTypeSet(page) {
	switch (page.tileType) {
	case "buttons":
		updateButtonsData()
		page.typeSet = buttons[page.tileTypeKey]
		break;
	case "cards":
		updateCardsData()
		page.typeSet = cards[page.tileTypeKey]
		break;
	}
}

// home screen
function homeScreen() {
	currentTopPage = "home"
	prepareNextRound()
	fadeTilesOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		setButtons(buttons.home)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["title"])
			fadeTilesIn()
		}, 500)
	}, 650);
}

// start game function
function startGame() {
	currentTopPage = "game"
	fadeTilesOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["roundInfoSimple"])
			elementFadeIn(guessInput)
			blockAndWait(hideButtons, fadeTilesIn, startCountdown, loadNextRound, prepareNextRound)
		}, 500)
	}, 650);
}

// call at end of game
function gameOver() {
	currentTopPage = "game over"
	fadeTilesOut()
	elementFadeOut(guessInput)

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		clearBackgroundGifs()
		headerFadeOut() 
		setButtons(buttons.gameOver)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["gameOverTitle"])
			fadeTilesIn()
		}, 500)
	}, 650);
}

// set submenu
function submenu(cardSet) {
	fadeTilesOut()

	// wait an inital 500ms (for the fade out to complete) then fade out the header, then begin to wait for next round to be ready to load
	setTimeout(() => {
		headerFadeOut() 
		setCards(cardSet)

		// wait 250ms for buttons to fade out then then change header
		setTimeout(()=>{
			headerFadeIn(headerChildren["title"])
			cascade(gifContainers, el => elementFadeIn(el), false)
		}, 500)
	}, 650);
}

// go back to the page before 
function goBack() {
	removeCurrentPage(pages[currentTopPage])
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
				// dynamicBlockElements[cardSet[index].key] = document.getElementById(cardSet[index].id)
				// dynamicBlockElements["back"] = document.getElementById("back-btn")

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
	scoreInfo.innerHTML = `Score: ${score}`

	// wait an inital 500ms (for the fade out to complete) then begin to wait for next round to be ready to load
	setTimeout(() => {
		blockAndWait(setGifs, fadeTilesIn)
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
				removeCurrentPage(pages.gameOver);
				setStorage(false, true)
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
function setButtons(btnSet) {
	const btnBlockTemplate = ({ text, id }) => `
	<btn class="col-container btn-block" id="${id}">
			${text}
	</btn>
	`
	gifContainers.forEach(
		(container, index) => {
				container.innerHTML = btnBlockTemplate(btnSet[index])
				// dynamicBlockElements[btnSet[index].key] = document.getElementById(btnSet[index].id)
			}
		)
}

// hide any buttons currently on the page
function hideButtons() {
	for (const btnKey in dynamicBlockElements) {
		dynamicBlockElements[btnKey].style.display = "none";
	}
	// dynamicBlockElements = {}
}

// // fade element in with box shadow
// function elementFadeIn(...els) {
// 	els.forEach(el => {
// 		el.style.opacity = 1
// 		setTimeout(() => {
// 			el.style.boxShadow = "var(--dark) 5px 5px"
// 		}, delay);
// 	})
// }
// fade element in with box shadow
function elementFadeIn(el, shadow) {
	el.style.opacity = 1
	setTimeout(() => {
		if (shadow) el.style.boxShadow = "var(--dark) 5px 5px"
	}, delay);
}

// // fade element out
// function elementFadeOut(el, shadow) {
// 	els.forEach(el => {
// 		el.style.boxShadow = "var(--dark) 0 0"
// 		setTimeout(() => {
// 			el.style.opacity = 0
// 		}, delay);
// 	})
// }
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

// clear any gifs set as backgrounds for the gif comtainers
function clearBackgroundGifs() {
	gifContainers.forEach(
		(item, key) => item.style.backgroundImage = "none"
	)
}

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
				score = 0
				correctGuesses = 0
				incorrectGuesses = 0
				removeCurrentPage(pages.gamePlay)
				break;
			case "play-again-btn":
				score = 0
				correctGuesses = 0
				incorrectGuesses = 0
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
})