var gameOver;
var tieCount = 0;

// display instructions
var display = document.getElementById('display').getElementsByTagName('p')[0];

window.onload = function instructions () {
  display.innerHTML = directions;
} 

// player HTML
var user = document.getElementById('user');
var comp = document.getElementById('computer');

// directions
var directions = "Welcome to Xtreme Rock Paper Scissors! Beware! This isn't your typical Rock Paper Scissfors game. <ul> <li>Both you and the computer begin with a set number of each weapon <ul><li>you can change this simply by entering a different number next to '# of weapons' then clicking outside the box</li><li>changing the starting # of weapons will also reset the game</li></ul></li> <li>You begin each round by playing one of your weapons</li> <li>If either player plays the same weapon 3x in a row, that weapon will 'break' and be removed</li> <li>The winner of each round wins the other player's weapon</li> <li>The game ends when one of the player has all the weapons</li> <li>If there is a tie 3x in a row, a random weapon will be removed from each player's arsenal</li> <li>You can build a weapon when its supply is exhausted by using one of each of the two other weapons. <ul><li>the computer will automatically do this when it runs out of a weapon</li></ul></li></ul>";
var directionsBtn = document.getElementsByClassName('directions')[0];
directionsBtn.onclick = () => {
  display.innerHTML = directions;
}

// starting # of weapons
var startSupply = 5;

function start (player) {
  var supply = player.getElementsByClassName('weaponcount');
  for (let i = 0; i < supply.length; i++) {
    supply[i].innerHTML = startSupply;
  }
}

start(user);
start(comp);


// clicking images of weapons
var playBtns = document.getElementsByClassName('play');
var userWeapon, compWeapon, winner;

// weapon supply
var weapons = ['rock', 'paper', 'scissor'];
var userSupply = ['rock', 'paper', 'scissor'];
var compSupply = ['rock', 'paper', 'scissor'];

var brokenWeapon;


/* main function */
for (let i = 0; i < playBtns.length; i++) {
  playBtns[i].onclick = () => {
    brokenWeapon = null;
    userWeapon = weapons[i];
    display.innerHTML = `you played ${userWeapon}`;
    // computer plays
    setTimeout( () => {
      compWeapon = compSupply[Math.floor(Math.random() * compSupply.length)]; 
      display.innerHTML = `computer played ${compWeapon}`; 
      // break weapon ?
      if (checkRepeat(user, userWeapon, userSupply)) {
        brokenWeapon = 'user';
      } 
      if (checkRepeat(comp, compWeapon, compSupply)) {
        if (brokenWeapon == 'user') {
          brokenWeapon = 'both';
        } else {
          brokenWeapon = 'comp';
        }
      }  
      // subtract the played weapons
      weaponCount('subtract');
      setTimeout( () => {
        play(userWeapon);
        displayWinner();
        if (winner == 'tie') {
          tieCount++;
        } else {
          tieCount = 0;
        }
        updtLog();
        
        setTimeout( () => {
          // give out weapons 
          weaponCount('played');
          // break weapons 
          if (brokenWeapon == 'user') {
            breakWeapon(userWeapon);
          } else if (brokenWeapon == 'comp') {
            breakWeapon(compWeapon);
          } else if (brokenWeapon == 'both') {
            breakWeapon(userWeapon);
            breakWeapon(compWeapon);
          } 
          // check if any weapon supply is exhausted
          for (let i = 0; i < userSupply.length; i++) {
            checkSupply(user, userSupply[i]);
          }
          for (let i = 0; i < compSupply.length; i++) {
            checkSupply(comp, compSupply[i]);
          }
          // check if game is over
          gameStatus(user, userSupply);
          if (!gameOver) {
            gameStatus(comp, compSupply);
          }
        }, 500);
      }, 800);
    }, 800);
  }
}


// each round
/* decide which player wins */
function compare (userWeapon, win, lose) {
  if (compWeapon == win) {
    winner = 'user';
  } else if (compWeapon == lose) {
    winner = 'computer';
  }
}

