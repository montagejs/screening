<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# Screen Objects

Screen objects are objects that are used by our screening project. These Objects fit into the following categories:

1. ScreenEvents - events that we capture and monitor
2. ScreenDelays - timing delays added to tests
3. ScreenScript - Executable pieces of javascript code for things like asserts
4. ScreenSync - Synchronization points in our timeline (not yet implemented)
5. ScreenFunctions - A collection of other screening events chained together (not yet implemented)

## Required Properties of Screen Objects

* execute - This method is called when it is the events turn to perform it's job.

## Optional Properties of Screen Objects

* delay - optional wait time for the event to process