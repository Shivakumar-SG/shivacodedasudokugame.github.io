
//creating vars
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

//function to get html element ids
function id(id) {
    return document.getElementById(id);
}
function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}


//create new game button click handler
window.onload = function() {
    //show start game button
    id("startBtn").classList.remove("hidden");
    id('startBtn').addEventListener("click", startGame);

    //add event listener to each number in numberController
    for (let index = 0; index < id("numberContainer").children.length; index++) {
      id("numberContainer").children[index].addEventListener("click", function() {
        //if selecting is not disabled,
        if (!disableSelect) {
          //if number is already selected,
          if (this.classList.contains("selected")) {
            //remove selection
            this.classList.remove("selected");
            selectedNum = null;
          } else {
            //deselect all numbers
            for (let i = 0; i < 9; i++) {
              id("numberContainer").children[i].classList.remove("selected");
            }
            //select it and update selectedNum
            this.classList.add("selected");
            selectedNum = this;
            updateMove();
          }
        }
      })
      
    }
}

function startGame() {

  //hide start game button when game starts
  id("startBtn").classList.add("hidden");

  //initiate the sudoku generator
  initiate();
  //difficulty method answers. test is partial sudoku keys. myArr is complete tile keys
  window.easy = [test,myArr];
  window.medium = [test, myArr];
  window.hard = [test, myArr];

  //Choose board difficulty and set lives
  let board;
  if (id("diff1").checked) {
    board = easy[0];
    lives = 20;
  }else if(id("diff2").checked) {
    board = medium[0];
    lives = 15;
  }else {
    lives = 10;
    board = hard[0];
  }

  //set lives
  disableSelect = false;
  id("lives").textContent = 'Lives Remaining: ' + lives;
  //crate board based on difficulty
  generateBoard(board);

  //starts timer
  startTimer();

  //sets theme based on input
  if( id("theme2").checked ) {
    qs("body").classList.add("dark");
  }else{
    qs("body").classList.remove("dark");
  }

  //show numberContainer
  id("numberContainer").classList.remove("hidden");
  // show solve button when game started.
  id("solveButton").classList.remove("hidden");
  // add function on click.
  id("solveButton").addEventListener("click", solveCurrentSudoku);
}

//solving the current sudoku. This function gets called after clicking solve
function solveCurrentSudoku(){
  for (let i = 0; i < 81; i++) {

    // pick out tiles and fill the solution keys
     let ansTile = id(i);
     ansTile.textContent = myArr[i];
  }
  id("lives").textContent = "Try Harder Next Time Buddy 😊";
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);

  // Show start game button again and hide solve button when game finished
  id("startBtn").classList.remove("hidden");
  id("solveButton").classList.add("hidden");
}


