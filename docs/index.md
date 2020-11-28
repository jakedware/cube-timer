<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="Jake Ware">

  <title>Jake's Cube Timer</title>

  <!-- Bootstrap core CSS -->
  <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

</head>
<script src="../scripts.js"></script>
<body onload="initialize()">

  <!-- Page Content -->
  <div class="container">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="mt-5" id="timer">0.00s</h1>
        <p class="lead" id="scramble"></p>
      </div>
    </div>
  </div>

  <div class="container text-center">
	<button type="button" id="timer-button" class="btn btn-primary btn-lg"
                      data-toggle="button" aria-pressed="false" onclick="toggleTimer()">
           START 
        </button>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-outline-secondary" onclick="changeInspectTime(5)">
            <input type="radio" name="options" id="option1" autocomplete="off"> 5s
          </label>
          <label class="btn btn-outline-secondary" onclick="changeInspectTime(10)">
            <input type="radio" name="options" id="option2" autocomplete="off"> 10s
          </label>
          <label class="btn btn-outline-secondary" onclick="changeInspectTime(15)">
            <input type="radio" name="options" id="option3" autocomplete="off" checked> 15s
          </label>
          <label class="btn btn-outline-secondary" onclick="changeInspectTime(0)">
            <input type="radio" name="options" id="option4" autocomplete="off">No Inspect
          </label>
      </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-striped" id="recent-table">
          <thead>
            <tr>
              <th scope="col">Recent Solves</th>
            </tr>
          </thead>
          <tbody>
              <tr id="recent-solve-zero"><td></td></tr>
              <tr id="recent-solve-one"><td></td></tr>
              <tr id="recent-solve-two"><td></td></tr>
              <tr id="recent-solve-three"><td></td></tr>
              <tr id="recent-solve-four"><td></td></tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <table class="table table-bordered table-striped" id="best-table">
          <thead>
            <tr>
              <th scope="col">Best Solves</th>
            </tr>
          </thead>
           <tbody>
               <tr id="best-solve-zero"><td></td></tr>
               <tr id="best-solve-one"><td></td></tr>
               <tr id="best-solve-two"><td></td></tr>
               <tr id="best-solve-three"><td></td></tr>
               <tr id="best-solve-three"><td></td></tr>
           </tbody>
        </table>
      </div>
  </div>

  <!-- Bootstrap core JavaScript -->
  <script src="../vendor/jquery/jquery.slim.min.js"></script>
  <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  
  <!-- Cube Timer Scripts -->
  <script src="../scripts.js"></script>

</body>

</html>