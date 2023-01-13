const MAX_HEALTH = 100;

export default function calculateStats(gameState) {
  gameState = calculateBoardStats(gameState);
  gameState = calculateYourStats(gameState);
  
  return gameState;
}

function calculateBoardStats(gameState) {
  let board = gameState.board;
  gameState.board["optimalMaxLength"] = 5;
  return gameState;
}

function calculateYourStats(gameState){
  gameState.you["dangerHealth"] = MAX_HEALTH * 1/3;
  gameState.you["hunger"] = calculateHunger(gameState);
  gameState.you["centralUrgency"] = calculateCentralUrgency(gameState);
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

function calculateCentralUrgency(gameState){
  let you = gameState.you;
  let board = gameState.board;
  if ("optimalMaxLength" in gameState.board){
    let bodyDiff = (board.optimalMaxLength - you.body.length);
    let bodyPenalty = Math.pow(Math.abs(Math.min(0, bodyDiff)), 3);
    return bodyPenalty;
  }
  return 100;
}