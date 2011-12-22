<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

Screening server overview
=========================

Note: You'll need a recent version of socket.io for this to work. Whatever comes off of npm should be sufficient.

This proof of concept server demonstrates a node.js server that can push and execute actions on client machines through a websocket-like interface. Currently the actions are read from the actions.txt file and are in the Montage serialization format produced by the recorder app. This is likely to change in the near future, so don't get too attached to it.

Usage
-----

The server is launched by running

    node server 
    
from the driver folder. This creates a local server on port 8081. Once the server is running an "agent" can be created by navigating any browser to 

    <server_address>:8081/screening/agent
    
If it is able to connect successfully the agent browser window will display "Connected! Device is now ready to have tests executed against it." It will then wait for further instruction from the server. In a production test environment devices would be navigated to this page to "initialize" them for testing, at which point they could run without further interaction.

To execute a test on a device, navigate a different browser window (on the same device or a different one) to

    <server_address>:8081/screening/driver
    
This will display all active agent devices by their socket id, along with some simple details about the device (User agent string, screen size). This list does not update dynamically at this point. Clicking "Run Test" next to one of the devices will then instruct that device to navigate to a sample web page and playback some pre-recorded actions (read from actions.txt). Once the playback is finished, the page will revert to the "Connected!" message and will be ready for another test to be executed.
