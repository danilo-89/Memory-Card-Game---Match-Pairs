let arr = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
let crdClick = 0;
let countClick = 0;
let elements = "";
let first = "";
let second = "";
let cardClass = "";
let cardSound1 = document.getElementById("audioContainer1");
let cardSound2 = document.getElementById("audioContainer2");
let cardsLeft = 12;
let timeStart = 0;
let timeEnd = 0;
let combo = 0;

const playBackground = document.getElementById("playground");
const exitBtn = document.getElementById("exitBtn");
const startBtn = document.getElementById("startBtn");
const startBtn2 = document.getElementById("startBtn2");
const closeBtn = document.getElementById("closeBtn");
const showCreditsBtn = document.getElementById("showCreditsBtn");




// Test IF LocalStorage is accessible
function lsTest() {
  let test = "test";
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
  // console.log("combo: " + num);
  document.getElementById("combo").classList.remove("bounceIn");
  void document.getElementById("combo").offsetWidth;
  document.getElementById("combo").classList.add("bounceIn");
}

let finishScreen = document.getElementById("finishScreen");
let startScreen = document.getElementById("startScreen");
let infoScreen = document.getElementById("infoScreen");

let hideCredits = function () {
  infoScreen.style.display = "none";
};

let showCredits = function () {
  infoScreen.style.display = "block";
};

let closeSScreen = function () {
  startScreen.style.display = "none";
};

let closeFScreen = function () {
  finishScreen.style.display = "none";
  startGame();
};


// Game timer display

let active = false;
let idIntv;
const stoper = document.getElementById('spanTime');

const timer = function() {
  if (!active) {
      active = !active;
      idIntv = setInterval(start, 10);
  } 
}

const start = function() {
  stoper.textContent = Math.round(new Date() / 1000) - timeStart;
}

const reset = function() {
  active = false;
  stoper.textContent = '0';
  clearInterval(idIntv);
}
// ------------------------


// START (New) GAME
let startGame = function () {
  reset();
  crdClick = 0;
  cardsLeft = 12;
  document.getElementById("clickedId").innerHTML = 0;
  first = "";
  second = "";

  // Randomize cards
  arr.sort(function () {
    return Math.random() - 0.5;
  });



  // console.log(arr);

  cardClass = document.getElementById("playground").childNodes;

  let i = 0;
  let nodes = document.getElementById("playground").children;
  // console.log(nodes.length);

  let sNum = 0;
  for (sNum = 0; sNum<24; sNum++) {
    nodes[sNum].childNodes[1].classList.remove("flip");
    // console.log(node);
  }

  setTimeout(function () {
    let nNum = 0;
    for (nNum = 0; nNum<24; nNum++) {
      // console.log(nodes[nNum]);
      nodes[nNum].childNodes[1].classList.remove("flip");
      nodes[nNum].classList.remove("rotate");
      nodes[nNum].style.visibility = "visible";
      nodes[nNum].className = "card" + arr[i];
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
      // console.log(this.className + " (first card) already clicked!");
      return;
    }

    // WHEN SECOND CARD IS CLICKED TWO TIMES IN A ROW
    else if (second != "" && second == this) {
      // console.log(this.className + " (second card) already clicked!");
      return;
    }

    // Check if MUTE is on, else play click sound
    if (document.getElementById("mute").checked) {
    } else {
      // Make sounds overlap when clicking too fast
      if (crdClick%2===0) {
        cardSound1.play();
        console.log(1)
      } else {
        cardSound2.play();
        console.log(2)
      }

    }

    // Count card clicks
    crdClick = crdClick + 1;

    // Get the start time
    if (crdClick === 1) {
      timeStart = Math.round(new Date() / 1000);
      timer();
      // console.log(timeStart);
    }

    document.getElementById("clickedId").innerHTML = crdClick;

    // console.log(crdClick);

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
      // console.log("two cards opened");

      // CHECK IF FIRST AND SECOND CARDS ARE THE SAME
      if (first.className === second.className) {
        cardsLeft = cardsLeft - 1;
        combo = combo + 1;
        if (combo > 1) {
          funcCombo(combo);
        }
        // console.log("combo is: " + combo);
        // console.log("yesss!");
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
          reset();
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
        // console.log("not same");
        combo = 0;
        const checkCClick = crdClick;
        const fFinish = first;
        const sFinish = second;
        // If both cards are opened and they are not the same (flip them back after)
        setTimeout(function () {
          if (crdClick === checkCClick) {
            fFinish.childNodes[1].classList.remove("flip");
            sFinish.childNodes[1].classList.remove("flip");
            // console.log("now");
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




exitBtn.addEventListener("click", function() {
  hideCredits();
});

startBtn.addEventListener("click", function() {
  closeSScreen();
});

showCreditsBtn.addEventListener("click", function() {
  showCredits();
});

closeBtn.addEventListener("click", function() {
  closeFScreen();
});

startBtn2.addEventListener("click", function() {
  startGame();
});



// Fix card reveal bug on window resize

function detectMob() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}


var doit;
function resizedw(){
  playBackground.style.opacity = "1";
}
window.onresize = function() {
  if(detectMob()==false) {
    playBackground.style.opacity = "0";
    clearTimeout(doit);
    doit = setTimeout(function() {
        resizedw();
    }, 250);
  }

};



