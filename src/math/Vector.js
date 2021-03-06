import { IsFloat } from 'utils';

/** Class Vector
 * Represents a 3D vector with X, Y, Z coordinates.
 * @constructor
 *
 * @example
 * new CSG.Vector(1, 2, 3);
 * new CSG.Vector([1, 2, 3]);
 * new CSG.Vector({ x: 1, y: 2, z: 3 });
 * new CSG.Vector(1, 2); // assumes z=0
 * new CSG.Vector([1, 2]); // assumes z=0
 */
const Vector = function (x, y, z) {
    if (arguments.length === 3) {
        this._x = parseFloat(x);
        this._y = parseFloat(y);
        this._z = parseFloat(z);
    } else if (arguments.length === 2) {
        this._x = parseFloat(x);
        this._y = parseFloat(y);
        this._z = 0;
    } else {
        var ok = true;
        if (arguments.length === 1) {
            if (typeof x === 'object') {
                if (x instanceof Vector) {
                    this._x = x._x;
                    this._y = x._y;
                    this._z = x._z;
                } else if (x instanceof Array) {
                    if (x.length < 2 || x.length > 3) {
                        ok = false;
                    } else {
                        this._x = parseFloat(x[0]);
                        this._y = parseFloat(x[1]);
                        if (x.length === 3) {
                            this._z = parseFloat(x[2]);
                        } else {
                            this._z = 0;
                        }
                    }
                } else if ('x' in x && 'y' in x) {
                    this._x = parseFloat(x.x);
                    this._y = parseFloat(x.y);
                    if ('z' in x) {
                        this._z = parseFloat(x.z);
                    } else {
                        this._z = 0;
                    }
                } else if ('_x' in x && '_y' in x) {
                    this._x = parseFloat(x._x);
                    this._y = parseFloat(x._y);
                    if ('_z' in x) {
                        this._z = parseFloat(x._z);
                    } else {
                        this._z = 0;
                    }
                } else ok = false;
            } else {
                var v = parseFloat(x);
                this._x = v;
                this._y = v;
                this._z = v;
            }
        } else ok = false;
        if (ok) {
            if (!IsFloat(this._x) || !IsFloat(this._y) || !IsFloat(this._z)) ok = false;
        } else {
            throw new Error('wrong arguments');
        }
    }
};

// This does the same as new Vector(x,y,z) but it doesn't go through the constructor
// and the parameters are not validated. Is much faster.
Vector.Create = function (x, y, z) {
    var result = Object.create(Vector.prototype);
    result._x = x;
    result._y = y;
    result._z = z;
    return result;
};

Vector.prototype = {
    get x() {
        return this._x;
    },
    get y() {
        return this._y;
    },
    get z() {
        return this._z;
    },

    set x(v) {
        throw new Error('Vector is immutable');
    },
    set y(v) {
        throw new Error('Vector is immutable');
    },
    set z(v) {
        throw new Error('Vector is immutable');
    },

    clone: function () {
        return Vector.Create(this._x, this._y, this._z);
    },

    negated: function () {
        return Vector.Create(-this._x, -this._y, -this._z);
    },

    abs: function () {
        return Vector.Create(Math.abs(this._x), Math.abs(this._y), Math.abs(this._z));
    },

    plus: function (a) {
        return Vector.Create(this._x + a._x, this._y + a._y, this._z + a._z);
    },

    minus: function (a) {
        return Vector.Create(this._x - a._x, this._y - a._y, this._z - a._z);
    },

    times: function (a) {
        return Vector.Create(this._x * a, this._y * a, this._z * a);
    },

    dividedBy: function (a) {
        return Vector.Create(this._x / a, this._y / a, this._z / a);
    },

    dot: function (a) {
        return this._x * a._x + this._y * a._y + this._z * a._z;
    },

    lerp: function (a, t) {
        return this.plus(a.minus(this).times(t));
    },

    lengthSquared: function () {
        return this.dot(this);
    },

    length: function () {
        return Math.sqrt(this.lengthSquared());
    },

    unit: function () {
        return this.dividedBy(this.length());
    },

    cross: function (a) {
        return Vector.Create(this._y * a._z - this._z * a._y, this._z * a._x - this._x * a._z, this._x * a._y - this._y * a._x);
    },

    distanceTo: function (a) {
        return this.minus(a).length();
    },

    distanceToSquared: function (a) {
        return this.minus(a).lengthSquared();
    },

    equals: function (a) {
        return this._x === a._x && this._y === a._y && this._z === a._z;
    },

    // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
    // Returns a new Vector
    multiply4x4: function (matrix4x4) {
        return matrix4x4.leftMultiply1x3Vector(this);
    },

    // find a vector that is somewhat perpendicular to this one
    randomNonParallelVector: function () {
        var abs = this.abs();
        if (abs._x <= abs._y && abs._x <= abs._z) {
            return Vector.Create(1, 0, 0);
        } else if (abs._y <= abs._x && abs._y <= abs._z) {
            return Vector.Create(0, 1, 0);
        } else {
            return Vector.Create(0, 0, 1);
        }
    },

    min: function (p) {
        return Vector.Create(Math.min(this._x, p._x), Math.min(this._y, p._y), Math.min(this._z, p._z));
    },

    max: function (p) {
        return Vector.Create(Math.max(this._x, p._x), Math.max(this._y, p._y), Math.max(this._z, p._z));
    },
};

export default Vector;
