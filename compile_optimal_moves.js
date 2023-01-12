import compileSafeMoves from './compile_safe_moves.js';
import runSimulation from './run_simulation.js';

export default function compileOptimalMoves(board, you, safeMoves, simulated=false) {
  let weightedMoves = {};
  for (let safeMove of safeMoves){
    weightedMoves[safeMove] = 0;
  }
  
  let nextMove = null;

  if ("hunger" in you){
      weightedMoves = findFood(board, you, weightedMoves);
  }
  weightedMoves = avoidHeadCollison(board, you, weightedMoves);

  // Create items array
  var items = Object.keys(weightedMoves).map(function(key) {
    return [key, weightedMoves[key]];
  });

  // Sort the array based on the second element (value)
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  // Run simulation if we are not in the simulation.
  if (!simulated){
    items = runSimulation(items, you, board, safeMoves);
  }

  if (items[0] != undefined){
    nextMove = items[0][0];
  }

  if (!simulated){
    console.log(items);
    console.log(nextMove);
  }
  
  return nextMove;
}

//add a function to avoid head to head collison 
function avoidHeadCollison(board, you, weightedMoves){
  //for each weighted move, check if there is a snake head 
  for(let move of Object.keys(weightedMoves)){
    if (move == "left"){
      for(let j = 0; j < board.snakes.length; j++){
      //ignore myself in this 
      if(you.id != board.snakes[j].id && you.length <= board.snakes[j].length){
        //check if there is other snake parts around me
        if(board.snakes[j].head.x == you.head.x-2 && 
          board.snakes[j].head.y == you.head.y){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing left move`);
          delete weightedMoves["left"];
        }
        else if(board.snakes[j].head.x == you.head.x-1 && 
          board.snakes[j].head.y == you.head.y+1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing left move`);
          delete weightedMoves["left"];
        }
        else if(board.snakes[j].head.x == you.head.x-1 && 
          board.snakes[j].head.y == you.head.y-1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing left move`);
          delete weightedMoves["left"];
        }
        }
      }
    }
    if (move == "right"){
      for(let j = 0; j < board.snakes.length; j++){
      //ignore myself in this 
      if(you.id != board.snakes[j].id && you.length <= board.snakes[j].length){
        //check if there is other snake parts around me
        if(board.snakes[j].head.x == you.head.x+2 && 
          board.snakes[j].head.y == you.head.y){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing right move`);
          delete weightedMoves["right"];
        }
        else if(board.snakes[j].head.x == you.head.x+1 && 
          board.snakes[j].head.y == you.head.y+1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing right move`);
          delete weightedMoves["right"];
        }
        else if(board.snakes[j].head.x == you.head.x+1 && 
          board.snakes[j].head.y == you.head.y-1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing right move`);
          delete weightedMoves["right"];
        }
        }
      }
    }

    if (move == "up"){
      for(let j = 0; j < board.snakes.length; j++){
      //ignore myself in this 
      if(you.id != board.snakes[j].id && you.length <= board.snakes[j].length){
        //check if there is other snake parts around me
        if(board.snakes[j].head.x == you.head.x && 
          board.snakes[j].head.y == you.head.y+2){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing up move`);
          delete weightedMoves["up"];
        }
        else if(board.snakes[j].head.x == you.head.x+1 && 
          board.snakes[j].head.y == you.head.y+1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing up move`);
          delete weightedMoves["up"];
        }
        else if(board.snakes[j].head.x == you.head.x-1 && 
          board.snakes[j].head.y == you.head.y+1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing up move`);
          delete weightedMoves["up"];
        }
        }
      }
    }
    if (move == "down"){
      for(let j = 0; j < board.snakes.length; j++){
      //ignore myself in this 
      if(you.id != board.snakes[j].id && you.length <= board.snakes[j].length){
        //check if there is other snake parts around me
        if(board.snakes[j].head.x == you.head.x && 
          board.snakes[j].head.y == you.head.y-2){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing down move`);
          delete weightedMoves["down"];
        }
        else if(board.snakes[j].head.x == you.head.x+1 && 
          board.snakes[j].head.y == you.head.y-1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing down move`);
          delete weightedMoves["down"];
        }
        else if(board.snakes[j].head.x == you.head.x-1 && 
          board.snakes[j].head.y == you.head.y-1){
          console.log(`Enemy head found at ${board.snakes[j].head.x},${board.snakes[j].head.y}. Removing down move`);
          delete weightedMoves["down"];
        }
        }
      }
    }
  }
  return weightedMoves;  
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