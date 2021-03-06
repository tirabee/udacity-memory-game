let card = document.getElementsByClassName("card");
let cards = [...card];
let deck = document.querySelector(".deck");
let selectedCards = 0;
let pickOne = "";
let pickTwo = "";
let delay = 1000;
let timer = new Timer();
let moves = 0;
let previousTarget = null;

/* Display the cards on the page   - shuffle the list of cards using the provided "shuffle" method below   - loop through each card and create its HTML   - add each card's HTML to the page */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(cards) {
  var currentIndex = cards.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}
// starts game and resets timer -- shuffling loop from https://scotch.io/tutorials/how-to-build-a-memory-matching-game-in-javascript
function startGame() {
  $(".card").removeClass("match", "show", "open");
  moves = 0;
  $(".values").html("00:00:00");
  var shuffledDeck = shuffle(cards);
  for (var i = 0; i < shuffledDeck.length; i++) {
    [].forEach.call(shuffledDeck, function(item) {
      deck.appendChild(item);
    });
  }
}
window.onload = startGame();
// adds match class to cards
// matching and reset functionality from https://www.taniarascia.com/how-to-create-a-memory-game-super-mario-with-plain-javascript/
function match() {
  let selected = document.querySelectorAll(".open");
  selected.forEach(card => {
    card.classList.add("match");
  });
}
// resets all selected cards and displays modal when win conditions are met.
const resetCards = () => {
  pickOne = "";
  pickTwo = "";
  selectedCards = 0;
  moves++;
  $(".moves").html(moves);
  starRating();
  modal();
  var selected = document.querySelectorAll(".show");
  selected.forEach(card => {
    card.classList.remove("show", "open");
  });
};
// matches cards based on their name attribute and resets if no matches are made.
deck.addEventListener("click", function(event) {
  let picks = event.target;
  if (picks === previousTarget) {
    return;
  }
  timer.start();
  if (selectedCards < 2) {
    selectedCards++;
    if (selectedCards === 1) {
      pickOne = picks.dataset.name;
      picks.classList.add("show", "open");
    } else {
      pickTwo = picks.dataset.name;
      picks.classList.add("show", "open");
    }
    if (pickOne !== "" && pickTwo !== "") {
      if (pickOne === pickTwo) {
        setTimeout(match, delay);
        setTimeout(resetCards, delay);
      } else {
        setTimeout(resetCards, delay);
      }
    }
    previousTarget = picks;
  }
});
// star rating determined by move count
function starRating() {
  if (moves > 8) {
    $(".star-three").hide();
  }
  if (moves > 12) {
    $(".star-two").hide();
  }
}
//displays congrats modal when all cards are matched
//modal based on tutorial: https://sabe.io/tutorials/how-to-create-modal-popup-box
function modal() {
  $(".stars-modal").html(function() {
    if (moves > 8) {
      $(".star-three").hide();
    }
    if (moves > 12) {
      $(".star-two").hide();
    }
  });
  if ($(".match").length === 16) {
    $(".modal").toggleClass("show-modal");
    timer.stop();
  }
}

$(".close-button").click(function() {
  $(".modal").toggleClass("show-modal");
});

timer.addEventListener("secondsUpdated", function(e) {
  $(".values").html(timer.getTimeValues().toString());
});
//restart button functionality
$(".restart").click(function() {
  timer.stop();
  startGame();
  resetCards();
  $(".modal").removeClass("show-modal");
  $(".star-two").show();
  $(".star-three").show();
  moves = 0;
  $(".moves").html(moves);
});
