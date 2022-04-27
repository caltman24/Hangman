import * as Random from "./randomUtils.js";
const removeAllChildren = (ele) => {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
};

class Game {
  constructor(attemptsCountElement, attemptsCount, wordDisplayElement) {
    this.attemptsCountElement = attemptsCountElement;
    this.attemptsCount = attemptsCount;
    this.wordDisplayElement = wordDisplayElement;
    this.remainingLetters = [];
    this.word = this.getWord();
    this.updateDisplay();
    this.word.then((word) => console.log(word));
  }

  updateDisplay() {
    this.attemptsCountElement.innerText = this.attemptsCount;
    if (this.attemptsCount <= 0) this.lost = true;
    if (this.lost) {
      alert("you lost. try again");
      this.restartGame();
    }
  }

  restartGame() {
    this.lost = false;
    this.attemptsCount = attemptsCount;
    this.resetDisplay();
    removeAllChildren(this.wordDisplayElement);
    this.word = this.getWord();
    this.word.then((word) => console.log(word));
    this.updateDisplay();
  }

  resetDisplay() {
    // remove all red classes from buttons
    for (let i = 0; i < alphabetButtons.length; i++) {
      if (alphabetButtons[i].classList.value === "red") {
        alphabetButtons[i].classList.remove("red");
      }
    }
    headElement.classList.toggle("disable");
    torsoElement.classList.toggle("disable");
    leftArmElement.classList.toggle("disable");
    rightArmElement.classList.toggle("disable");
    leftLegElement.classList.toggle("disable");
    rightLegElement.classList.toggle("disable");
  }

  async getWord() {
    const wordList = await fetch("./word_list.json").then((res) => res.json());
    const word = Random.fromArray(wordList);
    for (let i = 0; i < word.length; i++) {
      const newWord = Object.assign(document.createElement("span"), {
        className: "word disable-word",
        textContent: `${word[i]}`,
      });
      this.wordDisplayElement.appendChild(newWord);
      this.remainingLetters.push(word[i]);
    }
    if (word.length > 6) this.wordDisplayElement.style.fontSize = "1rem";
    if (word.length > 8) this.wordDisplayElement.style.fontSize = "0.8rem";
    return word;
  }

  async checkInput(button) {
    let letter = button.innerText.toLowerCase();
    let correct = false;
    for (let i = 0; i < this.remainingLetters.length; i++) {
      if (letter === this.remainingLetters[i]) {
        correct = true;
        this.remainingLetters.splice(i, 1);
        console.log(this.remainingLetters);
      }
    }
    if (!correct) {
      button.classList.add("red");
      this.attemptsCount -= 1;
      switch (this.attemptsCount) {
        case 5:
          headElement.classList.toggle("disable");
          break;
        case 4:
          torsoElement.classList.toggle("disable");
          break;
        case 3:
          rightArmElement.classList.toggle("disable");
          break;
        case 2:
          leftArmElement.classList.toggle("disable");
          break;
        case 1:
          leftLegElement.classList.toggle("disable");
          break;
        case 0:
          rightLegElement.classList.toggle("disable");
          break;
      }
    } else {
      for (let child of this.wordDisplayElement.children) {
        if (letter === child.innerText.toLowerCase()) {
          child.classList.toggle("disable-word");
        }
      }
    }
  }
}

const attemptsCountElement = document.querySelector(".attempts-count");
const bodyContainer = document.querySelector(".hangman-body-container");
const headElement = document.querySelector(".head");
const torsoElement = document.querySelector(".torso");
const leftArmElement = document.querySelector(".left-arm");
const rightArmElement = document.querySelector(".right-arm");
const leftLegElement = document.querySelector(".left-leg");
const rightLegElement = document.querySelector(".right-leg");
const wordDisplayElement = document.querySelector(".hangman-word-display");
const alphabetButtons = document.querySelectorAll(".alphabet-wrapper > button");

const attemptsCount = 6;
const game = new Game(attemptsCountElement, attemptsCount, wordDisplayElement);

alphabetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    game.checkInput(button);
    game.updateDisplay();
  });
});
