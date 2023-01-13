import compileSafeMoves from './compile_safe_moves.js';
export default function compileOptimalMoves(board, you, weightedMoves) {
  let nextMove = null;

  weightedMoves = avoidHeadCollison(board, you, weightedMoves);

  if ("hunger" in you){
      weightedMoves = findFood(board, you, weightedMoves);
  }
  weightedMoves = avoidEdge(board, you, weightedMoves);
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
  weightedMoves = findTarget(you, weightedMoves, you.hunger, food);
  
  return weightedMoves;
}

//tendency of moving closer to the center, away from the edge 
function avoidEdge(board, you, weightedMoves){
  //store the values of the safe coordinates 
  //right x coordinates 
  let x2 = Math.ceil(board.width * 2/3) - 1;
  //left x coordinates 
  let x1 = Math.ceil(board.width - x2);
  //upper y coordinates 
  let y2 = Math.ceil(board.height * 2/3) - 1;
  //lower y coordinates 
  let y1 = Math.ceil(board.height - y2);

  if (you.x >= x1 && you.x <= x2 && you.y >= y1 && you.y <= y2){
      let moveTowardsedge = [{"x": x1, "y": y1}, {"x": x2, "y": y1}, {"x": x1, "y": y2}, {"x": x2, "y": y2}];
      weightedMoves = findTarget(you, weightedMoves, you.centralUrgency, moveTowardsedge);
  }
  
  return weightedMoves;
  
}

function findTarget(you, weightedMoves, urgency, array){
  console.log(array);
  console.log(array.length);
  for (let i = 0; i < array.length; i++){
      //(x1-x2)+(y1-y2) in abs values 
    let distance = Math.abs(you.head.x - array[i].x) + Math.abs(you.head.y - array[i].y);
    let directions = new Array();
    
    if (you.head.x < array[i].x){
      directions.push("right");
    }

    if (you.head.x > array[i].x){
      directions.push("left");
    }

    if (you.head.y < array[i].y){
      directions.push("up");
    }

    if (you.head.y > array[i].y){
      directions.push("down");
    }

    for (let direction of directions){
      if (direction in weightedMoves){
        weightedMoves[direction] += urgency * 1/distance;
      }
    }
  }
  return weightedMoves;
}
