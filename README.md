# The Open House Form

## What is?

* I made this because we needed a way for clients to sign in during an open house
* We may not have the internet so the app runs locally
* developed as a web based so it could be easily hosted online
* out puts the clients to a CSV file on demand

## Features:

### this is not an exhaustive list, contact me if you want more information (realistically I don't think anyone but me will use it)

* has a timeout to carousel for a screen saver after a min of inactivity
	* move mouse or click exist screen saver
* has 2 forms for information
	* based on answer of first form if the guest is not working with a real estate agent then the second form is displayed
* has an admin page
	* access is located through a hidden button at bottom right of first form
	* can also append /admin to url to access
	* requires password to access incase of accidental click
		* default to nothing
	* can change various settings in the admin panel
	* can export or clear CSV file
	* some settings require a reload (I know, annoying, may change someday)
	* have to save individual changes (no save all button)
	
### designed to work with windows - not tested on other OSs

## Caveats

* you must include the nodex64.exe and nodex86.exe in the top directory with the click-to-run.cmd in order to have it work with no changes
	* of course if you have node installed globally you can just change the batch file click-to-run.cmd to call the node command
* this is set to run on localhost port 80 so that you don't have to enter a port number
	*  this port gets blocked a lot so you may need to change the port in the webServer.js
