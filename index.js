//Taking the html elements by using ID's
var bar1 = document.getElementById("bar-1");
var bar2 = document.getElementById("bar-2");
var ball = document.getElementById("ball");

//when key pessed movement of barr by 20 units
var movement = 20;

//Assigning names for Bar-1 and bar-2 and also initializing the storeName &storescore
const thisBar1 = "Bar-1";
const thisBar2 = "Bar-2";
const storeName = "abc";
const storeScore = 123;

//Initialzing the value changing elements
let whichBar;
let moveX = 2;
let moveY = 2;
let ballMoving;
//border will help to stop the bar at the end of the window
let border = 12;
let score;
let highScore;
let gameStart = false;

//Initializing localstorage for storescore and storeName with null value
localStorage.setItem(storeScore, "null");
localStorage.setItem(storeName, "null");

//Function before starting the game to display highscore and barname from the storage
(function () {
  highScore = localStorage.getItem(storeScore);
  whichBar = localStorage.getItem(storeName);
  if (whichBar === "null" || highScore === "null") {
    alert("Hello.. This is your first game");
    highScore = 0;
    whichBar = thisBar1;
  } else {
    alert(whichBar + " has maximum score of " + highScore * 100);
  }
  gameReset(thisBar1);
})();

function gameReset(barName) {
  if (whichBar !== "null" && highScore !== 0) {
    alert(
      localStorage.getItem(storeName) +
        " has maximum score of " +
        highScore * 100
    );
  }

  //bringing the bar1 bar2 and ball to the initiale position(middle)
  bar1.style.left = (window.innerWidth - bar1.offsetWidth) / 2 + "px";
  bar2.style.left = (window.innerWidth - bar2.offsetWidth) / 2 + "px";
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  if (barName === thisBar1) {
    ball.style.top =
      bar2.getBoundingClientRect().y -
      bar2.getBoundingClientRect().height +
      "px";
    moveY = -2;
  } else if (barName === thisBar2) {
    ball.style.top =
      bar1.getBoundingClientRect().y +
      bar1.getBoundingClientRect().height +
      "px";
    moveY = 2;
  }
  score = 0;
  gameStart = false;
}
document.addEventListener("keydown", (event) => {
  //keycode 68 id "d" key and keycode 39 is "right arrow key" in the keyboard
  if (event.keyCode === 68 || event.keyCode === 39) {
    //when key pressed bar moves to the right by 20 units also bar movement will stop when bar left position value reaches to (innerwidth-bar offsetwidth-border)value.
    if (
      parseInt(bar1.style.left) <
      window.innerWidth - bar1.offsetWidth - border
    ) {
      bar1.style.left = parseInt(bar1.style.left) + movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }
  //keycode 68 id "a" key and keycode 39 is "left arrow key" in the keyboard
  if (event.keyCode === 65 || event.keyCode === 37) {
    //when key pressed bar moves to the left by 20 units and also bar movement will stop when bar left position value reaches to (border)value.
    if (parseInt(bar1.style.left) > border) {
      bar1.style.left = parseInt(bar1.style.left) - movement + "px";
      bar2.style.left = bar1.style.left;
    }
  }
  //keycode 13 is "Enter" key
  if (event.keyCode === 13) {
    if (!gameStart) {
      gameStart = true;
      //to find the ball x and y position
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      //balldia is the diameter of the ball
      let balldia = ballRect.width;

      //bar1 and bar2 offset height and width values
      let bar1Height = bar1.offsetHeight;
      let bar1Width = bar1.offsetWidth;
      let bar2Height = bar2.offsetHeight;
      let bar2Width = bar2.offsetWidth;

      //Using setInterval with 10msec delay
      ballMoving = setInterval(function () {
        //bar1 and bar2 x postion values
        let bar1X = bar1.getBoundingClientRect().x;
        let bar2X = bar2.getBoundingClientRect().x;

        //ball center point value calculated using ball x postion value and ball diameter
        let ballCentre = ballX + balldia / 2;

        //moving the ball in x and y direction
        ballX = ballX + moveX;
        ballY = ballY + moveY;
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        //when ball touches the side screen moveX will toggle its direction
        if (ballX + balldia > window.innerWidth || ballX < 0) {
          moveX = -moveX;
        }
        //when ball touches bar1 moveY will toggle its direction and score will increase
        if (ballY <= bar1Height) {
          score++;
          moveY = -moveY;
          //when ballcenter point doesnot touch the bar1 score will be updated in the storage and game over
          if (ballCentre < bar1X || ballCentre > bar1X + bar1Width) {
            dataStoring(score, thisBar2);
          }
        }
        //when ball touches bar2 moveY will toggle its direction and score will increase
        if (ballY >= window.innerHeight - bar2Height - border) {
          moveY = -moveY;
          score++;
          //when ballcenter point doesnot touch the bar1 score will be updated in the storage and game over
          if (ballX < bar2X || ballX > bar2X + bar2Width) {
            dataStoring(score, thisBar1);
          }
        }
      }, 10);
    }
  }
});
//function to update the score and clear the Interval
//display the notification with score and highest score
function dataStoring(scoreObtained, winningBar) {
  if (scoreObtained > highScore) {
    highScore = scoreObtained;
    localStorage.setItem(storeScore, scoreObtained);
    localStorage.setItem(storeName, winningBar);
  }
  clearInterval(ballMoving);

  alert(
    `${winningBar} wins the Game with score of ${
      scoreObtained * 100
    }. Max Score is:${highScore * 100} `
  );
  gameReset(winningBar);
}
