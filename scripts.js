var timerStart = 0;
var timerEnd = 0;
var solves = [];
var bestTimes = [];
var timerToggle = false; // true if started, false otherwise
var currScramble = null;
var inspectSeconds = 15; // defaults to 15 seconds 
var inspecting = false; // true if inspection is taking place, false otherwise
var interval = null;

/*
 * Starts or ends timer based on timer button state
 */
function toggleTimer() {
  if (timerToggle && !inspecting) {
    endTimer();
    timerToggle = false;
    document.getElementById("timer-button").innerHTML = "START";
  }
  else if (!timerToggle) {
    timerToggle = true;
    inspectTime();
  } 
  else if (timerToggle && inspecting) {
    clearInterval(interval);
    startTimer();
    inspecting = false;
  }
}

function inspectTime() {
  if (inspectSeconds == 0) {
    startTimer();
    return;
  }

  var inspectStart = inspectSeconds;
  inspecting = true;

  document.getElementById("timer").innerHTML = inspectStart;
  document.getElementById("timer-button").innerHTML = "INSPECTING";
  
  interval = setInterval(function() {
    
    // start timer if end of inspection time is reached
    if (inspectStart == 1) {
      clearInterval(interval);
      startTimer();
      inspecting = false;
      return;
    }

    // update countdown
    inspectStart--;
    document.getElementById("timer").innerHTML = inspectStart;

  } , 1000);
    
}

/*
 * Changes the inspect time. Made to be used by inspect buttons
 */
function changeInspectTime(newTime) {
  inspectSeconds = newTime;
}

/*
 * Starts the timer
 */
function startTimer() {
  timerStart = (new Date()).getTime();

  document.getElementById("timer-button").innerHTML = "STOP";
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

/*
 * Updates the table of recent solve times
 */
function updateRecentTable() {
  let table = document.getElementById("recent-table");   
  for (var i = 0; i < solves.length; i++) {
    if (solves[i] === undefined) {
      continue;
    }

    table.rows[i + 1].innerHTML = "<td>" + solves[i].time + "s</td>";
    createDropdownRow(table.rows[i + 1], solves[i]);
  }
}

/**
 * Creates dropdown with scramble for the given row
 */
function createDropdownRow(parentRow, solve) {
  parentRow.innerHTML = "<td>" + "<div class=\"dropdown\">" +
   "<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">" + solve.time + "s</a>" +
   "<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLablel\">" +
        "<li><a>" + toStringArrayNoComma(solve.scramble) + "</a></li></ul></div></td>";

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
  currScramble = scramble;

  // put scramble into html
  document.getElementById("scramble").innerHTML = toStringArrayNoComma(scramble);
}

/*
 * Shifts solve time array so it can be easily displayed
 */
function shiftRecentSolveTimes(newTime) {
  var numRecentSolves = 5;
  for (var i = numRecentSolves - 1; i >= 0; i--) {
    if (i != 0) {
      solves[i] = solves[i - 1]
    }
    else {
      solves[0] = {time:newTime, scramble:currScramble};
    }
  }
}

/*
 * Same as toString() for an array but with no commas
 */
function toStringArrayNoComma(array) {
  var arrayString = "";

  array.forEach(element => {arrayString += element;});

  return arrayString;
}