function play (weapon) {
  switch (weapon) {
    case compWeapon:
      winner = 'tie';
      break;
    case 'rock':
      compare('rock', 'scissor', 'paper');
      break;
    case 'paper':
      compare('paper', 'rock', 'scissor');
      break;
    case 'scissor':
      compare('scissor', 'paper', 'rock');
  }
}

function displayWinner() {
  if (winner != 'tie') {
    display.innerHTML = `${winner} is the winner!`;
  } else {
    display.innerHTML = 'That was a tie! Play a weapon again.';
  }
}

/* update log */
var log = document.getElementById('log').getElementsByTagName('table')[0];
function updtLog () {
  var row = log.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = userWeapon;
  cell2.innerHTML = compWeapon;
  cell3.innerHTML = winner;
}


// update number of weapons
function subtract (player, playerWeapon) {
  var weaponCount = player.getElementsByClassName('weaponcount ' + playerWeapon)[0];
  var prevCount = Number(weaponCount.innerHTML);
  /* animate */
  weaponCount.style.color = 'rgb(255, 255, 255, 0)';
  setTimeout ( () => {
    weaponCount.innerHTML = prevCount - 1;
    weaponCount.style.color = 'rgb(4, 4, 4, 1)';
  }, 400); 
}

function returnWeapons () {
  var userCount = user.getElementsByClassName('weaponcount ' + userWeapon)[0];
  var compCount = comp.getElementsByClassName('weaponcount ' + compWeapon)[0];
  var userPrevCount = Number(userCount.innerHTML);
  var compPrevCount = Number(compCount.innerHTML);
  userCount.style.color = 'rgb(255, 255, 255, 0)';
  compCount.style.color = 'rgb(255, 255, 255, 0)';
    setTimeout( () => {
      userCount.innerHTML = userPrevCount + 1;
      userCount.style.color = 'rgb(4, 4, 4, 1)';
      compCount.innerHTML = compPrevCount + 1;
      compCount.style.color = 'rgb(4, 4, 4, 1)';
    }, 400);
  // bring back from zero 
  if (userPrevCount == 0) {    
    var playBtn = user.getElementsByClassName('overlay ' + userWeapon)[0].getElementsByTagName('button')[0];
    playBtn.style.display = 'inline';
    userSupply.push(userWeapon);
    var weaponImg = user.getElementsByClassName(userWeapon + ' weapon')[0].getElementsByTagName('img')[0];
    weaponImg.style.opacity = '1';
    weaponImg.style.animation = 'fadeIn 1s';
    userCount.style.opacity = '1';
    userCount.style.animation = 'fadeIn 1s'; 
  }
  if (compPrevCount == 0) {
    compSupply.push(compWeapon);
    weaponImg = comp.getElementsByClassName(compWeapon + ' weapon')[0].getElementsByTagName('img')[0];
    weaponImg.style.opacity = '1';
    weaponImg.style.animation = 'fadeIn 1s';
    compCount.style.opacity = '1';
    compCount.style.animation = 'fadeIn 1s';
  }
} 

