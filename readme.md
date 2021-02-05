You must have MongoDB community edition installeda and have the mongod.exe task running. https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

You must have node.js installed. https://nodejs.org/en/download/

Open this folder in your terminal(see options below) and type "npm i" to install the node_modules (JavaScript Libraries) then type "node index.js" to start the express server. 

- Option 1: open this folder in Visual Studio Code and right click in the explorer Open in Integrated Terminal

- Option 2: with this folder open in Visual Studio Code use the shortcut ctrl+shift+`

After index.js is running in the node.js REPL, then open a browser and type "http://localhost:3000/" as the URL.

We also recommend to install the nodemon package so the server automatically resets after there is changes to the code. To install it globally, type "npm install -g nodemon" in the terminal. To use nodemon just replace the keyword node with nodemon. I.E "nodemon index.js" to start the express server. Press ctrl-c to cancel. https://www.npmjs.com/package/nodemon

If you want to add color to your terminal and make it easier to read, then follow along with Scott Hanselman. https://www.youtube.com/watch?v=lu__oGZVT98&list=WL&index=10

THANKS!