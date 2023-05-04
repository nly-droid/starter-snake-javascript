let loop;
let loopCreated = false;
let loopPointer = -1;

export function createSquareLoop(board, you, move){
  loop = new Array();
  let loopSide = Math.ceil(Math.sqrt(you.length));
  let horizontal = ["left", "right"];
  let vertical = ["up", "down"];
  if (move == "left" || move == "right"){
    pushMoves(compileMoveOrder(move, vertical, horizontal), loopSide);
  }
  else if (move == "down" || move == "up"){
    pushMoves(compileMoveOrder(move, horizontal, vertical), loopSide);
  }
  console.log("Length: ", you.length, "Loop side: ", loopSide);
  console.log("Loop: ", loop);
  loopCreated = true;
  loopPointer = 0;
  return loop;
}

export function moveInLoop(safeMoves){
  if (loopCreated){
    let move = loop[loopPointer];
    if (move in safeMoves){
      loopPointer = (loopPointer + 1) % loop.length;
      return move;
    }
    return null;
  }
  return null;
}

function compileMoveOrder(move, evenArr, oddArr){
  let moveOrder = new Array();
  let secondMove = evenArr[Math.floor(Math.random() * evenArr.length)];
  let thirdMove = oddArr[1 - oddArr.indexOf(move)];
  let lastMove = evenArr[1 - evenArr.indexOf(secondMove)];
  moveOrder.push(move);
  moveOrder.push(secondMove);
  moveOrder.push(thirdMove);
  moveOrder.push(lastMove);
  console.log(moveOrder);
  return moveOrder;
}

function pushMoves(moves, loopSide){
  for (let i = 0; i < moves.length; i++){
    for (let j = 0; j < loopSide; j++){
      if (i != 0 && j != 0){
        loop.push(moves[i]);
      }
    }
  }
}