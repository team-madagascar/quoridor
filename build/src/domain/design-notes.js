"use strict";
/**
 *  Different players: local player(website), remote player, our bot, console bot
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var MoveCommand = /** @class */ (function () {
    function MoveCommand() {
    }
    return MoveCommand;
}());
var PlaceWallCommand = /** @class */ (function () {
    function PlaceWallCommand() {
    }
    return PlaceWallCommand;
}());
var GameFacade = /** @class */ (function () {
    function GameFacade(client1, client2) {
        this.client1 = client1;
        this.client2 = client2;
    }
    GameFacade.prototype.startGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.gameIsEnd()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._currentClient.doStep()];
                    case 1:
                        command = _a.sent();
                        command.apply();
                        this.changeCurrentClient();
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    GameFacade.prototype.changeCurrentClient = function () {
        // todo
    };
    GameFacade.prototype.gameIsEnd = function () {
        // todo
    };
    return GameFacade;
}());
var LocalClient = /** @class */ (function () {
    function LocalClient() {
    }
    return LocalClient;
}());
var RemoteClient = /** @class */ (function () {
    function RemoteClient() {
    }
    return RemoteClient;
}());
var BotClient = /** @class */ (function () {
    function BotClient() {
    }
    return BotClient;
}());
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    return Position;
}());
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
    Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(Orientation || (Orientation = {}));
var Wall = /** @class */ (function () {
    function Wall(orientation, position) {
        this.orientation = orientation;
        this.position = position;
    }
    return Wall;
}());
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
var Player = /** @class */ (function () {
    function Player(currentPosition, wallsCount) {
        this._remainingWallsCount = wallsCount;
        this._currentPosition = currentPosition;
    }
    Object.defineProperty(Player.prototype, "remainingWallsCount", {
        get: function () {
            return this._remainingWallsCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "currentPosition", {
        get: function () {
            return this._currentPosition;
        },
        enumerable: false,
        configurable: true
    });
    Player.prototype.move = function (direction, distance) { };
    Player.prototype.placeWall = function (wall) { };
    return Player;
}());
var Game = /** @class */ (function () {
    function Game(field, player1, player2) {
        this.field = field;
        this.player1 = player1;
        this.player2 = player2;
        this._currentPlayer = player1;
    }
    Game.prototype.move = function (direction) { };
    Game.prototype.placeWall = function (wall) { };
    return Game;
}());
