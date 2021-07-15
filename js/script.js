// ELEMENT VARIABLES
const questionsContainter = document.querySelector(".questions");

let triviaCategories = [
  {
    // For Any category
    id: "", // A blank id is required by the api for any category
    name: "Any Category",
  },
  {
    id: 9,
    name: "General Knowledge",
  },
  {
    id: 10,
    name: "Entertainment: Books",
  },
  {
    id: 11,
    name: "Entertainment: Film",
  },
  {
    id: 12,
    name: "Entertainment: Music",
  },
  {
    id: 13,
    name: "Entertainment: Musicals & Theatres",
  },
  {
    id: 14,
    name: "Entertainment: Television",
  },
  {
    id: 15,
    name: "Entertainment: Video Games",
  },
  {
    id: 16,
    name: "Entertainment: Board Games",
  },
  {
    id: 17,
    name: "Science & Nature",
  },
  {
    id: 18,
    name: "Science: Computers",
  },
  {
    id: 19,
    name: "Science: Mathematics",
  },
  {
    id: 20,
    name: "Mythology",
  },
  {
    id: 21,
    name: "Sports",
  },
  {
    id: 22,
    name: "Geography",
  },
  {
    id: 23,
    name: "History",
  },
  // These object does not appear to work with the api currently
  // {
  //   id: 24,
  //   name: "Politics",
  // },
  // {
  //   id: 25,
  //   name: "Art",
  // },
  {
    id: 26,
    name: "Celebrities",
  },
  {
    id: 27,
    name: "Animals",
  },
  {
    id: 28,
    name: "Vehicles",
  },
  {
    id: 29,
    name: "Entertainment: Comics",
  },
  {
    id: 30,
    name: "Science: Gadgets",
  },
  {
    id: 31,
    name: "Entertainment: Japanese Anime & Manga",
  },
  {
    id: 32,
    name: "Entertainment: Cartoon & Animations",
  },
];

// QUIZ VARIABLES
let questionCount = 10;
let categoryID = triviaCategories[0].id; // Empty string by default for any category
let difficultyList = ["Easy", "Medium", "Hard"];
let difficulty = difficultyList[0];
let multipleChoice = true;
let modalMode = false;
let questions = [];
let answers = [];
let score = 0;

const fetchTriviaData = async () => {
  // Fetch response from API
  let response = await fetch(
    `https://opentdb.com/api.php?amount=${questionCount}&category=${categoryID}&difficulty=${difficulty
    }&type=${multipleChoice ? "multiple" : "boolean"}`
  );

  // Ensure response was successful before proceeding
  if (response.status === 200) {
    // Extract data in JSON format
    let data = await response.json();
    // Add retrieved questions from data and assign them to the array of questions
    if (questions.length === 0) {
      questions = parseTriviaData(data);
    }
    createQuestion();
    // console.log(questions);
  }
};

const parseTriviaData = (data) => {
  // Create an array to store the retrieved questions
  let questionArray = [];
  let results = data.results;
  // Loop through each object of questions and return them
  results.forEach((questionObject, index) => {
    questionArray[index] = questionObject;
  });
  return questionArray;
};

const createQuestion = () => {
  // Loop through each question object
  console.log(questions);
  questions.forEach((object) => {
    // Create the container for the question
    let questionContainer = document.createElement("div");
    let questionID = questions.indexOf(object);
    questionContainer.classList.add("question-container");
    questionContainer.id = `Question${questionID}`;

    // Create the label for the question label
    let questionLabel = document.createElement("p");
    questionLabel.innerHTML = `Question ${questionID + 1}`;
    questionLabel.classList.add("question-label");
    questionContainer.appendChild(questionLabel);

    // Create the label for the question text
    let questionText = document.createElement("p");
    questionText.innerHTML = `${object.question}`;
    questionContainer.appendChild(questionText);

    let allAnswers = [object["correct_answer"], ...object["incorrect_answers"]];
    questionContainer.appendChild(createAnswers(allAnswers, questionID));

    // Configure Question Container Buttons for Modal Mode
    if (modalMode) {
      questionContainer.classList.add("question-modal");
      let qModalBtnWrapper = document.createElement("div");
      qModalBtnWrapper.className = "button-toggle-wrapper";
      // CREATE LEFT BUTTON
      let qModalBtnLeft = document.createElement("button");
      qModalBtnLeft.className = "previous-question-btn";
      qModalBtnLeft.innerHTML = "Previous";
      qModalBtnLeft.onclick = previousQuestion;
      // CREATE RIGHT BUTTON 
      let qModalBtnRight = document.createElement("button");
      qModalBtnRight.className = "next-question-btn";
      qModalBtnRight.innerHTML = "Next";
      qModalBtnRight.onclick = nextQuestion;
      qModalBtnWrapper.appendChild(qModalBtnLeft);
      qModalBtnWrapper.appendChild(qModalBtnRight);
      questionContainer.appendChild(qModalBtnWrapper);
      // SET ACTIVE QUESTION ON TOP
      if (questionID === 0) {
        console.log(questionContainer.style.zIndex);
        questionContainer.classList.add("active");
        questionContainer.style.zIndex = 100;
      } else {
        questionContainer.style.zIndex = -100;
      }
    }

    questionsContainter.appendChild(questionContainer);
  });
  showSubmitButton();
};

