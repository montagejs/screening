<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# Webdriver Server Setup

In order to record and run tests Screening needs a way to interact with the different web browsers, this is achieved by
using a Webdriver Server.

Webdriver provides a browser-specific browser driver, which sends commands to a browser, and retrieves results.

## Implementations

There are two basic implementations: Chromedriver, which works only for Google Chrome and Selenium Server which
provides drivers for other browsers like Firefox, Internet Explorer and Opera.

### Chrome

The Chromium project provides a dedicated webdriver for Chrome.

#### Installation

1. Download the **chromedriver** binary for the desired platform (win, mac, linux) from the
[Chromium Download page](http://code.google.com/p/chromium/downloads/list).
2. Unzip on the folder of your choice.

#### Running **chromedriver**

1. Execute **chromedriver** from the commmand line:

        $ /path/to/chromedriver-18.0.1022.0

2. This output indicates that **chromedriver** is ready to start serving requests:

        Started ChromeDriver
        port=9515
        version=18.0.1022.0

#### Webdriver URL

A Webdriver Agent can be added in Screening using by the following URL, where `host` is the domain name or IP of the system
where **chromedriver** is running and `9515` is the default port:

        http://host:9515/

### Selenium Server

Selenium Server is a Java application that provides implementations for different browsers, those implementations are
included in the main download.

#### Installation

1. Download Selenium Server from [Selenium downloads page](http://seleniumhq.org/download/). Save the `.jar` file to the
folder of your choice.

#### Running Selenium Server

**Important**:

Make sure that your system has Java v1.6 or better installed by typing this from the command line:

    $ java -version

If that displays an error then install Java from [java.com](http://www.java.com).

1. Execute the Selenium Server jar from the command line, example:

        $ java -jar /path/to/selenium-server-standalone-2.20.0.jar

    This command starts up Selenium Server using the default configuration, which might not work for you. The following
    sections explain how to configure Selenium Server to use different browsers.

##### Firefox

You'll need to pass the `webdriver.firefox.bin` environment variable which specifies the location of the Firefox executable.

For example, for Mac it would be like this:

    $ java -jar /path/to/selenium-server-standalone-2.20.0.jar -Dwebdriver.firefox.bin=/Applications/Firefox.app/Contents/MacOS/firefox

##### Chrome

Selenium Server can also be used as a driver for Chrome, but it requires you to install **chromedriver**. The benefit
of using Selenium Server is that a single Selenium Server instance could be used to drive different browsers.

You'll need to pass the `webdriver.chrome.driver` environment variable which specifies the location of the chromedriver
binary.

For example:

    $ java -jar /path/to/selenium-server-standalone-2.20.0.jar -Dwebdriver.chrome.driver=/path/to/chromedriver-18.0.1022.0

##### Multiple browsers using the same Selenium Server instance

Simply pass all the desired environment variables.

For example, this Selenium Server could drive both Chrome and Firefox

    java -jar /path/to/selenium-server-standalone-2.20.0.jar \
    -Dwebdriver.firefox.bin=/Applications/Firefox.app/Contents/MacOS/firefox \
    -Dwebdriver.chrome.driver=/path/to/chromedriver/chromedriver-18.0.1022.0

##### Webdriver URL

A Webdriver Agent can be added in Screening using by the following URL, where `host` is the domain name or IP of the system
where Selenium Server is running and `4444` is the default port:

        http://host:4444/wd/hub
