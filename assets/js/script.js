//alert("javascript loaded!")

//when #start-game is clicked, display: none to all .title-screen content
//dynamically create the next page layout
//add time to timer
//start counting down timer

const highScoreEl = document.getElementById("highscore");
const timeEl = document.getElementById("time");
const titleScreenEl = document.getElementById("title-screen");
const startGameBtn = document.getElementById("start-game");

//clears current content(s)
const clearScreen = function(objEl) {
  //create array filled with object values
  objValues = Object.values(objEl);

  //iterate over array
  for (i=0; i < objValues.length; i++) {
    //assign each screen element to be cleared to screenEl
    let screenEl = document.getElementById(objValues[i]);
    //clear screen element
    screenEl.style.display = "none";
  }
  return;
}

const startGame = function(event) {
  event.preventDefault();

  //clearScreen function expects object
  titleObj = {
    id: "title-screen",
  }
  //clear title screen content
  clearScreen(titleObj);
}

startGameBtn.addEventListener('click', startGame)