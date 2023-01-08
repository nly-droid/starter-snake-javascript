export function avoidMovingBackwards(board, you, isMoveSafe) {
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

export function avoidWalls(board, you, isMoveSafe) {
    // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  // boardWidth = gameState.board.width;
  // boardHeight = gameState.board.height;
  let boardWidth = board.width;
  let boardHeight = board.height;

  let myHead = you.body[0];  // Coordinates of your head

  if (myHead.x == boardWidth - 1){
    isMoveSafe.right = false;
  }
  
  if (myHead.x == 0) {
    isMoveSafe.left = false;
  }

  if (myHead.y == boardHeight - 1){
    isMoveSafe.up = false;
  }

  if (myHead.y == 0){
    isMoveSafe.down = false;
  }

  return isMoveSafe
}

export function avoidYourself(board, you, isMoveSafe){
  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  // myBody = gameState.you.body;
  return isMoveSafe
}

export function avoidOtherSnakes(board, you, isMoveSafe){
  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  // opponents = gameState.board.snakes;
  return isMoveSafe
}