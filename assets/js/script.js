const gifContainers = document.querySelectorAll(".gif-container")
const numGifs = gifContainers.length

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
        index => elementFadeOut(gifContainers[index])
    )
}

// cascade fade the gifs in
function fadeGifsIn() {
    cascade(
        0,
        1,
        numGifs, 
        index => elementFadeIn(gifContainers[index])
    )
}

// 
function cascade(start, increment, max, funct, callback) {
    let index = start;

    function innerCascade(max, funct) {
        setTimeout(() => {
            if (max > 0) {
                funct(index)
                index = index + increment

                innerCascade(max-1, funct)
            } else {
                callback()
            }
        }, 100)
    }
    innerCascade(max, funct)
}