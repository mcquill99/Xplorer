# XPlorer
### A 2D Game Design Project

You wake up in your spaseship to see that you crashed mid flight onto an unknown planet. All you have with you is the artificial intelligence on your spaceship's computer.

The only way to repair your ship is to collect resources scattered around the planet, but hostile life lives on the planet. Will you be able to survive long enough to get off of the planet? You must race against your oxygen tank's depletion to do so.

![Main Menu](https://github.com/mcquill99/Xplorer/blob/master/assets/Screenshots/Title.png)

### Objective

To create as polished of a game experience in one month as you can, from concept to implementation. We worked in groups of 3-4 people to create 2D games using the Phaser.Js library. 

### States
- Preload: This is the state that loads all assets into our game, and then brings the player to the main menu
- Menu: The state that controlls how the main menu looks and sounds
- Game: The main state the player is in while playing the game. This controlls all main gameplay loops: variables, enemy movement, sounds, timers, etc. This is the state that also loads in all enemies
![Enemy](https://github.com/mcquill99/Xplorer/blob/master/assets/Screenshots/critter.gif)
- GameOver: The state when the player loses all of their oxygen, this resets them with less materials in their spaceship.

### Random Map Creation
This section assigns random json values to a preassigned grid size. This becomes our game world. The number generated in our json represents the texture displayed. Possible textures include different grass textures and materials, so no one play through is exactly the same.

