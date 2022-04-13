const gifContainers = document.querySelectorAll(".gif-container")

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
    "book",
    "house",
    "water",
    "nature",
    "justice",
    "hell",
    "heaven",
    "car",
    "baby"
]

// return random/s word from a given list
function returnRandomFromArray(wordsArray, num) {
    var randomIndex;
    var randomWord;
  
    if (num === 1) {
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

        randomWordList.push(randomWord);
      }
      return randomWordList;
    }
  }

// fade element in with box shadow
function elementFadeIn(el) {
    el.style.transition = "200ms"
    el.style.opacity = "100"

    setTimeout(() => {
        el.style.boxShadow = "var(--dark) 5px 5px"
    }, 100);
}

// fade element out
function elementFadeOut(el) {
    el.style.boxShadow = "var(--dark) 0 0"

    setTimeout(() => {
        el.style.transition = "200ms"
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

            console.log(nextRound)
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