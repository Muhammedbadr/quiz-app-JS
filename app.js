const enButton = document.getElementById('toggle-en');
const arButton = document.getElementById('toggle-ar');
const toggleBg = document.getElementById('toggle-bg');
const baseURL = "https://opentdb.com/api.php"; // Base URL for the trivia API

function updateButtons(selectedButton) {
  if (selectedButton === enButton) {
    enButton.classList.add('bg-[#2455a2]', 'text-white');
    enButton.classList.remove('bg-white', 'text-[#2455a2]');
    arButton.classList.add('bg-white', 'text-[#2455a2]');
    arButton.classList.remove('bg-[#2455a2]', 'text-white');
    toggleBg.style.transform = 'translateX(0)';
  } else {
    arButton.classList.add('bg-[#2455a2]', 'text-white');
    arButton.classList.remove('bg-white', 'text-[#2455a2]');
    enButton.classList.add('bg-white', 'text-[#2455a2]');
    enButton.classList.remove('bg-[#2455a2]', 'text-white');
    toggleBg.style.transform = 'translateX(100%)';
  }
}

// English
enButton.addEventListener('click', async () => {
  updateButtons(enButton);
  document.querySelector('.quizDiv').classList.add('ltr');
  document.querySelector('.quizDiv').classList.remove('rtl');
  document.querySelectorAll('.btn-option').forEach(button => {
    button.classList.remove('text-right');
    button.classList.add('text-left');
  });
  const questions = await fetchTriviaQuestions('en');
  displayQuestion(questions[0]);
});

// Arabic
arButton.addEventListener('click', async () => {
  updateButtons(arButton);
  document.querySelector('.quizDiv').classList.add('rtl');
  document.querySelector('.quizDiv').classList.remove('ltr');
  document.querySelectorAll('.btn-option').forEach(button => {
    button.classList.remove('text-left');
    button.classList.add('text-right');
  });

  const questions = await fetchTriviaQuestions('ar');
  displayQuestion(questions[0]);
});

// API call to fetch trivia questions
async function fetchTriviaQuestions(language) {
  const langCode = language === 'en' ? 'en' : 'ar';
  const response = await fetch(`${baseURL}?amount=10&category=9&difficulty=medium&type=multiple&lang=${langCode}`);
  const data = await response.json();
  return data.results;
}

// Function to display the question and options
function displayQuestion(questionData) {
  const questionText = document.getElementById('question-text');
  const options = document.querySelectorAll('.btn-option');

  // Set question
  questionText.querySelector('.Q').textContent = questionData.question;

  // Set options
  options.forEach((option, index) => {
    option.textContent = questionData.incorrect_answers[index];
    option.value = 'false';
  });

  // Randomly set the correct answer to one of the options
  const correctIndex = Math.floor(Math.random() * options.length);
  options[correctIndex].textContent = questionData.correct_answer;
  options[correctIndex].value = 'true';
}

// Button handling
const btns = document.querySelectorAll(".btn-option");

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove the active class from all buttons
    btns.forEach(button => button.classList.remove("bg-blue-100"));
    
    // Add the active class to the clicked button
    btn.classList.add("bg-blue-100");
  });
});

// Submit and Next button logic
const submitButton = document.getElementById('next');
const nextButton = document.getElementById('submit');
let lastClickedButton = null;

const QN = document.querySelector('.QN');
let currentQuestionNumber = 1; // Initial question number

nextButton.addEventListener('click', () => {
  // Increment the question number
  currentQuestionNumber += 1;
  QN.textContent = `${currentQuestionNumber}. `;

  // Fetch new question
  fetchTriviaQuestions('en').then(questions => {
    displayQuestion(questions[currentQuestionNumber - 1]);
  });

  // Reset buttons for the next question
  submitButton.classList.remove('hidden');
  nextButton.classList.add('hidden');
});

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    lastClickedButton = btn;
  });
});

submitButton.addEventListener('click', () => {
  // Remove any previous background color classes from all buttons
  btns.forEach(button => {
    button.classList.remove('bg-green-100', 'bg-red-100');
  });
  
  // Apply background color to the correct and incorrect options
  btns.forEach(button => {
    if (button.value === 'true') {
      button.classList.add('bg-green-100');
    } else {
      button.classList.remove('bg-green-100');
    }
  });

  // Apply background color to the last clicked button
  if (lastClickedButton) {
    if (lastClickedButton.value === 'true') {
      lastClickedButton.classList.add('bg-green-100');
    } else {
      lastClickedButton.classList.add('bg-red-100');
    }
  }

  // Hide the "Submit" button and show the "Next" button
  submitButton.classList.add("hidden");
  nextButton.classList.remove("hidden");
});