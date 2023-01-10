export default function compileOptimalMoves(board, you, moves) {
  moves = findFood(board, you, moves);
  return moves;
}


function findFood(board, you, moves) {
  // Step 4 - Move towards food instead of random, to regain health and survive longer
  let myHead = you.body[0];

  let minDirection = new Array();
  let minDistance = board.width + board.height + 1;

  for (let i = 0; i < board.food.length; i++) {
    let food = board.food[i];

    let xDistance = food.x - myHead.x;
    let yDistance = food.y - myHead.y;
    let distance = Math.abs(xDistance) + Math.abs(yDistance);

    if (distance < minDistance) {
      let direction = new Array();
      if (xDistance > 0) {
        direction.push("right");
      }
  
      if (xDistance < 0) {
        direction.push("left");
      }
  
      if (yDistance > 0) {
        direction.push("up");
      }
  
      if (yDistance < 0) {
        direction.push("down");
      }

      minDirection = moves.filter(i => new Set(direction).has(i));
    }
  }

  if (minDirection.length > 0){
    moves = minDirection;
  }

  console.log(moves);

  return moves
}