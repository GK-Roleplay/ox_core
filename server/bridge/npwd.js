// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.GeneratePhoneNumber = GeneratePhoneNumber;
// var events_1 = require("../player/events");
// SetConvar('npwd:useResourceIntegration', 'true');
// SetConvar('npwd:database', JSON.stringify({
//     playerTable: 'characters',
//     identifierColumn: 'charId',
//     phoneNumberColumn: 'phoneNumber',
// }));
// (0, events_1.OnPlayerLoaded)('npwd', function (player) {
//     exports.npwd.newPlayer({
//         source: player.source,
//         identifier: player.charId,
//         phoneNumber: player.get('phoneNumber'),
//         firstname: player.get('firstName'),
//         lastname: player.get('lastName'),
//     });
// });
// (0, events_1.OnPlayerLogout)(function (player) { return exports.npwd.unloadPlayer(player.source); });
// function GeneratePhoneNumber() {
//     try {
//         return exports.npwd.generatePhoneNumber();
//     }
//     catch (e) { }
// }
