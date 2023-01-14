import runSimulation from './run_simulation.js';

export default function compileOptimalMoves(board, you, turn, safeMoves, simulated=false) {

  let weightedMoves = {};
  let collisionCount = 0;
  
  for (let safeMove of safeMoves){
    weightedMoves[safeMove] = 0;
  }
  
  let nextMove = null;

  if (!simulated){
    weightedMoves = avoidHeadCollison(board, you, weightedMoves, false);
  }
  else{
    weightedMoves = avoidHeadCollison(board, you, weightedMoves, true);
    collisionCount = weightedMoves["collisionCount"];
    weightedMoves = weightedMoves["weightedMoves"];
  }
  
  if ("hunger" in you){
      weightedMoves = findFood(board, you, weightedMoves, turn);
  }

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
    items = runSimulation(items, you, board, turn);
  }

  if (items[0] != undefined){
    nextMove = items[0][0];
  }

  if (!simulated){
    console.log(items);
    console.log(nextMove);
    return nextMove;
  }
  else{
    return {
      "nextMove": nextMove,
      "collisionCount": collisionCount
    }
  }
}

function detectHead(board, you, move){
  let moveTiles = {
    "right": {
      "x": you.head.x + 1,
      "y": you.head.y,
      "adjency": 
      [
        {
        "x": you.head.x + 1,
        "y": you.head.y + 1
        },
        {
        "x": you.head.x + 1,
        "y": you.head.y - 1
        },
        {
        "x": you.head.x + 2,
        "y": you.head.y
        }
      ]
    },
    "left": {
      "x": you.head.x - 1,
      "y": you.head.y,
      "adjency": 
      [
        {
        "x": you.head.x - 1,
        "y": you.head.y + 1
        },
        {
        "x": you.head.x - 1,
        "y": you.head.y - 1
        },
        {
        "x": you.head.x - 2,
        "y": you.head.y
        }
      ]
    },
    "down": {
      "x": you.head.x,
      "y": you.head.y - 1,
      "adjency": 
      [
        {
        "x": you.head.x + 1,
        "y": you.head.y - 1
        },
        {
        "x": you.head.x - 1,
        "y": you.head.y - 1
        },
        {
        "x": you.head.x,
        "y": you.head.y - 2
        }
      ]
    },
    "up": {
      "x": you.head.x,
      "y": you.head.y + 1,
      "adjency": 
      [
        {
        "x": you.head.x - 1,
        "y": you.head.y + 1
        },
        {
        "x": you.head.x + 1,
        "y": you.head.y + 1
        },
        {
        "x": you.head.x,
        "y": you.head.y + 2
        }
      ]
    }
  }
  for(let i = 0; i < board.snakes.length; i++){
    // ignore myself in this 
    if (you.id != board.snakes[i].id){
      for (let tile of moveTiles[move].adjency){
        if (board.snakes[i].head.x == tile.x && board.snakes[i].head.y == tile.y){
          //console.log(`Enemy head found at ${board.snakes[i].head.x}, ${board.snakes[i].head.y}. Removing ${move}!`);
          if (board.snakes[i].length >= you.body.length){
            return -1;
          }
          else{
            return Math.abs(you.hunger) * 1/10;
          }
        }
      }
    }
  }
  return 0;
}

//add a function to avoid head to head collison 
function avoidHeadCollison(board, you, weightedMoves, simulated=false){
  let collisionCount = 0;

  let moves = Object.keys(weightedMoves);
  //for each weighted move, check if there is a snake head 
  for(let move of moves){
    let weight = detectHead(board, you, move, weightedMoves);
    if (weight == -1){
      delete weightedMoves[move];
      collisionCount += 1;
    }
    else {
      weightedMoves[move] += weight;
    }
  }

  if (simulated){
    return {
      "weightedMoves": weightedMoves,
      "collisionCount": collisionCount
    };
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