# Battlesnake JavaScript Starter Project

### An official Battlesnake template written in JavaScript. Get started at [play.battlesnake.com](https://play.battlesnake.com).

![Battlesnake Logo](https://media.battlesnake.com/social/StarterSnakeGitHubRepos_JavaScript.png)

This project is a great starting point for anyone wanting to program their first Battlesnake in JavaScript. It can be run locally or easily deployed to a cloud provider of your choosing. See the [Battlesnake API Docs](https://docs.battlesnake.com/api) for more detail. 

## Technologies Used

This project uses [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/).

## Run Your Battlesnake

1. Click the green 'Run' button to start your Battlesnake.
2. Use your repl.co URL to register your Battlesnake and play games on [play.battlesnake.com](https://play.battlesnake.com).

## Next Steps

Continue with the [Battlesnake Quickstart Guide](https://docs.battlesnake.com/quickstart) to customize and improve your Battlesnake's behavior.

# Details of the strategies for the snake

## Snake Intro
Our snake is considered a calculating and nervous snake that only eats when necessary to control its length and run simulations in its heads to predict what other snakes will do and choose the optimal move out of the current safe moves it has. 

The mechanism for the statistics and optimal moves can be improved so the snake
doesn't overthink with garbage thoughts (and waste our previous move time).

It won several games, but at what cost? The code is messy and it's hard to know when some bugs happen. 

## Compile safe moves
We check if any moves (up, down, left, right) is safe for the snake (not killing it in the next turn).
+ Avoid the snake from hitting the walls (getting out of the boundary of the board).
+ Avoid the snake from eating its own body.
+ Avoid the snake from colliding with other snakes' bodies. 

## Calculate stats
Calculate statistics that help with deducing the optimal move for the snake.
+ Calculate the optimal max length for the snake (the assumption is that if the snake gets too long, it increases the chance of running into itself) - the way to decide the max length is arbitrary - can be improved.
+ Calculate the hunger for all the snakes on the board (to simulate the behaviors in the next few turns). This depends on the health and length of the snake (i.e the snake eats more when it reaches critical health and at short length and tries going on a diet when it reaches the optimal length and the health is still high). 
+ Calculate the longest snake length on the board (this serves as a danger indicator, which can be a separate calculation based on more factors) - if a very scary snake exists (the length is longer than half of the board), our snake panics when simulates more turn in his head (our snake is a very nervous one).

### Compile optimal moves
+ Out of the safe moves, run the simulation for several turns and add/ subtract weights for each move:
  + If there is food that is assocaited with the move, add some points to the move based on hunger and distance from the food.
  + If the snake uses the safe move, what is the chance it will soon collide with another snake head? If the length of that snake is longer than our snake, avoid that move. The collision count is increased by 1. If the other snake is shorter, then the weight is weirdly adjusted (the snake is still thinking whether to eat that one or not). 

### Simulation
+ Modify our positions and other snakes each turn based on the optimal moves.
+ Keep adding up the collision count for each turn.
+ Calculate the dead weight for each snake. If our snake dies in one of the turns, add a lot to dead weight. If other snakes die, subtract it (slightly) because staying alive is more important than slaying enermies. 
+ Remove food if snakes eat it and randomly put food on the board if there is no food left and some strange conditions (this function is terribly written).