const previousQuestion = () => {
  let questions = Array.from(document.querySelectorAll(".question-modal"));
  let activeQuestion = document.querySelector(".active");
  let nextID = questions.indexOf(activeQuestion)+1;
  if (nextID >= questions.length) {
    activeQuestion.style.zIndex = -100;
    activeQuestion.classList.remove("active");
    let previousQuestion = document.querySelector(`#Question${Number(nextID)}`);
    previousQuestion.style.zIndex = 100;
    previousQuestion.classList.add("active");
  } else {
    activeQuestion.style.zIndex = -100;
    activeQuestion.classList.remove("active");
    let previousQuestion = document.querySelector(`#Question${questions.length-1}`);
    previousQuestion.style.zIndex = 100;
    previousQuestion.classList.add("active");
  }
}

const nextQuestion = () => {
  let questions = Array.from(document.querySelectorAll(".question-modal"));
  let activeQuestion = document.querySelector(".active");
  let nextID = questions.indexOf(activeQuestion)+1;
  if (nextID < questions.length) {
    activeQuestion.style.zIndex = -100;
    activeQuestion.classList.remove("active");
    let nextQuestion = document.querySelector(`#Question${Number(nextID)}`);
    nextQuestion.style.zIndex = 100;
    nextQuestion.classList.add("active");
  } else {
    activeQuestion.style.zIndex = -100;
    activeQuestion.classList.remove("active");
    let nextQuestion = document.querySelector(`#Question0`);
    nextQuestion.style.zIndex = 100;
    nextQuestion.classList.add("active");
  }
}

const showSubmitButton = () => {
  let configBtn = document.querySelector(".main-button");
  if (configBtn) {
    configBtn.classList.remove("main-button");
  }
  let submitBtn = document.querySelector(".submit");
  submitBtn.style.visibility = "visible";
}

const createAnswers = (answers, questionID) => {
  // Create unordered list of answers
  let answersList = document.createElement("ul");
  answersList.classList.add("answers");
  let answerID = questionID;

  // RANDOMIZE ANSWERS (TODO: FIND A BETTER WAY)
  answers.sort(() => Math.random() - 0.5);
  answers.sort(() => Math.random() - 0.5);
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    // Create item for answer
    let item = document.createElement("li");

    // Create the radio input
    let input = document.createElement("input");
    input.type = "radio";
    input.name = `Answers${answerID}`;
    input.id = answer;
    input.value = answer;
    // item.appendChild(input);

    // Create the label tag
    let label = document.createElement("label");
    label.for = answer;
    // Add the radio input before the text
    label.appendChild(input);
    // Add the text in addition to the radio input (so the input and text and clickable)
    label.innerHTML += answer;
    item.appendChild(label);

    answersList.appendChild(item);
  });
  return answersList;
};

const collectAnswers = () => {
  // Get all list of answers
  let answersListAll = document.querySelectorAll(".answers");
  answers = new Array(questionCount);
  answers[0] = undefined;

  // Iterate through each individual set of answer lists per question
  answersListAll.forEach((answersList, listIndex) => {
    // Get a list of all possible answers
    let answerList = answersList.querySelectorAll("input");
    // Get the users actual response
    answerList.forEach((answerOption) => {
      if (answerOption.checked) {
        answers[listIndex] = answerOption.value;
      }
    });
  });
};

const calculateScore = () => {
  // Collect Answers to calcualte score
  collectAnswers();
  score = 0;

  questions.forEach((question, index) => {
    if (question.correct_answer === answers[index]) {
      score++;
    }
  });

  console.log("SCORE = " + score);
};

