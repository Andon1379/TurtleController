# TurtleController
Control turtles from a web browser using websockets!

## Running the Server 
Run `index.js` with node. It should give you a port to run the project off of. 
I would recommend connecting the server to a tunnel service.
The files for the web client will be served from the root directory of the server (In other words, just go to `https://localhost:3000` or whatever website you are running this off of to access it).

## Installing the code on the turtles
In computercraft, open up your turtle. Run the following commands:
`pastebin get iYyAqfMA turtle.lua`
`pastebin get AJrZke6q myFun.lua`
This will install the turtle - side code for this project to run. 
All you need to do now is connect it to the server. 
This can be done by running `./turtle.lua` in the turtle's console, and then typing in the URL to your server.
__Please Note:__ The url inputted needs to be of either `http://` or `https://`.


If you have any feedback, do not hesitate to make a new issue or a fork. I would love to collaborate with other people on this.