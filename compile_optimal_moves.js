  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  // food = gameState.board.food;
export function findFood(board, you, safeMoves){
  
  let food = board.food;
  //get the distance from all the food to all the snakes 
  //
  let snakehealth = you.health;
  if(food.length > 0 && snakehealth < 50){
  let minDistance = Math.abs(you.head.x - food[0].x) + Math.abs(you.head.y - food[0].y);
  let minFood = food[0];
  for(let i = 1; i< board.food.length; i++){
      //(x1-x2)+(y1-y2) in abs values 
    let distance = Math.abs(you.head.x - food[i].x) + Math.abs(you.head.y - food[i].y);

    if(distance < minDistance){
      minDistance = distance; 
      minFood = food[i];
    }
  }

//
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
  return safeMoves[Math.floor(Math.random() * safeMoves.length)];
}