//timer function
function startTimer() {
  //set time based on input
  if ( id("timer1").checked ) timeRemaining = 300;
  else if ( id("timer2").checked) timeRemaining = 600;
  else timeRemaining = 900;

  //set time for first time
  id("timer").textContent = timeConversion(timeRemaining);
  //set timer to update every second
  timer = setInterval(function() {
    timeRemaining--;
    //if no time remaining, end the Game
    if ( timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  },1000)
}

//convert seconds to mm:ss format
function timeConversion(time) {
  let minutes = Math.floor(time/60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time%60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

//generate the sudoku board when new game created
function generateBoard(board) {
  //clear previous board
  clearPrevious();

  //increment tile ids
  let idCount = 0;
  //create 81 tiles
  for (let index = 0; index < 81; index++) {
    //create new paragraph element
    let tile = document.createElement("p");
    //if the tile is not supposed to be blank,
    if (board[index] != 0) {
      //set tile text to correctnumber
      tile.textContent = board[index];
    } else {
      //add click event listener to tile element
      tile.addEventListener("click", function(){
        //if selecting is not disabled,
        if (!disableSelect) {
          //if tile is already selected,
          if (tile.classList.contains("selected")) {
            //remove selection
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //deselect all selected
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //add selection and update
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //assign tile id
    tile.id  = idCount;
    //increment tile ids for next tile
    idCount++;
    //add tile class to all tiles
    tile.classList.add("tile");

    //add border 
    if( (tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if( (tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6 ) {
      tile.classList.add("rightBorder");
    }

    // add tile to board
    id("board").appendChild(tile);
  }
}

//update tiles with selected numbers
function updateMove() {
  //if a number and a tile are selected

  if (selectedTile && selectedNum) {
    //set the tile to correct number
    selectedTile.textContent = selectedNum.textContent;
    
    //if the selected number matches the number in the solution key
    if (checkCorrect(selectedTile)) {
      //deselect the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //clear the selected variables
      selectedNum = null;
      selectedTile = null;

      //check if the board is completed
      if (checkDone()) {
        endGame();
        //  when the game ends, show start button and hide solveButton
        id("startBtn").classList.remove("hidden");
        id("solveButton").classList.add("hidden");
      }

      //if the number does not match the number in the solution
    } else {
      //disable selecting new number for a second
      disableSelect = true;
      //make the tile turn red
      selectedTile.classList.add("incorrect");
      //run in one second
      setTimeout(function() {
        //subtract the lives by one
        lives--;
        //if no lives left, end the game
        if(lives === 0) {
          endGame();

          //if lives is not zero
        } else {
          //Update the lives display
          id("lives").textContent = "Lives Remaining: " + lives;
          //reenable selecting numbers and tile
          disableSelect = false;
        }
        //restore tile color and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");

        //clear the tiles text and variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}
function checkCorrect(tile) {
  // set solution based on the difficulty
  let solution;
  if (id("diff1").checked) {
    solution = easy[1];
  }else if(id("diff2").checked) {
    solution = medium[1];
  }else {
    solution = hard[1];
  }

  // if tile number is equal to the solution number
  if (solution[(tile.id)] == tile.textContent ) {
    return true;
  }else {
    return false;
  }
}

//checkDone func
function checkDone() {
  let tiles = qsa(".tile");

  // if any tile is empty then continue game
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") {
      return false;
    } 
  }
  return true;
}

//endGame function
function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);

  //dispay win or lose
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You Lost 🥲";
  }else {
    id("lives").textContent = "You won! 🎊😌";
  }
}


//clears privious board
function clearPrevious() {

  //access all the tiles
  let tiles = qsa(".tile");

  //remove each tiles
  for (let index = 0; index < tiles.length; index++) {
    tiles[index].remove();    
  }

  //if there is a timer clear it
  if(timer) clearTimeout(timer);

  //Deselect selected number
  for (let index = 0; index < id("numberContainer").children.length; index++) {
    id("numberContainer").children[index].classList.remove("selected");    
  }

  //clear selected variables
  selectedTile = null;
  selectedNum = null;
}


// random Board numbers and correct sudoku numbers are generated
function initiate() {
  // null -> null
  // populate the board with initial random values using randBoard()
  randBoard();
  var startingBoard = [[]]
  var j = 0;

  // test-array with vales generated
  var sud = test;
  // push elements to board
  for (var i = 1; i <= 81; i++){
      const val = sud[i-1];
      if (val == 0){
        startingBoard[j].push(null)
      }
      else { 
          startingBoard[j].push(Number(val))
      }
      if (i % 9 == 0 && i < 81){
          startingBoard.push([])
          j++
      }
  }
  
  // check if the board is valid.
  const inputValid = validBoard(startingBoard)
  if (!inputValid){
      // if input Is Invalid call initiate() again to get valid board numbers
      initiate();
  }
  else{
    // if answer is valid, fill the board numbers to myArr
      const answer = solve(startingBoard)
      window.myArr = new Array(81);
      var x = 0;
      if (answer == undefined || answer == 0) {
        initiate();
      } else {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            myArr[x] = answer[i][j];
            x++;
          }
        }
      }
  }
}

// function to generate random numbers[1-9] in random places[1-81]
function randBoard() {
  // generate size of random places to which numbers are to be generated
  if (id("diff1").checked) {
    var arrSize = Math.floor(Math.random() * (27-23+1) + 23);
  }else if(id("diff2").checked) {
    var arrSize = Math.floor(Math.random() * (27-25+1) + 25);
  }else {
    var arrSize = Math.floor(Math.random() * (25-20+1) + 20);
  }
  var arr = Array(arrSize);

  // generate random numbers between 0 and 80
  for(var i = 0; i < arr.length; i++){
      var item = Math.floor(Math.random() * (80-0+1) + 0);
      arr[i] = item;
  }
  // global array test with default 0 values
  window.test = new Array(81).fill(0);

  // generate sudoku numbers [1-9] in the places generated above
  for (let j = 0; j < test.length; j++) {
    test[arr[j]] = Math.floor(Math.random() * (9-0+1) + 0);
  }
  return test;
}

// solves the given sudoku board
  // ASSUME the given sudoku board is valid
function solve(board) {
  
  // if board is already solved, return board
  if (solved(board)) {
      return board
  }
  else {
      // check for possible boards
      const possibilities = nextBoards(board)
      // keep only valid boards
      const validBoards = keepOnlyValid(possibilities)

      // search for the solution for the board
      return searchForSolution(validBoards)
  }
}

// finds a valid solution to the sudoku problem
function searchForSolution(boards){
  if (boards.length < 1){
      return false
  }
  else {
      // backtracking search for solution
      var first = boards.shift()
      const tryPath = solve(first)
      if (tryPath != false){
          return tryPath
      }
      else{
          return searchForSolution(boards)
      }
  }
}


function solved(board){
  // Board -> Boolean
  // checks to see if the given puzzle is solved
  for (var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){
          if (board[i][j] == null){
              return false
          }
      }
  }
  return true
}


function nextBoards(board){ 
  // Board -> List[Board]
  // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9
  var res = []
  const firstEmpty = findEmptySquare(board)
  if (firstEmpty != undefined){
      const y = firstEmpty[0]
      const x = firstEmpty[1]
      for (var i = 1; i <= 9; i++){
          var newBoard = [...board]
          var row = [...newBoard[y]]
          row[x] = i
          newBoard[y] = row
          res.push(newBoard)
      }
  }
  return res
}

function findEmptySquare(board){
  // Board -> [Int, Int] 
  // (get the i j coordinates for the first empty square)
  for (var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){
          if (board[i][j] == null) {
              return [i, j]
          }
      }
  }
}


function keepOnlyValid(boards){
  // List[Board] -> List[Board]
  // filters out all of the invalid boards from the list
  var res = []
  for (var i = 0; i < boards.length; i++){
      if (validBoard(boards[i])){
          res.push(boards[i])
      }
  }
  return res
}


function validBoard(board){
  // Board -> Boolean
  // checks to see if given board is valid
  return rowsGood(board) && columnsGood(board) && boxesGood(board)
}

function rowsGood(board){
  // Board -> Boolean
  // makes sure there are no repeating numbers for each row
  for (var i = 0; i < 9; i++){
      var cur = []
      for (var j = 0; j < 9; j++){
          if (cur.includes(board[i][j])){
              return false
          }
          else if (board[i][j] != null){
              cur.push(board[i][j])
          }
      }
  }
  return true
}

function columnsGood(board){
  // Board -> Boolean
  // makes sure there are no repeating numbers for each column
  for (var i = 0; i < 9; i++){
      var cur = []
      for (var j = 0; j < 9; j++){
          if (cur.includes(board[j][i])){
              return false
          }
          else if (board[j][i] != null){
              cur.push(board[j][i])
          }
      }
  }
  return true
}


function boxesGood(board){
  // transform this everywhere to update res
  const boxCoordinates = [[0, 0], [0, 1], [0, 2],
                          [1, 0], [1, 1], [1, 2],
                          [2, 0], [2, 1], [2, 2]]
  // Board -> Boolean
  // makes sure there are no repeating numbers for each box
  for (var y = 0; y < 9; y += 3){
      for (var x = 0; x < 9; x += 3){
          // each traversal should examine each box
          var cur = []
          for (var i = 0; i < 9; i++){
              var coordinates = [...boxCoordinates[i]]
              coordinates[0] += y
              coordinates[1] += x
              if (cur.includes(board[coordinates[0]][coordinates[1]])){
                  return false
              }
              else if (board[coordinates[0]][coordinates[1]] != null){
                  cur.push(board[coordinates[0]][coordinates[1]])
              }
          }
      }
  }
  return true
}