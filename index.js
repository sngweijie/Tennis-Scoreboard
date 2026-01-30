
//User clicks on points to increase points of respective player
//points will increase in order 15 -> 30 -> 40 -> game -> reset to 0 and game += 1 and set += 1 if game = 6 and 2 points away from opponent
//Undo button allows user to undo point which resets all values to before the point was increased
//first player to win 2 sets out of 3, wins the game and display message mentioning the winner *to-do*
//stretch goals
//new game button resets *done*
//new game confirmation popup
//maybe can allow players to enter their name
//timer *done*
//highlight player who is serving
//show toast feedback like "last point undone"
//add tiebreak condition
//adjust elements so that they will not deform when browser is resized.

let p1PointEl = document.getElementById("p1-point")
let p2PointEl = document.getElementById("p2-point")
let p1GamesEl = document.getElementById("p1-games")
let p2GamesEl = document.getElementById("p2-games")
let p1SetsEl = document.getElementById("p1-sets")
let p2SetsEl = document.getElementById("p2-sets")
let p1PrevSets1El = document.getElementById("p1-prev-sets-1")
let p1PrevSets2El = document.getElementById("p1-prev-sets-2")
let p2PrevSets1El = document.getElementById("p2-prev-sets-1")
let p2PrevSets2El = document.getElementById("p2-prev-sets-2")
let p1NameInput = document.getElementById("p1-name")
let p2NameInput = document.getElementById("p2-name")
let p1ServeBadge = document.getElementById("p1-serve-badge")
let p2ServeBadge = document.getElementById("p2-serve-badge")
let startGameBtn = document.getElementById("start-game-btn")
let modalBackdrop = document.getElementById("modal-backdrop")
let modalConfirmBtn = document.getElementById("modal-confirm")
let modalCancelBtn = document.getElementById("modal-cancel")
let timerDisplayEl = document.getElementById("timer-display")

let gameStarted = false
let lastFocusedEl = null
let history = []
let timerStart = null
let timerIntervalId = null
let timerElapsedMs = 0
let timerRunning = false
let server = "p1"

let p1Point = 0,p2Point = 0,p1Games = 0,p2Games = 0, p1Sets = 0, p2Sets = 0, p1PrevSets1 = 
0, p1PrevSets2 = 0, p2PrevSets1 = 0, p2PrevSets2 = 0, completeSets = 0 


//updates score
function updateScore() {
    p1PointEl.textContent = p1Point
    p2PointEl.textContent = p2Point
    p1GamesEl.textContent = p1Games
    p2GamesEl.textContent = p2Games
    p1SetsEl.textContent = p1Sets
    p2SetsEl.textContent = p2Sets
}
function updatePrevSets() {
    p1PrevSets1El.textContent = p1PrevSets1
    p1PrevSets2El.textContent = p1PrevSets2
    p2PrevSets1El.textContent = p2PrevSets1
    p2PrevSets2El.textContent = p2PrevSets2
}

function pushHistory() {
    history.push({
        p1Point,
        p2Point,
        p1Games,
        p2Games,
        p1Sets,
        p2Sets,
        p1PrevSets1,
        p1PrevSets2,
        p2PrevSets1,
        p2PrevSets2,
        completeSets,
        server
    })
}

function lockPlayerNames() {
    p1NameInput.disabled = true
    p2NameInput.disabled = true
}

function unlockPlayerNames() {
    p1NameInput.disabled = false
    p2NameInput.disabled = false
    p1NameInput.focus()
}

function updateServerUI() {
    const p1Serving = server === "p1"
    p1NameInput.classList.toggle("is-serving", p1Serving)
    p2NameInput.classList.toggle("is-serving", !p1Serving)
    p1ServeBadge.classList.toggle("is-hidden", !p1Serving)
    p2ServeBadge.classList.toggle("is-hidden", p1Serving)
}

function toggleServer() {
    server = server === "p1" ? "p2" : "p1"
    updateServerUI()
}

