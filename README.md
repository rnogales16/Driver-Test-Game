Driver Test Game
I made this game to check the reaction capacity of each person. The basic concept is that the user has two controls to move two balls on the screen, each inside a 
pre-built road. The user has 1000 lives at the start of the game and loses life each time they go outside of the road lines. The user continues to lose lives for 
the duration of time that they are outside of the road boarders.


Getting Started

I began by writing the basic structure of the HTML to ensure that all key elements were included on the screen. This was important to visualise the game and would 
be revisited throughout the building process in order to ensure it was updated my code developed. At this stage I also created the canvas so that I would be able 
to work with it in JS when I began to implement the logic of the game. 
The next step was to structure the CSS. The key features were setting the background image, and the colour and size of the letters. I also set the background 
colour of the canvas.


Next Steps

Once the basic HTML and CSS were complete, I drew the lines of the roads that I wanted to use for the game using Paint. Once I had created the roads, I linked them 
to a JS file and printed them on either side of the canvas so that they would appear on the browser. I then used JS to loop them in an infinate loop which would 
start when the start button was pressed.
The next step was creating the balls that would be moved by the user with the left and right arrow keys (right ball) and the A and D keys (left ball). I used 
classes, functions and methods in order to move the balls and the roads to create a more complex game.
At this stage it was important to create a chronometer to track the play time.


Final Step

The final stage of my code was focused on creating functions in JS to unsure that if either of the balls left the boarders of the roads, it would be recognised and 
the player would lose life. I did this by using the colours of the roads in contrast to the colour of the background. I created functions that could recognise when 
the pixel colours surrounding the balls yellow, meaning the player was safe, and when the balls were touching a pixel that was a different colour from the road, 
meaning the player would start to lose life. I also programmed a beep noise when the player was outside of the road.
