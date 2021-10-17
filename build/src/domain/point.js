"use strict";
exports.__esModule = true;
exports.Point = void 0;
var game_field_1 = require("../../../game-field");
/**
 * Point implements Flyweight pattern so it can be used in Map as key.
 * Point.create(0, 0) === Point.create(0.0) // true
 */
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.create = function (x, y) {
        var key = x + ":" + y;
        var point = this.cache.get(key);
        if (point === undefined) {
            point = new Point(x, y);
            this.cache.set(key, point);
        }
        return point;
    };
    Point.prototype.neighbors = function () {
        var directions = [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
        ];
        var neighbors = [];
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var direction = directions_1[_i];
            var deltaX = direction[0], deltaY = direction[1];
            var neighborPoint = Point.create(this.x + deltaX, this.y + deltaY);
            if (neighborPoint.isWithinField()) {
                neighbors.push(neighborPoint);
            }
        }
        return neighbors;
    };
    Point.prototype.isWithinField = function (fieldSize) {
        if (fieldSize === void 0) { fieldSize = game_field_1.GameField.GAME_FIELD_SIZE; }
        return (this.x >= 0 && this.y >= 0 && this.x < fieldSize && this.y < fieldSize);
    };
    Point.cache = new Map();
    return Point;
}());
exports.Point = Point;