// DISPLAY TRIVIA MODEL
const displayTriviaConfig = () => {
  if (document.querySelector(".modal-config-wrapper")) {
    let modal = document.querySelector(".modal-config-wrapper");
    modal.remove();
  }

  // Create modal wrapper
  let modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-config-wrapper");

  // Create a Results Section Modal
  let configModal = document.createElement("section");
  configModal.classList.add("modal");
  configModal.classList.add("config");

  // Create the header
  let configHeader = document.createElement("h2");
  configHeader.innerHTML = "Configure Your Trivia!";
  configModal.appendChild(configHeader);

  // Create the Close Modal button
  let closeModalBtn = document.createElement("button");
  closeModalBtn.classList.add("close-modal-btn");
  closeModalBtn.innerHTML = "x";
  closeModalBtn.onclick = closeConfigModal;
  configModal.appendChild(closeModalBtn);

  // Create a list for all trivia config options
  let configList = document.createElement("ul");

  // Create Question Number Selector
  let questionNumItem = document.createElement("li");
  let questionNumLabel = document.createElement("label");
  questionNumLabel.innerHTML = "Number of Questions: ";
  let questionNumInput = document.createElement("input");
  questionNumInput.classList.add("question-amount");
  questionNumInput.type = "number";
  questionNumInput.name = "question-amount";
  questionNumInput.value = "10";
  questionNumInput.min = "1";
  questionNumInput.max = "20";
  questionNumItem.appendChild(questionNumLabel);
  questionNumItem.appendChild(questionNumInput);
  configList.appendChild(questionNumItem);
  // <input type="range" id="a" name="a" value="50"></input>

  // Create Category Selector
  let selectorItem = document.createElement("li");
  let selectorLabel = document.createElement("label");
  selectorLabel.innerHTML = "Choose a Trivia Category: ";
  let selector = document.createElement("select");
  selector.name = "trivia-category";
  selector.classList.add("trivia-category");
  // Loop through each category and create an option tag for each
  triviaCategories.forEach(category => {
    let option = document.createElement("option");
    option.value = category.name;
    option.innerHTML = category.name;
    // option.class = category.id;
    selector.appendChild(option);
  });
  selectorItem.appendChild(selectorLabel);
  selectorItem.appendChild(selector);
  configList.appendChild(selectorItem);

  // Create Difficulty Selector
  let difficultyItem = document.createElement("li");
  let difficultyLabel = document.createElement("label");
  difficultyLabel.innerHTML = "Select a difficulty: ";
  let difficultySelector = document.createElement("select");
  difficultySelector.name = "difficulty";
  difficultySelector.classList.add("difficulty");
  difficultyList.forEach(difficulty => {
    let option = document.createElement("option");
    option.value = difficulty;
    option.innerHTML = difficulty;
    difficultySelector.appendChild(option);
  });
  difficultyItem.appendChild(difficultyLabel);
  difficultyItem.appendChild(difficultySelector);
  configList.appendChild(difficultyItem);

  // Create Modal Option
  qModalItem = document.createElement("li");
  qModalLabel = document.createElement("label");
  qModalLabel.innerHTML = "Question Layout: ";
  let qModalToggle = document.createElement("select");
  qModalToggle.className = "question-modal-toggle";
  let qModalFalseOption = document.createElement("option");
  qModalFalseOption.value = "List";
  qModalFalseOption.innerHTML = "List";
  let qModalTrueOption = document.createElement("option");
  qModalTrueOption.value = "Modal";
  qModalTrueOption.innerHTML = "Modal";
  qModalToggle.appendChild(qModalFalseOption);
  qModalToggle.appendChild(qModalTrueOption);
  qModalItem.appendChild(qModalLabel);
  qModalItem.appendChild(qModalToggle);
  configList.appendChild(qModalItem);

  // Add config list items to modal
  configModal.appendChild(configList);

  // Create the Start Trivia button
  let btnWrapper = document.createElement("div");
  btnWrapper.classList.add("button-wrapper");
  let startBtn = document.createElement("button");
  startBtn.innerHTML = "Start Trivia";
  startBtn.onclick = startTrivia;
  btnWrapper.appendChild(startBtn);
  configModal.appendChild(btnWrapper);

  modalWrapper.appendChild(configModal);
  document.body.appendChild(modalWrapper);
};

