const MAX_HEALTH = 100;

export default function calculateStats(gameState) {
  gameState = calculateBoardStats(gameState);
  gameState = calculateYourStats(gameState);
  
  return gameState;
}

function calculateBoardStats(gameState) {
  let board = gameState.board;
  gameState.board["optimalMaxLength"] = (board.width * board.height)*1/5;
  return gameState;
}

function calculateYourStats(gameState){
  gameState.you["dangerHealth"] = MAX_HEALTH * 1/2;
  gameState.you["hunger"] = calculateHunger(gameState);
  return gameState;
}

function calculateHunger(gameState){
  let hunger = 0;
  let you = gameState.you;
  let board = gameState.board;
  if ("optimalMaxLength" in gameState.board && "dangerHealth" in gameState.you){
    let healthDiff = (you.health - you.dangerHealth);
    let bodyDiff = (board.optimalMaxLength - you.body.length);
    let bodyPenalty = Math.pow(Math.abs(Math.min(0, bodyDiff)),3.5);
    let healthBoost = Math.pow(Math.abs(Math.min(0, healthDiff)),2);
    hunger = healthDiff + bodyDiff - bodyPenalty + healthBoost;
  }
  return hunger;
}