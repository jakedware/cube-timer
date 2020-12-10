var timerStart = 0;
var timerEnd = 0;
var solves = new Array();
var bestSolves = new Array();
var timerToggle = false; // true if started, false otherwise
var inspectSeconds = 15; // defaults to 15 seconds 
var inspecting = false; // true if inspection is taking place, false otherwise
var interval = null;
var numBestSolves = 5;
var numRecentSolves = 5;
var tableColors = ["primary", "success", "danger", "warning", "info"];
var tableColorsIndex = 0;

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

/*
 * Gives user selected amount of inspection time (defaults to 15s)
 */
function inspectTime() {
  if (inspectSeconds == 0) {
    startTimer();
    return;
  }

  var inspectTimeRemaining = inspectSeconds;
  inspecting = true;

  document.getElementById("timer").innerHTML = inspectTimeRemaining;
  document.getElementById("timer-button").innerHTML = "INSPECTING";
  
  interval = setInterval(function() {
    
    // start timer if end of inspection time is reached
    if (inspectTimeRemaining == 1) {
      clearInterval(interval);
      startTimer();
      inspecting = false;
      return;
    }

    // update countdown
    inspectTimeRemaining--;
    document.getElementById("timer").innerHTML = inspectTimeRemaining;

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
  var currScramble = generateScramble();
 
  // put solve times in array
  solves.unshift({time:solveTime, scramble:currScramble});
  if (solves.length == numRecentSolves + 1) {
    solves.pop();
  }

 // put solves in tables
  updateBestArray(solves[0]);
  updateRecentTable();
  updateBestTable(bestSolves);
}

/*
 * Updates the table of recent solve times
 */
function updateRecentTable() {
  let table = document.getElementById("recent-table");   
  for (var i = 0; i < numBestSolves; i++) {

    // make empty row
    if (solves[i] === undefined) {
      table.rows[i + 1].innerHTML = "<td></td><td width=\"100px\" class=\"text-center\"><button type=\"button\" class=\"btn btn-outline-danger\" disabled><i class=\"fa fa-trash-alt\"></i></button></td>";
      table.rows[i + 1].className = "";
      continue;
    }

    createDropdownRow(table.rows[i + 1], solves[i], i);
  }
}

/*
 * Updates best time table if new top 5 time is achieved
 */
function updateBestArray(currSolve) {
  var index = -1;
  // checks if currSolve is better than any of the best solves
  for (var i = numBestSolves - 1; i >= 0; i--) {
    if (bestSolves[i] === undefined || currSolve.time < bestSolves[i].time) {
      index = i;
    }
  }

  // don't update array if currSolve is not better than any of the best solves
  if (index == -1) {
    return;
  } 
  
  // udpdate array
  bestSolves.splice(index, 0, currSolve);

  // remove extra solves from end of array
  while(bestSolves.length > numBestSolves) {
    bestSolves.pop();
  }

  setCookies();

}

function updateBestTable() {
  // update best solves table
  let table = document.getElementById("best-table");
  var tableRowOffset = table.tHead.rows.length;
  for (var i = 0; i < numBestSolves; i++) {

    // make empty row withOUT solves
    if (bestSolves[i] === undefined) {
            table.rows[i + tableRowOffset].innerHTML = "<td></td><td width=\"100px\" class=\"text-center\"><button type=\"button\"    class=\"btn btn-outline-danger\" disabled><i class=\"fa fa-trash-alt\"></i></button></td>";
      table.rows[i + tableRowOffset].className = "";
      continue;
    }

    // create row WITH solve
    createDropdownRow(table.rows[i + tableRowOffset], bestSolves[i], i);
  }
}

/*
 * Creates dropdown with scramble for the given row
 */
function createDropdownRow(parentRow, solve, index) {
  parentRow.innerHTML = "<td class=\"text-center\">" + "<div class=\"dropdown\">" +
    "<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">" + solve.time + "s</a>" +
    "<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLablel\">" +
    "<li><a> " + toStringArrayNoComma(solve.scramble) + " </a></li></ul></div></td>" +
    "<td width=\"100px\" class=\"text-center\"><button type=\"button\" class=\"btn btn-outline-danger\" onclick=\"removeSolve("+ index + "," + solve.time + ")\">" +
    "<i class=\"fa fa-trash-alt\"></i></button></td>";

  // set colors for solves that are in both recent table and best table
  if (solves.includes(solve) && bestSolves.includes(solve)) {
    if (solve.colorIndex === undefined) {
      parentRow.className = "table-" + tableColors[tableColorsIndex];
    
      solve.colorIndex = tableColorsIndex;

      tableColorsIndex = ++tableColorsIndex % tableColors.length;
    }
    else {
      parentRow.className = "table-" + tableColors[solve.colorIndex];
    }
  }
  else {
    parentRow.className = "";
  }
}

/*
 * Removes solve from table
 */
function removeSolve(index, solveTime) {
  var solve = null;
  var isBestSolve = 0;

  // find matching solve in solve arrays
  if (solves[index] === undefined || solveTime != solves[index].time) {
    if (bestSolves[index] === undefined || solveTime != bestSolves[index].time) {
      console.log("Problem removing solve.");
      return;
    } 
    else {
      solve = bestSolves[index];
      isBestSolve++;
    }
  }
  else {
    solve = solves[index];
  }

  // if search for solve in array is successful
  if (solve != null) {
    if (Boolean(isBestSolve)) {
      bestSolves.splice(index, 1);

      // check if solve is also in recent
      if (solves.includes(solve)) {
        solves.splice(solves.indexOf(solve), 1);
      }
    }
    else {
      solves.splice(index, 1);

      // check if solve is also in best
      if (bestSolves.includes(solve)) {
        bestSolves.splice(bestSolves.indexOf(solve), 1);
      }
    }
  }
  else {
    console.log("Problem removing solve.");
    return;
  }

  // update tables
  updateBestTable();
  updateRecentTable();

  // update cookies
  deleteCookies();
  setCookies();
}

/*
 * Generates random scramble using R,L,U,D,F,B, ' and 2
 */ 
function generateScramble() {
  var cubeMoves = ["R", "L", "U", "D", "F", "B"];
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
	while (cubeMoves[randomIndex].charAt(0) == (scramble[i - 1]).charAt(0)) {
          randomIndex = Math.floor(Math.random() * 6);
	}

    scramble[i] = cubeMoves[randomIndex] + moveVariations[randomIndexVariations];
    
  }

  // put scramble into html
  document.getElementById("scramble").innerHTML = toStringArrayNoComma(scramble);

  return scramble;
}

/*
 * Same as toString() for an array but with no commas
 */
function toStringArrayNoComma(array) {
  if (array === undefined) {
    return;
  }

  var arrayString = "";

  array.forEach(element => {arrayString += element + " ";});

  return arrayString;
}

/*
 * Sets cookies with solves from best solves table
 */
function setCookies() {
  for (var i = 0; i < bestSolves.length; i++) {
    var solve = bestSolves[i];

    var cookieSolveInfo = "solve" + i + "=" + solve.time;
  
    var cookieScrambleInfo = "scramble" + i + "=";
    for (var i = 0; i < solve.scramble.length; i++) {
      cookieScrambleInfo += solve.scramble[i];

      if (i != solve.scramble.length - 1) {
        cookieScrambleInfo +=  "-";
      }
    }

    document.cookie = cookieSolveInfo;
    document.cookie = cookieScrambleInfo;
  }
}

/*
 * Reads cookies in order to populate best solves table
 */
function readCookies() {
  if(document.cookie.length == 0) {
    return;
  }

  // get cookie data
  var cookieArray = document.cookie.split(";");  
  console.log(cookieArray);
  
  // get solve from cookie data 
  var cookieSolves = new Array();
  for (var i = 0; i < cookieArray.length; i += 2) {
    var solveCookie = cookieArray[i].split("=")[1];
    var scrambleCookie = cookieArray[i + 1].split("=")[1].split("-");

    cookieSolves.push({time:solveCookie, scramble:scrambleCookie});
  }

  // update best solves table with the cookie solves
  bestSolves = cookieSolves;
  updateBestTable(cookieSolves);
}

function deleteCookies() {
  for (var i = 0; i < numBestSolves; i++) {
    document.cookie = "solve" + i + "=; scramble" + i + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; 
    console.log(document.cookie);
  }
}


/*
 * Calls function that initialize the website
 */
function initialize() {
  generateScramble();
  readCookies();
}
