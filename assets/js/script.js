//alert("javascript loaded!")

//when #start-game is clicked, display: none to all .title-screen content
//dynamically create the next page layout
//add time to timer
//start counting down timer

const highScoreEl = document.getElementById("highscore");
const timeEl = document.getElementById("time");
const titleScreenEl = document.getElementById("title-screen");
const startGameBtn = document.getElementById("start-game");
const mainEl = document.getElementById("main");

//random number generation
const randomNum = function(min, max) {
  let num = Math.floor(Math.random() * (max + 1 - min)) + min;
  return num;
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

//clears current content(s) on screen
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

  //index of chosen question
  choiceIndex = randomNum(0, questionsLeft.length - 1);
  //selects choice within our question array
  choice = questions[choiceIndex];

  return choice;
}

//creates a new question on the screen
const newQuestion = function(lastAnswerCorrect) {
  const question = chooseQuestion();

  //html section containing question info
  const sectionEl = document.createElement('section');
  sectionEl.className = 'question-container';

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
    answerBtn.textContent = `${i+1}. ${Object.values(question)[2][i][0]}`
    answerContainer.appendChild(answerBtn);
  }

  //append section to main body of html
  mainEl.appendChild(sectionEl);
}

const startGame = function() {
  //clearScreen function expects object
  titleObj = {
    id: "title-screen",
  }

  //clear title screen content
  clearScreen(titleObj);
  newQuestion(null);
}

startGameBtn.addEventListener('click', startGame)