/* <copyright>
Copyright (c) 2012, Motorola Mobility, Inc
All Rights Reserved.
BSD License.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  - Neither the name of Motorola Mobility nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
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