function weaponCount (func) {
  /* subtract weapon when used */
  if (func == 'subtract') {
    subtract(user, userWeapon);
    subtract(comp, compWeapon);
  }
  /* return weapons or give weapons accordingly */
  if (func == 'played') {
    if (winner == 'tie') {
      returnWeapons();
    } else if (winner == 'user') {
      var userCount = user.getElementsByClassName('weaponcount ' + compWeapon)[0];
      var prevCount = Number(userCount.innerHTML);
      userCount.innerHTML = prevCount + 1;
      // bring back from zero 
      var weaponImg = user.getElementsByClassName(compWeapon + ' weapon')[0].getElementsByTagName('img')[0];
      var playBtn = user.getElementsByClassName('overlay ' + compWeapon)[0].getElementsByTagName('button')[0];
      if (prevCount == 0) {
        weaponImg.style.opacity = '1';
        weaponImg.style.animation = 'fadeIn 1s';
        userCount.style.opacity = '1';
        userCount.style.animation = 'fadeIn 1s';
		    playBtn.style.display = 'inline';
        userSupply.push(compWeapon);
      }
    } else {
      var compCount = comp.getElementsByClassName('weaponcount ' + userWeapon)[0];
      prevCount = Number(compCount.innerHTML);
      compCount.innerHTML = prevCount + 1;
      // bring back from zero 
      var weaponImg = user.getElementsByClassName(compWeapon + ' weapon')[0].getElementsByTagName('img')[0];
      if (prevCount == 0) {
		compSupply.push(userWeapon);
        weaponImg.style.opacity = '1';
        weaponImg.style.animation = 'fadeIn 1s';
        compCount.style.opacity = '1';
        compCount.style.animation = 'fadeIn 1s';
      }
    }
  } 
  /* lose weapons when 3x tie */
  if (tieCount == 3) {
    var userLoss = userSupply[Math.floor(Math.random() * userSupply.length)];
    userCount = user.getElementsByClassName('weaponcount ' + userLoss)[0];
    prevCount = Number(userCount.innerHTML);
    userCount.innerHTML = prevCount - 1;
    var compLoss = compSupply[Math.floor(Math.random() * compSupply.length)];
    compCount = comp.getElementsByClassName('weaponcount ' + compLoss)[0];
    prevCount = Number(compCount.innerHTML);
    compCount.innerHTML = prevCount - 1;
    display.innerHTML = `You tied 3 times in a row, so you lose one ${userLoss} and the computer loses one ${compLoss}.`;
    // reset tieCount 
    tieCount = 0;
  }
}

/* weapon supply exhausted */
var checkSupply = (player, weapon) => {
  var countDisplay = player.getElementsByClassName('weaponcount ' + weapon)[0]; 
  var weaponImg = player.getElementsByClassName(weapon + ' weapon')[0].getElementsByTagName('img')[0];
  var count = Number(countDisplay.innerHTML);
  if (count == 0) {
    // disable use for user
    if (player == user) {
      var playBtn = player.getElementsByClassName('play ' + weapon)[0];
      playBtn.style.display = 'none';
      userSupply = deleteItem(weapon, userSupply);
      var buildBtn = user.getElementsByClassName('build ' + weapon)[0];
      buildBtn.style.display = 'inline';
    } else {
      // remove weapon from supply list
      compSupply = deleteItem(weapon, compSupply);
      setTimeout ( () => { build(comp, compSupply);}, 500);
    }
    // animate 
    weaponImg.style.opacity = '0.55';
    weaponImg.style.animation = 'fadeOut 1s';
    countDisplay.style.opacity = '0.55';
    countDisplay.style.animation = 'fadeOut 1s';
  }
}

// find index of item in array
var itemIndex = (item, array) => {
  var index;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == item) {
      index = i;
    }
  }
  return index;
}

// delete item from array and return new array
function deleteItem (item, array) {
  var newArray = [];
  delete array[itemIndex(item, array)];
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== undefined) {
      newArray.push(array[i]);
    }
  }
  return newArray;
}

// check if played 3x in a row
function checkRepeat (player, playerWeapon, playerSupply) {
  if (player == user) {
    cellNum = 0;
  } else {
    cellNum = 1;
  }
  var prevWeapon = log.rows[log.rows.length - 1].cells[cellNum].innerHTML;
  if (playerWeapon == prevWeapon) {
    prevWeapon = log.rows[log.rows.length - 2].cells[cellNum].innerHTML;
    if (playerWeapon == prevWeapon) {
      if (user == player) {
        return 'user';
      } else {
        return 'comp';
      }
    } 
  }
}

