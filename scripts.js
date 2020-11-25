var timerStart = 0;
var timerEnd = 0;
var solveTimes = [];
var bestTimes = [];
var timerToggle = false; // true if started, false otherwise

/*
 * Starts or ends timer based on timer button state
 */
function toggleTimer() {
  if (timerToggle) {
    endTimer();
    timerToggle = false;
    document.getElementById("timer-button").innerHTML = "START";
  }
  else {
    startTimer();
    timerToggle = true;
    document.getElementById("timer-button").innerHTML = "STOP";
  }
}

/*
 * Starts the timer
 */
function startTimer() {
  timerStart = (new Date()).getTime();

  document.getElementById("timer").innerHTML = "...";
}

/*
 * Ends the timer and updates solve time table
 */
function endTimer() {
  timerEnd = (new Date()).getTime();

  // update time
  var solveTime = (timerEnd - timerStart) / 1000;
  document.getElementById("timer").innerHTML = solveTime + "s";
 
  // generate new scramble
  document.getElementById("scramble").innerHTML = "";
  generateScramble();
 
  // put solve times in table
  shiftRecentSolveTimes(solveTime);
  updateRecentTable();

}

function updateRecentTable() {
  let table = document.createElement("table");
  table.id = "recent-table"
  
  for (var i = 0; i < solveTimes.length; i++) {
    table.insertRow();
    let cell = table.rows[table.rows.length - 1].insertCell();
    cell.textContent = solveTimes[i];
  }

  const oldTable = document.getElementById("recent-table");
  oldTable.parentNode.replaceChild(table, oldTable);
}

/*
 * Generates random scramble using R,L,U,D,F,B, ' and 2
 */ 
function generateScramble() {
  var cubeMoves = [" R", " L", " U", " D", " F", " B"];
  var moveVariations = ["", "'", "2"];
  var scramble = new Array();

  // picks random move and move variation for scramble
  for (var i = 0; i < 20; i++) {
    var randomIndex = Math.floor(Math.random() * 6);
    var randomIndexVariations = Math.floor(Math.random() * 3);

	if (i == 0) {
      scramble[i] = cubeMoves[randomIndex] + moveVariations[randomIndexVariations];
	  continue;
	}

        // consecutive scramble moves should not move the same face
	while (cubeMoves[randomIndex].charAt(1) == (scramble[i - 1]).charAt(1)) {
          randomIndex = Math.floor(Math.random() * 6);
	}

    scramble[i] = cubeMoves[randomIndex] + moveVariations[randomIndexVariations];
    
  }

  // put scramble into html
  scramble.forEach(element => {
    document.getElementById("scramble").innerHTML += element.toString();
	});
}

/*
 * Shifts solve time array so it can be easily displayed
 */
function shiftRecentSolveTimes(newTime) {
  var numRecentSolves = 5;
  for (var i = numRecentSolves - 1; i >= 0; i--) {
    if (i != 0) {
      solveTimes[i] = solveTimes[i - 1]
    }
    else {
      solveTimes[0] = newTime;
    }
  }
}

