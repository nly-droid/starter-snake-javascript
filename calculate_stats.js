const MAX_HEALTH = 100;

export default function calculateStats(gameState) {
  gameState.board = calculateBoardStats(gameState.board);
  gameState.you = calculateYourStats(gameState.you, gameState.board);
  
  return gameState;
}

export function calculateBoardStats(board) {
  board["optimalMaxLength"] = Math.ceil(board.width * 1.75);
  let longest = board.snakes[0].body.length;
  for (let i = 0; i < board.snakes.length; i++){
    board.snakes[i]["hunger"] = calculateHunger(board.snakes[i], board);
    if (board.snakes[i].body.length > longest){
      longest = board.snakes[i].body.length;
    }
  }
  board["longestSnakeLength"] = longest;
  return board;
}

export function calculateYourStats(you, board){
  you["hunger"] = calculateHunger(you, board);
  return you;
}

function calculateHunger(you, board){
  let hunger = 0;
  if ("optimalMaxLength" in board){
    let healthDiff = you.health - MAX_HEALTH * 1/4;
    let bodyDiff = (board.optimalMaxLength - you.body.length);
    let bodyPenalty = Math.pow(Math.abs(Math.min(0, bodyDiff)),2);
    let healthBoost = Math.pow(Math.abs(Math.min(0, healthDiff)),3);
    hunger = 1/healthDiff * bodyDiff - bodyPenalty + healthBoost;
  }
  return hunger;
}