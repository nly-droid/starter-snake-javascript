export default function compileSafeMoves(board, you, isMoveSafe) {
  isMoveSafe = avoidMovingBackwards(board, you, isMoveSafe);
  isMoveSafe = avoidWalls(board, you, isMoveSafe);
  isMoveSafe = avoidYourself(board, you, isMoveSafe);
  isMoveSafe = avoidOtherSnakes(board, you, isMoveSafe);
  return isMoveSafe
}

function avoidMovingBackwards(board, you, isMoveSafe) {
  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = you.body[0];
  const myNeck = you.body[1];
  

  if (myNeck.x < myHead.x) {        // Neck is left of head, don't move left
    isMoveSafe.left = false;

  } else if (myNeck.x > myHead.x) { // Neck is right of head, don't move right
    isMoveSafe.right = false;

  } else if (myNeck.y < myHead.y) { // Neck is below head, don't move down
    isMoveSafe.down = false;

  } else if (myNeck.y > myHead.y) { // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  return isMoveSafe;
}

function avoidWalls(board, you, isMoveSafe) {
  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;
  let boardWidth = board.width;
  let boardHeight = board.height;

  let myHead = you.body[0];  // Coordinates of your head

  if (myHead.x == boardWidth - 1) {
    isMoveSafe.right = false;
  }

  if (myHead.x == 0) {
    isMoveSafe.left = false;
  }

  if (myHead.y == boardHeight - 1) {
    isMoveSafe.up = false;
  }

  if (myHead.y == 0) {
    isMoveSafe.down = false;
  }

  return isMoveSafe;
}

function avoidYourself(board, you, isMoveSafe) {
  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  for(let i = 0; i < you.body.length - 1; i++){
    //for each body parts, check the four positions 
    //your body is at the right of your head 
    if ((you.body[0].x-1 == you.body[i].x) && (you.body[0].y == you.body[i].y)){
      isMoveSafe.left = false; 
    }
    //right
    if ((you.body[0].x+1 == you.body[i].x) && (you.body[0].y == you.body[i].y)){
      isMoveSafe.right = false; 
    }
    //down
    if ((you.body[0].y-1 == you.body[i].y) && (you.body[0].x == you.body[i].x)){
      isMoveSafe.down = false; 
    }
    //up
    if ((you.body[0].y+1 == you.body[i].y) && (you.body[0].x == you.body[i].x)){
      isMoveSafe.up = false; 
    }
  }
  
  return isMoveSafe;
}

function avoidOtherSnakes(board, you, isMoveSafe) {
  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  for (let i = 0; i < board.snakes.length; i++){
    for(let j = 0; j < board.snakes[i].length - 1; j++){
      //check if the head can move to the left 
      if ((you.body[0].x-1 == board.snakes[i].body[j].x) 
        && (you.body[0].y == board.snakes[i].body[j].y)){
        isMoveSafe.left = false;
      }
      //check if the head can move to the right
      if ((you.body[0].x+1 == board.snakes[i].body[j].x)
      && (you.body[0].y == board.snakes[i].body[j].y)){
        isMoveSafe.right = false;
      }
      ////check if the head can move down
      if ((you.body[0].y-1 == board.snakes[i].body[j].y)
          && (you.body[0].x == board.snakes[i].body[j].x)){
        isMoveSafe.down = false;
      }
      ////check if the head can move up
      if ((you.body[0].y+1 == board.snakes[i].body[j].y)
          && (you.body[0].x == board.snakes[i].body[j].x)){
        isMoveSafe.up = false;
      }
    }
  }
  return isMoveSafe;
}