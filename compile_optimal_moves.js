export default function compileOptimalMoves(board, you, weightedMoves) {
  let move = null;
  move = findFood(board, you, weightedMoves);
  return move;
}


function findFood(board, you, weightedMoves) {

  const safeMoves = Object.keys(weightedMoves);
  
  let food = board.food;
  // get the distance from all the food to all the snakes 
  let minFood = null;
  let minDistance = board.width + board.height + 1;

  // get the shortest distance
  for (let i = 0; i< board.food.length; i++){
      //(x1-x2)+(y1-y2) in abs values 
    let distance = Math.abs(you.head.x - food[i].x) + Math.abs(you.head.y - food[i].y);

    if(distance < minDistance){
      minDistance = distance; 
      minFood = food[i];
    }
  }

  if (minFood != null){
    for(let i = 0; i < safeMoves.length; i++){
      if(safeMoves[i] == "right" && you.head.x < minFood.x){
        return safeMoves[i];
      }
        if(safeMoves[i] == "left" && you.head.x > minFood.x){
        return safeMoves[i];
      }
        if(safeMoves[i] == "up" && you.head.y < minFood.y){
        return safeMoves[i];
      }
        if(safeMoves[i] == "down" && you.head.y > minFood.y){
        return safeMoves[i];
      }
    }
  }
  
  return null;
}