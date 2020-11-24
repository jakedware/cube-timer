var timerStart = 0;
var timerEnd = 0;
var solveTimes = [];

function startTimer() {
  timerStart = (new Date()).getTime();
  console.log(timerStart);

  document.getElementById("timer").innerHTML = "...";
}

function endTimer() {
  timerEnd = (new Date()).getTime();
  console.log(timerEnd);

  var solveTime = (timerEnd - timerStart) / 1000;
  document.getElementById("timer").innerHTML = solveTime + "s";

  document.getElementById("scramble").innerHTML = "";
  generateScramble();
  shiftRecentSolveTimes(solveTime);

  document.getElementById("recent-solve-zero").innerHTML = solveTimes[0] + "s";
  document.getElementById("recent-solve-one").innerHTML = solveTimes[1] + "s";
  document.getElementById("recent-solve-two").innerHTML = solveTimes[2] + "s";
  document.getElementById("recent-solve-three").innerHTML = solveTimes[3] + "s";
  document.getElementById("recent-solve-four").innerHTML = solveTimes[4] + "s";
}

function generateScramble() {
  var cubeMoves = [" R", " L", " U", " D", " F", " B"];
  var moveVariations = ["", "'", "2"];
  var scramble = new Array();

  for (var i = 0; i < 20; i++) {
    var randomIndex = Math.floor(Math.random() * 6);
    var randomIndexVariations = Math.floor(Math.random() * 3);

	if (i == 0) {
      scramble[i] = cubeMoves[randomIndex] + moveVariations[randomIndexVariations];
	  continue;
	}

	while (cubeMoves[randomIndex] === (scramble[i - 1])) {
        randomIndex = Math.floor(Math.random() * 6);
	}

    scramble[i] = cubeMoves[randomIndex] + moveVariations[randomIndexVariations];
    
  }

  scramble.forEach(element => {
    document.getElementById("scramble").innerHTML += element.toString();
	});
}

function shiftRecentSolveTimes(newTime) {
  var numRecentSolves = 5;
  for (var i = 0; i < (numRecentSolves - 1); i++) {
    solveTimes[i + 1] = solveTimes[i];
  }
  solveTimes[0] = newTime;
}

