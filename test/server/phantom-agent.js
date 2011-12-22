/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var page = new WebPage(),
    t, url;

if (phantom.args.length === 0) {
    console.log('Usage: phantom-agent.js <some URL>');
    phantom.exit();
} else {
    t = Date.now();
    url = phantom.args[0];
    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
            phantom.exit(1);
        } else {
            t = Date.now() - t;
            console.log('Loading time ' + t + ' msec');
        }

        // Leave the browser open for the duration of the test
        //phantom.exit();
    });
}