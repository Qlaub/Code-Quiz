//alert("javascript loaded!")

//when #start-game is clicked, display: none to all .title-screen content
//dynamically create the next page layout
//add time to timer
//start counting down timer

const viewHighScoreEl = document.getElementById("highscore");
const viewScoreContainerEl = document.getElementById('highscore-box')
const timeEl = document.getElementById("time");
const titleScreenEl = document.getElementById("title-screen");
const startGameBtn = document.getElementById("start-game");
const mainEl = document.getElementById("main");
const headerEl = document.getElementById('header');
const bodyEl = document.getElementById('body');
let clockCountdown = undefined;
let answerClear = undefined;

//random number generation
const randomNum = function(min, max) {
  let num = Math.floor(Math.random() * (max + 1 - min)) + min;
  return num;
}

//decrements clock by one second
const secondDown = function() {
  secondsLeft = timeEl.textContent - 1;
  timeEl.textContent = `${secondsLeft}`;
  if (secondsLeft <= 0) {
    return endGame();
  }
}

//quiz questions
let questions = [
  {
    //keeps track of whether the question has been answered by the user
    answered: false,
    //text of question
    questionText: "Commonly used data types DO NOT include:",
    //answers paired with their boolean value
    answerText: [["strings", false], ["booleans", false], ["alerts", true], ["numbers", false]],
  },
  {
    answered: false,
    questionText: "The condition in an if / else statement is enclosed with _________.",
    answerText: [["quotes", false], ["curly brackets", false], ["parenthesis", true], ["square brackets", false]],
  },
  {
    answered: false,
    questionText: "Arrays in JavaScript can be used to store:",
    answerText: [["numbers and strings", false], ["other arrays", false], ["booleans", false], ["all of the above", true]],
  },
  {
    answered: false,
    questionText: "String values must be enclosed within _____ when being assigned to variables.",
    answerText: [["commas", false], ["curly brackets", false], ["quotes", true], ["parenthesis", false]],
  },
  {
    answered: false,
    questionText: "A very useful tool used during development and debugging for printing content to the debugger is:",
    answerText: [["JavaScript", false], ["terminal/bash", false], ["for loops", false], ["console.log", true]],
  }
]

const startGame = function() {
  //clearScreen function expects object
  const titleObj = {
    id: "title-screen",
  }

  //clear title screen content
  clearScreen(titleObj);
  //adds 75 seconds to the clock
  timeEl.textContent = '75';
  //pulls up first question
  newQuestion(null);
}

