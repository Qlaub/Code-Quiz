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
  userSelection = this.id;
  console.log(userSelection)

  //if not
  if (userSelection === "answer-false") {
    //penalize 10 seconds
    currentTime = parseInt(timeEl.textContent);
    timeEl.textContent = `${currentTime - 10}`;

    return newQuestion(false);
  }
  return newQuestion(true);
}

const endGame = function() {

  //clears screen of questions
  const screenObj = {
    id: 'question-container',
  }
  clearScreen(screenObj);

  //create container for end screen
  const endScreenEl = document.createElement('section');
  endScreenEl.id = 'end-container';

  //end screen header
  const endHeaderEl = document.createElement('h2');
  endHeaderEl.textContent = "All done!";
  endScreenEl.appendChild(endHeaderEl);

  //end screen final score display
  const endScoreEl = document.createElement('p');
  const finalScore = parseInt(timeEl.innerText);
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

  mainEl.appendChild(endScreenEl);

  //display time as final score
  //create submit box for entering as high score
  //stores high score
  //then takes user to high score page
}

//creates a new question at random on the screen
const newQuestion = function(lastAnswerCorrect) {
  const question = chooseQuestion();

  //only create question page html on first question
  if (!document.getElementById('question-container')) {
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

startGameBtn.addEventListener('click', startGame)