// START TRIVIA FUNCTION
const startTrivia = () => {
  // Get the selected amount of questions
  let questionNumInput = document.querySelector(".question-amount");
  if (questionNumInput && Number(questionNumInput.value)) {
    questionCount = questionNumInput.value;
  }

  // Get the selected trivia category and loop to find the selected option
  let categorySelector = document.querySelector(".trivia-category");
  triviaCategories.forEach(category => {
    if (categorySelector.value === category.name) {
      categoryID = category.id;
    }
  });

  // Get the selected difficulty
  let difficultySelector = document.querySelector(".difficulty");
  if (difficultySelector) {
    difficulty = difficultySelector.value.toLowerCase();
  }

  // Get Selected Question Layout
  let qModalToggle = document.querySelector(".question-modal-toggle");
  if (qModalToggle.value === "List") {
    modalMode = false;
  } else if (qModalToggle.value === "Modal") {
    modalMode = true;
  }

  questions = [];
  questionsContainter.innerHTML = "";

  fetchTriviaData();
  closeConfigModal();
};

// *********************
// DISPLAY RESULTS MODAL
// *********************
const displayResults = () => {
  if (document.querySelector(".modal-results-wrapper")) {
    let modal = document.querySelector(".modal-results-wrapper");
    modal.remove();
  }

  // Calculate Score to display
  calculateScore();

  // Create modal wrapper
  let modalWrapper = document.createElement("div");
  modalWrapper.classList.add("modal-results-wrapper");

  // Create a Results Section Modal
  let resultsModal = document.createElement("section");
  resultsModal.classList.add("modal");
  resultsModal.classList.add("results");

  // Create the header
  let resultsHeader = document.createElement("h2");
  resultsHeader.innerHTML = "Results";
  resultsModal.appendChild(resultsHeader);

  // Create the Score Display
  let scoreDisplay = document.createElement("p");
  scoreDisplay.innerHTML = "Questions Correct: " + score;
  resultsModal.appendChild(scoreDisplay);

  // Display results of questions
  let resultsContainer = document.createElement("div");
  questions.forEach((question, index) => {
    // Create a container for the question result
    let questionResult = document.createElement("div");
    questionResult.className = "question-result";
    // Display the Question Label 
    let questionLabel = document.createElement("p");
    questionLabel.className = "question-label";
    questionLabel.innerHTML = `Question ${index + 1}`;
    questionResult.append(questionLabel);
    // Display the Question Text itself
    let questionText = document.createElement("p");
    questionText.innerHTML = question.question;
    questionResult.append(questionText);

    // Display the responded answer
    let responseLabel = document.createElement("p");
    responseLabel.classList.add("answer-label");
    responseLabel.innerHTML = "Your Response: ";
    let responseText = document.createElement("span");
    // Check if response was given for question (or not)
    if (answers[index]) {
      responseText.innerHTML = answers[index];
      // Check if the response was correct;
      (answers[index] === question.correct_answer) ?
        responseText.classList.add("correct") :
        responseText.classList.add("incorrect");
      responseLabel.append(responseText);
    } else {
      responseLabel.innerHTML = "You did not answer this question";
    }
    questionResult.append(responseLabel);

    // Display the correct answer
    let correctLabel = document.createElement("p");
    correctLabel.classList.add("answer-label");
    correctLabel.innerHTML = "Correct Answer: ";
    let correctText = document.createElement("span");
    correctText.className = "correct";
    correctText.innerHTML = question.correct_answer;
    correctLabel.append(correctText);
    questionResult.append(correctLabel);

    resultsContainer.append(questionResult);
  });
  resultsModal.append(resultsContainer);

  // Create the Close Modal button
  let closeModalBtn = document.createElement("button");
  closeModalBtn.classList.add("close-modal-btn");
  closeModalBtn.innerHTML = "x";
  closeModalBtn.onclick = closeResultsModal;
  resultsModal.appendChild(closeModalBtn);

  modalWrapper.appendChild(resultsModal);
  document.body.appendChild(modalWrapper);
};

const closeConfigModal = () => {
  let modal = document.querySelector(".modal-config-wrapper");
  modal.style.visibility = "hidden";
};

const closeResultsModal = () => {
  let modal = document.querySelector(".modal-results-wrapper");
  modal.style.visibility = "hidden";
};

document.addEventListener("click", (event) => {
  if (event.target.className === "modal-config-wrapper") {
    closeConfigModal();
  } else if (event.target.className === "modal-results-wrapper") {
    closeResultsModal();
  }
});