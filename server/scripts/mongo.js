var request = require("request"),
    fs = require("fs"),
    url = require("url"),
    os = require("os"),
    commander = require("commander"),
    spawn = require("child_process").spawn,
    path = require("path"),
    wrench = require("wrench");

/**
 * Downloads a file asynchronously.
 * It uses your proxy settings if they're defined in http_proxy
 *
 * @param fileUrl
 * @param path the destination path of the saved file
 */
var downloadFile = function(fileUrl, path, cb) {
    var host = url.parse(fileUrl).hostname
    var pathName = url.parse(fileUrl).pathname;
    var fileName = pathName.split("/").pop();

    var fullPathToFile = path + "/" + fileName;
    if (process.env.http_proxy) {
        request({url: fileUrl, proxy: process.env.http_proxy}, cb).pipe(fs.createWriteStream(fullPathToFile));
    } else {
        request(fileUrl, cb).pipe(fs.createWriteStream(fullPathToFile));
    }
}

/**
 * Creates the data/db directory used by the typical MongoDB installation
 * @param homeDir location of the user's home directory (~)
 */
var createDataDirectory = function(homeDir) {
    var dataDir = homeDir + "/data/db";

    if (!path.existsSync(dataDir)) {
        console.log("Creating MongoDB database directory on ~/data/db");
        wrench.mkdirSyncRecursive(dataDir, 0777);
    } else {
        console.log("MongoDB database directory exists already.");
    }
}

// Get the OS and version
var osType = os.type().toLowerCase();
var osRelease = os.release();
var homeDir = process.env.HOME;
console.log("You platform is: %s-%s", osType, osRelease);
console.log("User home directory: %s", homeDir);

// MongoDB download links by platform
var mongoInstallerUrls = {
    darwin32: "http://fastdl.mongodb.org/osx/mongodb-osx-i386-2.0.1.tgz",
    darwin64: "http://fastdl.mongodb.org/osx/mongodb-osx-x86_64-2.0.1.tgz",
    linux32: "http://fastdl.mongodb.org/linux/mongodb-linux-i686-2.0.1.tgz",
    linux64: "http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-2.0.1.tgz"
};

var mongoFlavorsLabel = ["32-bit", "64-bit"];
var mongoFlavors = ["32", "64"];

console.log("Choose the mongoDB flavor, use the 64-bit version if you know that your system supports it, otherwise use 32-bit:");
commander.choose(mongoFlavorsLabel, function(i) {
    process.stdin.destroy();

    var installerUrl = mongoInstallerUrls[osType + mongoFlavors[i]];
    if (!installerUrl) {
        console.log("Your platform is not supported.");
        process.exit(1);
    }

    console.log("Downloading: %s please wait...", installerUrl);
    downloadFile(installerUrl, homeDir, function(error, response) {
        if (error || response.statusCode !== 200) {
            console.error("There was a problem downloading the file - error: %j, status code: %d", error, response.statusCode);
            process.exit(1);
        }

        // Untar and unzip
        var fileName = url.parse(installerUrl).pathname.split("/").pop();
        var tar = spawn('tar', ['-xzvf', homeDir + "/" + fileName, "-C", homeDir]);

        tar.on('exit', function (code) {
            if (code !== 0) {
                console.error("tar process exited with code :%s", code);
                process.exit(code);
            } else {
                console.log("MongoDB is now installed on %s/%s", homeDir, fileName.substr(0, fileName.lastIndexOf(".")));

                createDataDirectory(homeDir);
            }
        });
    });
});
