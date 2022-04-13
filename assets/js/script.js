const gifContainers = document.querySelectorAll(".gif-container")

// fade element in with box shadow
function elementFadeIn(el) {
    el.style.transition = "200ms"
    el.style.opacity = "100"
    el.style.boxShadow = "var(--dark) 5px 5px"
}

// fade element out
function elementFadeOut(el) {
    el.style.transition = "200ms"
    el.style.opacity = "0"
    el.style.boxShadow = "var(--dark) 0 0"
}