//clears current content(s) on screen
const clearScreen = function(objEl) {
  debugger;
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

const showUserAnswer = function(answer) {
  let showContainer = document.getElementById('incorrect-correct-container')
  //create show answer elements if on first question
  if (answer === null && !showContainer) {
    showContainer = document.createElement('section')
    showContainer.id = 'incorrect-correct-container';
    showContainer.style.display = 'none';
    bodyEl.appendChild(showContainer);

    const showAnswer = document.createElement('p');
    showAnswer.id = 'incorrect-correct';
    showContainer.appendChild(showAnswer);
    return;
  }
  const previousAnswer = {
    id: 'incorrect-correct',
  }
  clearTimeout(answerClear);
  clearScreen(previousAnswer);
  const showAnswer = document.getElementById('incorrect-correct');
  if (answer) {
    showContainer.style.display = 'flex';
    showAnswer.style.display = 'flex';
    showAnswer.textContent = `Correct!`
  } else if (answer === false) {
    showContainer.style.display = 'flex';
    showAnswer.style.display = 'flex';
    showAnswer.textContent = `Incorrect!`
  }
  answerClear = setTimeout(clearAnswer, 5000);
}

const clearAnswer = function() {
  const element = document.getElementById('incorrect-correct-container');
  if (element) {
    answer = {
      id: 'incorrect-correct-container',
    }
    clearScreen(answer);
  }
}

//creates a new question at random on the screen
const newQuestion = function(lastAnswerBoolean) {
  showUserAnswer(lastAnswerBoolean);

  //clock starts counting down
  if (clockCountdown === undefined) {
    clockCountdown = setInterval(secondDown, 1000);
  }

  const question = chooseQuestion();
  const questionContainerEl = document.getElementById('question-container');
  if ((questionContainerEl) && questionContainerEl.style.display === 'none') {
    questionContainerEl.style.display = 'flex';
  }

  //only create question page html on first question
  if (!questionContainerEl) {
    //html section containing question info
    const sectionEl = document.createElement('section');
    sectionEl.className = 'question-container';
    sectionEl.id = 'question-container'

    //h2 question header creation
    const headingEl = document.createElement('h2');
    headingEl.className = 'question-header';
    headingEl.textContent = Object.values(question)[1];
    sectionEl.appendChild(headingEl)

    //div button container
    const answerContainer = document.createElement('div');
    answerContainer.className = 'answer-container';
    sectionEl.appendChild(answerContainer);

    //button creation one at a time
    for (let i=0; i < 4; i++) {
      let answerBtn = document.createElement('button');
      answerBtn.className = 'answer-btn';
      answerBtn.textContent = `${i+1}. ${Object.values(question)[2][i][0]}`;
      //id is either 'answer-true' or 'answer-false'
      answerBtn.id = `answer-${Object.values(question)[2][i][1]}`;
      answerContainer.appendChild(answerBtn);
    }

    //append section to main body of html
    mainEl.appendChild(sectionEl);

    answerBtnEls = document.querySelectorAll(".answer-btn");
    //click event listener added to buttons
    for (let i=0; i < answerBtnEls.length; i++) {
      answerBtnEls[i].addEventListener('click', checkQuestion)
    }
  } else if (question === false) {
    //if no questions left, go to end screen
    endGame();

  } else { 
    //if not first question, update page html to next question
    //update heading
    const headingEl = document.querySelector('.question-header');
    headingEl.textContent = Object.values(question)[1];

    //update answer buttons one at a time
    const answerBtnArray = document.querySelectorAll('.answer-btn')
    for (let i=0; i < 4; i++) {
      answerBtnArray[i].textContent = `${i+1}. ${Object.values(question)[2][i][0]}`;
      answerBtnArray[i].id = `answer-${Object.values(question)[2][i][1]}`;
    }
  }
}

const chooseQuestion = function() {
  let questionsLeft = [];

  //iterate through all questions
  for (let i=0; i < questions.length; i++) {
    //has question been answered
    answered = Object.values(questions[i])[0]
    //if question hasn't been answered, add to array
    if (!answered) {
      questionsLeft.push(i)
    }
  }

  //if no questions left end the game
  if (questionsLeft.length === 0) {
    return false;
  }

  //choose random question within questions left
  let questionsLeftIndex = randomNum(0, questionsLeft.length - 1);
  let questionsIndex = questionsLeft[questionsLeftIndex]
  let choice = questions[questionsIndex];

  //mark question as having been asked
  choice.answered = true;

  return choice;
}

const checkQuestion = function(event) {
  //was users answer correct
  const userSelection = this.id;
  console.log(userSelection)

  //if not
  if (userSelection === "answer-false") {
    //penalize 10 seconds
    currentTime = parseInt(timeEl.textContent);
    timeEl.textContent = `${currentTime - 10}`;

    //stops game if time is below zero after answering incorrectly
    if (currentTime <= 0) {
      return endGame();
    }

    return newQuestion(false);
  }
  return newQuestion(true);
}

const endGame = function() {
  //clears timeout function
  clearTimeout(clockCountdown);
  clockCountdown = undefined;

  //clears screen of questions
  const screenObj = {
    id: 'question-container',
  }
  clearScreen(screenObj);

  //if page already exists, display it
  const endEl = document.getElementById('end-container');
  if ((endEl) && endEl.style.display === 'none') {
    endEl.style.display = 'flex';
    //update score
    let finalScore = parseInt(timeEl.innerText);
    const endScoreEl = document.getElementById('final-score-display');
    endScoreEl.textContent = `Your final score is ${finalScore}`;
    //empty input field
    const inputEl = document.getElementById('initials-input');
    inputEl.value = '';
    return;
  }

  //create container for end screen
  const endScreenEl = document.createElement('section');
  endScreenEl.id = 'end-container';

  //end screen header
  const endHeaderEl = document.createElement('h2');
  endHeaderEl.textContent = "All done!";
  endScreenEl.appendChild(endHeaderEl);

  //end screen final score display
  const endScoreEl = document.createElement('p');
  endScoreEl.id = 'final-score-display';
  let finalScore = parseInt(timeEl.innerText);
  endScoreEl.textContent = `Your final score is ${finalScore}`;
  endScreenEl.appendChild(endScoreEl);

  //container to hold user initials submission
  const submitContainerEl = document.createElement('div');
  submitContainerEl.id = 'submit-container'
  endScreenEl.appendChild(submitContainerEl);

  //create 'Enter initials' text
  const initialsEl = document.createElement('span');
  initialsEl.textContent = 'Enter initials:';
  submitContainerEl.appendChild(initialsEl);

  //input element
  const inputEl = document.createElement('input');
  inputEl.id = 'initials-input';
  submitContainerEl.appendChild(inputEl);

  //button element
  const submitBtnEl = document.createElement('button');
  submitBtnEl.id = 'submit-btn';
  submitBtnEl.innerText = "Submit"
  submitContainerEl.appendChild(submitBtnEl);
  //listens for click on submit button
  submitBtnEl.addEventListener('click', scoreSubmit);

  //append everything to main page
  mainEl.appendChild(endScreenEl);

  //display time as final score
  //create submit box for entering as high score
  //stores high score
  //then takes user to high score page
}

const scoreSubmit = function() {
  const check = logScore();
  if (check === false) {
    return;
  }
  return highScorePage();
}

const logScore = function() {
  const userInitials = document.getElementById('initials-input').value
  const userScore = timeEl.innerText;
  const userData = [userInitials, userScore];

  //guard clause if user hasn't entered anything into input field
  if (!userInitials) {
    alert("Please enter your initials!");
    return false;
  }
  //retrieve high score storage
  const highScoreKey = "high score";
  let currentHighScores = JSON.parse(localStorage.getItem(highScoreKey));

  //if no high scores exist, create high score local storage with value being an array (to hold top 5 high scores)

  if (!currentHighScores) {
    const highScore = [userData];
    localStorage.setItem(highScoreKey, JSON.stringify(highScore));
    console.log("No current high scores, creating local storage")
  } else {
    //if high scores already exist, see if user has new high score
    console.log("Comparing user score to current high scores")
    compareScores(userData, currentHighScores);
    return true;
  }
  //clears user input
  const inputEl = document.getElementById('initials-input');
  inputEl.value = '';
  return true;
}

const highScorePage = function() {
  debugger;
  clearTimeout(clockCountdown);
  clockCountdown = undefined;
  clearAnswer();
  //finds first child element of main body that is being displayed
  //needs to be fixed because it will find elements with display: none;
  //going from questions to view high scores will not get rid of questions pages as a result
  //find way to iterate through child objects and only select one with display: flex and have it NOT be a text node
  //possible way is to have it match 'nodeType == Node.ELEMENT_NODE'
  const childrenEls = mainEl.children;
  let chosenChild = undefined;
  for (let i=0; i < childrenEls.length; i++) {
    let childDisplay = childrenEls[i].style.display
    if (childDisplay != 'none' && childrenEls[i].nodeType == Node.ELEMENT_NODE) {
      chosenChild = childrenEls[i];
      break;
    }
  }
  const page = {
    id1: 'header',
    id2: chosenChild.id,
  };
  clearScreen(page);
  const questionPageEl = document.getElementById('score-parent-container')
  if ((questionPageEl) && questionPageEl.style.display === "none") {
    return updateScorePage();
  }
  //multiple containing elements in order to take advantage of flex centering property
  const scoreParentContainerEl = document.createElement('section');
  scoreParentContainerEl.id = 'score-parent-container';
  const scoreChildContainerEl = document.createElement('section');
  scoreChildContainerEl.id = 'score-child-container';
  scoreParentContainerEl.appendChild(scoreChildContainerEl);

  //header text
  const scoreHeaderEl = document.createElement('h2');
  scoreHeaderEl.id = 'score-header';
  scoreHeaderEl.innerText = 'High scores';
  scoreChildContainerEl.appendChild(scoreHeaderEl);

  //unordered list
  const scoreListEl = document.createElement('ul');
  scoreListEl.id = 'score-list'
  scoreChildContainerEl.appendChild(scoreListEl);

  const highScoreKey = "high score";
  const scores = JSON.parse(localStorage.getItem(highScoreKey));

  //list items
  if (scores != null) {
    for (let i=0; i < scores.length; i++) {
      let listItemEl = document.createElement('li');
      listItemEl.className = 'high-score';
      listItemEl.textContent = `${i+1}. ${scores[i][0]} - ${scores[i][1]}`;
      scoreListEl.appendChild(listItemEl);
    }
  } else {
    let listItemEl = document.createElement('li');
    listItemEl.className = 'high-score';
    listItemEl.textContent = `No high scores!`;
    scoreListEl.appendChild(listItemEl);
  }

  //buttons container
  const btnContainerEl = document.createElement('div');
  btnContainerEl.id = 'high-score-button-container';
  scoreChildContainerEl.appendChild(btnContainerEl);

  //buttons
  const againBtnEl = document.createElement('button');
  const clearBtnEl = document.createElement('button');
  againBtnEl.className = 'high-score-buttons';
  clearBtnEl.className = 'high-score-buttons';
  againBtnEl.textContent = 'Play again';
  clearBtnEl.textContent = 'Clear high scores';
  againBtnEl.addEventListener('click', playAgain);
  clearBtnEl.addEventListener('click', removeScores);
  btnContainerEl.appendChild(againBtnEl);
  btnContainerEl.appendChild(clearBtnEl);

  mainEl.appendChild(scoreParentContainerEl);
  return;
}

const compareScores = function(currentScore, highScores) {
  let index = undefined;
  const highScoreKey = "high score";
  for (let i=0; i < highScores.length; i++) {
    //if high score list is already full  
    if (highScores.length === 5) {
      if (highScores[i][1] < currentScore[1]) {
        //and if user score is a new high score, add it and get rid of bottom score
        highScores.splice(i, 0, currentScore);
        highScores.pop();
        console.log("high score list full, new score added")
        localStorage.setItem(highScoreKey, JSON.stringify(highScores));
        return;
      }
      //user has a new high score
    } else if (highScores[i][1] < currentScore[1]) {
      highScores.splice(i, 0, currentScore);
      console.log("new high score")
      localStorage.setItem(highScoreKey, JSON.stringify(highScores));
      return;
      //log last index of tied high score
    } else if (highScores[i][1] === currentScore[1]) {
      index = i
      //user has a high score that is lower than all other high scores
    } else if (i+1 == highScores.length) {
      highScores.splice(highScores.length, 0, currentScore);
      console.log("lowest high score inserted")
      localStorage.setItem(highScoreKey, JSON.stringify(highScores));
      return;
    }
  }
  //update tied high score into lowest tied spot
  if (index != undefined) {
    highScores.splice(index+1, 0, currentScore);
    console.log("tied high score inserted")
    localStorage.setItem(highScoreKey, JSON.stringify(highScores));
    return;
  }
}

const playAgain = function() {
  //git rid of high score screen
  const scoreSection = {
    id: 'score-parent-container'
  }
  clearScreen(scoreSection);
  
  headerEl.style.display = 'flex';
  titleScreenEl.style.display = 'flex';
  startGameBtn.addEventListener('click', startGame);
  timeEl.textContent = '0';
  questions.forEach((question) => {
    console.log(question);
    question.answered = false;
  })
  return;
}

const removeScores = function() {
  const highScoreKey = 'high score';
  localStorage.removeItem(highScoreKey);
  return updateScorePage();
}

const updateScorePage = function() {
  const questionPageEl = document.getElementById('score-parent-container')
  const scoreListEl = document.getElementById('score-list')
  const highScoreKey = "high score";
  const scores = JSON.parse(localStorage.getItem(highScoreKey));

  //remove current high scores
  while (scoreListEl.firstChild) {
    scoreListEl.removeChild(scoreListEl.lastChild);
  }

  //if user has saved scores, update them
  if (scores) {
    for (let i=0; i < scores.length; i++) {
      let listItemEl = document.createElement('li');
      listItemEl.className = 'high-score';
      listItemEl.textContent = `${i+1}. ${scores[i][0]} - ${scores[i][1]}`;
      scoreListEl.appendChild(listItemEl);
    }
  } else {
    let listItemEl = document.createElement('li');
    listItemEl.className = 'high-score';
    listItemEl.textContent = `No high scores!`;
    scoreListEl.appendChild(listItemEl);
  }

  //show page elements
  if (questionPageEl.style.display === 'none') {
    questionPageEl.style.display = 'flex';
  }
  return;
}

viewScoreContainerEl.addEventListener('click', highScorePage)
startGameBtn.addEventListener('click', startGame)