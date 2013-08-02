AscendroGames
=============

Realtime Games for your Browser

It started as a quick glance in the world of serverside javascript and webgl but finished with a nice little gaming platform.

It's neither finished nor ready for production but it may help you in getting in touch with the technologies and/or having fun with implementing additional little games :)

## Installation:

Make sure to have node.js instaled and npm and node can be called. (For more informations see http://nodejs.org/ ).
 
Checkout the project on your server and then run istall.sh - it will install the required packages mime and socket.io.

Call node server.js or call start.sh in order to start the server. You will now be able to access the app via an browser and the adress <your server ip>:1337

If you want to run the server on a different ip you need to edit app.listen(1337) in the server.js to a port you prefer.

Note: we used this port number just for our internal pleasing - as it is a http protocol used port 80 and 8080 would be recommended. More informations here: https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

## What we used:

- Board from http://de.wikipedia.org/wiki/Datei:Dontworry.svg
- node.js : Platform for the serverside script - http://nodejs.org/
- socket.io : Library for usage of WebSockets and alternatives for communication between client and server - http://socket.io/
- mime : Determining the mimetypes of documents - https://github.com/broofa/node-mime
- three.js : Javascript 3D Library as a framework for webGL -  http://threejs.org/
- thee.js Editor : For creating our small models - http://threejs.org/editor/
- jquery/jqueryui : Speeding up the development of the frontend - http://jqueryui.com/

## License

   Copyright Michael Kling - Ascendro S.R.L

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

## Changelog

### 0.0.1
 
 - initial release
