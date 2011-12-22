/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

// Each agent is identified by it's socketID, which is a long random alphanumeric string.
// Since those are hard to track, though, we provide each client a "friendly name" that will
// be displayed on the client and server side to make it easier to identify who's who. In
// this case, those friendly names refer to differnt Muppets characters.
var friendlyNames = [
    "Animal",
    "Beaker",
    "Bean",
    "Beauregard",
    "Bert",
    "Bobo",
    "Camilla",
    "Clifford",
    "Elmo",
    "Ernie",
    "Fozzie",
    "George",
    "Gonzo",
    "Grover",
    "Kermit",
    "Oscar",
    "Pepe",
    "Ms. Piggy",
    "Rizzo",
    "Seymour",
    "Statler",
    "Waldorf",
    "Robin",
    "Rowlf",
    "Sam",
    "Scooter",
    "Skeeter",
    "Swedish Chef",
    "Sweetums"
];

var friendlyNameId = 0;

// Honestly this serves no legitimate purpose whatsoever. But it's more fun to get pseudo-random names!
function shuffle(v) {
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
friendlyNames = shuffle(friendlyNames);
// </goofing_off>

/**
 * Get a friendly agent name that is unique for this server instance.
 * @returns A unique friendly name
 */
exports.getNext = function() {
   var nameId = friendlyNameId % friendlyNames.length;
   
   var name = friendlyNames[nameId];
   var suffix = (friendlyNameId - nameId) / friendlyNames.length;
   
   friendlyNameId++;
   
   return name + (suffix ? " " + suffix : "");
}