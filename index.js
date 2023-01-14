// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';
import compileSafeMoves from './compile_safe_moves.js';
import compileOptimalMoves from './compile_optimal_moves.js';
import calculateStats from './calculate_stats.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "coolSnake",       // TODO: Your Battlesnake Username
    color: "#4f9f96", // TODO: Choose color
    head: "whale",  // TODO: Choose head
    tail: "fish",  // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {

  // Calculate stats
  gameState = calculateStats(gameState);

  let board = gameState.board;
  let you = gameState.you;
  let turn = gameState.turn;

  // Compile safe moves
  let safeMoves = compileSafeMoves(board, you);

  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }
  //check for if there is one safe move 
  if (safeMoves.length == 1){
    console.log(`MOVE ${gameState.turn}: One safe move ${safeMoves[0]} detected! Moving safely!`);
    return {move: safeMoves[0]}
  }

  // Compile optimal moves

  let nextMove = null;
  nextMove = compileOptimalMoves(board, you, turn, safeMoves);

  if (nextMove == null){
    // Choose a random move from the safe moves if there are no optimal moves
    nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }

  console.log(`MOVE ${gameState.turn}: ${nextMove}`)
  return { move: nextMove }; 
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end
});
