// Declare word list
const wordList = [
  "gold",
  "luck",
  "rain",
  "green",
  "jig",
  "hat",
  "coin",
  "wish",
  "ale",
  "clover",
  "charm",
  "pinch",
  "dance",
  "parade",
  "shamrock",
  "fortune",
  "feast",
  "mischief",
  "leprechaun",
  "treasure",
  "rainbow",
  "whiskey",
  "limerick",
  "tradition",
  "shenanigans",
  "celebration",
  "greenery",
  "magical",
  "celtic",
  "ireland",
  "dublin",
  "fiddle",
  "brogue",
  "bagpipes",
  "gaelic",
];

// Declare variables
let selectedWord = "";
let displayedWord = "";
let wrongGuesses = 0;
let guessedLetters = [];
let gameOver = false;
const maxMistakes = 6;

// Add event listener for "Enter" key to add task
document
  .getElementById("letterInput")
  .addEventListener("keydown", function (event) {
    // If "Enter" is pressed, add the task
    if (event.key === "Enter") guessLetter();
  });

// Start game function (runs everything)
function startGame(level) {
  // Reset game
  wrongGuesses = 0;
  guessedLetters = [];

  selectedWord = getRandomWord(level);
  displayedWord = "_".repeat(selectedWord.length);
  updateDifficultyDisplay(level);
  updateUI();

  // Show game area/difficulty by display hide selection buttons
  document.getElementById("gameArea").classList.remove("d-none");
  document.getElementById("gameArea").classList.add("d-block");

  document.getElementById("difficultyBox").classList.remove("d-none");
  document.getElementById("difficultyBox").classList.add("d-block");

  document.getElementById("difficultySelection").classList.add("d-none");
  document.getElementById("wordEntryBox").classList.add("d-none");

  // Auto focus on input
  document.getElementById("letterInput").focus();
}

// Start game with player-entered custom word
function startCustomWordGame() {
  const input = document
    .getElementById("customWordInput")
    .value.trim()
    .toLowerCase();
  if (!input.match(/^[a-z]{3,20}$/)) {
    const errorBox = document.getElementById("wordEntryError");
    errorBox.textContent =
      "Please enter a valid word (3–20 letters, A–Z only).";
    errorBox.classList.remove("d-none");
    return;
  }

  wrongGuesses = 0;
  guessedLetters = [];
  selectedWord = input;
  displayedWord = "_".repeat(selectedWord.length);
  document.getElementById("difficultyBox").classList.remove("d-none");
  document.getElementById("difficultyBox").classList.add("d-block");
  document.querySelector("#difficultyBox .fw-bold").textContent =
    "Difficulty: Friend Mode";
  document.getElementById("wordEntryError").classList.add("d-none");
  updateUI();

  document.getElementById("gameArea").classList.remove("d-none");
  document.getElementById("gameArea").classList.add("d-block");
  document.getElementById("difficultySelection").classList.add("d-none");
  document.getElementById("wordEntryBox").classList.add("d-none");
  document.getElementById("letterInput").focus();
}

function getRandomWord(level) {
  let filteredWords = wordList.filter((word) => {
    if (level === "easy") return word.length <= 4;
    if (level === "medium") return word.length >= 5 && word.length <= 7;
    if (level === "hard") return word.length >= 8;
  });

  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

// Update difficulty display
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById("difficultyBox");
  difficultyBox.classList.remove("easy", "medium", "hard");

  if (level === "easy") {
    difficultyBox.textContent = "Difficulty: Easy";
    difficultyBox.classList.add("easy");
  } else if (level === "medium") {
    difficultyBox.textContent = "Difficulty: Medium";
    difficultyBox.classList.add("medium");
  } else if (level === "hard") {
    difficultyBox.textContent = "Difficulty: Hard";
    difficultyBox.classList.add("hard");
  }
}

function updateUI() {
  document.getElementById("wordDisplay").textContent = displayedWord
    .split("")
    .join(" ");
}

function guessLetter() {
  if (gameOver) return; // Prevent guessing if game is over

  let inputField = document.getElementById("letterInput"); // Get input field
  let guessedLetter = inputField.value.toLowerCase(); // Convert input to lowercase

  // Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)) {
    showMessage("Please enter a valid letter (A-Z)!"); // Alert user if invalid input
    inputField.value = ""; // Clear input field
    return; // Exit function
  }

  // Check if letter was already guessed
  if (guessedLetters.includes(guessedLetter)) {
    showMessage(
      `You already guessed '${guessedLetter}'. Try a different letter!`
    ); // Alert user if invalid input
    inputField.value = ""; // Clear input field
    return; // Exit function
  }

  // Store guessed letter
  guessedLetters.push(guessedLetter);

  // Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)) {
    updateCorrectGuess(guessedLetter);
  } else {
    updateWrongGuess(guessedLetter);
  }

  inputField.value = ""; // Clear input field
  document.getElementById("letterInput").focus(); // Refocus input field for next guess
}

function showMessage(message) {
  const box = document.getElementById("endBox");
  const msg = document.getElementById("endMsg");
  msg.textContent = message;
  box.classList.remove("d-none");
}

function updateWrongGuess(guessedLetter) {
  wrongGuesses++;
  document.getElementById("wrongLetters").textContent += `${guessedLetter}`;

  // Retrieve the audio element for the "wrong" sound effect
  const wrongsound = document.getElementById("wrongsound");

  // Reset playback position to the beginning to ensure it can be replayed
  wrongsound.currentTime = 0;

  // Play the sound effect
  wrongsound.play();

  // document.getElementById("shamrock").src = `imgs/shamrock${6 - wrongGuesses}.jpg`;

  if (wrongGuesses === maxMistakes) {
    endGame(false);
  }
}

function updateCorrectGuess(guessedLetter) {
  let newDisplayedWord = "";

  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === guessedLetter) {
      newDisplayedWord += guessedLetter; // Replace underscore with correct letter
    } else {
      newDisplayedWord += displayedWord[i]; // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord;
  updateUI();

  // Retrieve the audio element for the "correct" sound effect
  const correctsound = document.getElementById("correctsound");

  // Reset playback position to the beginning to ensure it can be replayed
  correctsound.currentTime = 0;

  // Play the sound effect
  correctsound.play();

  //  Check if the player has guessed all letters
  if (!displayedWord.includes("_")) {
    endGame(true);
  }
}

function endGame(won) {
  gameOver = true;
  let message = won
    ? "🎉 Congratulations! You guessed the word! 🍀"
    : `❌ Game Over! The word was "${selectedWord}".`;

  // Set modal message and show modal
  const modal = document.getElementById("endBox");
  const messageEl = document.getElementById("endMsg");

  messageEl.textContent = message;
  modal.classList.remove("d-none");
}

// Restart game
function restartGame() {
  selectedWord = "";
  wrongGuesses = 0;
  displayedWord = "";
  guessedLetters = [];
  gameOver = false;
  document.getElementById("wrongLetters").textContent = "Wrong Guesses: ";
  document.getElementById("letterInput").value = "";
  document.getElementById("gameArea").classList.add("d-none");
  document.getElementById("difficultyBox").classList.add("d-none");
  document.getElementById("difficultySelection").classList.remove("d-none");
  document.getElementById("endBox").classList.add("d-none");
  document.getElementById("wordEntryBox").classList.add("d-none");
  document.getElementById("customWordInput").value = "";
}

// Show custom word entry form
function showWordEntry() {
  document.getElementById("difficultySelection").classList.add("d-none");
  document.getElementById("wordEntryBox").classList.remove("d-none");
}
