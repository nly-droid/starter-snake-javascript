import compileSafeMoves from './compile_safe_moves.js';
import compileOptimalMoves from './compile_optimal_moves.js';
import {calculateYourStats, calculateBoardStats} from './calculate_stats.js';

export default function runSimulation(items, you, board, gameTurn){
  for (let item of items){
    //console.log("Checking ahead for ", item);
    let move = item[0];
    let maxSnakeLength = Math.ceil(board.width * 1/2);
    if ("longestSnakeLength" in board){
      maxSnakeLength = board["longestSnakeLength"];
    }
    let maxTurn = Math.max(maxSnakeLength - 1, Math.ceil(board.width * 1/2));
    let turn = 0;
    let modifiedYou = JSON.parse(JSON.stringify(you));
    let modifiedBoard = JSON.parse(JSON.stringify(board));
    let modifiedTurn = gameTurn;
    let snakeIndex = getSnakeIndex(you, board);
    //console.log("Our snake index is", snakeIndex);
    let collisionCount = 0;
    let deadWeight = 0;
    while (turn < maxTurn && snakeIndex != -1){
      // Calculate stats
      modifiedBoard = calculateBoardStats(modifiedBoard);
      modifiedYou = calculateYourStats(modifiedYou, modifiedBoard);
      for (let i = 0; i < modifiedBoard.snakes.length; i++){
        if (turn == 0 && i == snakeIndex){
          modifiedBoard.snakes[i] = simulateSnake(modifiedBoard.snakes[i], modifiedBoard, move);  
        }
        else {
          // Calculate snake move
          let snakeSafeMoves = compileSafeMoves(modifiedBoard, modifiedBoard.snakes[i]);
          let snakeOptimal = compileOptimalMoves(modifiedBoard, modifiedBoard.snakes[i], modifiedTurn, snakeSafeMoves, true);

          if (snakeOptimal["nextMove"] == null){
            // Choose a random move from the safe moves if there are no optimal moves
            snakeOptimal["nextMove"] = snakeSafeMoves[Math.floor(Math.random() * snakeSafeMoves.length)];
          }
          // Change snake
          modifiedBoard.snakes[i] = simulateSnake(modifiedBoard.snakes[i], modifiedBoard, snakeOptimal["nextMove"]);
          // Update collision count
          if (i == snakeIndex)  {
             collisionCount += Math.round(1.5 * snakeOptimal["collisionCount"] * 1/Math.max(1, turn) * 100) / 100; 
          }
          else{
            collisionCount += Math.round(snakeOptimal["collisionCount"] * 1/Math.max(1, turn) * 100) / 100;
          }
        }
        
        if (i == snakeIndex && modifiedBoard.snakes[i] != null){
          modifiedYou = modifiedBoard.snakes[i];
          //console.log(modifiedYou.head);
        }
        
        if (modifiedBoard.snakes[i] == null){
          //console.log("Snake", i, "will die on turn", turn);

          if (i !== snakeIndex){
            deadWeight += Math.round(3 * Math.max(1, 1/collisionCount) * 1/Math.max(1, turn) * 100) / 100;
          }
          else{
            deadWeight -= Math.round(10 * 1/Math.max(1, turn) * 100) / 100;
          }
          modifiedBoard.snakes.splice(i, 1);
          snakeIndex = getSnakeIndex(modifiedYou, modifiedBoard);
          i = i - 1;
        }
      }
      modifiedBoard = simulateFood(modifiedBoard, modifiedTurn);
      turn += 1;
      modifiedTurn += 1;
    }
    //console.log("Dead Weight", deadWeight);
    //console.log("Collision count", collisionCount);
    item.push(Math.round((turn - collisionCount + deadWeight) * 100) / 100);
  }
  
  for (let item of items){
    if (item.length != 3){
      item.push(0);
    }
  }
  
  items.sort(function(first, second) {
    if (second[2] == first[2]){
      return second[1] - first[1];
    }
    return second[2] - first[2];}
  );
  return items;
}

function getSnakeIndex(you, board){
  let snakes = board.snakes;
  if (snakes.length > 1){
    for (let i = 0; i < snakes.length; i++){
      if (you.id == snakes[i].id){
        return i;
      }
    }
  }
  return -1;
}

function simulateSnake(modifiedYou, modifiedBoard, move){
  if (move != null){
    let moveTiles = {
      "right": {
        "x": modifiedYou.head.x + 1,
        "y": modifiedYou.head.y
      },
      "left": {
        "x": modifiedYou.head.x - 1,
        "y": modifiedYou.head.y
      },
      "down": {
        "x": modifiedYou.head.x,
        "y": modifiedYou.head.y - 1
      },
      "up": {
        "x": modifiedYou.head.x,
        "y": modifiedYou.head.y + 1
      }
    }
    modifiedYou.health -= 1;
    modifiedYou.body.unshift(moveTiles[move]);
    modifiedYou.head = moveTiles[move];


    let eatFood = false;
    for (let i = 0; i < modifiedBoard.food.length; i++){
      let food = modifiedBoard.food[i];
      if (modifiedYou.head.x == food.x && modifiedYou.head.y == food.y){
        eatFood = true;
        //console.log("Snake eats food at", food.x, food.y, eatFood);
        break;
      }
    }

    if (!eatFood){
      modifiedYou.body.pop();
      if (modifiedYou.health == 0){
        return null;
      }
    }
  }
  else {
    modifiedYou = null;
  }

  return modifiedYou;
}

function simulateFood(modifiedBoard, turn){
  const FOOD_RATE = modifiedBoard.food.length;
  let food = modifiedBoard.food;
  
  // Remove food if snake eats it.
  for (let i = 0; i < food.length; i++){
    for (let j = 0; j < modifiedBoard.snakes.length; j++){
      if (modifiedBoard.snakes[j].head.x == food[i].x && modifiedBoard.snakes[j].head.y == food[i].y){
        modifiedBoard.snakes[j].health = 100;
        modifiedBoard.food.splice(i, 1);
        i = i - 1;
        break;
      }
    }
  }

  // Add new food
  if ((turn % FOOD_RATE == 0) || (modifiedBoard.food.length == 0)){
    let newFood = {
      "x": Math.floor(Math.random() * modifiedBoard.width),
      "y": Math.floor(Math.random() * modifiedBoard.height)
    }
    modifiedBoard.food.push(newFood);
  }
  
  return modifiedBoard;
}