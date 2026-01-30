
//User clicks on points to increase points of respective player
//points will increase in order 15 -> 30 -> 40 -> game -> reset to 0 and game += 1 and set += 1 if game = 6 and 2 points away from opponent
//Undo button allows user to undo point which resets all values to before the point was increased
//first player to win 2 sets out of 3, wins the game and display message mentioning the winner *to-do*
//stretch goals
//new game button resets *done*
//new game confirmation popup
//maybe can allow players to enter their name
//timer
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
}

//increase player 1 points accordingly (15, 30 ,40, game, duece, adv, game)
function addPointP1() {
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
    updateScore()
    updatePrevSets()
}

//undo previous action (e.g decrease point and reverse set,game values)
function undo() {
    
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
