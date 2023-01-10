export default function compileOptimalMoves(board, you, weightedMoves) {
  let nextMove = null;

  if ("hunger" in you){
      weightedMoves = findFood(board, you, weightedMoves);
  }

  console.log(weightedMoves);

  let highestWeight = Number.MIN_SAFE_INTEGER;
  // Get the move with the highest weight
  for (let move of Object.keys(weightedMoves)){
    if (weightedMoves[move] > highestWeight){
      nextMove = move;
      highestWeight = weightedMoves[move];
    }
  }
  console.log(nextMove);
  
  return nextMove;
}


function findFood(board, you, weightedMoves) {
  
  let food = board.food;
  // get the distance from all the food to all the snakes 
  for (let i = 0; i< board.food.length; i++){
      //(x1-x2)+(y1-y2) in abs values 
    let distance = Math.abs(you.head.x - food[i].x) + Math.abs(you.head.y - food[i].y);
    let directions = new Array();
    
    if (you.head.x < food[i].x){
      directions.push("right");
    }

    if (you.head.x > food[i].x){
      directions.push("left");
    }

    if (you.head.y < food[i].y){
      directions.push("up");
    }

    if (you.head.y > food[i].y){
      directions.push("down");
    }

    for (let direction of directions){
      if (direction in weightedMoves){
        weightedMoves[direction] += you.hunger * 1/distance;
      }
    }
  }
  
  return weightedMoves;
}