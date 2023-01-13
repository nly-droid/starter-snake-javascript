import compileSafeMoves from './compile_safe_moves.js';
import compileOptimalMoves from './compile_optimal_moves.js';

export default function runSimulation(items, you, board, turn, safeMoves){
  for (let item of items){
    console.log("Checking ahead for ", item);
    let move = item[0];
    let maxTurn = Math.max(you.body.length, board.width);
    let turn = 0;
    let modifiedYou = JSON.parse(JSON.stringify(you));
    let modifiedBoard = JSON.parse(JSON.stringify(board));
    let snakeIndex = getSnakeIndex(you, board);
    console.log("Our snake index is", snakeIndex);
    while (turn < maxTurn && snakeIndex != -1){
      // Change snake
      for (let i = 0; i < modifiedBoard.snakes.length; i++){
        let snake = modifiedBoard.snakes[i];
        if (turn == 0 && i == snakeIndex){
          modifiedBoard.snakes[i] = simulateSnake(modifiedBoard.snakes[i], modifiedBoard, move);
        }
        else{
          let snakeSafeMoves = compileSafeMoves(modifiedBoard, snake);
          let snakeOptimal = compileOptimalMoves(modifiedBoard, snake, modifiedBoard.turn, snakeSafeMoves, true);
          modifiedBoard.snakes[i] = simulateSnake(snake, modifiedBoard, snakeOptimal);
        }
        if (modifiedBoard.snakes[i] == null){
          console.log("Snake", i, "will die on turn", turn);
          modifiedBoard.snakes.splice(i, 1);
          snakeIndex = getSnakeIndex(modifiedYou, modifiedBoard);
          i = i - 1;
        }
      }
      modifiedYou = modifiedBoard.snakes[snakeIndex];
      turn += 1;
      modifiedBoard.turn += 1;
    }
    item.push(turn);
  }
  
  for (let item of items){
    if (item.length != 3){
      item.push(0);
    }
  }
  
  items.sort(function(first, second) {
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
    modifiedYou.body.unshift(moveTiles[move]);
    modifiedYou.head = moveTiles[move];
    let removeFoodIndex = -1;
    for (let i = 0; i < modifiedBoard.food.length; i++){
      let food = modifiedBoard.food[i];
      if (modifiedYou.head.x == food.x && modifiedYou.head.y == food.y){
        removeFoodIndex = i;
        break;
      }
    }
    if (removeFoodIndex == -1){
      modifiedYou.body.pop();
    }
  }
  else {
    modifiedYou = null;
  }

  return modifiedYou;
}

function simulateFood(modifiedBoard, modifiedYou, turn){
  return null;
}