// break weapon 
function breakWeapon (playerWeapon) {
  if (brokenWeapon == 'both') {
    if (userWeapon !== compWeapon) {
      display.innerHTML = `${userWeapon} and ${compWeapon} have broken!`;
    }
  } else {
    display.innerHTML = `${playerWeapon} has broken!`;
  }
  // remove from arrays
  userSupply = deleteItem(playerWeapon, userSupply);
  compSupply = deleteItem(playerWeapon, compSupply);
  // disable use visually: user
  var playBtn = user.getElementsByClassName('overlay ' + playerWeapon)[0].getElementsByTagName('button')[0];
  playBtn.style.display = 'none';
  var buildBtn = user.getElementsByClassName('overlay ' + playerWeapon)[0].getElementsByTagName('button')[1];
  buildBtn.style.display = 'none';
  var weaponImg = user.getElementsByClassName(playerWeapon + ' weapon')[0].getElementsByTagName('img')[0];
  var countDisplay = user.getElementsByClassName('weaponcount ' + playerWeapon)[0];
  weaponImg.style.opacity = '0.55';
  weaponImg.style.animation = 'fadeOut 1s';
  countDisplay.style.opacity = '0.55';
  countDisplay.style.animation = 'fadeOut 1s';
  countDisplay.innerHTML = '-';
  var overlay = user.getElementsByClassName('overlay ' + playerWeapon)[0];
  overlay.style.display = 'none';
  // disable use visually: computer
  weaponImg = comp.getElementsByClassName(playerWeapon + ' weapon')[0].getElementsByTagName('img')[0];
  countDisplay = comp.getElementsByClassName('weaponcount ' + playerWeapon)[0];
  weaponImg.style.opacity = '0.55';
  weaponImg.style.animation = 'fadeOut 1s';
  countDisplay.style.opacity = '0.55';
  countDisplay.style.animation = 'fadeOut 1s';
  countDisplay.innerHTML = '-';
}


// game over
var finalWinner;

function gameStatus (player, playerSupply) {
  var rockCount = player.getElementsByClassName('weaponcount rock')[0].innerHTML;
  var paperCount = player.getElementsByClassName('weaponcount paper')[0].innerHTML;
  var scissorCount = player.getElementsByClassName('weaponcount scissor')[0].innerHTML;
  var sum = Number(rockCount) + Number(paperCount) + Number(scissorCount);
  // one player has all the weapons
  if (sum == (startSupply * 6)) {
    if (player == comp) {
      finalWinner = 'the computer is the winner!';
    } else {
      finalWinner = 'you are the winner!';
    }
    gameOver();
  }
  // one player has no weapons
  else if (sum == 0) {
    if (player == user) {
      finalWinner = 'the computer is the winner!';
    } else {
      finalWinner = 'you are the winner!';
    }
    gameOver();
  }
  // one player only has a single type of weapon
  else if (playerSupply.length == 1) {
    if (((player == user) && (compSupply.length == 1)) || ((player == comp) && (userSupply.length == 1))) {
      finalWinner = 'that was a tie!';
    } else {
      if (player == user) {
        finalWinner = 'the computer is the winner!';
      } else {
        finalWinner = 'you are the winner!';
      } 
    }
    gameOver();
  }
}

// game over pop up
var gameOverPopup = document.getElementsByClassName('gameover')[0];
var winnerDisplay = gameOverPopup.getElementsByTagName('span')[0];
var commentDisplay = gameOverPopup.getElementsByTagName('i')[0];
var gameOverlay = document.getElementsByClassName('gameoverlay')[0];
var gameOver = () => {
  // show popup
  gameOverPopup.style.animation = "fadeIn 1s";
  gameOverlay.style.animation = "fadeIn 1s";
  gameOverPopup.style.visibility = "visible";
  gameOverlay.style.visibility = "visible";
  gameOverPopup.style.opacity = "1";
  gameOverlay.style.opacity = "1";
  gameOverPopup.style.transform = "translate(-50%, -50%) scale(1)";
  // popup content
  winnerDisplay.innerHTML = finalWinner;
}

