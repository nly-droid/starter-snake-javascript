import compileSafeMoves from './compile_safe_moves.js';
import compileOptimalMoves from './compile_optimal_moves.js';

export default function runSimulation(items, you, board, safeMoves){
  for (let item of items){
    console.log("Checking ahead for ", item);
    let move = item[0];
    let maxTurn = you.body.length;
    let turn = 0;
    let turnSafeMoves = safeMoves;
    let modifiedYou = {};
    Object.assign(modifiedYou, you);
    while (turn < maxTurn && turnSafeMoves.length > 0){
      // Change snake
      modifiedYou = simulateSnake(modifiedYou, move);
      turnSafeMoves = compileSafeMoves(board, you);
      move = compileOptimalMoves(board, you, turnSafeMoves, true);
    if (move == null){
  // Choose a random move from the safe moves if there are no optimal moves
        move = turnSafeMoves[Math.floor(Math.random() * turnSafeMoves.length)];
      }
      turn += 1;
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

function simulateSnake(modifiedYou, move){
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
  modifiedYou.body.pop();
  modifiedYou.head = moveTiles[move];
  return modifiedYou;
}