function openModal() {
    lastFocusedEl = document.activeElement
    modalBackdrop.classList.add("is-open")
    modalBackdrop.setAttribute("aria-hidden", "false")
    modalConfirmBtn.focus()
    pauseTimer()
}

function closeModal() {
    modalBackdrop.classList.remove("is-open")
    modalBackdrop.setAttribute("aria-hidden", "true")
    if (gameStarted) {
        resumeTimer()
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus()
        lastFocusedEl = null
        return
    }
    startGameBtn.focus()
}

function gameP1(){
    p1Games += 1
    if (p1Games == 6){
        completeSets += 1
        if (completeSets >= 2){
            updateScoreSwipeLeft(p1PrevSets1El, p1PrevSets2)
            updateScoreSwipeLeft(p2PrevSets1El, p2PrevSets2)
            p1PrevSets1 = p1PrevSets2
            p2PrevSets1 = p1PrevSets2
        }
        updateScoreSwipeLeft(p1PrevSets2El, p1Games)
        updateScoreSwipeLeft(p2PrevSets2El, p2Games)
        p1PrevSets2 = p1Games
        p2PrevSets2 = p2Games
        p1Sets += 1
        p1Games = p2Games = 0
        
    }
    p1Point = p2Point = 0
    toggleServer()
}
function gameP2(){
    p2Games += 1
    if (p2Games == 6){
        if (completeSets >= 1){
            updateScoreSwipeLeft(p1PrevSets1El, p1PrevSets2)
            updateScoreSwipeLeft(p2PrevSets1El, p2PrevSets2)
            p1PrevSets1 = p1PrevSets2
            p2PrevSets1 = p1PrevSets2
        }
        updateScoreSwipeLeft(p1PrevSets2El, p1Games)
        updateScoreSwipeLeft(p2PrevSets2El, p2Games)
        p1PrevSets2 = p1Games
        p2PrevSets2 = p2Games
        p2Sets += 1
        completeSets += 1
        p1Games = p2Games = 0
        
    }
    p1Point = p2Point = 0
    toggleServer()
}

//increase player 1 points accordingly (15, 30 ,40, game, duece, adv, game)
function addPointP1() {
    pushHistory()
    if(p1Point==30){
        p1Point += 10
    } else if (p1Point==40){
        if (p2Point==40){
            p1Point = "Ad"
        } else if (p2Point=="Ad") {
            p2Point = 40   
        } else {
            gameP1()   
        }
    } else if (p1Point=="Ad"){
        gameP1()
    } else {
        p1Point += 15
    }
    
    updateScore()
}

//increase player 2 points accordingly (15, 30 ,40, game, duece, adv, game)
function addPointP2() {
    pushHistory()
    if(p2Point==30){
        p2Point += 10
    } else if (p2Point==40){
        if (p1Point==40){
            p2Point = "Ad"
        } else if (p1Point=="Ad") {
            p1Point = 40   
        } else {
            gameP2()  
        }
    } else if (p2Point=="Ad"){
        gameP2()
    } else {
        p2Point += 15
    }
    
    updateScore()
}


//resets points
function newGame() {
    p1Point = p2Point = p1Games = p2Games = p1Sets = p2Sets = p1PrevSets1 = 
    p1PrevSets2 = p2PrevSets1 = p2PrevSets2 = completeSets = 0
    history = []
    server = "p1"
    updateServerUI()
    resetTimer()
    updateScore()
    updatePrevSets()
}

function startOrNewGame() {
    if (!gameStarted) {
        if (!p1NameInput.value.trim() || !p2NameInput.value.trim()) {
            return
        }
        lockPlayerNames()
        startTimer()
        startGameBtn.textContent = "New Game"
        gameStarted = true
        return
    }
    openModal()
}

modalConfirmBtn.addEventListener("click", () => {
    newGame()
    unlockPlayerNames()
    startGameBtn.textContent = "Start Game"
    gameStarted = false
    closeModal()
})

modalCancelBtn.addEventListener("click", () => {
    closeModal()
})

modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
        closeModal()
    }
})

document.addEventListener("keydown", (event) => {
    if (!modalBackdrop.classList.contains("is-open")) {
        return
    }
    if (event.key === "Escape") {
        closeModal()
        return
    }
    if (event.key !== "Tab") {
        return
    }

    const focusable = modalBackdrop.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) {
        event.preventDefault()
        return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const isShift = event.shiftKey

    if (isShift && document.activeElement === first) {
        event.preventDefault()
        last.focus()
        return
    }
    if (!isShift && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
})

function startTimer() {
    timerElapsedMs = 0
    timerStart = Date.now()
    if (timerIntervalId) {
        clearInterval(timerIntervalId)
    }
    timerIntervalId = setInterval(updateTimerDisplay, 1000)
    timerRunning = true
    updateTimerDisplay()
}

updateServerUI()

function resetTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId)
        timerIntervalId = null
    }
    timerStart = null
    timerElapsedMs = 0
    timerRunning = false
    timerDisplayEl.textContent = "00:00:00"
}

function updateTimerDisplay() {
    if (!timerStart && timerElapsedMs === 0) {
        timerDisplayEl.textContent = "00:00:00"
        return
    }
    const liveElapsedMs = timerRunning && timerStart ? Date.now() - timerStart : 0
    const totalSeconds = Math.floor((timerElapsedMs + liveElapsedMs) / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const hh = String(hours).padStart(2, "0")
    const mm = String(minutes).padStart(2, "0")
    const ss = String(seconds).padStart(2, "0")
    timerDisplayEl.textContent = `${hh}:${mm}:${ss}`
}

function pauseTimer() {
    if (!timerRunning || !timerStart) {
        return
    }
    timerElapsedMs += Date.now() - timerStart
    timerStart = null
    timerRunning = false
    if (timerIntervalId) {
        clearInterval(timerIntervalId)
        timerIntervalId = null
    }
    updateTimerDisplay()
}

function resumeTimer() {
    if (timerRunning) {
        return
    }
    timerStart = Date.now()
    timerIntervalId = setInterval(updateTimerDisplay, 1000)
    timerRunning = true
    updateTimerDisplay()
}

//undo previous action (e.g decrease point and reverse set,game values)
function undo() {
    if (history.length === 0) {
        return
    }
    const prev = history.pop()
    p1Point = prev.p1Point
    p2Point = prev.p2Point
    p1Games = prev.p1Games
    p2Games = prev.p2Games
    p1Sets = prev.p1Sets
    p2Sets = prev.p2Sets
    p1PrevSets1 = prev.p1PrevSets1
    p1PrevSets2 = prev.p1PrevSets2
    p2PrevSets1 = prev.p2PrevSets1
    p2PrevSets2 = prev.p2PrevSets2
    completeSets = prev.completeSets
    server = prev.server
    updateScore()
    updatePrevSets()
    updateServerUI()
}


//animation
function updateScoreSwipeLeft(el, newText) {
  // If user prefers reduced motion, just update instantly
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = newText;
    return;
  }

  // 1) animate current value out to the left
  el.classList.remove("swipe-in-from-right", "swipe-in");
  el.classList.add("swipe-out-left");

  // Wait for the "out" transition to finish
  const OUT_MS = 140;

  window.setTimeout(() => {
    // 2) swap the text while hidden
    el.textContent = newText;

    // 3) jump to "new value starts off to the right"
    el.classList.remove("swipe-out-left");
    el.classList.add("swipe-in-from-right");

    // Force a reflow so the browser applies the start position
    // (this is the key to making the transition run)
    void el.offsetWidth;

    // 4) animate into place
    el.classList.add("swipe-in");
    el.classList.remove("swipe-in-from-right");

    // Optional cleanup after in-transition ends
    const IN_MS = 140;
    window.setTimeout(() => {
      el.classList.remove("swipe-in");
    }, IN_MS);
  }, OUT_MS);
}