var playAgain = document.getElementsByClassName('close')[0];
playAgain.onclick = () => {
  reset();
  // close popup
  gameOverPopup.style.animation = "fadeOut 1s";
  gameOverlay.style.animation = "fadeOut 1s";
  gameOverPopup.style.visibility = "hidden";
  gameOverlay.style.visibility = "hidden";
  gameOverPopup.style.opacity = "0";
  gameOverlay.style.opacity = "0";
  gameOverPopup.style.transform = "translate(-50%, -50%) scale(0.65)";
}

// reset 
var resetBtn = document.getElementsByClassName('reset')[0];
function reset () {
  weapons = ['rock', 'paper', 'scissor'];
  userSupply = ['rock', 'paper', 'scissor'];
  compSupply = ['rock', 'paper', 'scissor'];
  gameOver, finalWinner = null;
  // clear log 
  var logLength = log.rows.length;
  for (let i = 1; i < logLength; i++) {
    log.deleteRow(1);
  }
  // reset weapon images
  resetImages(user);
  resetImages(comp);
}
resetBtn.addEventListener("click", reset);

function resetImages (player) {
  // show instructions on display
  display.innerHTML = directions;
  // back to opacity 1
  var weaponImgs = player.getElementsByClassName('weapon');
  var weaponCount = player.getElementsByClassName('weaponcount');
  for (let i = 0; i < weaponImgs.length; i++) {
    var img = weaponImgs[i].getElementsByTagName('img')[0];
    img.style.opacity = '1';
    weaponCount[i].style.opacity = '1';
  }
  // back to original supply
  for (let i = 0; i < weaponCount.length; i++) {
    weaponCount[i].innerHTML = startSupply;
  }
  // bring back buttons for user 
  if (player == user) {
    var overlay = player.getElementsByClassName('overlay');
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].style.display = 'inline';
    }
    for (let i = 0; i < 3; i++) {
      var playBtn = player.getElementsByClassName('play ' + weapons[i])[0];
      playBtn.style.display = 'inline';
      var buildBtn = player.getElementsByClassName('build ' + weapons[i])[0];
      buildBtn.style.display = 'inline';
    }
  }
}

// change # of weapons
var changeInput = document.getElementsByClassName('changenum')[0].getElementsByTagName('span')[0];
changeInput.onblur = () => {
  if ((Number(changeInput.innerHTML) > 30) || (Number(changeInput.innerHTML) < 5)) {
    changeInput.innerHTML = 5;
    display.innerHTML = 'Please enter a number from 5 to 30!';
  } else {
    startSupply = changeInput.innerHTML;
    reset();
  }
}


// build weapons
for (let i = 0; i < 3; i++) {
  var buildBtn = user.getElementsByClassName('build');
  buildBtn[i].onclick = () => { build(user, userSupply) };
}

function build (player, playerSupply) {
  if (playerSupply.length == 2) {
    for (let a = 0; a < 3; a++) {
      if (hasItem(playerSupply, weapons[a])) {        
        var sacrifice = weapons[a];
        var countDisplay = player.getElementsByClassName('weaponcount')[a];
        var count = Number(countDisplay.innerHTML);
        countDisplay.innerHTML = count - 1;
      }
    }
    for (let a = 0; a < 3; a++) {
      if (!hasItem(playerSupply, weapons[a])) {
        var builtWeapon = player.getElementsByClassName('weaponcount')[a];
        builtWeapon.innerHTML = '1';
        builtWeapon.style.opacity = '1';
        builtWeapon.style.animation = 'fadeIn 1s';
      }
    }
  } else {
    display.innerHTML = 'You can only build a weapon if its supply is exhausted!'
  }
}

// check if item is in array
function hasItem(array, item) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] == item) {
      return true;
    } 
  } 
  return false;
}



