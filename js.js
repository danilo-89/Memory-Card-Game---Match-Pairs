var arr = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
var crdClick = 0;
var countClick = 0;
var elements = "";
var first = "";
var second = "";
var cardClass = "";
var cardSound = document.getElementById("audioContainer");
var cardsLeft = 12;
var timeStart = 0;
var timeEnd = 0;
var combo = 0;

// Test IF LocalStorage is accessible
function lsTest() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Show and hide Combo popup
function funcCombo(num) {
  console.log("combo: " + num);
  document.getElementById("combo").classList.remove("bounceIn");
  void document.getElementById("combo").offsetWidth;
  document.getElementById("combo").classList.add("bounceIn");
}

var finishScreen = document.getElementById("finishScreen");
var startScreen = document.getElementById("startScreen");
var infoScreen = document.getElementById("infoScreen");

var hideCredits = function () {
  infoScreen.style.display = "none";
};

var showCredits = function () {
  infoScreen.style.display = "block";
};

var closeSScreen = function () {
  startScreen.style.display = "none";
};

var closeFScreen = function () {
  finishScreen.style.display = "none";
  startGame();
};

// START (New) GAME
var startGame = function () {
  crdClick = 0;
  cardsLeft = 12;
  document.getElementById("clickedId").innerHTML = 0;
  first = "";
  second = "";

  // Randomize cards
  arr.sort(() => Math.random() - 0.5);

  console.log(arr);

  cardClass = document.getElementById("playground").childNodes;

  var i = 0;
  let nodes = document.getElementById("playground").children;
  // console.log(nodes.length);

  for (let node of nodes) {
    node.childNodes[1].classList.remove("flip");
    // console.log(node);
  }

  setTimeout(function () {
    for (let node of nodes) {
      node.childNodes[1].classList.remove("flip");
      node.classList.remove("rotate");
      node.style.visibility = "visible";
      node.className = "card" + arr[i];
      i = i + 1;
      // console.log(node);
    }
  }, 500);
};

startGame();

// WHEN CARD IS CLICKED:
Array.prototype.forEach.call(cardClass, function (element) {
  element.addEventListener("mousedown", function () {
    // WHEN FIRST CARD IS CLICKED TWO TIMES IN A ROW
    if (first != "" && first == this) {
      console.log(this.className + " (first card) already clicked!");
      return;
    }

    // WHEN SECOND CARD IS CLICKED TWO TIMES IN A ROW
    else if (second != "" && second == this) {
      console.log(this.className + " (second card) already clicked!");
      return;
    }

    // Check if MUTE is on
    if (document.getElementById("mute").checked) {
    } else {
      cardSound.play();
    }

    crdClick = crdClick + 1;

    // Get the start time
    if (crdClick === 1) {
      timeStart = Math.round(new Date() / 1000);
      console.log(timeStart);
    }

    document.getElementById("clickedId").innerHTML = crdClick;

    console.log(crdClick);

    // WHEN NEW CARD IS OPENED AND FIRST AND SECOND CARDS HAVE ALREADY BEEN OPENED
    if (first != "" && second != "") {
      if (first.className !== second.className) {
        first.childNodes[1].classList.remove("flip");
        second.childNodes[1].classList.remove("flip");
      }
      first = this;
      this.childNodes[1].classList.add("flip");
      second = "";
    }

    // WHEN SECOND CARD IS OPENED
    else if (first != "" && second == "") {
      second = this;
      this.childNodes[1].classList.add("flip");
      console.log("two cards opened");

      // CHECK IF FIRST AND SECOND CARDS ARE THE SAME
      if (first.className === second.className) {
        cardsLeft = cardsLeft - 1;
        combo = combo + 1;
        if (combo > 1) {
          funcCombo(combo);
        }
        console.log("combo is: " + combo);
        console.log("yesss!");
        const fFinish = first;
        const sFinish = second;

        fFinish.classList.add("rotate");
        sFinish.classList.add("rotate");

        setTimeout(function () {
          if (crdClick > 1) {
            fFinish.style.visibility = "hidden";
            sFinish.style.visibility = "hidden";
          }
        }, 1000);

        // CHECK IF THERE ARE NO MORE CARDS (IF GAME IS FINISHED)
        if (cardsLeft < 1) {
          document.getElementById("movesSpan").innerHTML = crdClick;
          timeEnd = Math.round(new Date() / 1000) - timeStart;
          document.getElementById("timeSpan").innerHTML = timeEnd;

          if (lsTest() === true) {
            if (
              localStorage.getItem("bestMoves") >= crdClick ||
              localStorage.getItem("bestMoves") == null
            ) {
              document.getElementById("bMovesSpan").innerHTML = crdClick;
              localStorage.setItem("bestMoves", crdClick);
            } else {
              document.getElementById(
                "bMovesSpan"
              ).innerHTML = localStorage.getItem("bestMoves");
            }

            if (
              localStorage.getItem("bestTime") >= timeEnd ||
              localStorage.getItem("bestTime") == null
            ) {
              document.getElementById("bTimeSpan").innerHTML = timeEnd;
              localStorage.setItem("bestTime", timeEnd);
            } else {
              document.getElementById(
                "bTimeSpan"
              ).innerHTML = localStorage.getItem("bestTime");
            }
          }

          finishScreen.style.display = "block";
        }
      } else {
        console.log("not same");
        combo = 0;
        const checkCClick = crdClick;
        const fFinish = first;
        const sFinish = second;
        // If both cards are opened and they are not the same (flip them back after)
        setTimeout(function () {
          if (crdClick === checkCClick) {
            fFinish.childNodes[1].classList.remove("flip");
            sFinish.childNodes[1].classList.remove("flip");
            console.log("now");
            first = "";
            second = "";
          }
        }, 1100);
      }
    }

    // WHEN FIRST CARD IS OPENED
    else if (first == "" && second == "") {
      first = this;
      this.childNodes[1].classList.add("flip");
    }
  });
});