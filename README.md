# TurtleController
control turtles from a web browser using websockets

yes I am ripping off ottomated, but this is a project I made without using his code

notes for running: 
install the json file in the folder turtle_client as an api for the turtle.
do so by running "pastebin get 4nRg9CHU json" in the turtle.
then, in a command line, run "tsc index.ts" in order to compile the server file, 
then run "node index.js". copy the resulting wss:// link
then open the file index.html in a web browser, and paste the wss:// into the first text box,
and then clicking "connect". 
then install the turtle.lua on the turtle, but paste whatever was after the wss:// in the link into the part
in the beginning where it defines the variable "Websocket_ip". then run the file.

if everything went correctly, the turtle should now have a label.


to do: 

proper communication between server, web client, and turtle.
make web client look nice.
fix web client so i dont have to send messages using inspect element's console.
update readme.md