var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function () {
    'use strict';
    var isCommonjs = typeof module !== 'undefined' && module.exports;
    var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;
    var fn = (function () {
        var val;
        var valLength;
        var fnMap = [
            [
                'requestFullscreen',
                'exitFullscreen',
                'fullscreenElement',
                'fullscreenEnabled',
                'fullscreenchange',
                'fullscreenerror'
            ],
            [
                'webkitRequestFullscreen',
                'webkitExitFullscreen',
                'webkitFullscreenElement',
                'webkitFullscreenEnabled',
                'webkitfullscreenchange',
                'webkitfullscreenerror'
            ],
            [
                'webkitRequestFullScreen',
                'webkitCancelFullScreen',
                'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen',
                'webkitfullscreenchange',
                'webkitfullscreenerror'
            ],
            [
                'mozRequestFullScreen',
                'mozCancelFullScreen',
                'mozFullScreenElement',
                'mozFullScreenEnabled',
                'mozfullscreenchange',
                'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen',
                'msExitFullscreen',
                'msFullscreenElement',
                'msFullscreenEnabled',
                'MSFullscreenChange',
                'MSFullscreenError'
            ]
        ];
        var i = 0;
        var l = fnMap.length;
        var ret = {};
        for (; i < l; i++) {
            val = fnMap[i];
            if (val && val[1] in document) {
                for (i = 0, valLength = val.length; i < valLength; i++) {
                    ret[fnMap[0][i]] = val[i];
                }
                return ret;
            }
        }
        return false;
    })();
    var screenfull = {
        request: function (elem) {
            var request = fn.requestFullscreen;
            elem = elem || document.documentElement;
            if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
                elem[request]();
            }
            else {
                elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
            }
        },
        exit: function () {
            document[fn.exitFullscreen]();
        },
        toggle: function (elem) {
            if (this.isFullscreen) {
                this.exit();
            }
            else {
                this.request(elem);
            }
        },
        raw: fn
    };
    if (!fn) {
        if (isCommonjs) {
            module.exports = false;
        }
        else {
            window.screenfull = false;
        }
        return;
    }
    Object.defineProperties(screenfull, {
        isFullscreen: {
            get: function () {
                return Boolean(document[fn.fullscreenElement]);
            }
        },
        element: {
            enumerable: true,
            get: function () {
                return document[fn.fullscreenElement];
            }
        },
        enabled: {
            enumerable: true,
            get: function () {
                return Boolean(document[fn.fullscreenEnabled]);
            }
        }
    });
    if (isCommonjs) {
        module.exports = screenfull;
    }
    else {
        window.screenfull = screenfull;
    }
})();
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
}
else if (typeof define === "function" && define.amd) {
    define([], f);
}
else {
    var g;
    if (typeof window !== "undefined") {
        g = window;
    }
    else if (typeof global !== "undefined") {
        g = global;
    }
    else if (typeof self !== "undefined") {
        g = self;
    }
    else {
        g = this;
    }
    g.Matter = f();
} })(function () {
    var define, module, exports;
    return (function e(t, n, r) { function s(o, u) { if (!n[o]) {
        if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
                return a(o, !0);
            if (i)
                return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = { exports: {} };
        t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e); }, l, l.exports, e, t, n, r);
    } return n[o].exports; } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)
        s(r[o]); return s; })({ 1: [function (require, module, exports) {
                var Body = {};
                module.exports = Body;
                var Vertices = require('../geometry/Vertices');
                var Vector = require('../geometry/Vector');
                var Sleeping = require('../core/Sleeping');
                var Render = require('../render/Render');
                var Common = require('../core/Common');
                var Bounds = require('../geometry/Bounds');
                var Axes = require('../geometry/Axes');
                (function () {
                    Body._inertiaScale = 4;
                    Body._nextCollidingGroupId = 1;
                    Body._nextNonCollidingGroupId = -1;
                    Body._nextCategory = 0x0001;
                    Body.create = function (options) {
                        var defaults = {
                            id: Common.nextId(),
                            type: 'body',
                            label: 'Body',
                            parts: [],
                            angle: 0,
                            vertices: Vertices.fromPath('L 0 0 L 40 0 L 40 40 L 0 40'),
                            position: { x: 0, y: 0 },
                            force: { x: 0, y: 0 },
                            torque: 0,
                            positionImpulse: { x: 0, y: 0 },
                            constraintImpulse: { x: 0, y: 0, angle: 0 },
                            totalContacts: 0,
                            speed: 0,
                            angularSpeed: 0,
                            velocity: { x: 0, y: 0 },
                            angularVelocity: 0,
                            isSensor: false,
                            isStatic: false,
                            isSleeping: false,
                            motion: 0,
                            sleepThreshold: 60,
                            density: 0.001,
                            restitution: 0,
                            friction: 0.1,
                            frictionStatic: 0.5,
                            frictionAir: 0.01,
                            collisionFilter: {
                                category: 0x0001,
                                mask: 0xFFFFFFFF,
                                group: 0
                            },
                            slop: 0.05,
                            timeScale: 1,
                            render: {
                                visible: true,
                                opacity: 1,
                                sprite: {
                                    xScale: 1,
                                    yScale: 1,
                                    xOffset: 0,
                                    yOffset: 0
                                },
                                lineWidth: 1.5
                            }
                        };
                        var body = Common.extend(defaults, options);
                        _initProperties(body, options);
                        return body;
                    };
                    Body.nextGroup = function (isNonColliding) {
                        if (isNonColliding)
                            return Body._nextNonCollidingGroupId--;
                        return Body._nextCollidingGroupId++;
                    };
                    Body.nextCategory = function () {
                        Body._nextCategory = Body._nextCategory << 1;
                        return Body._nextCategory;
                    };
                    var _initProperties = function (body, options) {
                        Body.set(body, {
                            bounds: body.bounds || Bounds.create(body.vertices),
                            positionPrev: body.positionPrev || Vector.clone(body.position),
                            anglePrev: body.anglePrev || body.angle,
                            vertices: body.vertices,
                            parts: body.parts || [body],
                            isStatic: body.isStatic,
                            isSleeping: body.isSleeping,
                            parent: body.parent || body
                        });
                        Vertices.rotate(body.vertices, body.angle, body.position);
                        Axes.rotate(body.axes, body.angle);
                        Bounds.update(body.bounds, body.vertices, body.velocity);
                        Body.set(body, {
                            axes: options.axes || body.axes,
                            area: options.area || body.area,
                            mass: options.mass || body.mass,
                            inertia: options.inertia || body.inertia
                        });
                        var defaultFillStyle = (body.isStatic ? '#eeeeee' : Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58'])), defaultStrokeStyle = Common.shadeColor(defaultFillStyle, -20);
                        body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
                        body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
                        body.render.sprite.xOffset += -(body.bounds.min.x - body.position.x) / (body.bounds.max.x - body.bounds.min.x);
                        body.render.sprite.yOffset += -(body.bounds.min.y - body.position.y) / (body.bounds.max.y - body.bounds.min.y);
                    };
                    Body.set = function (body, settings, value) {
                        var property;
                        if (typeof settings === 'string') {
                            property = settings;
                            settings = {};
                            settings[property] = value;
                        }
                        for (property in settings) {
                            value = settings[property];
                            if (!settings.hasOwnProperty(property))
                                continue;
                            switch (property) {
                                case 'isStatic':
                                    Body.setStatic(body, value);
                                    break;
                                case 'isSleeping':
                                    Sleeping.set(body, value);
                                    break;
                                case 'mass':
                                    Body.setMass(body, value);
                                    break;
                                case 'density':
                                    Body.setDensity(body, value);
                                    break;
                                case 'inertia':
                                    Body.setInertia(body, value);
                                    break;
                                case 'vertices':
                                    Body.setVertices(body, value);
                                    break;
                                case 'position':
                                    Body.setPosition(body, value);
                                    break;
                                case 'angle':
                                    Body.setAngle(body, value);
                                    break;
                                case 'velocity':
                                    Body.setVelocity(body, value);
                                    break;
                                case 'angularVelocity':
                                    Body.setAngularVelocity(body, value);
                                    break;
                                case 'parts':
                                    Body.setParts(body, value);
                                    break;
                                default:
                                    body[property] = value;
                            }
                        }
                    };
                    Body.setStatic = function (body, isStatic) {
                        for (var i = 0; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            part.isStatic = isStatic;
                            if (isStatic) {
                                part.restitution = 0;
                                part.friction = 1;
                                part.mass = part.inertia = part.density = Infinity;
                                part.inverseMass = part.inverseInertia = 0;
                                part.positionPrev.x = part.position.x;
                                part.positionPrev.y = part.position.y;
                                part.anglePrev = part.angle;
                                part.angularVelocity = 0;
                                part.speed = 0;
                                part.angularSpeed = 0;
                                part.motion = 0;
                            }
                        }
                    };
                    Body.setMass = function (body, mass) {
                        body.mass = mass;
                        body.inverseMass = 1 / body.mass;
                        body.density = body.mass / body.area;
                    };
                    Body.setDensity = function (body, density) {
                        Body.setMass(body, density * body.area);
                        body.density = density;
                    };
                    Body.setInertia = function (body, inertia) {
                        body.inertia = inertia;
                        body.inverseInertia = 1 / body.inertia;
                    };
                    Body.setVertices = function (body, vertices) {
                        if (vertices[0].body === body) {
                            body.vertices = vertices;
                        }
                        else {
                            body.vertices = Vertices.create(vertices, body);
                        }
                        body.axes = Axes.fromVertices(body.vertices);
                        body.area = Vertices.area(body.vertices);
                        Body.setMass(body, body.density * body.area);
                        var centre = Vertices.centre(body.vertices);
                        Vertices.translate(body.vertices, centre, -1);
                        Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
                        Vertices.translate(body.vertices, body.position);
                        Bounds.update(body.bounds, body.vertices, body.velocity);
                    };
                    Body.setParts = function (body, parts, autoHull) {
                        var i;
                        parts = parts.slice(0);
                        body.parts.length = 0;
                        body.parts.push(body);
                        body.parent = body;
                        for (i = 0; i < parts.length; i++) {
                            var part = parts[i];
                            if (part !== body) {
                                part.parent = body;
                                body.parts.push(part);
                            }
                        }
                        if (body.parts.length === 1)
                            return;
                        autoHull = typeof autoHull !== 'undefined' ? autoHull : true;
                        if (autoHull) {
                            var vertices = [];
                            for (i = 0; i < parts.length; i++) {
                                vertices = vertices.concat(parts[i].vertices);
                            }
                            Vertices.clockwiseSort(vertices);
                            var hull = Vertices.hull(vertices), hullCentre = Vertices.centre(hull);
                            Body.setVertices(body, hull);
                            Vertices.translate(body.vertices, hullCentre);
                        }
                        var total = _totalProperties(body);
                        body.area = total.area;
                        body.parent = body;
                        body.position.x = total.centre.x;
                        body.position.y = total.centre.y;
                        body.positionPrev.x = total.centre.x;
                        body.positionPrev.y = total.centre.y;
                        Body.setMass(body, total.mass);
                        Body.setInertia(body, total.inertia);
                        Body.setPosition(body, total.centre);
                    };
                    Body.setPosition = function (body, position) {
                        var delta = Vector.sub(position, body.position);
                        body.positionPrev.x += delta.x;
                        body.positionPrev.y += delta.y;
                        for (var i = 0; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            part.position.x += delta.x;
                            part.position.y += delta.y;
                            Vertices.translate(part.vertices, delta);
                            Bounds.update(part.bounds, part.vertices, body.velocity);
                        }
                    };
                    Body.setAngle = function (body, angle) {
                        var delta = angle - body.angle;
                        body.anglePrev += delta;
                        for (var i = 0; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            part.angle += delta;
                            Vertices.rotate(part.vertices, delta, body.position);
                            Axes.rotate(part.axes, delta);
                            Bounds.update(part.bounds, part.vertices, body.velocity);
                            if (i > 0) {
                                Vector.rotateAbout(part.position, delta, body.position, part.position);
                            }
                        }
                    };
                    Body.setVelocity = function (body, velocity) {
                        body.positionPrev.x = body.position.x - velocity.x;
                        body.positionPrev.y = body.position.y - velocity.y;
                        body.velocity.x = velocity.x;
                        body.velocity.y = velocity.y;
                        body.speed = Vector.magnitude(body.velocity);
                    };
                    Body.setAngularVelocity = function (body, velocity) {
                        body.anglePrev = body.angle - velocity;
                        body.angularVelocity = velocity;
                        body.angularSpeed = Math.abs(body.angularVelocity);
                    };
                    Body.translate = function (body, translation) {
                        Body.setPosition(body, Vector.add(body.position, translation));
                    };
                    Body.rotate = function (body, rotation) {
                        Body.setAngle(body, body.angle + rotation);
                    };
                    Body.scale = function (body, scaleX, scaleY, point) {
                        for (var i = 0; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            Vertices.scale(part.vertices, scaleX, scaleY, body.position);
                            part.axes = Axes.fromVertices(part.vertices);
                            if (!body.isStatic) {
                                part.area = Vertices.area(part.vertices);
                                Body.setMass(part, body.density * part.area);
                                Vertices.translate(part.vertices, { x: -part.position.x, y: -part.position.y });
                                Body.setInertia(part, Vertices.inertia(part.vertices, part.mass));
                                Vertices.translate(part.vertices, { x: part.position.x, y: part.position.y });
                            }
                            Bounds.update(part.bounds, part.vertices, body.velocity);
                        }
                        if (body.circleRadius) {
                            if (scaleX === scaleY) {
                                body.circleRadius *= scaleX;
                            }
                            else {
                                body.circleRadius = null;
                            }
                        }
                        if (!body.isStatic) {
                            var total = _totalProperties(body);
                            body.area = total.area;
                            Body.setMass(body, total.mass);
                            Body.setInertia(body, total.inertia);
                        }
                    };
                    Body.update = function (body, deltaTime, timeScale, correction) {
                        var deltaTimeSquared = Math.pow(deltaTime * timeScale * body.timeScale, 2);
                        var frictionAir = 1 - body.frictionAir * timeScale * body.timeScale, velocityPrevX = body.position.x - body.positionPrev.x, velocityPrevY = body.position.y - body.positionPrev.y;
                        body.velocity.x = (velocityPrevX * frictionAir * correction) + (body.force.x / body.mass) * deltaTimeSquared;
                        body.velocity.y = (velocityPrevY * frictionAir * correction) + (body.force.y / body.mass) * deltaTimeSquared;
                        body.positionPrev.x = body.position.x;
                        body.positionPrev.y = body.position.y;
                        body.position.x += body.velocity.x;
                        body.position.y += body.velocity.y;
                        body.angularVelocity = ((body.angle - body.anglePrev) * frictionAir * correction) + (body.torque / body.inertia) * deltaTimeSquared;
                        body.anglePrev = body.angle;
                        body.angle += body.angularVelocity;
                        body.speed = Vector.magnitude(body.velocity);
                        body.angularSpeed = Math.abs(body.angularVelocity);
                        for (var i = 0; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            Vertices.translate(part.vertices, body.velocity);
                            if (i > 0) {
                                part.position.x += body.velocity.x;
                                part.position.y += body.velocity.y;
                            }
                            if (body.angularVelocity !== 0) {
                                Vertices.rotate(part.vertices, body.angularVelocity, body.position);
                                Axes.rotate(part.axes, body.angularVelocity);
                                if (i > 0) {
                                    Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
                                }
                            }
                            Bounds.update(part.bounds, part.vertices, body.velocity);
                        }
                    };
                    Body.applyForce = function (body, position, force) {
                        body.force.x += force.x;
                        body.force.y += force.y;
                        var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
                        body.torque += offset.x * force.y - offset.y * force.x;
                    };
                    var _totalProperties = function (body) {
                        var properties = {
                            mass: 0,
                            area: 0,
                            inertia: 0,
                            centre: { x: 0, y: 0 }
                        };
                        for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
                            var part = body.parts[i];
                            properties.mass += part.mass;
                            properties.area += part.area;
                            properties.inertia += part.inertia;
                            properties.centre = Vector.add(properties.centre, Vector.mult(part.position, part.mass !== Infinity ? part.mass : 1));
                        }
                        properties.centre = Vector.div(properties.centre, properties.mass !== Infinity ? properties.mass : body.parts.length);
                        return properties;
                    };
                })();
            }, { "../core/Common": 14, "../core/Sleeping": 20, "../geometry/Axes": 23, "../geometry/Bounds": 24, "../geometry/Vector": 26, "../geometry/Vertices": 27, "../render/Render": 29 }], 2: [function (require, module, exports) {
                var Composite = {};
                module.exports = Composite;
                var Events = require('../core/Events');
                var Common = require('../core/Common');
                var Body = require('./Body');
                (function () {
                    Composite.create = function (options) {
                        return Common.extend({
                            id: Common.nextId(),
                            type: 'composite',
                            parent: null,
                            isModified: false,
                            bodies: [],
                            constraints: [],
                            composites: [],
                            label: 'Composite'
                        }, options);
                    };
                    Composite.setModified = function (composite, isModified, updateParents, updateChildren) {
                        composite.isModified = isModified;
                        if (updateParents && composite.parent) {
                            Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
                        }
                        if (updateChildren) {
                            for (var i = 0; i < composite.composites.length; i++) {
                                var childComposite = composite.composites[i];
                                Composite.setModified(childComposite, isModified, updateParents, updateChildren);
                            }
                        }
                    };
                    Composite.add = function (composite, object) {
                        var objects = [].concat(object);
                        Events.trigger(composite, 'beforeAdd', { object: object });
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            switch (obj.type) {
                                case 'body':
                                    if (obj.parent !== obj) {
                                        Common.log('Composite.add: skipped adding a compound body part (you must add its parent instead)', 'warn');
                                        break;
                                    }
                                    Composite.addBody(composite, obj);
                                    break;
                                case 'constraint':
                                    Composite.addConstraint(composite, obj);
                                    break;
                                case 'composite':
                                    Composite.addComposite(composite, obj);
                                    break;
                                case 'mouseConstraint':
                                    Composite.addConstraint(composite, obj.constraint);
                                    break;
                            }
                        }
                        Events.trigger(composite, 'afterAdd', { object: object });
                        return composite;
                    };
                    Composite.remove = function (composite, object, deep) {
                        var objects = [].concat(object);
                        Events.trigger(composite, 'beforeRemove', { object: object });
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            switch (obj.type) {
                                case 'body':
                                    Composite.removeBody(composite, obj, deep);
                                    break;
                                case 'constraint':
                                    Composite.removeConstraint(composite, obj, deep);
                                    break;
                                case 'composite':
                                    Composite.removeComposite(composite, obj, deep);
                                    break;
                                case 'mouseConstraint':
                                    Composite.removeConstraint(composite, obj.constraint);
                                    break;
                            }
                        }
                        Events.trigger(composite, 'afterRemove', { object: object });
                        return composite;
                    };
                    Composite.addComposite = function (compositeA, compositeB) {
                        compositeA.composites.push(compositeB);
                        compositeB.parent = compositeA;
                        Composite.setModified(compositeA, true, true, false);
                        return compositeA;
                    };
                    Composite.removeComposite = function (compositeA, compositeB, deep) {
                        var position = Common.indexOf(compositeA.composites, compositeB);
                        if (position !== -1) {
                            Composite.removeCompositeAt(compositeA, position);
                            Composite.setModified(compositeA, true, true, false);
                        }
                        if (deep) {
                            for (var i = 0; i < compositeA.composites.length; i++) {
                                Composite.removeComposite(compositeA.composites[i], compositeB, true);
                            }
                        }
                        return compositeA;
                    };
                    Composite.removeCompositeAt = function (composite, position) {
                        composite.composites.splice(position, 1);
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.addBody = function (composite, body) {
                        composite.bodies.push(body);
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.removeBody = function (composite, body, deep) {
                        var position = Common.indexOf(composite.bodies, body);
                        if (position !== -1) {
                            Composite.removeBodyAt(composite, position);
                            Composite.setModified(composite, true, true, false);
                        }
                        if (deep) {
                            for (var i = 0; i < composite.composites.length; i++) {
                                Composite.removeBody(composite.composites[i], body, true);
                            }
                        }
                        return composite;
                    };
                    Composite.removeBodyAt = function (composite, position) {
                        composite.bodies.splice(position, 1);
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.addConstraint = function (composite, constraint) {
                        composite.constraints.push(constraint);
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.removeConstraint = function (composite, constraint, deep) {
                        var position = Common.indexOf(composite.constraints, constraint);
                        if (position !== -1) {
                            Composite.removeConstraintAt(composite, position);
                        }
                        if (deep) {
                            for (var i = 0; i < composite.composites.length; i++) {
                                Composite.removeConstraint(composite.composites[i], constraint, true);
                            }
                        }
                        return composite;
                    };
                    Composite.removeConstraintAt = function (composite, position) {
                        composite.constraints.splice(position, 1);
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.clear = function (composite, keepStatic, deep) {
                        if (deep) {
                            for (var i = 0; i < composite.composites.length; i++) {
                                Composite.clear(composite.composites[i], keepStatic, true);
                            }
                        }
                        if (keepStatic) {
                            composite.bodies = composite.bodies.filter(function (body) { return body.isStatic; });
                        }
                        else {
                            composite.bodies.length = 0;
                        }
                        composite.constraints.length = 0;
                        composite.composites.length = 0;
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.allBodies = function (composite) {
                        var bodies = [].concat(composite.bodies);
                        for (var i = 0; i < composite.composites.length; i++)
                            bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
                        return bodies;
                    };
                    Composite.allConstraints = function (composite) {
                        var constraints = [].concat(composite.constraints);
                        for (var i = 0; i < composite.composites.length; i++)
                            constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
                        return constraints;
                    };
                    Composite.allComposites = function (composite) {
                        var composites = [].concat(composite.composites);
                        for (var i = 0; i < composite.composites.length; i++)
                            composites = composites.concat(Composite.allComposites(composite.composites[i]));
                        return composites;
                    };
                    Composite.get = function (composite, id, type) {
                        var objects, object;
                        switch (type) {
                            case 'body':
                                objects = Composite.allBodies(composite);
                                break;
                            case 'constraint':
                                objects = Composite.allConstraints(composite);
                                break;
                            case 'composite':
                                objects = Composite.allComposites(composite).concat(composite);
                                break;
                        }
                        if (!objects)
                            return null;
                        object = objects.filter(function (object) {
                            return object.id.toString() === id.toString();
                        });
                        return object.length === 0 ? null : object[0];
                    };
                    Composite.move = function (compositeA, objects, compositeB) {
                        Composite.remove(compositeA, objects);
                        Composite.add(compositeB, objects);
                        return compositeA;
                    };
                    Composite.rebase = function (composite) {
                        var objects = Composite.allBodies(composite)
                            .concat(Composite.allConstraints(composite))
                            .concat(Composite.allComposites(composite));
                        for (var i = 0; i < objects.length; i++) {
                            objects[i].id = Common.nextId();
                        }
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.translate = function (composite, translation, recursive) {
                        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                        for (var i = 0; i < bodies.length; i++) {
                            Body.translate(bodies[i], translation);
                        }
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.rotate = function (composite, rotation, point, recursive) {
                        var cos = Math.cos(rotation), sin = Math.sin(rotation), bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                            Body.setPosition(body, {
                                x: point.x + (dx * cos - dy * sin),
                                y: point.y + (dx * sin + dy * cos)
                            });
                            Body.rotate(body, rotation);
                        }
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                    Composite.scale = function (composite, scaleX, scaleY, point, recursive) {
                        var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                            Body.setPosition(body, {
                                x: point.x + dx * scaleX,
                                y: point.y + dy * scaleY
                            });
                            Body.scale(body, scaleX, scaleY);
                        }
                        Composite.setModified(composite, true, true, false);
                        return composite;
                    };
                })();
            }, { "../core/Common": 14, "../core/Events": 16, "./Body": 1 }], 3: [function (require, module, exports) {
                var World = {};
                module.exports = World;
                var Composite = require('./Composite');
                var Constraint = require('../constraint/Constraint');
                var Common = require('../core/Common');
                (function () {
                    World.create = function (options) {
                        var composite = Composite.create();
                        var defaults = {
                            label: 'World',
                            gravity: {
                                x: 0,
                                y: 1,
                                scale: 0.001
                            },
                            bounds: {
                                min: { x: -Infinity, y: -Infinity },
                                max: { x: Infinity, y: Infinity }
                            }
                        };
                        return Common.extend(composite, defaults, options);
                    };
                })();
            }, { "../constraint/Constraint": 12, "../core/Common": 14, "./Composite": 2 }], 4: [function (require, module, exports) {
                var Contact = {};
                module.exports = Contact;
                (function () {
                    Contact.create = function (vertex) {
                        return {
                            id: Contact.id(vertex),
                            vertex: vertex,
                            normalImpulse: 0,
                            tangentImpulse: 0
                        };
                    };
                    Contact.id = function (vertex) {
                        return vertex.body.id + '_' + vertex.index;
                    };
                })();
            }, {}], 5: [function (require, module, exports) {
                var Detector = {};
                module.exports = Detector;
                var SAT = require('./SAT');
                var Pair = require('./Pair');
                var Bounds = require('../geometry/Bounds');
                (function () {
                    Detector.collisions = function (broadphasePairs, engine) {
                        var collisions = [], pairsTable = engine.pairs.table;
                        for (var i = 0; i < broadphasePairs.length; i++) {
                            var bodyA = broadphasePairs[i][0], bodyB = broadphasePairs[i][1];
                            if ((bodyA.isStatic || bodyA.isSleeping) && (bodyB.isStatic || bodyB.isSleeping))
                                continue;
                            if (!Detector.canCollide(bodyA.collisionFilter, bodyB.collisionFilter))
                                continue;
                            if (Bounds.overlaps(bodyA.bounds, bodyB.bounds)) {
                                for (var j = bodyA.parts.length > 1 ? 1 : 0; j < bodyA.parts.length; j++) {
                                    var partA = bodyA.parts[j];
                                    for (var k = bodyB.parts.length > 1 ? 1 : 0; k < bodyB.parts.length; k++) {
                                        var partB = bodyB.parts[k];
                                        if ((partA === bodyA && partB === bodyB) || Bounds.overlaps(partA.bounds, partB.bounds)) {
                                            var pairId = Pair.id(partA, partB), pair = pairsTable[pairId], previousCollision;
                                            if (pair && pair.isActive) {
                                                previousCollision = pair.collision;
                                            }
                                            else {
                                                previousCollision = null;
                                            }
                                            var collision = SAT.collides(partA, partB, previousCollision);
                                            if (collision.collided) {
                                                collisions.push(collision);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return collisions;
                    };
                    Detector.canCollide = function (filterA, filterB) {
                        if (filterA.group === filterB.group && filterA.group !== 0)
                            return filterA.group > 0;
                        return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
                    };
                })();
            }, { "../geometry/Bounds": 24, "./Pair": 7, "./SAT": 11 }], 6: [function (require, module, exports) {
                var Grid = {};
                module.exports = Grid;
                var Pair = require('./Pair');
                var Detector = require('./Detector');
                var Common = require('../core/Common');
                (function () {
                    Grid.create = function (options) {
                        var defaults = {
                            controller: Grid,
                            detector: Detector.collisions,
                            buckets: {},
                            pairs: {},
                            pairsList: [],
                            bucketWidth: 48,
                            bucketHeight: 48
                        };
                        return Common.extend(defaults, options);
                    };
                    Grid.update = function (grid, bodies, engine, forceUpdate) {
                        var i, col, row, world = engine.world, buckets = grid.buckets, bucket, bucketId, gridChanged = false;
                        for (i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (body.isSleeping && !forceUpdate)
                                continue;
                            if (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x
                                || body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y)
                                continue;
                            var newRegion = _getRegion(grid, body);
                            if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
                                if (!body.region || forceUpdate)
                                    body.region = newRegion;
                                var union = _regionUnion(newRegion, body.region);
                                for (col = union.startCol; col <= union.endCol; col++) {
                                    for (row = union.startRow; row <= union.endRow; row++) {
                                        bucketId = _getBucketId(col, row);
                                        bucket = buckets[bucketId];
                                        var isInsideNewRegion = (col >= newRegion.startCol && col <= newRegion.endCol
                                            && row >= newRegion.startRow && row <= newRegion.endRow);
                                        var isInsideOldRegion = (col >= body.region.startCol && col <= body.region.endCol
                                            && row >= body.region.startRow && row <= body.region.endRow);
                                        if (!isInsideNewRegion && isInsideOldRegion) {
                                            if (isInsideOldRegion) {
                                                if (bucket)
                                                    _bucketRemoveBody(grid, bucket, body);
                                            }
                                        }
                                        if (body.region === newRegion || (isInsideNewRegion && !isInsideOldRegion) || forceUpdate) {
                                            if (!bucket)
                                                bucket = _createBucket(buckets, bucketId);
                                            _bucketAddBody(grid, bucket, body);
                                        }
                                    }
                                }
                                body.region = newRegion;
                                gridChanged = true;
                            }
                        }
                        if (gridChanged)
                            grid.pairsList = _createActivePairsList(grid);
                    };
                    Grid.clear = function (grid) {
                        grid.buckets = {};
                        grid.pairs = {};
                        grid.pairsList = [];
                    };
                    var _regionUnion = function (regionA, regionB) {
                        var startCol = Math.min(regionA.startCol, regionB.startCol), endCol = Math.max(regionA.endCol, regionB.endCol), startRow = Math.min(regionA.startRow, regionB.startRow), endRow = Math.max(regionA.endRow, regionB.endRow);
                        return _createRegion(startCol, endCol, startRow, endRow);
                    };
                    var _getRegion = function (grid, body) {
                        var bounds = body.bounds, startCol = Math.floor(bounds.min.x / grid.bucketWidth), endCol = Math.floor(bounds.max.x / grid.bucketWidth), startRow = Math.floor(bounds.min.y / grid.bucketHeight), endRow = Math.floor(bounds.max.y / grid.bucketHeight);
                        return _createRegion(startCol, endCol, startRow, endRow);
                    };
                    var _createRegion = function (startCol, endCol, startRow, endRow) {
                        return {
                            id: startCol + ',' + endCol + ',' + startRow + ',' + endRow,
                            startCol: startCol,
                            endCol: endCol,
                            startRow: startRow,
                            endRow: endRow
                        };
                    };
                    var _getBucketId = function (column, row) {
                        return column + ',' + row;
                    };
                    var _createBucket = function (buckets, bucketId) {
                        var bucket = buckets[bucketId] = [];
                        return bucket;
                    };
                    var _bucketAddBody = function (grid, bucket, body) {
                        for (var i = 0; i < bucket.length; i++) {
                            var bodyB = bucket[i];
                            if (body.id === bodyB.id || (body.isStatic && bodyB.isStatic))
                                continue;
                            var pairId = Pair.id(body, bodyB), pair = grid.pairs[pairId];
                            if (pair) {
                                pair[2] += 1;
                            }
                            else {
                                grid.pairs[pairId] = [body, bodyB, 1];
                            }
                        }
                        bucket.push(body);
                    };
                    var _bucketRemoveBody = function (grid, bucket, body) {
                        bucket.splice(Common.indexOf(bucket, body), 1);
                        for (var i = 0; i < bucket.length; i++) {
                            var bodyB = bucket[i], pairId = Pair.id(body, bodyB), pair = grid.pairs[pairId];
                            if (pair)
                                pair[2] -= 1;
                        }
                    };
                    var _createActivePairsList = function (grid) {
                        var pairKeys, pair, pairs = [];
                        pairKeys = Common.keys(grid.pairs);
                        for (var k = 0; k < pairKeys.length; k++) {
                            pair = grid.pairs[pairKeys[k]];
                            if (pair[2] > 0) {
                                pairs.push(pair);
                            }
                            else {
                                delete grid.pairs[pairKeys[k]];
                            }
                        }
                        return pairs;
                    };
                })();
            }, { "../core/Common": 14, "./Detector": 5, "./Pair": 7 }], 7: [function (require, module, exports) {
                var Pair = {};
                module.exports = Pair;
                var Contact = require('./Contact');
                (function () {
                    Pair.create = function (collision, timestamp) {
                        var bodyA = collision.bodyA, bodyB = collision.bodyB, parentA = collision.parentA, parentB = collision.parentB;
                        var pair = {
                            id: Pair.id(bodyA, bodyB),
                            bodyA: bodyA,
                            bodyB: bodyB,
                            contacts: {},
                            activeContacts: [],
                            separation: 0,
                            isActive: true,
                            isSensor: bodyA.isSensor || bodyB.isSensor,
                            timeCreated: timestamp,
                            timeUpdated: timestamp,
                            inverseMass: parentA.inverseMass + parentB.inverseMass,
                            friction: Math.min(parentA.friction, parentB.friction),
                            frictionStatic: Math.max(parentA.frictionStatic, parentB.frictionStatic),
                            restitution: Math.max(parentA.restitution, parentB.restitution),
                            slop: Math.max(parentA.slop, parentB.slop)
                        };
                        Pair.update(pair, collision, timestamp);
                        return pair;
                    };
                    Pair.update = function (pair, collision, timestamp) {
                        var contacts = pair.contacts, supports = collision.supports, activeContacts = pair.activeContacts, parentA = collision.parentA, parentB = collision.parentB;
                        pair.collision = collision;
                        pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
                        pair.friction = Math.min(parentA.friction, parentB.friction);
                        pair.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
                        pair.restitution = Math.max(parentA.restitution, parentB.restitution);
                        pair.slop = Math.max(parentA.slop, parentB.slop);
                        activeContacts.length = 0;
                        if (collision.collided) {
                            for (var i = 0; i < supports.length; i++) {
                                var support = supports[i], contactId = Contact.id(support), contact = contacts[contactId];
                                if (contact) {
                                    activeContacts.push(contact);
                                }
                                else {
                                    activeContacts.push(contacts[contactId] = Contact.create(support));
                                }
                            }
                            pair.separation = collision.depth;
                            Pair.setActive(pair, true, timestamp);
                        }
                        else {
                            if (pair.isActive === true)
                                Pair.setActive(pair, false, timestamp);
                        }
                    };
                    Pair.setActive = function (pair, isActive, timestamp) {
                        if (isActive) {
                            pair.isActive = true;
                            pair.timeUpdated = timestamp;
                        }
                        else {
                            pair.isActive = false;
                            pair.activeContacts.length = 0;
                        }
                    };
                    Pair.id = function (bodyA, bodyB) {
                        if (bodyA.id < bodyB.id) {
                            return bodyA.id + '_' + bodyB.id;
                        }
                        else {
                            return bodyB.id + '_' + bodyA.id;
                        }
                    };
                })();
            }, { "./Contact": 4 }], 8: [function (require, module, exports) {
                var Pairs = {};
                module.exports = Pairs;
                var Pair = require('./Pair');
                var Common = require('../core/Common');
                (function () {
                    var _pairMaxIdleLife = 1000;
                    Pairs.create = function (options) {
                        return Common.extend({
                            table: {},
                            list: [],
                            collisionStart: [],
                            collisionActive: [],
                            collisionEnd: []
                        }, options);
                    };
                    Pairs.update = function (pairs, collisions, timestamp) {
                        var pairsList = pairs.list, pairsTable = pairs.table, collisionStart = pairs.collisionStart, collisionEnd = pairs.collisionEnd, collisionActive = pairs.collisionActive, activePairIds = [], collision, pairId, pair, i;
                        collisionStart.length = 0;
                        collisionEnd.length = 0;
                        collisionActive.length = 0;
                        for (i = 0; i < collisions.length; i++) {
                            collision = collisions[i];
                            if (collision.collided) {
                                pairId = Pair.id(collision.bodyA, collision.bodyB);
                                activePairIds.push(pairId);
                                pair = pairsTable[pairId];
                                if (pair) {
                                    if (pair.isActive) {
                                        collisionActive.push(pair);
                                    }
                                    else {
                                        collisionStart.push(pair);
                                    }
                                    Pair.update(pair, collision, timestamp);
                                }
                                else {
                                    pair = Pair.create(collision, timestamp);
                                    pairsTable[pairId] = pair;
                                    collisionStart.push(pair);
                                    pairsList.push(pair);
                                }
                            }
                        }
                        for (i = 0; i < pairsList.length; i++) {
                            pair = pairsList[i];
                            if (pair.isActive && Common.indexOf(activePairIds, pair.id) === -1) {
                                Pair.setActive(pair, false, timestamp);
                                collisionEnd.push(pair);
                            }
                        }
                    };
                    Pairs.removeOld = function (pairs, timestamp) {
                        var pairsList = pairs.list, pairsTable = pairs.table, indexesToRemove = [], pair, collision, pairIndex, i;
                        for (i = 0; i < pairsList.length; i++) {
                            pair = pairsList[i];
                            collision = pair.collision;
                            if (collision.bodyA.isSleeping || collision.bodyB.isSleeping) {
                                pair.timeUpdated = timestamp;
                                continue;
                            }
                            if (timestamp - pair.timeUpdated > _pairMaxIdleLife) {
                                indexesToRemove.push(i);
                            }
                        }
                        for (i = 0; i < indexesToRemove.length; i++) {
                            pairIndex = indexesToRemove[i] - i;
                            pair = pairsList[pairIndex];
                            delete pairsTable[pair.id];
                            pairsList.splice(pairIndex, 1);
                        }
                    };
                    Pairs.clear = function (pairs) {
                        pairs.table = {};
                        pairs.list.length = 0;
                        pairs.collisionStart.length = 0;
                        pairs.collisionActive.length = 0;
                        pairs.collisionEnd.length = 0;
                        return pairs;
                    };
                })();
            }, { "../core/Common": 14, "./Pair": 7 }], 9: [function (require, module, exports) {
                var Query = {};
                module.exports = Query;
                var Vector = require('../geometry/Vector');
                var SAT = require('./SAT');
                var Bounds = require('../geometry/Bounds');
                var Bodies = require('../factory/Bodies');
                var Vertices = require('../geometry/Vertices');
                (function () {
                    Query.ray = function (bodies, startPoint, endPoint, rayWidth) {
                        rayWidth = rayWidth || 1e-100;
                        var rayAngle = Vector.angle(startPoint, endPoint), rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)), rayX = (endPoint.x + startPoint.x) * 0.5, rayY = (endPoint.y + startPoint.y) * 0.5, ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }), collisions = [];
                        for (var i = 0; i < bodies.length; i++) {
                            var bodyA = bodies[i];
                            if (Bounds.overlaps(bodyA.bounds, ray.bounds)) {
                                for (var j = bodyA.parts.length === 1 ? 0 : 1; j < bodyA.parts.length; j++) {
                                    var part = bodyA.parts[j];
                                    if (Bounds.overlaps(part.bounds, ray.bounds)) {
                                        var collision = SAT.collides(part, ray);
                                        if (collision.collided) {
                                            collision.body = collision.bodyA = collision.bodyB = bodyA;
                                            collisions.push(collision);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        return collisions;
                    };
                    Query.region = function (bodies, bounds, outside) {
                        var result = [];
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i], overlaps = Bounds.overlaps(body.bounds, bounds);
                            if ((overlaps && !outside) || (!overlaps && outside))
                                result.push(body);
                        }
                        return result;
                    };
                    Query.point = function (bodies, point) {
                        var result = [];
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (Bounds.contains(body.bounds, point)) {
                                for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
                                    var part = body.parts[j];
                                    if (Bounds.contains(part.bounds, point)
                                        && Vertices.contains(part.vertices, point)) {
                                        result.push(body);
                                        break;
                                    }
                                }
                            }
                        }
                        return result;
                    };
                })();
            }, { "../factory/Bodies": 21, "../geometry/Bounds": 24, "../geometry/Vector": 26, "../geometry/Vertices": 27, "./SAT": 11 }], 10: [function (require, module, exports) {
                var Resolver = {};
                module.exports = Resolver;
                var Vertices = require('../geometry/Vertices');
                var Vector = require('../geometry/Vector');
                var Common = require('../core/Common');
                var Bounds = require('../geometry/Bounds');
                (function () {
                    Resolver._restingThresh = 4;
                    Resolver._restingThreshTangent = 6;
                    Resolver._positionDampen = 0.9;
                    Resolver._positionWarming = 0.8;
                    Resolver._frictionNormalMultiplier = 5;
                    Resolver.preSolvePosition = function (pairs) {
                        var i, pair, activeCount;
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive)
                                continue;
                            activeCount = pair.activeContacts.length;
                            pair.collision.parentA.totalContacts += activeCount;
                            pair.collision.parentB.totalContacts += activeCount;
                        }
                    };
                    Resolver.solvePosition = function (pairs, timeScale) {
                        var i, pair, collision, bodyA, bodyB, normal, bodyBtoA, contactShare, positionImpulse, contactCount = {}, tempA = Vector._temp[0], tempB = Vector._temp[1], tempC = Vector._temp[2], tempD = Vector._temp[3];
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive || pair.isSensor)
                                continue;
                            collision = pair.collision;
                            bodyA = collision.parentA;
                            bodyB = collision.parentB;
                            normal = collision.normal;
                            bodyBtoA = Vector.sub(Vector.add(bodyB.positionImpulse, bodyB.position, tempA), Vector.add(bodyA.positionImpulse, Vector.sub(bodyB.position, collision.penetration, tempB), tempC), tempD);
                            pair.separation = Vector.dot(normal, bodyBtoA);
                        }
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive || pair.isSensor || pair.separation < 0)
                                continue;
                            collision = pair.collision;
                            bodyA = collision.parentA;
                            bodyB = collision.parentB;
                            normal = collision.normal;
                            positionImpulse = (pair.separation - pair.slop) * timeScale;
                            if (bodyA.isStatic || bodyB.isStatic)
                                positionImpulse *= 2;
                            if (!(bodyA.isStatic || bodyA.isSleeping)) {
                                contactShare = Resolver._positionDampen / bodyA.totalContacts;
                                bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
                                bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
                            }
                            if (!(bodyB.isStatic || bodyB.isSleeping)) {
                                contactShare = Resolver._positionDampen / bodyB.totalContacts;
                                bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
                                bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
                            }
                        }
                    };
                    Resolver.postSolvePosition = function (bodies) {
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            body.totalContacts = 0;
                            if (body.positionImpulse.x !== 0 || body.positionImpulse.y !== 0) {
                                for (var j = 0; j < body.parts.length; j++) {
                                    var part = body.parts[j];
                                    Vertices.translate(part.vertices, body.positionImpulse);
                                    Bounds.update(part.bounds, part.vertices, body.velocity);
                                    part.position.x += body.positionImpulse.x;
                                    part.position.y += body.positionImpulse.y;
                                }
                                body.positionPrev.x += body.positionImpulse.x;
                                body.positionPrev.y += body.positionImpulse.y;
                                if (Vector.dot(body.positionImpulse, body.velocity) < 0) {
                                    body.positionImpulse.x = 0;
                                    body.positionImpulse.y = 0;
                                }
                                else {
                                    body.positionImpulse.x *= Resolver._positionWarming;
                                    body.positionImpulse.y *= Resolver._positionWarming;
                                }
                            }
                        }
                    };
                    Resolver.preSolveVelocity = function (pairs) {
                        var i, j, pair, contacts, collision, bodyA, bodyB, normal, tangent, contact, contactVertex, normalImpulse, tangentImpulse, offset, impulse = Vector._temp[0], tempA = Vector._temp[1];
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive || pair.isSensor)
                                continue;
                            contacts = pair.activeContacts;
                            collision = pair.collision;
                            bodyA = collision.parentA;
                            bodyB = collision.parentB;
                            normal = collision.normal;
                            tangent = collision.tangent;
                            for (j = 0; j < contacts.length; j++) {
                                contact = contacts[j];
                                contactVertex = contact.vertex;
                                normalImpulse = contact.normalImpulse;
                                tangentImpulse = contact.tangentImpulse;
                                if (normalImpulse !== 0 || tangentImpulse !== 0) {
                                    impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
                                    impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
                                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                                        offset = Vector.sub(contactVertex, bodyA.position, tempA);
                                        bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
                                        bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
                                        bodyA.anglePrev += Vector.cross(offset, impulse) * bodyA.inverseInertia;
                                    }
                                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                                        offset = Vector.sub(contactVertex, bodyB.position, tempA);
                                        bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
                                        bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
                                        bodyB.anglePrev -= Vector.cross(offset, impulse) * bodyB.inverseInertia;
                                    }
                                }
                            }
                        }
                    };
                    Resolver.solveVelocity = function (pairs, timeScale) {
                        var timeScaleSquared = timeScale * timeScale, impulse = Vector._temp[0], tempA = Vector._temp[1], tempB = Vector._temp[2], tempC = Vector._temp[3], tempD = Vector._temp[4], tempE = Vector._temp[5];
                        for (var i = 0; i < pairs.length; i++) {
                            var pair = pairs[i];
                            if (!pair.isActive || pair.isSensor)
                                continue;
                            var collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, normal = collision.normal, tangent = collision.tangent, contacts = pair.activeContacts, contactShare = 1 / contacts.length;
                            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
                            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
                            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
                            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
                            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
                            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
                            for (var j = 0; j < contacts.length; j++) {
                                var contact = contacts[j], contactVertex = contact.vertex, offsetA = Vector.sub(contactVertex, bodyA.position, tempA), offsetB = Vector.sub(contactVertex, bodyB.position, tempB), velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity), tempC), velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity), tempD), relativeVelocity = Vector.sub(velocityPointA, velocityPointB, tempE), normalVelocity = Vector.dot(normal, relativeVelocity);
                                var tangentVelocity = Vector.dot(tangent, relativeVelocity), tangentSpeed = Math.abs(tangentVelocity), tangentVelocityDirection = Common.sign(tangentVelocity);
                                var normalImpulse = (1 + pair.restitution) * normalVelocity, normalForce = Common.clamp(pair.separation + normalVelocity, 0, 1) * Resolver._frictionNormalMultiplier;
                                var tangentImpulse = tangentVelocity, maxFriction = Infinity;
                                if (tangentSpeed > pair.friction * pair.frictionStatic * normalForce * timeScaleSquared) {
                                    maxFriction = tangentSpeed;
                                    tangentImpulse = Common.clamp(pair.friction * tangentVelocityDirection * timeScaleSquared, -maxFriction, maxFriction);
                                }
                                var oAcN = Vector.cross(offsetA, normal), oBcN = Vector.cross(offsetB, normal), share = contactShare / (bodyA.inverseMass + bodyB.inverseMass + bodyA.inverseInertia * oAcN * oAcN + bodyB.inverseInertia * oBcN * oBcN);
                                normalImpulse *= share;
                                tangentImpulse *= share;
                                if (normalVelocity < 0 && normalVelocity * normalVelocity > Resolver._restingThresh * timeScaleSquared) {
                                    contact.normalImpulse = 0;
                                }
                                else {
                                    var contactNormalImpulse = contact.normalImpulse;
                                    contact.normalImpulse = Math.min(contact.normalImpulse + normalImpulse, 0);
                                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
                                }
                                if (tangentVelocity * tangentVelocity > Resolver._restingThreshTangent * timeScaleSquared) {
                                    contact.tangentImpulse = 0;
                                }
                                else {
                                    var contactTangentImpulse = contact.tangentImpulse;
                                    contact.tangentImpulse = Common.clamp(contact.tangentImpulse + tangentImpulse, -maxFriction, maxFriction);
                                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
                                }
                                impulse.x = (normal.x * normalImpulse) + (tangent.x * tangentImpulse);
                                impulse.y = (normal.y * normalImpulse) + (tangent.y * tangentImpulse);
                                if (!(bodyA.isStatic || bodyA.isSleeping)) {
                                    bodyA.positionPrev.x += impulse.x * bodyA.inverseMass;
                                    bodyA.positionPrev.y += impulse.y * bodyA.inverseMass;
                                    bodyA.anglePrev += Vector.cross(offsetA, impulse) * bodyA.inverseInertia;
                                }
                                if (!(bodyB.isStatic || bodyB.isSleeping)) {
                                    bodyB.positionPrev.x -= impulse.x * bodyB.inverseMass;
                                    bodyB.positionPrev.y -= impulse.y * bodyB.inverseMass;
                                    bodyB.anglePrev -= Vector.cross(offsetB, impulse) * bodyB.inverseInertia;
                                }
                            }
                        }
                    };
                })();
            }, { "../core/Common": 14, "../geometry/Bounds": 24, "../geometry/Vector": 26, "../geometry/Vertices": 27 }], 11: [function (require, module, exports) {
                var SAT = {};
                module.exports = SAT;
                var Vertices = require('../geometry/Vertices');
                var Vector = require('../geometry/Vector');
                (function () {
                    SAT.collides = function (bodyA, bodyB, previousCollision) {
                        var overlapAB, overlapBA, minOverlap, collision, prevCol = previousCollision, canReusePrevCol = false;
                        if (prevCol) {
                            var parentA = bodyA.parent, parentB = bodyB.parent, motion = parentA.speed * parentA.speed + parentA.angularSpeed * parentA.angularSpeed
                                + parentB.speed * parentB.speed + parentB.angularSpeed * parentB.angularSpeed;
                            canReusePrevCol = prevCol && prevCol.collided && motion < 0.2;
                            collision = prevCol;
                        }
                        else {
                            collision = { collided: false, bodyA: bodyA, bodyB: bodyB };
                        }
                        if (prevCol && canReusePrevCol) {
                            var axisBodyA = collision.axisBody, axisBodyB = axisBodyA === bodyA ? bodyB : bodyA, axes = [axisBodyA.axes[prevCol.axisNumber]];
                            minOverlap = _overlapAxes(axisBodyA.vertices, axisBodyB.vertices, axes);
                            collision.reused = true;
                            if (minOverlap.overlap <= 0) {
                                collision.collided = false;
                                return collision;
                            }
                        }
                        else {
                            overlapAB = _overlapAxes(bodyA.vertices, bodyB.vertices, bodyA.axes);
                            if (overlapAB.overlap <= 0) {
                                collision.collided = false;
                                return collision;
                            }
                            overlapBA = _overlapAxes(bodyB.vertices, bodyA.vertices, bodyB.axes);
                            if (overlapBA.overlap <= 0) {
                                collision.collided = false;
                                return collision;
                            }
                            if (overlapAB.overlap < overlapBA.overlap) {
                                minOverlap = overlapAB;
                                collision.axisBody = bodyA;
                            }
                            else {
                                minOverlap = overlapBA;
                                collision.axisBody = bodyB;
                            }
                            collision.axisNumber = minOverlap.axisNumber;
                        }
                        collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
                        collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
                        collision.collided = true;
                        collision.normal = minOverlap.axis;
                        collision.depth = minOverlap.overlap;
                        collision.parentA = collision.bodyA.parent;
                        collision.parentB = collision.bodyB.parent;
                        bodyA = collision.bodyA;
                        bodyB = collision.bodyB;
                        if (Vector.dot(collision.normal, Vector.sub(bodyB.position, bodyA.position)) > 0)
                            collision.normal = Vector.neg(collision.normal);
                        collision.tangent = Vector.perp(collision.normal);
                        collision.penetration = {
                            x: collision.normal.x * collision.depth,
                            y: collision.normal.y * collision.depth
                        };
                        var verticesB = _findSupports(bodyA, bodyB, collision.normal), supports = collision.supports || [];
                        supports.length = 0;
                        if (Vertices.contains(bodyA.vertices, verticesB[0]))
                            supports.push(verticesB[0]);
                        if (Vertices.contains(bodyA.vertices, verticesB[1]))
                            supports.push(verticesB[1]);
                        if (supports.length < 2) {
                            var verticesA = _findSupports(bodyB, bodyA, Vector.neg(collision.normal));
                            if (Vertices.contains(bodyB.vertices, verticesA[0]))
                                supports.push(verticesA[0]);
                            if (supports.length < 2 && Vertices.contains(bodyB.vertices, verticesA[1]))
                                supports.push(verticesA[1]);
                        }
                        if (supports.length < 1)
                            supports = [verticesB[0]];
                        collision.supports = supports;
                        return collision;
                    };
                    var _overlapAxes = function (verticesA, verticesB, axes) {
                        var projectionA = Vector._temp[0], projectionB = Vector._temp[1], result = { overlap: Number.MAX_VALUE }, overlap, axis;
                        for (var i = 0; i < axes.length; i++) {
                            axis = axes[i];
                            _projectToAxis(projectionA, verticesA, axis);
                            _projectToAxis(projectionB, verticesB, axis);
                            overlap = Math.min(projectionA.max - projectionB.min, projectionB.max - projectionA.min);
                            if (overlap <= 0) {
                                result.overlap = overlap;
                                return result;
                            }
                            if (overlap < result.overlap) {
                                result.overlap = overlap;
                                result.axis = axis;
                                result.axisNumber = i;
                            }
                        }
                        return result;
                    };
                    var _projectToAxis = function (projection, vertices, axis) {
                        var min = Vector.dot(vertices[0], axis), max = min;
                        for (var i = 1; i < vertices.length; i += 1) {
                            var dot = Vector.dot(vertices[i], axis);
                            if (dot > max) {
                                max = dot;
                            }
                            else if (dot < min) {
                                min = dot;
                            }
                        }
                        projection.min = min;
                        projection.max = max;
                    };
                    var _findSupports = function (bodyA, bodyB, normal) {
                        var nearestDistance = Number.MAX_VALUE, vertexToBody = Vector._temp[0], vertices = bodyB.vertices, bodyAPosition = bodyA.position, distance, vertex, vertexA, vertexB;
                        for (var i = 0; i < vertices.length; i++) {
                            vertex = vertices[i];
                            vertexToBody.x = vertex.x - bodyAPosition.x;
                            vertexToBody.y = vertex.y - bodyAPosition.y;
                            distance = -Vector.dot(normal, vertexToBody);
                            if (distance < nearestDistance) {
                                nearestDistance = distance;
                                vertexA = vertex;
                            }
                        }
                        var prevIndex = vertexA.index - 1 >= 0 ? vertexA.index - 1 : vertices.length - 1;
                        vertex = vertices[prevIndex];
                        vertexToBody.x = vertex.x - bodyAPosition.x;
                        vertexToBody.y = vertex.y - bodyAPosition.y;
                        nearestDistance = -Vector.dot(normal, vertexToBody);
                        vertexB = vertex;
                        var nextIndex = (vertexA.index + 1) % vertices.length;
                        vertex = vertices[nextIndex];
                        vertexToBody.x = vertex.x - bodyAPosition.x;
                        vertexToBody.y = vertex.y - bodyAPosition.y;
                        distance = -Vector.dot(normal, vertexToBody);
                        if (distance < nearestDistance) {
                            vertexB = vertex;
                        }
                        return [vertexA, vertexB];
                    };
                })();
            }, { "../geometry/Vector": 26, "../geometry/Vertices": 27 }], 12: [function (require, module, exports) {
                var Constraint = {};
                module.exports = Constraint;
                var Vertices = require('../geometry/Vertices');
                var Vector = require('../geometry/Vector');
                var Sleeping = require('../core/Sleeping');
                var Bounds = require('../geometry/Bounds');
                var Axes = require('../geometry/Axes');
                var Common = require('../core/Common');
                (function () {
                    var _minLength = 0.000001, _minDifference = 0.001;
                    Constraint.create = function (options) {
                        var constraint = options;
                        if (constraint.bodyA && !constraint.pointA)
                            constraint.pointA = { x: 0, y: 0 };
                        if (constraint.bodyB && !constraint.pointB)
                            constraint.pointB = { x: 0, y: 0 };
                        var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA, initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB, length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
                        constraint.length = constraint.length || length || _minLength;
                        var render = {
                            visible: true,
                            lineWidth: 2,
                            strokeStyle: '#666'
                        };
                        constraint.render = Common.extend(render, constraint.render);
                        constraint.id = constraint.id || Common.nextId();
                        constraint.label = constraint.label || 'Constraint';
                        constraint.type = 'constraint';
                        constraint.stiffness = constraint.stiffness || 1;
                        constraint.angularStiffness = constraint.angularStiffness || 0;
                        constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
                        constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
                        return constraint;
                    };
                    Constraint.solveAll = function (constraints, timeScale) {
                        for (var i = 0; i < constraints.length; i++) {
                            Constraint.solve(constraints[i], timeScale);
                        }
                    };
                    Constraint.solve = function (constraint, timeScale) {
                        var bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointA = constraint.pointA, pointB = constraint.pointB;
                        if (bodyA && !bodyA.isStatic) {
                            constraint.pointA = Vector.rotate(pointA, bodyA.angle - constraint.angleA);
                            constraint.angleA = bodyA.angle;
                        }
                        if (bodyB && !bodyB.isStatic) {
                            constraint.pointB = Vector.rotate(pointB, bodyB.angle - constraint.angleB);
                            constraint.angleB = bodyB.angle;
                        }
                        var pointAWorld = pointA, pointBWorld = pointB;
                        if (bodyA)
                            pointAWorld = Vector.add(bodyA.position, pointA);
                        if (bodyB)
                            pointBWorld = Vector.add(bodyB.position, pointB);
                        if (!pointAWorld || !pointBWorld)
                            return;
                        var delta = Vector.sub(pointAWorld, pointBWorld), currentLength = Vector.magnitude(delta);
                        if (currentLength === 0)
                            currentLength = _minLength;
                        var difference = (currentLength - constraint.length) / currentLength, normal = Vector.div(delta, currentLength), force = Vector.mult(delta, difference * 0.5 * constraint.stiffness * timeScale * timeScale);
                        if (Math.abs(1 - (currentLength / constraint.length)) < _minDifference * timeScale)
                            return;
                        var velocityPointA, velocityPointB, offsetA, offsetB, oAn, oBn, bodyADenom, bodyBDenom;
                        if (bodyA && !bodyA.isStatic) {
                            offsetA = {
                                x: pointAWorld.x - bodyA.position.x + force.x,
                                y: pointAWorld.y - bodyA.position.y + force.y
                            };
                            bodyA.velocity.x = bodyA.position.x - bodyA.positionPrev.x;
                            bodyA.velocity.y = bodyA.position.y - bodyA.positionPrev.y;
                            bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
                            velocityPointA = Vector.add(bodyA.velocity, Vector.mult(Vector.perp(offsetA), bodyA.angularVelocity));
                            oAn = Vector.dot(offsetA, normal);
                            bodyADenom = bodyA.inverseMass + bodyA.inverseInertia * oAn * oAn;
                        }
                        else {
                            velocityPointA = { x: 0, y: 0 };
                            bodyADenom = bodyA ? bodyA.inverseMass : 0;
                        }
                        if (bodyB && !bodyB.isStatic) {
                            offsetB = {
                                x: pointBWorld.x - bodyB.position.x - force.x,
                                y: pointBWorld.y - bodyB.position.y - force.y
                            };
                            bodyB.velocity.x = bodyB.position.x - bodyB.positionPrev.x;
                            bodyB.velocity.y = bodyB.position.y - bodyB.positionPrev.y;
                            bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
                            velocityPointB = Vector.add(bodyB.velocity, Vector.mult(Vector.perp(offsetB), bodyB.angularVelocity));
                            oBn = Vector.dot(offsetB, normal);
                            bodyBDenom = bodyB.inverseMass + bodyB.inverseInertia * oBn * oBn;
                        }
                        else {
                            velocityPointB = { x: 0, y: 0 };
                            bodyBDenom = bodyB ? bodyB.inverseMass : 0;
                        }
                        var relativeVelocity = Vector.sub(velocityPointB, velocityPointA), normalImpulse = Vector.dot(normal, relativeVelocity) / (bodyADenom + bodyBDenom);
                        if (normalImpulse > 0)
                            normalImpulse = 0;
                        var normalVelocity = {
                            x: normal.x * normalImpulse,
                            y: normal.y * normalImpulse
                        };
                        var torque;
                        if (bodyA && !bodyA.isStatic) {
                            torque = Vector.cross(offsetA, normalVelocity) * bodyA.inverseInertia * (1 - constraint.angularStiffness);
                            bodyA.constraintImpulse.x -= force.x;
                            bodyA.constraintImpulse.y -= force.y;
                            bodyA.constraintImpulse.angle += torque;
                            bodyA.position.x -= force.x;
                            bodyA.position.y -= force.y;
                            bodyA.angle += torque;
                        }
                        if (bodyB && !bodyB.isStatic) {
                            torque = Vector.cross(offsetB, normalVelocity) * bodyB.inverseInertia * (1 - constraint.angularStiffness);
                            bodyB.constraintImpulse.x += force.x;
                            bodyB.constraintImpulse.y += force.y;
                            bodyB.constraintImpulse.angle -= torque;
                            bodyB.position.x += force.x;
                            bodyB.position.y += force.y;
                            bodyB.angle -= torque;
                        }
                    };
                    Constraint.postSolveAll = function (bodies) {
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i], impulse = body.constraintImpulse;
                            if (impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
                                continue;
                            }
                            Sleeping.set(body, false);
                            for (var j = 0; j < body.parts.length; j++) {
                                var part = body.parts[j];
                                Vertices.translate(part.vertices, impulse);
                                if (j > 0) {
                                    part.position.x += impulse.x;
                                    part.position.y += impulse.y;
                                }
                                if (impulse.angle !== 0) {
                                    Vertices.rotate(part.vertices, impulse.angle, body.position);
                                    Axes.rotate(part.axes, impulse.angle);
                                    if (j > 0) {
                                        Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
                                    }
                                }
                                Bounds.update(part.bounds, part.vertices, body.velocity);
                            }
                            impulse.angle = 0;
                            impulse.x = 0;
                            impulse.y = 0;
                        }
                    };
                })();
            }, { "../core/Common": 14, "../core/Sleeping": 20, "../geometry/Axes": 23, "../geometry/Bounds": 24, "../geometry/Vector": 26, "../geometry/Vertices": 27 }], 13: [function (require, module, exports) {
                var MouseConstraint = {};
                module.exports = MouseConstraint;
                var Vertices = require('../geometry/Vertices');
                var Sleeping = require('../core/Sleeping');
                var Mouse = require('../core/Mouse');
                var Events = require('../core/Events');
                var Detector = require('../collision/Detector');
                var Constraint = require('./Constraint');
                var Composite = require('../body/Composite');
                var Common = require('../core/Common');
                var Bounds = require('../geometry/Bounds');
                (function () {
                    MouseConstraint.create = function (engine, options) {
                        var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
                        if (!mouse) {
                            if (engine && engine.render && engine.render.canvas) {
                                mouse = Mouse.create(engine.render.canvas);
                            }
                            else if (options && options.element) {
                                mouse = Mouse.create(options.element);
                            }
                            else {
                                mouse = Mouse.create();
                                Common.log('MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected', 'warn');
                            }
                        }
                        var constraint = Constraint.create({
                            label: 'Mouse Constraint',
                            pointA: mouse.position,
                            pointB: { x: 0, y: 0 },
                            length: 0.01,
                            stiffness: 0.1,
                            angularStiffness: 1,
                            render: {
                                strokeStyle: '#90EE90',
                                lineWidth: 3
                            }
                        });
                        var defaults = {
                            type: 'mouseConstraint',
                            mouse: mouse,
                            element: null,
                            body: null,
                            constraint: constraint,
                            collisionFilter: {
                                category: 0x0001,
                                mask: 0xFFFFFFFF,
                                group: 0
                            }
                        };
                        var mouseConstraint = Common.extend(defaults, options);
                        Events.on(engine, 'tick', function () {
                            var allBodies = Composite.allBodies(engine.world);
                            MouseConstraint.update(mouseConstraint, allBodies);
                            _triggerEvents(mouseConstraint);
                        });
                        return mouseConstraint;
                    };
                    MouseConstraint.update = function (mouseConstraint, bodies) {
                        var mouse = mouseConstraint.mouse, constraint = mouseConstraint.constraint, body = mouseConstraint.body;
                        if (mouse.button === 0) {
                            if (!constraint.bodyB) {
                                for (var i = 0; i < bodies.length; i++) {
                                    body = bodies[i];
                                    if (Bounds.contains(body.bounds, mouse.position)
                                        && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
                                        for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                                            var part = body.parts[j];
                                            if (Vertices.contains(part.vertices, mouse.position)) {
                                                constraint.pointA = mouse.position;
                                                constraint.bodyB = mouseConstraint.body = body;
                                                constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
                                                constraint.angleB = body.angle;
                                                Sleeping.set(body, false);
                                                Events.trigger(mouseConstraint, 'startdrag', { mouse: mouse, body: body });
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                Sleeping.set(constraint.bodyB, false);
                                constraint.pointA = mouse.position;
                            }
                        }
                        else {
                            constraint.bodyB = mouseConstraint.body = null;
                            constraint.pointB = null;
                            if (body)
                                Events.trigger(mouseConstraint, 'enddrag', { mouse: mouse, body: body });
                        }
                    };
                    var _triggerEvents = function (mouseConstraint) {
                        var mouse = mouseConstraint.mouse, mouseEvents = mouse.sourceEvents;
                        if (mouseEvents.mousemove)
                            Events.trigger(mouseConstraint, 'mousemove', { mouse: mouse });
                        if (mouseEvents.mousedown)
                            Events.trigger(mouseConstraint, 'mousedown', { mouse: mouse });
                        if (mouseEvents.mouseup)
                            Events.trigger(mouseConstraint, 'mouseup', { mouse: mouse });
                        Mouse.clearSourceEvents(mouse);
                    };
                })();
            }, { "../body/Composite": 2, "../collision/Detector": 5, "../core/Common": 14, "../core/Events": 16, "../core/Mouse": 18, "../core/Sleeping": 20, "../geometry/Bounds": 24, "../geometry/Vertices": 27, "./Constraint": 12 }], 14: [function (require, module, exports) {
                var Common = {};
                module.exports = Common;
                (function () {
                    Common._nextId = 0;
                    Common._seed = 0;
                    Common.extend = function (obj, deep) {
                        var argsStart, args, deepClone;
                        if (typeof deep === 'boolean') {
                            argsStart = 2;
                            deepClone = deep;
                        }
                        else {
                            argsStart = 1;
                            deepClone = true;
                        }
                        args = Array.prototype.slice.call(arguments, argsStart);
                        for (var i = 0; i < args.length; i++) {
                            var source = args[i];
                            if (source) {
                                for (var prop in source) {
                                    if (deepClone && source[prop] && source[prop].constructor === Object) {
                                        if (!obj[prop] || obj[prop].constructor === Object) {
                                            obj[prop] = obj[prop] || {};
                                            Common.extend(obj[prop], deepClone, source[prop]);
                                        }
                                        else {
                                            obj[prop] = source[prop];
                                        }
                                    }
                                    else {
                                        obj[prop] = source[prop];
                                    }
                                }
                            }
                        }
                        return obj;
                    };
                    Common.clone = function (obj, deep) {
                        return Common.extend({}, deep, obj);
                    };
                    Common.keys = function (obj) {
                        if (Object.keys)
                            return Object.keys(obj);
                        var keys = [];
                        for (var key in obj)
                            keys.push(key);
                        return keys;
                    };
                    Common.values = function (obj) {
                        var values = [];
                        if (Object.keys) {
                            var keys = Object.keys(obj);
                            for (var i = 0; i < keys.length; i++) {
                                values.push(obj[keys[i]]);
                            }
                            return values;
                        }
                        for (var key in obj)
                            values.push(obj[key]);
                        return values;
                    };
                    Common.shadeColor = function (color, percent) {
                        var colorInteger = parseInt(color.slice(1), 16), amount = Math.round(2.55 * percent), R = (colorInteger >> 16) + amount, B = (colorInteger >> 8 & 0x00FF) + amount, G = (colorInteger & 0x0000FF) + amount;
                        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000
                            + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100
                            + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
                    };
                    Common.shuffle = function (array) {
                        for (var i = array.length - 1; i > 0; i--) {
                            var j = Math.floor(Common.random() * (i + 1));
                            var temp = array[i];
                            array[i] = array[j];
                            array[j] = temp;
                        }
                        return array;
                    };
                    Common.choose = function (choices) {
                        return choices[Math.floor(Common.random() * choices.length)];
                    };
                    Common.isElement = function (obj) {
                        try {
                            return obj instanceof HTMLElement;
                        }
                        catch (e) {
                            return (typeof obj === "object") &&
                                (obj.nodeType === 1) && (typeof obj.style === "object") &&
                                (typeof obj.ownerDocument === "object");
                        }
                    };
                    Common.isArray = function (obj) {
                        return Object.prototype.toString.call(obj) === '[object Array]';
                    };
                    Common.clamp = function (value, min, max) {
                        if (value < min)
                            return min;
                        if (value > max)
                            return max;
                        return value;
                    };
                    Common.sign = function (value) {
                        return value < 0 ? -1 : 1;
                    };
                    Common.now = function () {
                        var performance = window.performance || {};
                        performance.now = (function () {
                            return performance.now ||
                                performance.webkitNow ||
                                performance.msNow ||
                                performance.oNow ||
                                performance.mozNow ||
                                function () { return +(new Date()); };
                        })();
                        return performance.now();
                    };
                    Common.random = function (min, max) {
                        min = (typeof min !== "undefined") ? min : 0;
                        max = (typeof max !== "undefined") ? max : 1;
                        return min + _seededRandom() * (max - min);
                    };
                    Common.colorToNumber = function (colorString) {
                        colorString = colorString.replace('#', '');
                        if (colorString.length == 3) {
                            colorString = colorString.charAt(0) + colorString.charAt(0)
                                + colorString.charAt(1) + colorString.charAt(1)
                                + colorString.charAt(2) + colorString.charAt(2);
                        }
                        return parseInt(colorString, 16);
                    };
                    Common.log = function (message, type) {
                        if (!console || !console.log || !console.warn)
                            return;
                        switch (type) {
                            case 'warn':
                                console.warn('Matter.js:', message);
                                break;
                            case 'error':
                                console.log('Matter.js:', message);
                                break;
                        }
                    };
                    Common.nextId = function () {
                        return Common._nextId++;
                    };
                    Common.indexOf = function (haystack, needle) {
                        if (haystack.indexOf)
                            return haystack.indexOf(needle);
                        for (var i = 0; i < haystack.length; i++) {
                            if (haystack[i] === needle)
                                return i;
                        }
                        return -1;
                    };
                    var _seededRandom = function () {
                        Common._seed = (Common._seed * 9301 + 49297) % 233280;
                        return Common._seed / 233280;
                    };
                })();
            }, {}], 15: [function (require, module, exports) {
                var Engine = {};
                module.exports = Engine;
                var World = require('../body/World');
                var Sleeping = require('./Sleeping');
                var Resolver = require('../collision/Resolver');
                var Render = require('../render/Render');
                var Pairs = require('../collision/Pairs');
                var Metrics = require('./Metrics');
                var Grid = require('../collision/Grid');
                var Events = require('./Events');
                var Composite = require('../body/Composite');
                var Constraint = require('../constraint/Constraint');
                var Common = require('./Common');
                var Body = require('../body/Body');
                (function () {
                    Engine.create = function (element, options) {
                        options = Common.isElement(element) ? options : element;
                        element = Common.isElement(element) ? element : null;
                        options = options || {};
                        if (element || options.render) {
                            Common.log('Engine.create: engine.render is deprecated (see docs)', 'warn');
                        }
                        var defaults = {
                            positionIterations: 6,
                            velocityIterations: 4,
                            constraintIterations: 2,
                            enableSleeping: false,
                            events: [],
                            timing: {
                                timestamp: 0,
                                timeScale: 1
                            },
                            broadphase: {
                                controller: Grid
                            }
                        };
                        var engine = Common.extend(defaults, options);
                        if (element || engine.render) {
                            var renderDefaults = {
                                element: element,
                                controller: Render
                            };
                            engine.render = Common.extend(renderDefaults, engine.render);
                        }
                        if (engine.render && engine.render.controller) {
                            engine.render = engine.render.controller.create(engine.render);
                        }
                        if (engine.render) {
                            engine.render.engine = engine;
                        }
                        engine.world = options.world || World.create(engine.world);
                        engine.pairs = Pairs.create();
                        engine.broadphase = engine.broadphase.controller.create(engine.broadphase);
                        engine.metrics = engine.metrics || { extended: false };
                        return engine;
                    };
                    Engine.update = function (engine, delta, correction) {
                        delta = delta || 1000 / 60;
                        correction = correction || 1;
                        var world = engine.world, timing = engine.timing, broadphase = engine.broadphase, broadphasePairs = [], i;
                        timing.timestamp += delta * timing.timeScale;
                        var event = {
                            timestamp: timing.timestamp
                        };
                        Events.trigger(engine, 'beforeUpdate', event);
                        var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world);
                        if (engine.enableSleeping)
                            Sleeping.update(allBodies, timing.timeScale);
                        _bodiesApplyGravity(allBodies, world.gravity);
                        _bodiesUpdate(allBodies, delta, timing.timeScale, correction, world.bounds);
                        for (i = 0; i < engine.constraintIterations; i++) {
                            Constraint.solveAll(allConstraints, timing.timeScale);
                        }
                        Constraint.postSolveAll(allBodies);
                        if (broadphase.controller) {
                            if (world.isModified)
                                broadphase.controller.clear(broadphase);
                            broadphase.controller.update(broadphase, allBodies, engine, world.isModified);
                            broadphasePairs = broadphase.pairsList;
                        }
                        else {
                            broadphasePairs = allBodies;
                        }
                        if (world.isModified) {
                            Composite.setModified(world, false, false, true);
                        }
                        var collisions = broadphase.detector(broadphasePairs, engine);
                        var pairs = engine.pairs, timestamp = timing.timestamp;
                        Pairs.update(pairs, collisions, timestamp);
                        Pairs.removeOld(pairs, timestamp);
                        if (engine.enableSleeping)
                            Sleeping.afterCollisions(pairs.list, timing.timeScale);
                        if (pairs.collisionStart.length > 0)
                            Events.trigger(engine, 'collisionStart', { pairs: pairs.collisionStart });
                        Resolver.preSolvePosition(pairs.list);
                        for (i = 0; i < engine.positionIterations; i++) {
                            Resolver.solvePosition(pairs.list, timing.timeScale);
                        }
                        Resolver.postSolvePosition(allBodies);
                        Resolver.preSolveVelocity(pairs.list);
                        for (i = 0; i < engine.velocityIterations; i++) {
                            Resolver.solveVelocity(pairs.list, timing.timeScale);
                        }
                        if (pairs.collisionActive.length > 0)
                            Events.trigger(engine, 'collisionActive', { pairs: pairs.collisionActive });
                        if (pairs.collisionEnd.length > 0)
                            Events.trigger(engine, 'collisionEnd', { pairs: pairs.collisionEnd });
                        _bodiesClearForces(allBodies);
                        Events.trigger(engine, 'afterUpdate', event);
                        return engine;
                    };
                    Engine.merge = function (engineA, engineB) {
                        Common.extend(engineA, engineB);
                        if (engineB.world) {
                            engineA.world = engineB.world;
                            Engine.clear(engineA);
                            var bodies = Composite.allBodies(engineA.world);
                            for (var i = 0; i < bodies.length; i++) {
                                var body = bodies[i];
                                Sleeping.set(body, false);
                                body.id = Common.nextId();
                            }
                        }
                    };
                    Engine.clear = function (engine) {
                        var world = engine.world;
                        Pairs.clear(engine.pairs);
                        var broadphase = engine.broadphase;
                        if (broadphase.controller) {
                            var bodies = Composite.allBodies(world);
                            broadphase.controller.clear(broadphase);
                            broadphase.controller.update(broadphase, bodies, engine, true);
                        }
                    };
                    var _bodiesClearForces = function (bodies) {
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            body.force.x = 0;
                            body.force.y = 0;
                            body.torque = 0;
                        }
                    };
                    var _bodiesApplyGravity = function (bodies, gravity) {
                        var gravityScale = typeof gravity.scale !== 'undefined' ? gravity.scale : 0.001;
                        if ((gravity.x === 0 && gravity.y === 0) || gravityScale === 0) {
                            return;
                        }
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (body.isStatic || body.isSleeping)
                                continue;
                            body.force.y += body.mass * gravity.y * gravityScale;
                            body.force.x += body.mass * gravity.x * gravityScale;
                        }
                    };
                    var _bodiesUpdate = function (bodies, deltaTime, timeScale, correction, worldBounds) {
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (body.isStatic || body.isSleeping)
                                continue;
                            Body.update(body, deltaTime, timeScale, correction);
                        }
                    };
                })();
            }, { "../body/Body": 1, "../body/Composite": 2, "../body/World": 3, "../collision/Grid": 6, "../collision/Pairs": 8, "../collision/Resolver": 10, "../constraint/Constraint": 12, "../render/Render": 29, "./Common": 14, "./Events": 16, "./Metrics": 17, "./Sleeping": 20 }], 16: [function (require, module, exports) {
                var Events = {};
                module.exports = Events;
                var Common = require('./Common');
                (function () {
                    Events.on = function (object, eventNames, callback) {
                        var names = eventNames.split(' '), name;
                        for (var i = 0; i < names.length; i++) {
                            name = names[i];
                            object.events = object.events || {};
                            object.events[name] = object.events[name] || [];
                            object.events[name].push(callback);
                        }
                        return callback;
                    };
                    Events.off = function (object, eventNames, callback) {
                        if (!eventNames) {
                            object.events = {};
                            return;
                        }
                        if (typeof eventNames === 'function') {
                            callback = eventNames;
                            eventNames = Common.keys(object.events).join(' ');
                        }
                        var names = eventNames.split(' ');
                        for (var i = 0; i < names.length; i++) {
                            var callbacks = object.events[names[i]], newCallbacks = [];
                            if (callback && callbacks) {
                                for (var j = 0; j < callbacks.length; j++) {
                                    if (callbacks[j] !== callback)
                                        newCallbacks.push(callbacks[j]);
                                }
                            }
                            object.events[names[i]] = newCallbacks;
                        }
                    };
                    Events.trigger = function (object, eventNames, event) {
                        var names, name, callbacks, eventClone;
                        if (object.events) {
                            if (!event)
                                event = {};
                            names = eventNames.split(' ');
                            for (var i = 0; i < names.length; i++) {
                                name = names[i];
                                callbacks = object.events[name];
                                if (callbacks) {
                                    eventClone = Common.clone(event, false);
                                    eventClone.name = name;
                                    eventClone.source = object;
                                    for (var j = 0; j < callbacks.length; j++) {
                                        callbacks[j].apply(object, [eventClone]);
                                    }
                                }
                            }
                        }
                    };
                })();
            }, { "./Common": 14 }], 17: [function (require, module, exports) {
            }, { "../body/Composite": 2, "./Common": 14 }], 18: [function (require, module, exports) {
                var Mouse = {};
                module.exports = Mouse;
                var Common = require('../core/Common');
                (function () {
                    Mouse.create = function (element) {
                        var mouse = {};
                        if (!element) {
                            Common.log('Mouse.create: element was undefined, defaulting to document.body', 'warn');
                        }
                        mouse.element = element || document.body;
                        mouse.absolute = { x: 0, y: 0 };
                        mouse.position = { x: 0, y: 0 };
                        mouse.mousedownPosition = { x: 0, y: 0 };
                        mouse.mouseupPosition = { x: 0, y: 0 };
                        mouse.offset = { x: 0, y: 0 };
                        mouse.scale = { x: 1, y: 1 };
                        mouse.wheelDelta = 0;
                        mouse.button = -1;
                        mouse.pixelRatio = mouse.element.getAttribute('data-pixel-ratio') || 1;
                        mouse.sourceEvents = {
                            mousemove: null,
                            mousedown: null,
                            mouseup: null,
                            mousewheel: null
                        };
                        mouse.mousemove = function (event) {
                            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                            if (touches) {
                                mouse.button = 0;
                                event.preventDefault();
                            }
                            mouse.absolute.x = position.x;
                            mouse.absolute.y = position.y;
                            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                            mouse.sourceEvents.mousemove = event;
                        };
                        mouse.mousedown = function (event) {
                            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                            if (touches) {
                                mouse.button = 0;
                                event.preventDefault();
                            }
                            else {
                                mouse.button = event.button;
                            }
                            mouse.absolute.x = position.x;
                            mouse.absolute.y = position.y;
                            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                            mouse.mousedownPosition.x = mouse.position.x;
                            mouse.mousedownPosition.y = mouse.position.y;
                            mouse.sourceEvents.mousedown = event;
                        };
                        mouse.mouseup = function (event) {
                            var position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                            if (touches) {
                                event.preventDefault();
                            }
                            mouse.button = -1;
                            mouse.absolute.x = position.x;
                            mouse.absolute.y = position.y;
                            mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                            mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                            mouse.mouseupPosition.x = mouse.position.x;
                            mouse.mouseupPosition.y = mouse.position.y;
                            mouse.sourceEvents.mouseup = event;
                        };
                        mouse.mousewheel = function (event) {
                            mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
                            event.preventDefault();
                        };
                        Mouse.setElement(mouse, mouse.element);
                        return mouse;
                    };
                    Mouse.setElement = function (mouse, element) {
                        mouse.element = element;
                        element.addEventListener('mousemove', mouse.mousemove);
                        element.addEventListener('mousedown', mouse.mousedown);
                        element.addEventListener('mouseup', mouse.mouseup);
                        element.addEventListener('mousewheel', mouse.mousewheel);
                        element.addEventListener('DOMMouseScroll', mouse.mousewheel);
                        element.addEventListener('touchmove', mouse.mousemove);
                        element.addEventListener('touchstart', mouse.mousedown);
                        element.addEventListener('touchend', mouse.mouseup);
                    };
                    Mouse.clearSourceEvents = function (mouse) {
                        mouse.sourceEvents.mousemove = null;
                        mouse.sourceEvents.mousedown = null;
                        mouse.sourceEvents.mouseup = null;
                        mouse.sourceEvents.mousewheel = null;
                        mouse.wheelDelta = 0;
                    };
                    Mouse.setOffset = function (mouse, offset) {
                        mouse.offset.x = offset.x;
                        mouse.offset.y = offset.y;
                        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                    };
                    Mouse.setScale = function (mouse, scale) {
                        mouse.scale.x = scale.x;
                        mouse.scale.y = scale.y;
                        mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                        mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                    };
                    var _getRelativeMousePosition = function (event, element, pixelRatio) {
                        var elementBounds = element.getBoundingClientRect(), rootNode = (document.documentElement || document.body.parentNode || document.body), scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft, scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop, touches = event.changedTouches, x, y;
                        if (touches) {
                            x = touches[0].pageX - elementBounds.left - scrollX;
                            y = touches[0].pageY - elementBounds.top - scrollY;
                        }
                        else {
                            x = event.pageX - elementBounds.left - scrollX;
                            y = event.pageY - elementBounds.top - scrollY;
                        }
                        return {
                            x: x / (element.clientWidth / element.width * pixelRatio),
                            y: y / (element.clientHeight / element.height * pixelRatio)
                        };
                    };
                })();
            }, { "../core/Common": 14 }], 19: [function (require, module, exports) {
                var Runner = {};
                module.exports = Runner;
                var Events = require('./Events');
                var Engine = require('./Engine');
                var Common = require('./Common');
                (function () {
                    var _requestAnimationFrame, _cancelAnimationFrame;
                    if (typeof window !== 'undefined') {
                        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                            || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
                            || function (callback) { window.setTimeout(function () { callback(Common.now()); }, 1000 / 60); };
                        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
                            || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
                    }
                    Runner.create = function (options) {
                        var defaults = {
                            fps: 60,
                            correction: 1,
                            deltaSampleSize: 60,
                            counterTimestamp: 0,
                            frameCounter: 0,
                            deltaHistory: [],
                            timePrev: null,
                            timeScalePrev: 1,
                            frameRequestId: null,
                            isFixed: false,
                            enabled: true
                        };
                        var runner = Common.extend(defaults, options);
                        runner.delta = runner.delta || 1000 / runner.fps;
                        runner.deltaMin = runner.deltaMin || 1000 / runner.fps;
                        runner.deltaMax = runner.deltaMax || 1000 / (runner.fps * 0.5);
                        runner.fps = 1000 / runner.delta;
                        return runner;
                    };
                    Runner.run = function (runner, engine) {
                        if (typeof runner.positionIterations !== 'undefined') {
                            engine = runner;
                            runner = Runner.create();
                        }
                        (function render(time) {
                            runner.frameRequestId = _requestAnimationFrame(render);
                            if (time && runner.enabled) {
                                Runner.tick(runner, engine, time);
                            }
                        })();
                        return runner;
                    };
                    Runner.tick = function (runner, engine, time) {
                        var timing = engine.timing, correction = 1, delta;
                        var event = {
                            timestamp: timing.timestamp
                        };
                        Events.trigger(runner, 'beforeTick', event);
                        Events.trigger(engine, 'beforeTick', event);
                        if (runner.isFixed) {
                            delta = runner.delta;
                        }
                        else {
                            delta = (time - runner.timePrev) || runner.delta;
                            runner.timePrev = time;
                            runner.deltaHistory.push(delta);
                            runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
                            delta = Math.min.apply(null, runner.deltaHistory);
                            delta = delta < runner.deltaMin ? runner.deltaMin : delta;
                            delta = delta > runner.deltaMax ? runner.deltaMax : delta;
                            correction = delta / runner.delta;
                            runner.delta = delta;
                        }
                        if (runner.timeScalePrev !== 0)
                            correction *= timing.timeScale / runner.timeScalePrev;
                        if (timing.timeScale === 0)
                            correction = 0;
                        runner.timeScalePrev = timing.timeScale;
                        runner.correction = correction;
                        runner.frameCounter += 1;
                        if (time - runner.counterTimestamp >= 1000) {
                            runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1000);
                            runner.counterTimestamp = time;
                            runner.frameCounter = 0;
                        }
                        Events.trigger(runner, 'tick', event);
                        Events.trigger(engine, 'tick', event);
                        if (engine.world.isModified
                            && engine.render
                            && engine.render.controller
                            && engine.render.controller.clear) {
                            engine.render.controller.clear(engine.render);
                        }
                        Events.trigger(runner, 'beforeUpdate', event);
                        Engine.update(engine, delta, correction);
                        Events.trigger(runner, 'afterUpdate', event);
                        if (engine.render && engine.render.controller) {
                            Events.trigger(runner, 'beforeRender', event);
                            Events.trigger(engine, 'beforeRender', event);
                            engine.render.controller.world(engine.render);
                            Events.trigger(runner, 'afterRender', event);
                            Events.trigger(engine, 'afterRender', event);
                        }
                        Events.trigger(runner, 'afterTick', event);
                        Events.trigger(engine, 'afterTick', event);
                    };
                    Runner.stop = function (runner) {
                        _cancelAnimationFrame(runner.frameRequestId);
                    };
                    Runner.start = function (runner, engine) {
                        Runner.run(runner, engine);
                    };
                })();
            }, { "./Common": 14, "./Engine": 15, "./Events": 16 }], 20: [function (require, module, exports) {
                var Sleeping = {};
                module.exports = Sleeping;
                var Events = require('./Events');
                (function () {
                    Sleeping._motionWakeThreshold = 0.18;
                    Sleeping._motionSleepThreshold = 0.08;
                    Sleeping._minBias = 0.9;
                    Sleeping.update = function (bodies, timeScale) {
                        var timeFactor = timeScale * timeScale * timeScale;
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i], motion = body.speed * body.speed + body.angularSpeed * body.angularSpeed;
                            if (body.force.x !== 0 || body.force.y !== 0) {
                                Sleeping.set(body, false);
                                continue;
                            }
                            var minMotion = Math.min(body.motion, motion), maxMotion = Math.max(body.motion, motion);
                            body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
                            if (body.sleepThreshold > 0 && body.motion < Sleeping._motionSleepThreshold * timeFactor) {
                                body.sleepCounter += 1;
                                if (body.sleepCounter >= body.sleepThreshold)
                                    Sleeping.set(body, true);
                            }
                            else if (body.sleepCounter > 0) {
                                body.sleepCounter -= 1;
                            }
                        }
                    };
                    Sleeping.afterCollisions = function (pairs, timeScale) {
                        var timeFactor = timeScale * timeScale * timeScale;
                        for (var i = 0; i < pairs.length; i++) {
                            var pair = pairs[i];
                            if (!pair.isActive)
                                continue;
                            var collision = pair.collision, bodyA = collision.bodyA.parent, bodyB = collision.bodyB.parent;
                            if ((bodyA.isSleeping && bodyB.isSleeping) || bodyA.isStatic || bodyB.isStatic)
                                continue;
                            if (bodyA.isSleeping || bodyB.isSleeping) {
                                var sleepingBody = (bodyA.isSleeping && !bodyA.isStatic) ? bodyA : bodyB, movingBody = sleepingBody === bodyA ? bodyB : bodyA;
                                if (!sleepingBody.isStatic && movingBody.motion > Sleeping._motionWakeThreshold * timeFactor) {
                                    Sleeping.set(sleepingBody, false);
                                }
                            }
                        }
                    };
                    Sleeping.set = function (body, isSleeping) {
                        var wasSleeping = body.isSleeping;
                        if (isSleeping) {
                            body.isSleeping = true;
                            body.sleepCounter = body.sleepThreshold;
                            body.positionImpulse.x = 0;
                            body.positionImpulse.y = 0;
                            body.positionPrev.x = body.position.x;
                            body.positionPrev.y = body.position.y;
                            body.anglePrev = body.angle;
                            body.speed = 0;
                            body.angularSpeed = 0;
                            body.motion = 0;
                            if (!wasSleeping) {
                                Events.trigger(body, 'sleepStart');
                            }
                        }
                        else {
                            body.isSleeping = false;
                            body.sleepCounter = 0;
                            if (wasSleeping) {
                                Events.trigger(body, 'sleepEnd');
                            }
                        }
                    };
                })();
            }, { "./Events": 16 }], 21: [function (require, module, exports) {
                var Bodies = {};
                module.exports = Bodies;
                var Vertices = require('../geometry/Vertices');
                var Common = require('../core/Common');
                var Body = require('../body/Body');
                var Bounds = require('../geometry/Bounds');
                var Vector = require('../geometry/Vector');
                (function () {
                    Bodies.rectangle = function (x, y, width, height, options) {
                        options = options || {};
                        var rectangle = {
                            label: 'Rectangle Body',
                            position: { x: x, y: y },
                            vertices: Vertices.fromPath('L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height)
                        };
                        if (options.chamfer) {
                            var chamfer = options.chamfer;
                            rectangle.vertices = Vertices.chamfer(rectangle.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
                            delete options.chamfer;
                        }
                        return Body.create(Common.extend({}, rectangle, options));
                    };
                    Bodies.trapezoid = function (x, y, width, height, slope, options) {
                        options = options || {};
                        slope *= 0.5;
                        var roof = (1 - (slope * 2)) * width;
                        var x1 = width * slope, x2 = x1 + roof, x3 = x2 + x1, verticesPath;
                        if (slope < 0.5) {
                            verticesPath = 'L 0 0 L ' + x1 + ' ' + (-height) + ' L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0';
                        }
                        else {
                            verticesPath = 'L 0 0 L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0';
                        }
                        var trapezoid = {
                            label: 'Trapezoid Body',
                            position: { x: x, y: y },
                            vertices: Vertices.fromPath(verticesPath)
                        };
                        if (options.chamfer) {
                            var chamfer = options.chamfer;
                            trapezoid.vertices = Vertices.chamfer(trapezoid.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
                            delete options.chamfer;
                        }
                        return Body.create(Common.extend({}, trapezoid, options));
                    };
                    Bodies.circle = function (x, y, radius, options, maxSides) {
                        options = options || {};
                        var circle = {
                            label: 'Circle Body',
                            circleRadius: radius
                        };
                        maxSides = maxSides || 25;
                        var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
                        if (sides % 2 === 1)
                            sides += 1;
                        return Bodies.polygon(x, y, sides, radius, Common.extend({}, circle, options));
                    };
                    Bodies.polygon = function (x, y, sides, radius, options) {
                        options = options || {};
                        if (sides < 3)
                            return Bodies.circle(x, y, radius, options);
                        var theta = 2 * Math.PI / sides, path = '', offset = theta * 0.5;
                        for (var i = 0; i < sides; i += 1) {
                            var angle = offset + (i * theta), xx = Math.cos(angle) * radius, yy = Math.sin(angle) * radius;
                            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
                        }
                        var polygon = {
                            label: 'Polygon Body',
                            position: { x: x, y: y },
                            vertices: Vertices.fromPath(path)
                        };
                        if (options.chamfer) {
                            var chamfer = options.chamfer;
                            polygon.vertices = Vertices.chamfer(polygon.vertices, chamfer.radius, chamfer.quality, chamfer.qualityMin, chamfer.qualityMax);
                            delete options.chamfer;
                        }
                        return Body.create(Common.extend({}, polygon, options));
                    };
                    Bodies.fromVertices = function (x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea) {
                        var body, parts, isConvex, vertices, i, j, k, v, z;
                        options = options || {};
                        parts = [];
                        flagInternal = typeof flagInternal !== 'undefined' ? flagInternal : false;
                        removeCollinear = typeof removeCollinear !== 'undefined' ? removeCollinear : 0.01;
                        minimumArea = typeof minimumArea !== 'undefined' ? minimumArea : 10;
                        if (!window.decomp) {
                            Common.log('Bodies.fromVertices: poly-decomp.js required. Could not decompose vertices. Fallback to convex hull.', 'warn');
                        }
                        if (!Common.isArray(vertexSets[0])) {
                            vertexSets = [vertexSets];
                        }
                        for (v = 0; v < vertexSets.length; v += 1) {
                            vertices = vertexSets[v];
                            isConvex = Vertices.isConvex(vertices);
                            if (isConvex || !window.decomp) {
                                if (isConvex) {
                                    vertices = Vertices.clockwiseSort(vertices);
                                }
                                else {
                                    vertices = Vertices.hull(vertices);
                                }
                                parts.push({
                                    position: { x: x, y: y },
                                    vertices: vertices
                                });
                            }
                            else {
                                var concave = new decomp.Polygon();
                                for (i = 0; i < vertices.length; i++) {
                                    concave.vertices.push([vertices[i].x, vertices[i].y]);
                                }
                                concave.makeCCW();
                                if (removeCollinear !== false)
                                    concave.removeCollinearPoints(removeCollinear);
                                var decomposed = concave.quickDecomp();
                                for (i = 0; i < decomposed.length; i++) {
                                    var chunk = decomposed[i], chunkVertices = [];
                                    for (j = 0; j < chunk.vertices.length; j++) {
                                        chunkVertices.push({ x: chunk.vertices[j][0], y: chunk.vertices[j][1] });
                                    }
                                    if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea)
                                        continue;
                                    parts.push({
                                        position: Vertices.centre(chunkVertices),
                                        vertices: chunkVertices
                                    });
                                }
                            }
                        }
                        for (i = 0; i < parts.length; i++) {
                            parts[i] = Body.create(Common.extend(parts[i], options));
                        }
                        if (flagInternal) {
                            var coincident_max_dist = 5;
                            for (i = 0; i < parts.length; i++) {
                                var partA = parts[i];
                                for (j = i + 1; j < parts.length; j++) {
                                    var partB = parts[j];
                                    if (Bounds.overlaps(partA.bounds, partB.bounds)) {
                                        var pav = partA.vertices, pbv = partB.vertices;
                                        for (k = 0; k < partA.vertices.length; k++) {
                                            for (z = 0; z < partB.vertices.length; z++) {
                                                var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])), db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));
                                                if (da < coincident_max_dist && db < coincident_max_dist) {
                                                    pav[k].isInternal = true;
                                                    pbv[z].isInternal = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (parts.length > 1) {
                            body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
                            Body.setPosition(body, { x: x, y: y });
                            return body;
                        }
                        else {
                            return parts[0];
                        }
                    };
                })();
            }, { "../body/Body": 1, "../core/Common": 14, "../geometry/Bounds": 24, "../geometry/Vector": 26, "../geometry/Vertices": 27 }], 22: [function (require, module, exports) {
                var Composites = {};
                module.exports = Composites;
                var Composite = require('../body/Composite');
                var Constraint = require('../constraint/Constraint');
                var Common = require('../core/Common');
                var Body = require('../body/Body');
                var Bodies = require('./Bodies');
                (function () {
                    Composites.stack = function (xx, yy, columns, rows, columnGap, rowGap, callback) {
                        var stack = Composite.create({ label: 'Stack' }), x = xx, y = yy, lastBody, i = 0;
                        for (var row = 0; row < rows; row++) {
                            var maxHeight = 0;
                            for (var column = 0; column < columns; column++) {
                                var body = callback(x, y, column, row, lastBody, i);
                                if (body) {
                                    var bodyHeight = body.bounds.max.y - body.bounds.min.y, bodyWidth = body.bounds.max.x - body.bounds.min.x;
                                    if (bodyHeight > maxHeight)
                                        maxHeight = bodyHeight;
                                    Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
                                    x = body.bounds.max.x + columnGap;
                                    Composite.addBody(stack, body);
                                    lastBody = body;
                                    i += 1;
                                }
                                else {
                                    x += columnGap;
                                }
                            }
                            y += maxHeight + rowGap;
                            x = xx;
                        }
                        return stack;
                    };
                    Composites.chain = function (composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
                        var bodies = composite.bodies;
                        for (var i = 1; i < bodies.length; i++) {
                            var bodyA = bodies[i - 1], bodyB = bodies[i], bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y, bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y, bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
                            var defaults = {
                                bodyA: bodyA,
                                pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
                                bodyB: bodyB,
                                pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
                            };
                            var constraint = Common.extend(defaults, options);
                            Composite.addConstraint(composite, Constraint.create(constraint));
                        }
                        composite.label += ' Chain';
                        return composite;
                    };
                    Composites.mesh = function (composite, columns, rows, crossBrace, options) {
                        var bodies = composite.bodies, row, col, bodyA, bodyB, bodyC;
                        for (row = 0; row < rows; row++) {
                            for (col = 1; col < columns; col++) {
                                bodyA = bodies[(col - 1) + (row * columns)];
                                bodyB = bodies[col + (row * columns)];
                                Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
                            }
                            if (row > 0) {
                                for (col = 0; col < columns; col++) {
                                    bodyA = bodies[col + ((row - 1) * columns)];
                                    bodyB = bodies[col + (row * columns)];
                                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyA, bodyB: bodyB }, options)));
                                    if (crossBrace && col > 0) {
                                        bodyC = bodies[(col - 1) + ((row - 1) * columns)];
                                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                                    }
                                    if (crossBrace && col < columns - 1) {
                                        bodyC = bodies[(col + 1) + ((row - 1) * columns)];
                                        Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB: bodyB }, options)));
                                    }
                                }
                            }
                        }
                        composite.label += ' Mesh';
                        return composite;
                    };
                    Composites.pyramid = function (xx, yy, columns, rows, columnGap, rowGap, callback) {
                        return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y, column, row, lastBody, i) {
                            var actualRows = Math.min(rows, Math.ceil(columns / 2)), lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
                            if (row > actualRows)
                                return;
                            row = actualRows - row;
                            var start = row, end = columns - 1 - row;
                            if (column < start || column > end)
                                return;
                            if (i === 1) {
                                Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
                            }
                            var xOffset = lastBody ? column * lastBodyWidth : 0;
                            return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
                        });
                    };
                    Composites.newtonsCradle = function (xx, yy, number, size, length) {
                        var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });
                        for (var i = 0; i < number; i++) {
                            var separation = 1.9, circle = Bodies.circle(xx + i * (size * separation), yy + length, size, { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0.0001, slop: 1 }), constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });
                            Composite.addBody(newtonsCradle, circle);
                            Composite.addConstraint(newtonsCradle, constraint);
                        }
                        return newtonsCradle;
                    };
                    Composites.car = function (xx, yy, width, height, wheelSize) {
                        var group = Body.nextGroup(true), wheelBase = -20, wheelAOffset = -width * 0.5 + wheelBase, wheelBOffset = width * 0.5 - wheelBase, wheelYOffset = 0;
                        var car = Composite.create({ label: 'Car' }), body = Bodies.trapezoid(xx, yy, width, height, 0.3, {
                            collisionFilter: {
                                group: group
                            },
                            friction: 0.01,
                            chamfer: {
                                radius: 10
                            }
                        });
                        var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
                            collisionFilter: {
                                group: group
                            },
                            friction: 0.8,
                            density: 0.01
                        });
                        var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
                            collisionFilter: {
                                group: group
                            },
                            friction: 0.8,
                            density: 0.01
                        });
                        var axelA = Constraint.create({
                            bodyA: body,
                            pointA: { x: wheelAOffset, y: wheelYOffset },
                            bodyB: wheelA,
                            stiffness: 0.2
                        });
                        var axelB = Constraint.create({
                            bodyA: body,
                            pointA: { x: wheelBOffset, y: wheelYOffset },
                            bodyB: wheelB,
                            stiffness: 0.2
                        });
                        Composite.addBody(car, body);
                        Composite.addBody(car, wheelA);
                        Composite.addBody(car, wheelB);
                        Composite.addConstraint(car, axelA);
                        Composite.addConstraint(car, axelB);
                        return car;
                    };
                    Composites.softBody = function (xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
                        particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
                        constraintOptions = Common.extend({ stiffness: 0.4 }, constraintOptions);
                        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
                            return Bodies.circle(x, y, particleRadius, particleOptions);
                        });
                        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
                        softBody.label = 'Soft Body';
                        return softBody;
                    };
                })();
            }, { "../body/Body": 1, "../body/Composite": 2, "../constraint/Constraint": 12, "../core/Common": 14, "./Bodies": 21 }], 23: [function (require, module, exports) {
                var Axes = {};
                module.exports = Axes;
                var Vector = require('../geometry/Vector');
                var Common = require('../core/Common');
                (function () {
                    Axes.fromVertices = function (vertices) {
                        var axes = {};
                        for (var i = 0; i < vertices.length; i++) {
                            var j = (i + 1) % vertices.length, normal = Vector.normalise({
                                x: vertices[j].y - vertices[i].y,
                                y: vertices[i].x - vertices[j].x
                            }), gradient = (normal.y === 0) ? Infinity : (normal.x / normal.y);
                            gradient = gradient.toFixed(3).toString();
                            axes[gradient] = normal;
                        }
                        return Common.values(axes);
                    };
                    Axes.rotate = function (axes, angle) {
                        if (angle === 0)
                            return;
                        var cos = Math.cos(angle), sin = Math.sin(angle);
                        for (var i = 0; i < axes.length; i++) {
                            var axis = axes[i], xx;
                            xx = axis.x * cos - axis.y * sin;
                            axis.y = axis.x * sin + axis.y * cos;
                            axis.x = xx;
                        }
                    };
                })();
            }, { "../core/Common": 14, "../geometry/Vector": 26 }], 24: [function (require, module, exports) {
                var Bounds = {};
                module.exports = Bounds;
                (function () {
                    Bounds.create = function (vertices) {
                        var bounds = {
                            min: { x: 0, y: 0 },
                            max: { x: 0, y: 0 }
                        };
                        if (vertices)
                            Bounds.update(bounds, vertices);
                        return bounds;
                    };
                    Bounds.update = function (bounds, vertices, velocity) {
                        bounds.min.x = Infinity;
                        bounds.max.x = -Infinity;
                        bounds.min.y = Infinity;
                        bounds.max.y = -Infinity;
                        for (var i = 0; i < vertices.length; i++) {
                            var vertex = vertices[i];
                            if (vertex.x > bounds.max.x)
                                bounds.max.x = vertex.x;
                            if (vertex.x < bounds.min.x)
                                bounds.min.x = vertex.x;
                            if (vertex.y > bounds.max.y)
                                bounds.max.y = vertex.y;
                            if (vertex.y < bounds.min.y)
                                bounds.min.y = vertex.y;
                        }
                        if (velocity) {
                            if (velocity.x > 0) {
                                bounds.max.x += velocity.x;
                            }
                            else {
                                bounds.min.x += velocity.x;
                            }
                            if (velocity.y > 0) {
                                bounds.max.y += velocity.y;
                            }
                            else {
                                bounds.min.y += velocity.y;
                            }
                        }
                    };
                    Bounds.contains = function (bounds, point) {
                        return point.x >= bounds.min.x && point.x <= bounds.max.x
                            && point.y >= bounds.min.y && point.y <= bounds.max.y;
                    };
                    Bounds.overlaps = function (boundsA, boundsB) {
                        return (boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x
                            && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y);
                    };
                    Bounds.translate = function (bounds, vector) {
                        bounds.min.x += vector.x;
                        bounds.max.x += vector.x;
                        bounds.min.y += vector.y;
                        bounds.max.y += vector.y;
                    };
                    Bounds.shift = function (bounds, position) {
                        var deltaX = bounds.max.x - bounds.min.x, deltaY = bounds.max.y - bounds.min.y;
                        bounds.min.x = position.x;
                        bounds.max.x = position.x + deltaX;
                        bounds.min.y = position.y;
                        bounds.max.y = position.y + deltaY;
                    };
                })();
            }, {}], 25: [function (require, module, exports) {
                var Svg = {};
                module.exports = Svg;
                var Bounds = require('../geometry/Bounds');
                (function () {
                    Svg.pathToVertices = function (path, sampleLength) {
                        var i, il, total, point, segment, segments, segmentsQueue, lastSegment, lastPoint, segmentIndex, points = [], lx, ly, length = 0, x = 0, y = 0;
                        sampleLength = sampleLength || 15;
                        var addPoint = function (px, py, pathSegType) {
                            var isRelative = pathSegType % 2 === 1 && pathSegType > 1;
                            if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
                                if (lastPoint && isRelative) {
                                    lx = lastPoint.x;
                                    ly = lastPoint.y;
                                }
                                else {
                                    lx = 0;
                                    ly = 0;
                                }
                                var point = {
                                    x: lx + px,
                                    y: ly + py
                                };
                                if (isRelative || !lastPoint) {
                                    lastPoint = point;
                                }
                                points.push(point);
                                x = lx + px;
                                y = ly + py;
                            }
                        };
                        var addSegmentPoint = function (segment) {
                            var segType = segment.pathSegTypeAsLetter.toUpperCase();
                            if (segType === 'Z')
                                return;
                            switch (segType) {
                                case 'M':
                                case 'L':
                                case 'T':
                                case 'C':
                                case 'S':
                                case 'Q':
                                    x = segment.x;
                                    y = segment.y;
                                    break;
                                case 'H':
                                    x = segment.x;
                                    break;
                                case 'V':
                                    y = segment.y;
                                    break;
                            }
                            addPoint(x, y, segment.pathSegType);
                        };
                        _svgPathToAbsolute(path);
                        total = path.getTotalLength();
                        segments = [];
                        for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
                            segments.push(path.pathSegList.getItem(i));
                        segmentsQueue = segments.concat();
                        while (length < total) {
                            segmentIndex = path.getPathSegAtLength(length);
                            segment = segments[segmentIndex];
                            if (segment != lastSegment) {
                                while (segmentsQueue.length && segmentsQueue[0] != segment)
                                    addSegmentPoint(segmentsQueue.shift());
                                lastSegment = segment;
                            }
                            switch (segment.pathSegTypeAsLetter.toUpperCase()) {
                                case 'C':
                                case 'T':
                                case 'S':
                                case 'Q':
                                case 'A':
                                    point = path.getPointAtLength(length);
                                    addPoint(point.x, point.y, 0);
                                    break;
                            }
                            length += sampleLength;
                        }
                        for (i = 0, il = segmentsQueue.length; i < il; ++i)
                            addSegmentPoint(segmentsQueue[i]);
                        return points;
                    };
                    var _svgPathToAbsolute = function (path) {
                        var x0, y0, x1, y1, x2, y2, segs = path.pathSegList, x = 0, y = 0, len = segs.numberOfItems;
                        for (var i = 0; i < len; ++i) {
                            var seg = segs.getItem(i), segType = seg.pathSegTypeAsLetter;
                            if (/[MLHVCSQTA]/.test(segType)) {
                                if ('x' in seg)
                                    x = seg.x;
                                if ('y' in seg)
                                    y = seg.y;
                            }
                            else {
                                if ('x1' in seg)
                                    x1 = x + seg.x1;
                                if ('x2' in seg)
                                    x2 = x + seg.x2;
                                if ('y1' in seg)
                                    y1 = y + seg.y1;
                                if ('y2' in seg)
                                    y2 = y + seg.y2;
                                if ('x' in seg)
                                    x += seg.x;
                                if ('y' in seg)
                                    y += seg.y;
                                switch (segType) {
                                    case 'm':
                                        segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                                        break;
                                    case 'l':
                                        segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                                        break;
                                    case 'h':
                                        segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                                        break;
                                    case 'v':
                                        segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                                        break;
                                    case 'c':
                                        segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                                        break;
                                    case 's':
                                        segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                                        break;
                                    case 'q':
                                        segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                                        break;
                                    case 't':
                                        segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                                        break;
                                    case 'a':
                                        segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                                        break;
                                    case 'z':
                                    case 'Z':
                                        x = x0;
                                        y = y0;
                                        break;
                                }
                            }
                            if (segType == 'M' || segType == 'm') {
                                x0 = x;
                                y0 = y;
                            }
                        }
                    };
                })();
            }, { "../geometry/Bounds": 24 }], 26: [function (require, module, exports) {
                var Vector = {};
                module.exports = Vector;
                (function () {
                    Vector.create = function (x, y) {
                        return { x: x || 0, y: y || 0 };
                    };
                    Vector.clone = function (vector) {
                        return { x: vector.x, y: vector.y };
                    };
                    Vector.magnitude = function (vector) {
                        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
                    };
                    Vector.magnitudeSquared = function (vector) {
                        return (vector.x * vector.x) + (vector.y * vector.y);
                    };
                    Vector.rotate = function (vector, angle) {
                        var cos = Math.cos(angle), sin = Math.sin(angle);
                        return {
                            x: vector.x * cos - vector.y * sin,
                            y: vector.x * sin + vector.y * cos
                        };
                    };
                    Vector.rotateAbout = function (vector, angle, point, output) {
                        var cos = Math.cos(angle), sin = Math.sin(angle);
                        if (!output)
                            output = {};
                        var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
                        output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
                        output.x = x;
                        return output;
                    };
                    Vector.normalise = function (vector) {
                        var magnitude = Vector.magnitude(vector);
                        if (magnitude === 0)
                            return { x: 0, y: 0 };
                        return { x: vector.x / magnitude, y: vector.y / magnitude };
                    };
                    Vector.dot = function (vectorA, vectorB) {
                        return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
                    };
                    Vector.cross = function (vectorA, vectorB) {
                        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
                    };
                    Vector.cross3 = function (vectorA, vectorB, vectorC) {
                        return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
                    };
                    Vector.add = function (vectorA, vectorB, output) {
                        if (!output)
                            output = {};
                        output.x = vectorA.x + vectorB.x;
                        output.y = vectorA.y + vectorB.y;
                        return output;
                    };
                    Vector.sub = function (vectorA, vectorB, output) {
                        if (!output)
                            output = {};
                        output.x = vectorA.x - vectorB.x;
                        output.y = vectorA.y - vectorB.y;
                        return output;
                    };
                    Vector.mult = function (vector, scalar) {
                        return { x: vector.x * scalar, y: vector.y * scalar };
                    };
                    Vector.div = function (vector, scalar) {
                        return { x: vector.x / scalar, y: vector.y / scalar };
                    };
                    Vector.perp = function (vector, negate) {
                        negate = negate === true ? -1 : 1;
                        return { x: negate * -vector.y, y: negate * vector.x };
                    };
                    Vector.neg = function (vector) {
                        return { x: -vector.x, y: -vector.y };
                    };
                    Vector.angle = function (vectorA, vectorB) {
                        return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
                    };
                    Vector._temp = [Vector.create(), Vector.create(),
                        Vector.create(), Vector.create(),
                        Vector.create(), Vector.create()];
                })();
            }, {}], 27: [function (require, module, exports) {
                var Vertices = {};
                module.exports = Vertices;
                var Vector = require('../geometry/Vector');
                var Common = require('../core/Common');
                (function () {
                    Vertices.create = function (points, body) {
                        var vertices = [];
                        for (var i = 0; i < points.length; i++) {
                            var point = points[i], vertex = {
                                x: point.x,
                                y: point.y,
                                index: i,
                                body: body,
                                isInternal: false
                            };
                            vertices.push(vertex);
                        }
                        return vertices;
                    };
                    Vertices.fromPath = function (path, body) {
                        var pathPattern = /L?\s*([\-\d\.e]+)[\s,]*([\-\d\.e]+)*/ig, points = [];
                        path.replace(pathPattern, function (match, x, y) {
                            points.push({ x: parseFloat(x), y: parseFloat(y) });
                        });
                        return Vertices.create(points, body);
                    };
                    Vertices.centre = function (vertices) {
                        var area = Vertices.area(vertices, true), centre = { x: 0, y: 0 }, cross, temp, j;
                        for (var i = 0; i < vertices.length; i++) {
                            j = (i + 1) % vertices.length;
                            cross = Vector.cross(vertices[i], vertices[j]);
                            temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
                            centre = Vector.add(centre, temp);
                        }
                        return Vector.div(centre, 6 * area);
                    };
                    Vertices.mean = function (vertices) {
                        var average = { x: 0, y: 0 };
                        for (var i = 0; i < vertices.length; i++) {
                            average.x += vertices[i].x;
                            average.y += vertices[i].y;
                        }
                        return Vector.div(average, vertices.length);
                    };
                    Vertices.area = function (vertices, signed) {
                        var area = 0, j = vertices.length - 1;
                        for (var i = 0; i < vertices.length; i++) {
                            area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
                            j = i;
                        }
                        if (signed)
                            return area / 2;
                        return Math.abs(area) / 2;
                    };
                    Vertices.inertia = function (vertices, mass) {
                        var numerator = 0, denominator = 0, v = vertices, cross, j;
                        for (var n = 0; n < v.length; n++) {
                            j = (n + 1) % v.length;
                            cross = Math.abs(Vector.cross(v[j], v[n]));
                            numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
                            denominator += cross;
                        }
                        return (mass / 6) * (numerator / denominator);
                    };
                    Vertices.translate = function (vertices, vector, scalar) {
                        var i;
                        if (scalar) {
                            for (i = 0; i < vertices.length; i++) {
                                vertices[i].x += vector.x * scalar;
                                vertices[i].y += vector.y * scalar;
                            }
                        }
                        else {
                            for (i = 0; i < vertices.length; i++) {
                                vertices[i].x += vector.x;
                                vertices[i].y += vector.y;
                            }
                        }
                        return vertices;
                    };
                    Vertices.rotate = function (vertices, angle, point) {
                        if (angle === 0)
                            return;
                        var cos = Math.cos(angle), sin = Math.sin(angle);
                        for (var i = 0; i < vertices.length; i++) {
                            var vertice = vertices[i], dx = vertice.x - point.x, dy = vertice.y - point.y;
                            vertice.x = point.x + (dx * cos - dy * sin);
                            vertice.y = point.y + (dx * sin + dy * cos);
                        }
                        return vertices;
                    };
                    Vertices.contains = function (vertices, point) {
                        for (var i = 0; i < vertices.length; i++) {
                            var vertice = vertices[i], nextVertice = vertices[(i + 1) % vertices.length];
                            if ((point.x - vertice.x) * (nextVertice.y - vertice.y) + (point.y - vertice.y) * (vertice.x - nextVertice.x) > 0) {
                                return false;
                            }
                        }
                        return true;
                    };
                    Vertices.scale = function (vertices, scaleX, scaleY, point) {
                        if (scaleX === 1 && scaleY === 1)
                            return vertices;
                        point = point || Vertices.centre(vertices);
                        var vertex, delta;
                        for (var i = 0; i < vertices.length; i++) {
                            vertex = vertices[i];
                            delta = Vector.sub(vertex, point);
                            vertices[i].x = point.x + delta.x * scaleX;
                            vertices[i].y = point.y + delta.y * scaleY;
                        }
                        return vertices;
                    };
                    Vertices.chamfer = function (vertices, radius, quality, qualityMin, qualityMax) {
                        radius = radius || [8];
                        if (!radius.length)
                            radius = [radius];
                        quality = (typeof quality !== 'undefined') ? quality : -1;
                        qualityMin = qualityMin || 2;
                        qualityMax = qualityMax || 14;
                        var newVertices = [];
                        for (var i = 0; i < vertices.length; i++) {
                            var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1], vertex = vertices[i], nextVertex = vertices[(i + 1) % vertices.length], currentRadius = radius[i < radius.length ? i : radius.length - 1];
                            if (currentRadius === 0) {
                                newVertices.push(vertex);
                                continue;
                            }
                            var prevNormal = Vector.normalise({
                                x: vertex.y - prevVertex.y,
                                y: prevVertex.x - vertex.x
                            });
                            var nextNormal = Vector.normalise({
                                x: nextVertex.y - vertex.y,
                                y: vertex.x - nextVertex.x
                            });
                            var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)), radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius), midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)), scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
                            var precision = quality;
                            if (quality === -1) {
                                precision = Math.pow(currentRadius, 0.32) * 1.75;
                            }
                            precision = Common.clamp(precision, qualityMin, qualityMax);
                            if (precision % 2 === 1)
                                precision += 1;
                            var alpha = Math.acos(Vector.dot(prevNormal, nextNormal)), theta = alpha / precision;
                            for (var j = 0; j < precision; j++) {
                                newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
                            }
                        }
                        return newVertices;
                    };
                    Vertices.clockwiseSort = function (vertices) {
                        var centre = Vertices.mean(vertices);
                        vertices.sort(function (vertexA, vertexB) {
                            return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
                        });
                        return vertices;
                    };
                    Vertices.isConvex = function (vertices) {
                        var flag = 0, n = vertices.length, i, j, k, z;
                        if (n < 3)
                            return null;
                        for (i = 0; i < n; i++) {
                            j = (i + 1) % n;
                            k = (i + 2) % n;
                            z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
                            z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
                            if (z < 0) {
                                flag |= 1;
                            }
                            else if (z > 0) {
                                flag |= 2;
                            }
                            if (flag === 3) {
                                return false;
                            }
                        }
                        if (flag !== 0) {
                            return true;
                        }
                        else {
                            return null;
                        }
                    };
                    Vertices.hull = function (vertices) {
                        var upper = [], lower = [], vertex, i;
                        vertices = vertices.slice(0);
                        vertices.sort(function (vertexA, vertexB) {
                            var dx = vertexA.x - vertexB.x;
                            return dx !== 0 ? dx : vertexA.y - vertexB.y;
                        });
                        for (i = 0; i < vertices.length; i++) {
                            vertex = vertices[i];
                            while (lower.length >= 2
                                && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
                                lower.pop();
                            }
                            lower.push(vertex);
                        }
                        for (i = vertices.length - 1; i >= 0; i--) {
                            vertex = vertices[i];
                            while (upper.length >= 2
                                && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
                                upper.pop();
                            }
                            upper.push(vertex);
                        }
                        upper.pop();
                        lower.pop();
                        return upper.concat(lower);
                    };
                })();
            }, { "../core/Common": 14, "../geometry/Vector": 26 }], 28: [function (require, module, exports) {
                var Matter = module.exports = {};
                Matter.version = 'master';
                Matter.Body = require('../body/Body');
                Matter.Composite = require('../body/Composite');
                Matter.World = require('../body/World');
                Matter.Contact = require('../collision/Contact');
                Matter.Detector = require('../collision/Detector');
                Matter.Grid = require('../collision/Grid');
                Matter.Pairs = require('../collision/Pairs');
                Matter.Pair = require('../collision/Pair');
                Matter.Query = require('../collision/Query');
                Matter.Resolver = require('../collision/Resolver');
                Matter.SAT = require('../collision/SAT');
                Matter.Constraint = require('../constraint/Constraint');
                Matter.MouseConstraint = require('../constraint/MouseConstraint');
                Matter.Common = require('../core/Common');
                Matter.Engine = require('../core/Engine');
                Matter.Events = require('../core/Events');
                Matter.Mouse = require('../core/Mouse');
                Matter.Runner = require('../core/Runner');
                Matter.Sleeping = require('../core/Sleeping');
                Matter.Bodies = require('../factory/Bodies');
                Matter.Composites = require('../factory/Composites');
                Matter.Axes = require('../geometry/Axes');
                Matter.Bounds = require('../geometry/Bounds');
                Matter.Svg = require('../geometry/Svg');
                Matter.Vector = require('../geometry/Vector');
                Matter.Vertices = require('../geometry/Vertices');
                Matter.Render = require('../render/Render');
                Matter.RenderPixi = require('../render/RenderPixi');
                Matter.World.add = Matter.Composite.add;
                Matter.World.remove = Matter.Composite.remove;
                Matter.World.addComposite = Matter.Composite.addComposite;
                Matter.World.addBody = Matter.Composite.addBody;
                Matter.World.addConstraint = Matter.Composite.addConstraint;
                Matter.World.clear = Matter.Composite.clear;
                Matter.Engine.run = Matter.Runner.run;
            }, { "../body/Body": 1, "../body/Composite": 2, "../body/World": 3, "../collision/Contact": 4, "../collision/Detector": 5, "../collision/Grid": 6, "../collision/Pair": 7, "../collision/Pairs": 8, "../collision/Query": 9, "../collision/Resolver": 10, "../collision/SAT": 11, "../constraint/Constraint": 12, "../constraint/MouseConstraint": 13, "../core/Common": 14, "../core/Engine": 15, "../core/Events": 16, "../core/Metrics": 17, "../core/Mouse": 18, "../core/Runner": 19, "../core/Sleeping": 20, "../factory/Bodies": 21, "../factory/Composites": 22, "../geometry/Axes": 23, "../geometry/Bounds": 24, "../geometry/Svg": 25, "../geometry/Vector": 26, "../geometry/Vertices": 27, "../render/Render": 29, "../render/RenderPixi": 30 }], 29: [function (require, module, exports) {
                var Render = {};
                module.exports = Render;
                var Common = require('../core/Common');
                var Composite = require('../body/Composite');
                var Bounds = require('../geometry/Bounds');
                var Events = require('../core/Events');
                var Grid = require('../collision/Grid');
                var Vector = require('../geometry/Vector');
                (function () {
                    var _requestAnimationFrame, _cancelAnimationFrame;
                    if (typeof window !== 'undefined') {
                        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                            || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
                            || function (callback) { window.setTimeout(function () { callback(Common.now()); }, 1000 / 60); };
                        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
                            || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
                    }
                    Render.create = function (options) {
                        var defaults = {
                            controller: Render,
                            engine: null,
                            element: null,
                            canvas: null,
                            mouse: null,
                            frameRequestId: null,
                            options: {
                                width: 800,
                                height: 600,
                                pixelRatio: 1,
                                background: '#fafafa',
                                wireframeBackground: '#222',
                                hasBounds: !!options.bounds,
                                enabled: true,
                                wireframes: true,
                                showSleeping: true,
                                showDebug: false,
                                showBroadphase: false,
                                showBounds: false,
                                showVelocity: false,
                                showCollisions: false,
                                showSeparations: false,
                                showAxes: false,
                                showPositions: false,
                                showAngleIndicator: false,
                                showIds: false,
                                showShadows: false,
                                showVertexNumbers: false,
                                showConvexHulls: false,
                                showInternalEdges: false,
                                showMousePosition: false
                            }
                        };
                        var render = Common.extend(defaults, options);
                        if (render.canvas) {
                            render.canvas.width = render.options.width || render.canvas.width;
                            render.canvas.height = render.options.height || render.canvas.height;
                        }
                        render.mouse = options.mouse;
                        render.engine = options.engine;
                        render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
                        render.context = render.canvas.getContext('2d');
                        render.textures = {};
                        render.bounds = render.bounds || {
                            min: {
                                x: 0,
                                y: 0
                            },
                            max: {
                                x: render.canvas.width,
                                y: render.canvas.height
                            }
                        };
                        if (render.options.pixelRatio !== 1) {
                            Render.setPixelRatio(render, render.options.pixelRatio);
                        }
                        if (Common.isElement(render.element)) {
                            render.element.appendChild(render.canvas);
                        }
                        else {
                            Common.log('Render.create: options.element was undefined, render.canvas was created but not appended', 'warn');
                        }
                        return render;
                    };
                    Render.run = function (render) {
                        (function loop(time) {
                            render.frameRequestId = _requestAnimationFrame(loop);
                            Render.world(render);
                        })();
                    };
                    Render.stop = function (render) {
                        _cancelAnimationFrame(render.frameRequestId);
                    };
                    Render.setPixelRatio = function (render, pixelRatio) {
                        var options = render.options, canvas = render.canvas;
                        if (pixelRatio === 'auto') {
                            pixelRatio = _getPixelRatio(canvas);
                        }
                        options.pixelRatio = pixelRatio;
                        canvas.setAttribute('data-pixel-ratio', pixelRatio);
                        canvas.width = options.width * pixelRatio;
                        canvas.height = options.height * pixelRatio;
                        canvas.style.width = options.width + 'px';
                        canvas.style.height = options.height + 'px';
                        render.context.scale(pixelRatio, pixelRatio);
                    };
                    Render.world = function (render) {
                        var engine = render.engine, world = engine.world, canvas = render.canvas, context = render.context, options = render.options, allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world), background = options.wireframes ? options.wireframeBackground : options.background, bodies = [], constraints = [], i;
                        var event = {
                            timestamp: engine.timing.timestamp
                        };
                        Events.trigger(render, 'beforeRender', event);
                        if (render.currentBackground !== background)
                            _applyBackground(render, background);
                        context.globalCompositeOperation = 'source-in';
                        context.fillStyle = "transparent";
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        context.globalCompositeOperation = 'source-over';
                        if (options.hasBounds) {
                            var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / options.width, boundsScaleY = boundsHeight / options.height;
                            for (i = 0; i < allBodies.length; i++) {
                                var body = allBodies[i];
                                if (Bounds.overlaps(body.bounds, render.bounds))
                                    bodies.push(body);
                            }
                            for (i = 0; i < allConstraints.length; i++) {
                                var constraint = allConstraints[i], bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointAWorld = constraint.pointA, pointBWorld = constraint.pointB;
                                if (bodyA)
                                    pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                                if (bodyB)
                                    pointBWorld = Vector.add(bodyB.position, constraint.pointB);
                                if (!pointAWorld || !pointBWorld)
                                    continue;
                                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                                    constraints.push(constraint);
                            }
                            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
                            context.translate(-render.bounds.min.x, -render.bounds.min.y);
                        }
                        else {
                            constraints = allConstraints;
                            bodies = allBodies;
                        }
                        if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
                            Render.bodies(render, bodies, context);
                        }
                        else {
                            if (options.showConvexHulls)
                                Render.bodyConvexHulls(render, bodies, context);
                            Render.bodyWireframes(render, bodies, context);
                        }
                        if (options.showBounds)
                            Render.bodyBounds(render, bodies, context);
                        if (options.showAxes || options.showAngleIndicator)
                            Render.bodyAxes(render, bodies, context);
                        if (options.showPositions)
                            Render.bodyPositions(render, bodies, context);
                        if (options.showVelocity)
                            Render.bodyVelocity(render, bodies, context);
                        if (options.showIds)
                            Render.bodyIds(render, bodies, context);
                        if (options.showSeparations)
                            Render.separations(render, engine.pairs.list, context);
                        if (options.showCollisions)
                            Render.collisions(render, engine.pairs.list, context);
                        if (options.showVertexNumbers)
                            Render.vertexNumbers(render, bodies, context);
                        if (options.showMousePosition)
                            Render.mousePosition(render, render.mouse, context);
                        Render.constraints(constraints, context);
                        if (options.showBroadphase && engine.broadphase.controller === Grid)
                            Render.grid(render, engine.broadphase, context);
                        if (options.showDebug)
                            Render.debug(render, context);
                        if (options.hasBounds) {
                            context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
                        }
                        Events.trigger(render, 'afterRender', event);
                    };
                    Render.debug = function (render, context) {
                        var c = context, engine = render.engine, world = engine.world, metrics = engine.metrics, options = render.options, bodies = Composite.allBodies(world), space = "    ";
                        if (engine.timing.timestamp - (render.debugTimestamp || 0) >= 500) {
                            var text = "";
                            if (metrics.timing) {
                                text += "fps: " + Math.round(metrics.timing.fps) + space;
                            }
                            render.debugString = text;
                            render.debugTimestamp = engine.timing.timestamp;
                        }
                        if (render.debugString) {
                            c.font = "12px Arial";
                            if (options.wireframes) {
                                c.fillStyle = 'rgba(255,255,255,0.5)';
                            }
                            else {
                                c.fillStyle = 'rgba(0,0,0,0.5)';
                            }
                            var split = render.debugString.split('\n');
                            for (var i = 0; i < split.length; i++) {
                                c.fillText(split[i], 50, 50 + i * 18);
                            }
                        }
                    };
                    Render.constraints = function (constraints, context) {
                        var c = context;
                        for (var i = 0; i < constraints.length; i++) {
                            var constraint = constraints[i];
                            if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                                continue;
                            var bodyA = constraint.bodyA, bodyB = constraint.bodyB;
                            if (bodyA) {
                                c.beginPath();
                                c.moveTo(bodyA.position.x + constraint.pointA.x, bodyA.position.y + constraint.pointA.y);
                            }
                            else {
                                c.beginPath();
                                c.moveTo(constraint.pointA.x, constraint.pointA.y);
                            }
                            if (bodyB) {
                                c.lineTo(bodyB.position.x + constraint.pointB.x, bodyB.position.y + constraint.pointB.y);
                            }
                            else {
                                c.lineTo(constraint.pointB.x, constraint.pointB.y);
                            }
                            c.lineWidth = constraint.render.lineWidth;
                            c.strokeStyle = constraint.render.strokeStyle;
                            c.stroke();
                        }
                    };
                    Render.bodyShadows = function (render, bodies, context) {
                        var c = context, engine = render.engine;
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (!body.render.visible)
                                continue;
                            if (body.circleRadius) {
                                c.beginPath();
                                c.arc(body.position.x, body.position.y, body.circleRadius, 0, 2 * Math.PI);
                                c.closePath();
                            }
                            else {
                                c.beginPath();
                                c.moveTo(body.vertices[0].x, body.vertices[0].y);
                                for (var j = 1; j < body.vertices.length; j++) {
                                    c.lineTo(body.vertices[j].x, body.vertices[j].y);
                                }
                                c.closePath();
                            }
                            var distanceX = body.position.x - render.options.width * 0.5, distanceY = body.position.y - render.options.height * 0.2, distance = Math.abs(distanceX) + Math.abs(distanceY);
                            c.shadowColor = 'rgba(0,0,0,0.15)';
                            c.shadowOffsetX = 0.05 * distanceX;
                            c.shadowOffsetY = 0.05 * distanceY;
                            c.shadowBlur = 1 + 12 * Math.min(1, distance / 1000);
                            c.fill();
                            c.shadowColor = null;
                            c.shadowOffsetX = null;
                            c.shadowOffsetY = null;
                            c.shadowBlur = null;
                        }
                    };
                    Render.bodies = function (render, bodies, context) {
                        var c = context, engine = render.engine, options = render.options, showInternalEdges = options.showInternalEdges || !options.wireframes, body, part, i, k;
                        for (i = 0; i < bodies.length; i++) {
                            body = bodies[i];
                            if (!body.render.visible)
                                continue;
                            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                                part = body.parts[k];
                                if (!part.render.visible)
                                    continue;
                                if (options.showSleeping && body.isSleeping) {
                                    c.globalAlpha = 0.5 * part.render.opacity;
                                }
                                else if (part.render.opacity !== 1) {
                                    c.globalAlpha = part.render.opacity;
                                }
                                if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
                                    var sprite = part.render.sprite, texture = _getTexture(render, sprite.texture);
                                    c.translate(part.position.x, part.position.y);
                                    c.rotate(part.angle);
                                    c.drawImage(texture, texture.width * -sprite.xOffset * sprite.xScale, texture.height * -sprite.yOffset * sprite.yScale, texture.width * sprite.xScale, texture.height * sprite.yScale);
                                    c.rotate(-part.angle);
                                    c.translate(-part.position.x, -part.position.y);
                                }
                                else {
                                    if (part.circleRadius) {
                                        c.beginPath();
                                        c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
                                    }
                                    else {
                                        c.beginPath();
                                        c.moveTo(part.vertices[0].x, part.vertices[0].y);
                                        for (var j = 1; j < part.vertices.length; j++) {
                                            if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                                                c.lineTo(part.vertices[j].x, part.vertices[j].y);
                                            }
                                            else {
                                                c.moveTo(part.vertices[j].x, part.vertices[j].y);
                                            }
                                            if (part.vertices[j].isInternal && !showInternalEdges) {
                                                c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                                            }
                                        }
                                        c.lineTo(part.vertices[0].x, part.vertices[0].y);
                                        c.closePath();
                                    }
                                    if (!options.wireframes) {
                                        c.fillStyle = part.render.fillStyle;
                                        c.lineWidth = part.render.lineWidth;
                                        c.strokeStyle = part.render.strokeStyle;
                                        c.fill();
                                    }
                                    else {
                                        c.lineWidth = 1;
                                        c.strokeStyle = '#bbb';
                                    }
                                    c.stroke();
                                }
                                c.globalAlpha = 1;
                            }
                        }
                    };
                    Render.bodyWireframes = function (render, bodies, context) {
                        var c = context, showInternalEdges = render.options.showInternalEdges, body, part, i, j, k;
                        c.beginPath();
                        for (i = 0; i < bodies.length; i++) {
                            body = bodies[i];
                            if (!body.render.visible)
                                continue;
                            for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                                part = body.parts[k];
                                c.moveTo(part.vertices[0].x, part.vertices[0].y);
                                for (j = 1; j < part.vertices.length; j++) {
                                    if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                                        c.lineTo(part.vertices[j].x, part.vertices[j].y);
                                    }
                                    else {
                                        c.moveTo(part.vertices[j].x, part.vertices[j].y);
                                    }
                                    if (part.vertices[j].isInternal && !showInternalEdges) {
                                        c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                                    }
                                }
                                c.lineTo(part.vertices[0].x, part.vertices[0].y);
                            }
                        }
                        c.lineWidth = 1;
                        c.strokeStyle = '#bbb';
                        c.stroke();
                    };
                    Render.bodyConvexHulls = function (render, bodies, context) {
                        var c = context, body, part, i, j, k;
                        c.beginPath();
                        for (i = 0; i < bodies.length; i++) {
                            body = bodies[i];
                            if (!body.render.visible || body.parts.length === 1)
                                continue;
                            c.moveTo(body.vertices[0].x, body.vertices[0].y);
                            for (j = 1; j < body.vertices.length; j++) {
                                c.lineTo(body.vertices[j].x, body.vertices[j].y);
                            }
                            c.lineTo(body.vertices[0].x, body.vertices[0].y);
                        }
                        c.lineWidth = 1;
                        c.strokeStyle = 'rgba(255,255,255,0.2)';
                        c.stroke();
                    };
                    Render.vertexNumbers = function (render, bodies, context) {
                        var c = context, i, j, k;
                        for (i = 0; i < bodies.length; i++) {
                            var parts = bodies[i].parts;
                            for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
                                var part = parts[k];
                                for (j = 0; j < part.vertices.length; j++) {
                                    c.fillStyle = 'rgba(255,255,255,0.2)';
                                    c.fillText(i + '_' + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
                                }
                            }
                        }
                    };
                    Render.mousePosition = function (render, mouse, context) {
                        var c = context;
                        c.fillStyle = 'rgba(255,255,255,0.8)';
                        c.fillText(mouse.position.x + '  ' + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
                    };
                    Render.bodyBounds = function (render, bodies, context) {
                        var c = context, engine = render.engine, options = render.options;
                        c.beginPath();
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (body.render.visible) {
                                var parts = bodies[i].parts;
                                for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                                    var part = parts[j];
                                    c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
                                }
                            }
                        }
                        if (options.wireframes) {
                            c.strokeStyle = 'rgba(255,255,255,0.08)';
                        }
                        else {
                            c.strokeStyle = 'rgba(0,0,0,0.1)';
                        }
                        c.lineWidth = 1;
                        c.stroke();
                    };
                    Render.bodyAxes = function (render, bodies, context) {
                        var c = context, engine = render.engine, options = render.options, part, i, j, k;
                        c.beginPath();
                        for (i = 0; i < bodies.length; i++) {
                            var body = bodies[i], parts = body.parts;
                            if (!body.render.visible)
                                continue;
                            if (options.showAxes) {
                                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                                    part = parts[j];
                                    for (k = 0; k < part.axes.length; k++) {
                                        var axis = part.axes[k];
                                        c.moveTo(part.position.x, part.position.y);
                                        c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
                                    }
                                }
                            }
                            else {
                                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                                    part = parts[j];
                                    for (k = 0; k < part.axes.length; k++) {
                                        c.moveTo(part.position.x, part.position.y);
                                        c.lineTo((part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2, (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2);
                                    }
                                }
                            }
                        }
                        if (options.wireframes) {
                            c.strokeStyle = 'indianred';
                        }
                        else {
                            c.strokeStyle = 'rgba(0,0,0,0.8)';
                            c.globalCompositeOperation = 'overlay';
                        }
                        c.lineWidth = 1;
                        c.stroke();
                        c.globalCompositeOperation = 'source-over';
                    };
                    Render.bodyPositions = function (render, bodies, context) {
                        var c = context, engine = render.engine, options = render.options, body, part, i, k;
                        c.beginPath();
                        for (i = 0; i < bodies.length; i++) {
                            body = bodies[i];
                            if (!body.render.visible)
                                continue;
                            for (k = 0; k < body.parts.length; k++) {
                                part = body.parts[k];
                                c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
                                c.closePath();
                            }
                        }
                        if (options.wireframes) {
                            c.fillStyle = 'indianred';
                        }
                        else {
                            c.fillStyle = 'rgba(0,0,0,0.5)';
                        }
                        c.fill();
                        c.beginPath();
                        for (i = 0; i < bodies.length; i++) {
                            body = bodies[i];
                            if (body.render.visible) {
                                c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
                                c.closePath();
                            }
                        }
                        c.fillStyle = 'rgba(255,165,0,0.8)';
                        c.fill();
                    };
                    Render.bodyVelocity = function (render, bodies, context) {
                        var c = context;
                        c.beginPath();
                        for (var i = 0; i < bodies.length; i++) {
                            var body = bodies[i];
                            if (!body.render.visible)
                                continue;
                            c.moveTo(body.position.x, body.position.y);
                            c.lineTo(body.position.x + (body.position.x - body.positionPrev.x) * 2, body.position.y + (body.position.y - body.positionPrev.y) * 2);
                        }
                        c.lineWidth = 3;
                        c.strokeStyle = 'cornflowerblue';
                        c.stroke();
                    };
                    Render.bodyIds = function (render, bodies, context) {
                        var c = context, i, j;
                        for (i = 0; i < bodies.length; i++) {
                            if (!bodies[i].render.visible)
                                continue;
                            var parts = bodies[i].parts;
                            for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                                var part = parts[j];
                                c.font = "12px Arial";
                                c.fillStyle = 'rgba(255,255,255,0.5)';
                                c.fillText(part.id, part.position.x + 10, part.position.y - 10);
                            }
                        }
                    };
                    Render.collisions = function (render, pairs, context) {
                        var c = context, options = render.options, pair, collision, corrected, bodyA, bodyB, i, j;
                        c.beginPath();
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive)
                                continue;
                            collision = pair.collision;
                            for (j = 0; j < pair.activeContacts.length; j++) {
                                var contact = pair.activeContacts[j], vertex = contact.vertex;
                                c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
                            }
                        }
                        if (options.wireframes) {
                            c.fillStyle = 'rgba(255,255,255,0.7)';
                        }
                        else {
                            c.fillStyle = 'orange';
                        }
                        c.fill();
                        c.beginPath();
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive)
                                continue;
                            collision = pair.collision;
                            if (pair.activeContacts.length > 0) {
                                var normalPosX = pair.activeContacts[0].vertex.x, normalPosY = pair.activeContacts[0].vertex.y;
                                if (pair.activeContacts.length === 2) {
                                    normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
                                    normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
                                }
                                if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) {
                                    c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
                                }
                                else {
                                    c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
                                }
                                c.lineTo(normalPosX, normalPosY);
                            }
                        }
                        if (options.wireframes) {
                            c.strokeStyle = 'rgba(255,165,0,0.7)';
                        }
                        else {
                            c.strokeStyle = 'orange';
                        }
                        c.lineWidth = 1;
                        c.stroke();
                    };
                    Render.separations = function (render, pairs, context) {
                        var c = context, options = render.options, pair, collision, corrected, bodyA, bodyB, i, j;
                        c.beginPath();
                        for (i = 0; i < pairs.length; i++) {
                            pair = pairs[i];
                            if (!pair.isActive)
                                continue;
                            collision = pair.collision;
                            bodyA = collision.bodyA;
                            bodyB = collision.bodyB;
                            var k = 1;
                            if (!bodyB.isStatic && !bodyA.isStatic)
                                k = 0.5;
                            if (bodyB.isStatic)
                                k = 0;
                            c.moveTo(bodyB.position.x, bodyB.position.y);
                            c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
                            k = 1;
                            if (!bodyB.isStatic && !bodyA.isStatic)
                                k = 0.5;
                            if (bodyA.isStatic)
                                k = 0;
                            c.moveTo(bodyA.position.x, bodyA.position.y);
                            c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
                        }
                        if (options.wireframes) {
                            c.strokeStyle = 'rgba(255,165,0,0.5)';
                        }
                        else {
                            c.strokeStyle = 'orange';
                        }
                        c.stroke();
                    };
                    Render.grid = function (render, grid, context) {
                        var c = context, options = render.options;
                        if (options.wireframes) {
                            c.strokeStyle = 'rgba(255,180,0,0.1)';
                        }
                        else {
                            c.strokeStyle = 'rgba(255,180,0,0.5)';
                        }
                        c.beginPath();
                        var bucketKeys = Common.keys(grid.buckets);
                        for (var i = 0; i < bucketKeys.length; i++) {
                            var bucketId = bucketKeys[i];
                            if (grid.buckets[bucketId].length < 2)
                                continue;
                            var region = bucketId.split(',');
                            c.rect(0.5 + parseInt(region[0], 10) * grid.bucketWidth, 0.5 + parseInt(region[1], 10) * grid.bucketHeight, grid.bucketWidth, grid.bucketHeight);
                        }
                        c.lineWidth = 1;
                        c.stroke();
                    };
                    Render.inspector = function (inspector, context) {
                        var engine = inspector.engine, selected = inspector.selected, render = inspector.render, options = render.options, bounds;
                        if (options.hasBounds) {
                            var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
                            context.scale(1 / boundsScaleX, 1 / boundsScaleY);
                            context.translate(-render.bounds.min.x, -render.bounds.min.y);
                        }
                        for (var i = 0; i < selected.length; i++) {
                            var item = selected[i].data;
                            context.translate(0.5, 0.5);
                            context.lineWidth = 1;
                            context.strokeStyle = 'rgba(255,165,0,0.9)';
                            context.setLineDash([1, 2]);
                            switch (item.type) {
                                case 'body':
                                    bounds = item.bounds;
                                    context.beginPath();
                                    context.rect(Math.floor(bounds.min.x - 3), Math.floor(bounds.min.y - 3), Math.floor(bounds.max.x - bounds.min.x + 6), Math.floor(bounds.max.y - bounds.min.y + 6));
                                    context.closePath();
                                    context.stroke();
                                    break;
                                case 'constraint':
                                    var point = item.pointA;
                                    if (item.bodyA)
                                        point = item.pointB;
                                    context.beginPath();
                                    context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                                    context.closePath();
                                    context.stroke();
                                    break;
                            }
                            context.setLineDash([]);
                            context.translate(-0.5, -0.5);
                        }
                        if (inspector.selectStart !== null) {
                            context.translate(0.5, 0.5);
                            context.lineWidth = 1;
                            context.strokeStyle = 'rgba(255,165,0,0.6)';
                            context.fillStyle = 'rgba(255,165,0,0.1)';
                            bounds = inspector.selectBounds;
                            context.beginPath();
                            context.rect(Math.floor(bounds.min.x), Math.floor(bounds.min.y), Math.floor(bounds.max.x - bounds.min.x), Math.floor(bounds.max.y - bounds.min.y));
                            context.closePath();
                            context.stroke();
                            context.fill();
                            context.translate(-0.5, -0.5);
                        }
                        if (options.hasBounds)
                            context.setTransform(1, 0, 0, 1, 0, 0);
                    };
                    var _createCanvas = function (width, height) {
                        var canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        canvas.oncontextmenu = function () { return false; };
                        canvas.onselectstart = function () { return false; };
                        return canvas;
                    };
                    var _getPixelRatio = function (canvas) {
                        var context = canvas.getContext('2d'), devicePixelRatio = window.devicePixelRatio || 1, backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio
                            || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio
                            || context.backingStorePixelRatio || 1;
                        return devicePixelRatio / backingStorePixelRatio;
                    };
                    var _getTexture = function (render, imagePath) {
                        var image = render.textures[imagePath];
                        if (image)
                            return image;
                        image = render.textures[imagePath] = new Image();
                        image.src = imagePath;
                        return image;
                    };
                    var _applyBackground = function (render, background) {
                        var cssBackground = background;
                        if (/(jpg|gif|png)$/.test(background))
                            cssBackground = 'url(' + background + ')';
                        render.canvas.style.background = cssBackground;
                        render.canvas.style.backgroundSize = "contain";
                        render.currentBackground = background;
                    };
                })();
            }, { "../body/Composite": 2, "../collision/Grid": 6, "../core/Common": 14, "../core/Events": 16, "../geometry/Bounds": 24, "../geometry/Vector": 26 }], 30: [function (require, module, exports) {
                var RenderPixi = {};
                module.exports = RenderPixi;
                var Composite = require('../body/Composite');
                var Common = require('../core/Common');
                (function () {
                    var _requestAnimationFrame, _cancelAnimationFrame;
                    if (typeof window !== 'undefined') {
                        _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
                            || window.mozRequestAnimationFrame || window.msRequestAnimationFrame
                            || function (callback) { window.setTimeout(function () { callback(Common.now()); }, 1000 / 60); };
                        _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
                            || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
                    }
                    RenderPixi.create = function (options) {
                        Common.log('RenderPixi.create: Matter.RenderPixi is deprecated (see docs)', 'warn');
                        var defaults = {
                            controller: RenderPixi,
                            engine: null,
                            element: null,
                            frameRequestId: null,
                            canvas: null,
                            renderer: null,
                            container: null,
                            spriteContainer: null,
                            pixiOptions: null,
                            options: {
                                width: 800,
                                height: 600,
                                background: '#fafafa',
                                wireframeBackground: '#222',
                                hasBounds: false,
                                enabled: true,
                                wireframes: true,
                                showSleeping: true,
                                showDebug: false,
                                showBroadphase: false,
                                showBounds: false,
                                showVelocity: false,
                                showCollisions: false,
                                showAxes: false,
                                showPositions: false,
                                showAngleIndicator: false,
                                showIds: false,
                                showShadows: false
                            }
                        };
                        var render = Common.extend(defaults, options), transparent = !render.options.wireframes && render.options.background === 'transparent';
                        render.pixiOptions = render.pixiOptions || {
                            view: render.canvas,
                            transparent: transparent,
                            antialias: true,
                            backgroundColor: options.background
                        };
                        render.mouse = options.mouse;
                        render.engine = options.engine;
                        render.renderer = render.renderer || new PIXI.WebGLRenderer(render.options.width, render.options.height, render.pixiOptions);
                        render.container = render.container || new PIXI.Container();
                        render.spriteContainer = render.spriteContainer || new PIXI.Container();
                        render.canvas = render.canvas || render.renderer.view;
                        render.bounds = render.bounds || {
                            min: {
                                x: 0,
                                y: 0
                            },
                            max: {
                                x: render.options.width,
                                y: render.options.height
                            }
                        };
                        render.textures = {};
                        render.sprites = {};
                        render.primitives = {};
                        render.container.addChild(render.spriteContainer);
                        if (Common.isElement(render.element)) {
                            render.element.appendChild(render.canvas);
                        }
                        else {
                            Common.log('No "render.element" passed, "render.canvas" was not inserted into document.', 'warn');
                        }
                        render.canvas.oncontextmenu = function () { return false; };
                        render.canvas.onselectstart = function () { return false; };
                        return render;
                    };
                    RenderPixi.run = function (render) {
                        (function loop(time) {
                            render.frameRequestId = _requestAnimationFrame(loop);
                            RenderPixi.world(render);
                        })();
                    };
                    RenderPixi.stop = function (render) {
                        _cancelAnimationFrame(render.frameRequestId);
                    };
                    RenderPixi.clear = function (render) {
                        var container = render.container, spriteContainer = render.spriteContainer;
                        while (container.children[0]) {
                            container.removeChild(container.children[0]);
                        }
                        while (spriteContainer.children[0]) {
                            spriteContainer.removeChild(spriteContainer.children[0]);
                        }
                        var bgSprite = render.sprites['bg-0'];
                        render.textures = {};
                        render.sprites = {};
                        render.primitives = {};
                        render.sprites['bg-0'] = bgSprite;
                        if (bgSprite)
                            container.addChildAt(bgSprite, 0);
                        render.container.addChild(render.spriteContainer);
                        render.currentBackground = null;
                        container.scale.set(1, 1);
                        container.position.set(0, 0);
                    };
                    RenderPixi.setBackground = function (render, background) {
                        if (render.currentBackground !== background) {
                            var isColor = background.indexOf && background.indexOf('#') !== -1, bgSprite = render.sprites['bg-0'];
                            if (isColor) {
                                var color = Common.colorToNumber(background);
                                render.renderer.backgroundColor = color;
                                if (bgSprite)
                                    render.container.removeChild(bgSprite);
                            }
                            else {
                                if (!bgSprite) {
                                    var texture = _getTexture(render, background);
                                    bgSprite = render.sprites['bg-0'] = new PIXI.Sprite(texture);
                                    bgSprite.position.x = 0;
                                    bgSprite.position.y = 0;
                                    render.container.addChildAt(bgSprite, 0);
                                }
                            }
                            render.currentBackground = background;
                        }
                    };
                    RenderPixi.world = function (render) {
                        var engine = render.engine, world = engine.world, renderer = render.renderer, container = render.container, options = render.options, bodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world), constraints = [], i;
                        if (options.wireframes) {
                            RenderPixi.setBackground(render, options.wireframeBackground);
                        }
                        else {
                            RenderPixi.setBackground(render, options.background);
                        }
                        var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
                        if (options.hasBounds) {
                            for (i = 0; i < bodies.length; i++) {
                                var body = bodies[i];
                                body.render.sprite.visible = Bounds.overlaps(body.bounds, render.bounds);
                            }
                            for (i = 0; i < allConstraints.length; i++) {
                                var constraint = allConstraints[i], bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointAWorld = constraint.pointA, pointBWorld = constraint.pointB;
                                if (bodyA)
                                    pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                                if (bodyB)
                                    pointBWorld = Vector.add(bodyB.position, constraint.pointB);
                                if (!pointAWorld || !pointBWorld)
                                    continue;
                                if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                                    constraints.push(constraint);
                            }
                            container.scale.set(1 / boundsScaleX, 1 / boundsScaleY);
                            container.position.set(-render.bounds.min.x * (1 / boundsScaleX), -render.bounds.min.y * (1 / boundsScaleY));
                        }
                        else {
                            constraints = allConstraints;
                        }
                        for (i = 0; i < bodies.length; i++)
                            RenderPixi.body(render, bodies[i]);
                        for (i = 0; i < constraints.length; i++)
                            RenderPixi.constraint(render, constraints[i]);
                        renderer.render(container);
                    };
                    RenderPixi.constraint = function (render, constraint) {
                        var engine = render.engine, bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointA = constraint.pointA, pointB = constraint.pointB, container = render.container, constraintRender = constraint.render, primitiveId = 'c-' + constraint.id, primitive = render.primitives[primitiveId];
                        if (!primitive)
                            primitive = render.primitives[primitiveId] = new PIXI.Graphics();
                        if (!constraintRender.visible || !constraint.pointA || !constraint.pointB) {
                            primitive.clear();
                            return;
                        }
                        if (Common.indexOf(container.children, primitive) === -1)
                            container.addChild(primitive);
                        primitive.clear();
                        primitive.beginFill(0, 0);
                        primitive.lineStyle(constraintRender.lineWidth, Common.colorToNumber(constraintRender.strokeStyle), 1);
                        if (bodyA) {
                            primitive.moveTo(bodyA.position.x + pointA.x, bodyA.position.y + pointA.y);
                        }
                        else {
                            primitive.moveTo(pointA.x, pointA.y);
                        }
                        if (bodyB) {
                            primitive.lineTo(bodyB.position.x + pointB.x, bodyB.position.y + pointB.y);
                        }
                        else {
                            primitive.lineTo(pointB.x, pointB.y);
                        }
                        primitive.endFill();
                    };
                    RenderPixi.body = function (render, body) {
                        var engine = render.engine, bodyRender = body.render;
                        if (!bodyRender.visible)
                            return;
                        if (bodyRender.sprite && bodyRender.sprite.texture) {
                            var spriteId = 'b-' + body.id, sprite = render.sprites[spriteId], spriteContainer = render.spriteContainer;
                            if (!sprite)
                                sprite = render.sprites[spriteId] = _createBodySprite(render, body);
                            if (Common.indexOf(spriteContainer.children, sprite) === -1)
                                spriteContainer.addChild(sprite);
                            sprite.position.x = body.position.x;
                            sprite.position.y = body.position.y;
                            sprite.rotation = body.angle;
                            sprite.scale.x = bodyRender.sprite.xScale || 1;
                            sprite.scale.y = bodyRender.sprite.yScale || 1;
                        }
                        else {
                            var primitiveId = 'b-' + body.id, primitive = render.primitives[primitiveId], container = render.container;
                            if (!primitive) {
                                primitive = render.primitives[primitiveId] = _createBodyPrimitive(render, body);
                                primitive.initialAngle = body.angle;
                            }
                            if (Common.indexOf(container.children, primitive) === -1)
                                container.addChild(primitive);
                            primitive.position.x = body.position.x;
                            primitive.position.y = body.position.y;
                            primitive.rotation = body.angle - primitive.initialAngle;
                        }
                    };
                    var _createBodySprite = function (render, body) {
                        var bodyRender = body.render, texturePath = bodyRender.sprite.texture, texture = _getTexture(render, texturePath), sprite = new PIXI.Sprite(texture);
                        sprite.anchor.x = body.render.sprite.xOffset;
                        sprite.anchor.y = body.render.sprite.yOffset;
                        return sprite;
                    };
                    var _createBodyPrimitive = function (render, body) {
                        var bodyRender = body.render, options = render.options, primitive = new PIXI.Graphics(), fillStyle = Common.colorToNumber(bodyRender.fillStyle), strokeStyle = Common.colorToNumber(bodyRender.strokeStyle), strokeStyleIndicator = Common.colorToNumber(bodyRender.strokeStyle), strokeStyleWireframe = Common.colorToNumber('#bbb'), strokeStyleWireframeIndicator = Common.colorToNumber('#CD5C5C'), part;
                        primitive.clear();
                        for (var k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                            part = body.parts[k];
                            if (!options.wireframes) {
                                primitive.beginFill(fillStyle, 1);
                                primitive.lineStyle(bodyRender.lineWidth, strokeStyle, 1);
                            }
                            else {
                                primitive.beginFill(0, 0);
                                primitive.lineStyle(1, strokeStyleWireframe, 1);
                            }
                            primitive.moveTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);
                            for (var j = 1; j < part.vertices.length; j++) {
                                primitive.lineTo(part.vertices[j].x - body.position.x, part.vertices[j].y - body.position.y);
                            }
                            primitive.lineTo(part.vertices[0].x - body.position.x, part.vertices[0].y - body.position.y);
                            primitive.endFill();
                            if (options.showAngleIndicator || options.showAxes) {
                                primitive.beginFill(0, 0);
                                if (options.wireframes) {
                                    primitive.lineStyle(1, strokeStyleWireframeIndicator, 1);
                                }
                                else {
                                    primitive.lineStyle(1, strokeStyleIndicator);
                                }
                                primitive.moveTo(part.position.x - body.position.x, part.position.y - body.position.y);
                                primitive.lineTo(((part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2 - body.position.x), ((part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2 - body.position.y));
                                primitive.endFill();
                            }
                        }
                        return primitive;
                    };
                    var _getTexture = function (render, imagePath) {
                        var texture = render.textures[imagePath];
                        if (!texture)
                            texture = render.textures[imagePath] = PIXI.Texture.fromImage(imagePath);
                        return texture;
                    };
                })();
            }, { "../body/Composite": 2, "../core/Common": 14 }] }, {}, [28])(28);
});
(function (console, $hx_exports, $global) {
    "use strict";
    function $extend(from, fields) {
        function Inherit() { }
        Inherit.prototype = from;
        var proto = new Inherit();
        for (var name in fields)
            proto[name] = fields[name];
        if (fields.toString !== Object.prototype.toString)
            proto.toString = fields.toString;
        return proto;
    }
    var AudioManager = function () {
        this.bufferList = new haxe_ds_StringMap();
        this.types = new haxe_ds_StringMap();
        this.types.set("mp3", "audio/mpeg");
        this.types.set("ogg", "audio/ogg");
        this.types.set("wav", "audio/wav");
        this.types.set("aac", "audio/aac");
        this.types.set("m4a", "audio/x-m4a");
    };
    AudioManager.__name__ = true;
    AudioManager.prototype = {
        checkWebAudioAPISupport: function () {
            return Reflect.field(window, "AudioContext") != null || Reflect.field(window, "webkitAudioContext") != null;
        },
        unlockAudio: function () {
            if (this.audioContext != null) {
                var bfr = this.audioContext.createBuffer(1, 1, Waud.preferredSampleRate);
                var src = this.audioContext.createBufferSource();
                src.buffer = bfr;
                src.connect(this.audioContext.destination);
                if (Reflect.field(src, "start") != null)
                    src.start(0);
                else
                    src.noteOn(0);
                if (src.onended != null)
                    src.onended = $bind(this, this._unlockCallback);
                else
                    haxe_Timer.delay($bind(this, this._unlockCallback), 1);
            }
            else {
                var audio;
                var _this = window.document;
                audio = _this.createElement("audio");
                var source;
                var _this1 = window.document;
                source = _this1.createElement("source");
                source.src = "data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";
                audio.appendChild(source);
                window.document.appendChild(audio);
                audio.play();
                if (Waud.__touchUnlockCallback != null)
                    Waud.__touchUnlockCallback();
                Waud.dom.ontouchend = null;
            }
        },
        _unlockCallback: function () {
            if (Waud.__touchUnlockCallback != null)
                Waud.__touchUnlockCallback();
            Waud.dom.ontouchend = null;
        },
        createAudioContext: function () {
            if (this.audioContext == null)
                try {
                    if (Reflect.field(window, "AudioContext") != null)
                        this.audioContext = new AudioContext();
                    else if (Reflect.field(window, "webkitAudioContext") != null)
                        this.audioContext = new webkitAudioContext();
                    this.masterGainNode = this.createGain();
                }
                catch (e) {
                    if (e instanceof js__$Boot_HaxeError)
                        e = e.val;
                    this.audioContext = null;
                }
            return this.audioContext;
        },
        createGain: function () {
            if (($_ = this.audioContext, $bind($_, $_.createGain)) != null)
                return this.audioContext.createGain();
            else
                return Reflect.callMethod(this.audioContext, Reflect.field(this.audioContext, "createGainNode"), []);
        },
        destroy: function () {
            if (this.audioContext != null && (this.audioContext.close != null && this.audioContext.close != ""))
                this.audioContext.close();
            this.audioContext = null;
            this.bufferList = null;
            this.types = null;
        },
        __class__: AudioManager
    };
    var BaseSound = function (sndUrl, options) {
        this._b64 = new EReg("(^data:audio).*(;base64,)", "i");
        if (sndUrl == null || sndUrl == "") {
            console.log("invalid sound url");
            return;
        }
        if (Waud.audioManager == null) {
            console.log("initialise Waud using Waud.init() before loading sounds");
            return;
        }
        this.isSpriteSound = false;
        this.url = sndUrl;
        this._isLoaded = false;
        this._isPlaying = false;
        this._muted = false;
        this._duration = 0;
        this._options = WaudUtils.setDefaultOptions(options);
        this.rate = this._options.playbackRate;
    };
    BaseSound.__name__ = true;
    BaseSound.prototype = {
        isReady: function () {
            return this._isLoaded;
        },
        __class__: BaseSound
    };
    var EReg = function (r, opt) {
        opt = opt.split("u").join("");
        this.r = new RegExp(r, opt);
    };
    EReg.__name__ = true;
    EReg.prototype = {
        match: function (s) {
            if (this.r.global)
                this.r.lastIndex = 0;
            this.r.m = this.r.exec(s);
            this.r.s = s;
            return this.r.m != null;
        },
        matched: function (n) {
            if (this.r.m != null && n >= 0 && n < this.r.m.length)
                return this.r.m[n];
            else
                throw new js__$Boot_HaxeError("EReg::matched");
        },
        __class__: EReg
    };
    var IWaudSound = function () { };
    IWaudSound.__name__ = true;
    IWaudSound.prototype = {
        __class__: IWaudSound
    };
    var HTML5Sound = function (url, options, src) {
        BaseSound.call(this, url, options);
        this._snd = Waud.dom.createElement("audio");
        if (src == null)
            this._addSource(url);
        else
            this._snd.appendChild(src);
        if (this._options.preload)
            this.load();
        if (this._b64.match(url))
            url = "";
    };
    HTML5Sound.__name__ = true;
    HTML5Sound.__interfaces__ = [IWaudSound];
    HTML5Sound.__super__ = BaseSound;
    HTML5Sound.prototype = $extend(BaseSound.prototype, {
        load: function (callback) {
            var _g = this;
            if (!this._isLoaded) {
                this._snd.autoplay = this._options.autoplay;
                this._snd.loop = this._options.loop;
                this._snd.volume = this._options.volume;
                this._snd.playbackRate = this.rate;
                if (callback != null)
                    this._options.onload = callback;
                if (this._options.preload)
                    this._snd.preload = "auto";
                else
                    this._snd.preload = "metadata";
                if (this._options.onload != null) {
                    this._isLoaded = true;
                    this._snd.onloadeddata = function () {
                        _g._options.onload(_g);
                    };
                }
                this._snd.onplaying = function () {
                    _g._isPlaying = true;
                };
                this._snd.onended = function () {
                    _g._isPlaying = false;
                    if (_g._options.onend != null)
                        _g._options.onend(_g);
                };
                if (this._options.onerror != null)
                    this._snd.onerror = function () {
                        _g._options.onerror(_g);
                    };
                this._snd.load();
            }
            return this;
        },
        getDuration: function () {
            if (!this._isLoaded)
                return 0;
            this._duration = this._snd.duration;
            return this._duration;
        },
        _addSource: function (url) {
            this.source = Waud.dom.createElement("source");
            this.source.src = url;
            if ((function ($this) {
                var $r;
                var key = $this._getExt(url);
                $r = Waud.audioManager.types.get(key);
                return $r;
            }(this)) != null) {
                var key1 = this._getExt(url);
                this.source.type = Waud.audioManager.types.get(key1);
            }
            this._snd.appendChild(this.source);
            return this.source;
        },
        _getExt: function (filename) {
            return filename.split(".").pop();
        },
        setVolume: function (val, spriteName) {
            if (val >= 0 && val <= 1)
                this._options.volume = val;
            if (!this._isLoaded)
                return;
            this._snd.volume = this._options.volume;
        },
        getVolume: function (spriteName) {
            return this._options.volume;
        },
        mute: function (val, spriteName) {
            if (!this._isLoaded)
                return;
            this._snd.muted = val;
            if (WaudUtils.isiOS()) {
                if (val && this.isPlaying()) {
                    this._muted = true;
                    this._snd.pause();
                }
                else if (this._muted) {
                    this._muted = false;
                    this._snd.play();
                }
            }
        },
        toggleMute: function (spriteName) {
            this.mute(!this._muted);
        },
        play: function (sprite, soundProps) {
            var _g = this;
            this.spriteName = sprite;
            if (!this._isLoaded || this._snd == null) {
                console.log("sound not loaded");
                return -1;
            }
            if (this._isPlaying) {
                if (this._options.autostop)
                    this.stop(this.spriteName);
                else {
                    var n;
                    n = js_Boot.__cast(this._snd.cloneNode(true), HTMLAudioElement);
                    haxe_Timer.delay($bind(n, n.play), 100);
                }
            }
            if (this._muted)
                return -1;
            if (this.isSpriteSound && soundProps != null) {
                if (this._pauseTime == null)
                    this._snd.currentTime = soundProps.start;
                else
                    this._snd.currentTime = this._pauseTime;
                if (this._tmr != null)
                    this._tmr.stop();
                this._tmr = haxe_Timer.delay(function () {
                    if (soundProps.loop != null && soundProps.loop)
                        _g.play(_g.spriteName, soundProps);
                    else
                        _g.stop(_g.spriteName);
                }, Math.ceil(soundProps.duration * 1000));
            }
            haxe_Timer.delay(($_ = this._snd, $bind($_, $_.play)), 100);
            this._pauseTime = null;
            return 0;
        },
        togglePlay: function (spriteName) {
            if (this._isPlaying)
                this.pause();
            else
                this.play();
        },
        isPlaying: function (spriteName) {
            return this._isPlaying;
        },
        loop: function (val) {
            if (!this._isLoaded || this._snd == null)
                return;
            this._snd.loop = val;
        },
        autoStop: function (val) {
            this._options.autostop = val;
        },
        stop: function (spriteName) {
            if (!this._isLoaded || this._snd == null)
                return;
            this._snd.currentTime = 0;
            this._snd.pause();
            this._isPlaying = false;
            if (this._tmr != null)
                this._tmr.stop();
        },
        pause: function (spriteName) {
            if (!this._isLoaded || this._snd == null)
                return;
            this._snd.pause();
            this._pauseTime = this._snd.currentTime;
            this._isPlaying = false;
            if (this._tmr != null)
                this._tmr.stop();
        },
        playbackRate: function (val, spriteName) {
            if (val == null)
                return this.rate;
            this._snd.playbackRate = val;
            return this.rate = val;
        },
        setTime: function (time) {
            if (!this._isLoaded || this._snd == null || time > this._snd.duration)
                return;
            this._snd.currentTime = time;
        },
        getTime: function () {
            if (this._snd == null || !this._isLoaded || !this._isPlaying)
                return 0;
            return this._snd.currentTime;
        },
        onEnd: function (callback, spriteName) {
            this._options.onend = callback;
            return this;
        },
        onLoad: function (callback) {
            this._options.onload = callback;
            return this;
        },
        onError: function (callback) {
            this._options.onerror = callback;
            return this;
        },
        destroy: function () {
            if (this._snd != null) {
                this._snd.pause();
                this._snd.removeChild(this.source);
                this.source = null;
                this._snd = null;
            }
            this._isPlaying = false;
        },
        __class__: HTML5Sound
    });
    var HxOverrides = function () { };
    HxOverrides.__name__ = true;
    HxOverrides.cca = function (s, index) {
        var x = s.charCodeAt(index);
        if (x != x)
            return undefined;
        return x;
    };
    HxOverrides.indexOf = function (a, obj, i) {
        var len = a.length;
        if (i < 0) {
            i += len;
            if (i < 0)
                i = 0;
        }
        while (i < len) {
            if (a[i] === obj)
                return i;
            i++;
        }
        return -1;
    };
    Math.__name__ = true;
    var Reflect = function () { };
    Reflect.__name__ = true;
    Reflect.field = function (o, field) {
        try {
            return o[field];
        }
        catch (e) {
            if (e instanceof js__$Boot_HaxeError)
                e = e.val;
            return null;
        }
    };
    Reflect.callMethod = function (o, func, args) {
        return func.apply(o, args);
    };
    Reflect.fields = function (o) {
        var a = [];
        if (o != null) {
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            for (var f in o) {
                if (f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o, f))
                    a.push(f);
            }
        }
        return a;
    };
    var Std = function () { };
    Std.__name__ = true;
    Std.string = function (s) {
        return js_Boot.__string_rec(s, "");
    };
    Std.parseInt = function (x) {
        var v = parseInt(x, 10);
        if (v == 0 && (HxOverrides.cca(x, 1) == 120 || HxOverrides.cca(x, 1) == 88))
            v = parseInt(x);
        if (isNaN(v))
            return null;
        return v;
    };
    var Waud = $hx_exports.Waud = function () { };
    Waud.__name__ = true;
    Waud.init = function (d) {
        if (Waud.__audioElement == null) {
            if (d == null)
                d = window.document;
            Waud.dom = d;
            Waud.__audioElement = Waud.dom.createElement("audio");
            if (Waud.audioManager == null)
                Waud.audioManager = new AudioManager();
            Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
            Waud.isHTML5AudioSupported = Reflect.field(window, "Audio") != null;
            if (Waud.isWebAudioSupported)
                Waud.audioContext = Waud.audioManager.createAudioContext();
            Waud.sounds = new haxe_ds_StringMap();
            Waud._volume = 1;
            Waud._sayHello();
        }
    };
    Waud._sayHello = function () {
        if (window.navigator.userAgent.toLowerCase().indexOf("chrome") > 1) {
            var e = ["\n %c %c %c WAUD%c.%cJS%c v" + Waud.version + " %c  %c http://www.waudjs.com %c %c %c 📢 \n\n", "background: #32BEA6; padding:5px 0;", "background: #32BEA6; padding:5px 0;", "color: #E70000; background: #29162B; padding:5px 0;", "color: #F3B607; background: #29162B; padding:5px 0;", "color: #32BEA6; background: #29162B; padding:5px 0;", "color: #999999; background: #29162B; padding:5px 0;", "background: #32BEA6; padding:5px 0;", "background: #B8FCEF; padding:5px 0;", "background: #32BEA6; padding:5px 0;", "color: #E70000; background: #32BEA6; padding:5px 0;", "color: #FF2424; background: #FFFFFF; padding:5px 0;"];
            window.console.log.apply(window.console, e);
        }
        else
            window.console.log("WAUD.JS v" + Waud.version + " - http://www.waudjs.com");
    };
    Waud.autoMute = function () {
        Waud._focusManager = new WaudFocusManager();
        Waud._focusManager.focus = function () {
            Waud.mute(false);
        };
        Waud._focusManager.blur = function () {
            Waud.mute(true);
        };
    };
    Waud.enableTouchUnlock = function (callback) {
        Waud.__touchUnlockCallback = callback;
        Waud.dom.ontouchend = ($_ = Waud.audioManager, $bind($_, $_.unlockAudio));
    };
    Waud.setVolume = function (val) {
        if ((((val | 0) === val) || typeof (val) == "number") && val >= 0 && val <= 1) {
            Waud._volume = val;
            if (Waud.sounds != null) {
                var $it0 = Waud.sounds.iterator();
                while ($it0.hasNext()) {
                    var sound = $it0.next();
                    sound.setVolume(val);
                }
            }
        }
        else
            window.console.warn("Volume should be a number between 0 and 1. Received: " + val);
    };
    Waud.getVolume = function () {
        return Waud._volume;
    };
    Waud.mute = function (val) {
        if (val == null)
            val = true;
        Waud.isMuted = val;
        if (Waud.sounds != null) {
            var $it0 = Waud.sounds.iterator();
            while ($it0.hasNext()) {
                var sound = $it0.next();
                sound.mute(val);
            }
        }
    };
    Waud.playbackRate = function (val) {
        if (val == null)
            return Waud._playbackRate;
        else if (Waud.sounds != null) {
            var $it0 = Waud.sounds.iterator();
            while ($it0.hasNext()) {
                var sound = $it0.next();
                sound.playbackRate(val);
            }
        }
        return Waud._playbackRate = val;
    };
    Waud.stop = function () {
        if (Waud.sounds != null) {
            var $it0 = Waud.sounds.iterator();
            while ($it0.hasNext()) {
                var sound = $it0.next();
                sound.stop();
            }
        }
    };
    Waud.pause = function () {
        if (Waud.sounds != null) {
            var $it0 = Waud.sounds.iterator();
            while ($it0.hasNext()) {
                var sound = $it0.next();
                sound.pause();
            }
        }
    };
    Waud.getFormatSupportString = function () {
        var support = "OGG: " + Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
        support += ", WAV: " + Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
        support += ", MP3: " + Waud.__audioElement.canPlayType("audio/mpeg;");
        support += ", AAC: " + Waud.__audioElement.canPlayType("audio/aac;");
        support += ", M4A: " + Waud.__audioElement.canPlayType("audio/x-m4a;");
        return support;
    };
    Waud.isSupported = function () {
        if (Waud.isWebAudioSupported == null || Waud.isHTML5AudioSupported == null) {
            Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
            Waud.isHTML5AudioSupported = Reflect.field(window, "Audio") != null;
        }
        return Waud.isWebAudioSupported || Waud.isHTML5AudioSupported;
    };
    Waud.isOGGSupported = function () {
        var canPlay = Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
        return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
    };
    Waud.isWAVSupported = function () {
        var canPlay = Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
        return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
    };
    Waud.isMP3Supported = function () {
        var canPlay = Waud.__audioElement.canPlayType("audio/mpeg;");
        return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
    };
    Waud.isAACSupported = function () {
        var canPlay = Waud.__audioElement.canPlayType("audio/aac;");
        return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
    };
    Waud.isM4ASupported = function () {
        var canPlay = Waud.__audioElement.canPlayType("audio/x-m4a;");
        return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
    };
    Waud.getSampleRate = function () {
        if (Waud.audioContext != null)
            return Waud.audioContext.sampleRate;
        else
            return 0;
    };
    Waud.destroy = function () {
        if (Waud.sounds != null) {
            var $it0 = Waud.sounds.iterator();
            while ($it0.hasNext()) {
                var sound = $it0.next();
                sound.destroy();
            }
        }
        Waud.sounds = null;
        if (Waud.audioManager != null)
            Waud.audioManager.destroy();
        Waud.audioManager = null;
        Waud.audioContext = null;
        Waud.__audioElement = null;
        if (Waud._focusManager != null) {
            Waud._focusManager.clearEvents();
            Waud._focusManager.blur = null;
            Waud._focusManager.focus = null;
            Waud._focusManager = null;
        }
    };
    var WaudBase64Pack = $hx_exports.WaudBase64Pack = function (url, onLoaded, onProgress, onError, options, sequentialLoad) {
        if (sequentialLoad == null)
            sequentialLoad = false;
        if (Waud.audioManager == null) {
            console.log("initialise Waud using Waud.init() before loading sounds");
            return;
        }
        this._sequentialLoad = sequentialLoad;
        if (url.indexOf(".json") > 0) {
            this.progress = 0;
            this._options = WaudUtils.setDefaultOptions(options);
            this._totalSize = 0;
            this._soundCount = 0;
            this._loadCount = 0;
            this._onLoaded = onLoaded;
            this._onProgress = onProgress;
            this._onError = onError;
            this._sounds = new haxe_ds_StringMap();
            this._loadBase64Json(url);
        }
    };
    WaudBase64Pack.__name__ = true;
    WaudBase64Pack.prototype = {
        _loadBase64Json: function (base64Url) {
            var _g = this;
            var m = new EReg("\"meta\":.[0-9]*,[0-9]*.", "i");
            var xobj = new XMLHttpRequest();
            xobj.open("GET", base64Url, true);
            if (this._onProgress != null)
                xobj.onprogress = function (e) {
                    var meta = m.match(xobj.responseText);
                    if (meta && _g._totalSize == 0) {
                        var metaInfo = JSON.parse("{" + m.matched(0) + "}");
                        _g._totalSize = metaInfo.meta[1];
                    }
                    if (e.lengthComputable)
                        _g.progress = e.loaded / e.total;
                    else
                        _g.progress = e.loaded / _g._totalSize;
                    if (_g.progress > 1)
                        _g.progress = 1;
                    _g._onProgress(0.8 * _g.progress);
                };
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    var res = JSON.parse(xobj.responseText);
                    _g._soundsToLoad = new haxe_ds_StringMap();
                    _g._soundIds = [];
                    var _g1 = 0;
                    var _g2 = Reflect.fields(res);
                    while (_g1 < _g2.length) {
                        var n = _g2[_g1];
                        ++_g1;
                        if (n == "meta")
                            continue;
                        if ((res instanceof Array) && res.__enum__ == null) {
                            _g._soundIds.push(Reflect.field(res, n).name);
                            var key = Reflect.field(res, n).name;
                            var value = "data:" + Std.string(Reflect.field(res, n).mime) + ";base64," + Std.string(Reflect.field(res, n).data);
                            _g._soundsToLoad.set(key, value);
                        }
                        else {
                            _g._soundIds.push(n);
                            var value1 = Reflect.field(res, n);
                            _g._soundsToLoad.set(n, value1);
                        }
                    }
                    _g._soundCount = _g._soundIds.length;
                    if (!_g._sequentialLoad)
                        while (_g._soundIds.length > 0)
                            _g._createSound(_g._soundIds.shift());
                    else
                        _g._createSound(_g._soundIds.shift());
                }
            };
            xobj.send(null);
        },
        _createSound: function (id) {
            var _g = this;
            var snd = new WaudSound(this._soundsToLoad.get(id), { onload: function (s) {
                    _g._sounds.set(id, s);
                    Waud.sounds.set(id, s);
                    if (_g._options.onload != null)
                        _g._options.onload(s);
                    _g._checkProgress();
                }, onerror: function (s1) {
                    _g._sounds.set(id, null);
                    if (_g._options.onerror != null)
                        _g._options.onerror(s1);
                    if (_g._checkProgress() && _g._onError != null)
                        _g._onError();
                }, autoplay: this._options.autoplay, autostop: this._options.autostop, loop: this._options.loop, onend: this._options.onend, playbackRate: this._options.playbackRate, preload: this._options.preload, volume: this._options.volume, webaudio: this._options.webaudio });
        },
        _checkProgress: function () {
            this._loadCount++;
            if (this._onProgress != null)
                this._onProgress(0.8 + 0.2 * (this._loadCount / this._soundCount));
            if (this._loadCount == this._soundCount) {
                this._soundsToLoad = null;
                if (this._onLoaded != null)
                    this._onLoaded(this._sounds);
                return true;
            }
            else if (this._sequentialLoad)
                this._createSound(this._soundIds.shift());
            return false;
        },
        __class__: WaudBase64Pack
    };
    var WaudFocusManager = $hx_exports.WaudFocusManager = function () {
        var _g = this;
        this._hidden = "";
        this._visibilityChange = "";
        this._currentState = "";
        if (Reflect.field(window.document, "hidden") != null) {
            this._hidden = "hidden";
            this._visibilityChange = "visibilitychange";
        }
        else if (Reflect.field(window.document, "mozHidden") != null) {
            this._hidden = "mozHidden";
            this._visibilityChange = "mozvisibilitychange";
        }
        else if (Reflect.field(window.document, "msHidden") != null) {
            this._hidden = "msHidden";
            this._visibilityChange = "msvisibilitychange";
        }
        else if (Reflect.field(window.document, "webkitHidden") != null) {
            this._hidden = "webkitHidden";
            this._visibilityChange = "webkitvisibilitychange";
        }
        if (Reflect.field(window, "addEventListener") != null) {
            window.addEventListener("focus", $bind(this, this._focus));
            window.addEventListener("blur", $bind(this, this._blur));
            window.addEventListener("pageshow", $bind(this, this._focus));
            window.addEventListener("pagehide", $bind(this, this._blur));
            document.addEventListener(this._visibilityChange, $bind(this, this._handleVisibilityChange));
        }
        else if (Reflect.field(window, "attachEvent") != null) {
            window.attachEvent("onfocus", $bind(this, this._focus));
            window.attachEvent("onblur", $bind(this, this._blur));
            window.attachEvent("pageshow", $bind(this, this._focus));
            window.attachEvent("pagehide", $bind(this, this._blur));
            document.attachEvent(this._visibilityChange, $bind(this, this._handleVisibilityChange));
        }
        else
            window.onload = function () {
                window.onfocus = $bind(_g, _g._focus);
                window.onblur = $bind(_g, _g._blur);
                window.onpageshow = $bind(_g, _g._focus);
                window.onpagehide = $bind(_g, _g._blur);
            };
    };
    WaudFocusManager.__name__ = true;
    WaudFocusManager.prototype = {
        _handleVisibilityChange: function () {
            if (Reflect.field(window.document, this._hidden) != null && Reflect.field(window.document, this._hidden) && this.blur != null)
                this.blur();
            else if (this.focus != null)
                this.focus();
        },
        _focus: function () {
            if (this._currentState != "focus" && this.focus != null)
                this.focus();
            this._currentState = "focus";
        },
        _blur: function () {
            if (this._currentState != "blur" && this.blur != null)
                this.blur();
            this._currentState = "blur";
        },
        clearEvents: function () {
            if (Reflect.field(window, "removeEventListener") != null) {
                window.removeEventListener("focus", $bind(this, this._focus));
                window.removeEventListener("blur", $bind(this, this._blur));
                window.removeEventListener("pageshow", $bind(this, this._focus));
                window.removeEventListener("pagehide", $bind(this, this._blur));
                window.removeEventListener(this._visibilityChange, $bind(this, this._handleVisibilityChange));
            }
            else if (Reflect.field(window, "removeEvent") != null) {
                window.removeEvent("onfocus", $bind(this, this._focus));
                window.removeEvent("onblur", $bind(this, this._blur));
                window.removeEvent("pageshow", $bind(this, this._focus));
                window.removeEvent("pagehide", $bind(this, this._blur));
                window.removeEvent(this._visibilityChange, $bind(this, this._handleVisibilityChange));
            }
            else {
                window.onfocus = null;
                window.onblur = null;
                window.onpageshow = null;
                window.onpagehide = null;
            }
        },
        __class__: WaudFocusManager
    };
    var WaudSound = $hx_exports.WaudSound = function (url, options) {
        if (Waud.audioManager == null) {
            console.log("initialise Waud using Waud.init() before loading sounds");
            return;
        }
        this.rate = 1;
        this._options = options;
        if (url.indexOf(".json") > 0) {
            this.isSpriteSound = true;
            this._spriteDuration = 0;
            this._spriteSounds = new haxe_ds_StringMap();
            this._spriteSoundEndCallbacks = new haxe_ds_StringMap();
            this._loadSpriteJson(url);
        }
        else {
            this.isSpriteSound = false;
            this._init(url);
        }
        if (new EReg("(^data:audio).*(;base64,)", "i").match(url)) {
            var key = "snd" + new Date().getTime();
            Waud.sounds.set(key, this);
            url = "";
        }
        else
            Waud.sounds.set(url, this);
    };
    WaudSound.__name__ = true;
    WaudSound.__interfaces__ = [IWaudSound];
    WaudSound.prototype = {
        _loadSpriteJson: function (jsonUrl) {
            var _g = this;
            var xobj = new XMLHttpRequest();
            xobj.open("GET", jsonUrl, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    _g._spriteData = JSON.parse(xobj.responseText);
                    var src = _g._spriteData.src;
                    if (jsonUrl.indexOf("/") > -1)
                        src = jsonUrl.substring(0, jsonUrl.lastIndexOf("/") + 1) + src;
                    _g._init(src);
                }
            };
            xobj.send(null);
        },
        _init: function (soundUrl) {
            this.url = soundUrl;
            if (Waud.isWebAudioSupported && Waud.useWebAudio && (this._options == null || this._options.webaudio == null || this._options.webaudio)) {
                if (this.isSpriteSound)
                    this._loadSpriteSound(this.url);
                else
                    this._snd = new WebAudioAPISound(this.url, this._options);
            }
            else if (Waud.isHTML5AudioSupported) {
                if (this._spriteData != null && this._spriteData.sprite != null) {
                    var _g = 0;
                    var _g1 = this._spriteData.sprite;
                    while (_g < _g1.length) {
                        var snd = _g1[_g];
                        ++_g;
                        var sound = new HTML5Sound(this.url, this._options);
                        sound.isSpriteSound = true;
                        this._spriteSounds.set(snd.name, sound);
                    }
                }
                else
                    this._snd = new HTML5Sound(this.url, this._options);
            }
            else {
                console.log("no audio support in this browser");
                return;
            }
        },
        getDuration: function () {
            if (this.isSpriteSound)
                return this._spriteDuration;
            if (this._snd == null)
                return 0;
            return this._snd.getDuration();
        },
        setVolume: function (val, spriteName) {
            if (((val | 0) === val) || typeof (val) == "number") {
                if (this.isSpriteSound) {
                    if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                        this._spriteSounds.get(spriteName).setVolume(val);
                    return;
                }
                if (this._snd == null)
                    return;
                this._snd.setVolume(val);
            }
            else
                window.console.warn("Volume should be a number between 0 and 1. Received: " + val);
        },
        getVolume: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    return this._spriteSounds.get(spriteName).getVolume();
                return 0;
            }
            if (this._snd == null)
                return 0;
            return this._snd.getVolume();
        },
        mute: function (val, spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    this._spriteSounds.get(spriteName).mute(val);
                else {
                    var $it0 = this._spriteSounds.iterator();
                    while ($it0.hasNext()) {
                        var snd = $it0.next();
                        snd.mute(val);
                    }
                }
                return;
            }
            if (this._snd == null)
                return;
            this._snd.mute(val);
        },
        toggleMute: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    this._spriteSounds.get(spriteName).toggleMute();
                else {
                    var $it0 = this._spriteSounds.iterator();
                    while ($it0.hasNext()) {
                        var snd = $it0.next();
                        snd.toggleMute();
                    }
                }
                return;
            }
            if (this._snd == null)
                return;
            this._snd.toggleMute();
        },
        load: function (callback) {
            if (this._snd == null || this.isSpriteSound)
                return null;
            this._snd.load(callback);
            return this;
        },
        isReady: function () {
            if (this.isSpriteSound) {
                var $it0 = this._spriteSounds.iterator();
                while ($it0.hasNext()) {
                    var snd = $it0.next();
                    return snd.isReady();
                }
            }
            return this._snd.isReady();
        },
        play: function (spriteName, soundProps) {
            if (this.isSpriteSound) {
                if (spriteName != null) {
                    var _g = 0;
                    var _g1 = this._spriteData.sprite;
                    while (_g < _g1.length) {
                        var snd = _g1[_g];
                        ++_g;
                        if (snd.name == spriteName) {
                            soundProps = snd;
                            break;
                        }
                    }
                    if (soundProps == null)
                        return null;
                    if (this._spriteSounds.get(spriteName) != null) {
                        this._spriteSounds.get(spriteName).stop();
                        return this._spriteSounds.get(spriteName).play(spriteName, soundProps);
                    }
                }
                else
                    return null;
            }
            if (this._snd == null)
                return null;
            return this._snd.play(spriteName, soundProps);
        },
        togglePlay: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    this._spriteSounds.get(spriteName).togglePlay();
                return;
            }
            if (this._snd == null)
                return;
            this._snd.togglePlay();
        },
        isPlaying: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    return this._spriteSounds.get(spriteName).isPlaying();
                return false;
            }
            if (this._snd == null)
                return false;
            return this._snd.isPlaying();
        },
        loop: function (val) {
            if (this._snd == null || this.isSpriteSound)
                return;
            this._snd.loop(val);
        },
        autoStop: function (val) {
            if (this._snd == null)
                return;
            this._snd.autoStop(val);
        },
        stop: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    this._spriteSounds.get(spriteName).stop();
                else {
                    var $it0 = this._spriteSounds.iterator();
                    while ($it0.hasNext()) {
                        var snd = $it0.next();
                        snd.stop();
                    }
                }
            }
            else if (this._snd != null)
                this._snd.stop();
        },
        pause: function (spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                    this._spriteSounds.get(spriteName).pause();
                else {
                    var $it0 = this._spriteSounds.iterator();
                    while ($it0.hasNext()) {
                        var snd = $it0.next();
                        snd.pause();
                    }
                }
            }
            else if (this._snd != null)
                this._snd.pause();
        },
        playbackRate: function (val, spriteName) {
            if (val != null) {
                if (this.isSpriteSound) {
                    if (spriteName != null && this._spriteSounds.get(spriteName) != null)
                        this._spriteSounds.get(spriteName).playbackRate(val);
                    else {
                        var $it0 = this._spriteSounds.iterator();
                        while ($it0.hasNext()) {
                            var snd = $it0.next();
                            snd.playbackRate(val);
                        }
                    }
                }
                else if (this._snd != null)
                    this._snd.playbackRate(val);
                return this.rate = val;
            }
            return this.rate;
        },
        setTime: function (time) {
            if (this._snd == null || this.isSpriteSound)
                return;
            this._snd.setTime(time);
        },
        getTime: function () {
            if (this._snd == null || this.isSpriteSound)
                return 0;
            return this._snd.getTime();
        },
        onEnd: function (callback, spriteName) {
            if (this.isSpriteSound) {
                if (spriteName != null)
                    this._spriteSoundEndCallbacks.set(spriteName, callback);
                return this;
            }
            else if (this._snd != null) {
                this._snd.onEnd(callback);
                return this;
            }
            return null;
        },
        onLoad: function (callback) {
            if (this._snd == null || this.isSpriteSound)
                return null;
            this._snd.onLoad(callback);
            return this;
        },
        onError: function (callback) {
            if (this._snd == null || this.isSpriteSound)
                return null;
            this._snd.onError(callback);
            return this;
        },
        destroy: function () {
            if (this.isSpriteSound) {
                var $it0 = this._spriteSounds.iterator();
                while ($it0.hasNext()) {
                    var snd = $it0.next();
                    snd.destroy();
                }
            }
            else if (this._snd != null) {
                this._snd.destroy();
                this._snd = null;
            }
        },
        _loadSpriteSound: function (url) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = $bind(this, this._onSpriteSoundLoaded);
            request.onerror = $bind(this, this._onSpriteSoundError);
            request.send();
        },
        _onSpriteSoundLoaded: function (evt) {
            Waud.audioManager.audioContext.decodeAudioData(evt.target.response, $bind(this, this._decodeSuccess), $bind(this, this._onSpriteSoundError));
        },
        _onSpriteSoundError: function () {
            if (this._options != null && this._options.onerror != null)
                this._options.onerror(this);
        },
        _decodeSuccess: function (buffer) {
            if (buffer == null) {
                this._onSpriteSoundError();
                return;
            }
            Waud.audioManager.bufferList.set(this.url, buffer);
            this._spriteDuration = buffer.duration;
            if (this._options != null && this._options.onload != null)
                this._options.onload(this);
            var _g = 0;
            var _g1 = this._spriteData.sprite;
            while (_g < _g1.length) {
                var snd = _g1[_g];
                ++_g;
                var sound = new WebAudioAPISound(this.url, this._options, true, buffer.duration);
                sound.isSpriteSound = true;
                this._spriteSounds.set(snd.name, sound);
                sound.onEnd($bind(this, this._spriteOnEnd), snd.name);
            }
        },
        _spriteOnEnd: function (snd) {
            if (this._spriteSoundEndCallbacks.get(snd.spriteName) != null)
                this._spriteSoundEndCallbacks.get(snd.spriteName)(snd);
        },
        __class__: WaudSound
    };
    var WaudUtils = $hx_exports.WaudUtils = function () { };
    WaudUtils.__name__ = true;
    WaudUtils.isAndroid = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("Android", "i").match(ua);
    };
    WaudUtils.isiOS = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("(iPad|iPhone|iPod)", "i").match(ua);
    };
    WaudUtils.isWindowsPhone = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("(IEMobile|Windows Phone)", "i").match(ua);
    };
    WaudUtils.isFirefox = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("Firefox", "i").match(ua);
    };
    WaudUtils.isOpera = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("Opera", "i").match(ua) || Reflect.field(window, "opera") != null;
    };
    WaudUtils.isChrome = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("Chrome", "i").match(ua);
    };
    WaudUtils.isSafari = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("Safari", "i").match(ua);
    };
    WaudUtils.isMobile = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        return new EReg("(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile)", "i").match(ua);
    };
    WaudUtils.getiOSVersion = function (ua) {
        if (ua == null)
            ua = window.navigator.userAgent;
        var v = new EReg("[0-9_]+?[0-9_]+?[0-9_]+", "i");
        var matched = [];
        if (v.match(ua)) {
            var match = v.matched(0).split("_");
            var _g = [];
            var _g1 = 0;
            while (_g1 < match.length) {
                var i = match[_g1];
                ++_g1;
                _g.push(Std.parseInt(i));
            }
            matched = _g;
        }
        return matched;
    };
    WaudUtils.setDefaultOptions = function (options) {
        if (options == null)
            options = {};
        if (options.autoplay != null)
            options.autoplay = options.autoplay;
        else
            options.autoplay = Waud.defaults.autoplay;
        if (options.autostop != null)
            options.autostop = options.autostop;
        else
            options.autostop = Waud.defaults.autostop;
        if (options.webaudio != null)
            options.webaudio = options.webaudio;
        else
            options.webaudio = Waud.defaults.webaudio;
        if (options.preload != null)
            options.preload = options.preload;
        else
            options.preload = Waud.defaults.preload;
        if (options.loop != null)
            options.loop = options.loop;
        else
            options.loop = Waud.defaults.loop;
        if (options.onload != null)
            options.onload = options.onload;
        else
            options.onload = Waud.defaults.onload;
        if (options.onend != null)
            options.onend = options.onend;
        else
            options.onend = Waud.defaults.onend;
        if (options.onerror != null)
            options.onerror = options.onerror;
        else
            options.onerror = Waud.defaults.onerror;
        if (options.volume == null || options.volume < 0 || options.volume > 1)
            options.volume = Waud.defaults.volume;
        if (options.playbackRate == null || options.playbackRate <= 0 || options.playbackRate >= 4)
            options.playbackRate = Waud.defaults.playbackRate;
        return options;
    };
    var WebAudioAPISound = function (url, options, loaded, d) {
        if (d == null)
            d = 0;
        if (loaded == null)
            loaded = false;
        BaseSound.call(this, url, options);
        this._playStartTime = 0;
        this._pauseTime = 0;
        this._srcNodes = [];
        this._gainNodes = [];
        this._currentSoundProps = null;
        this._isLoaded = loaded;
        this._duration = d;
        this._manager = Waud.audioManager;
        if (this._b64.match(url)) {
            this._decodeAudio(this._base64ToArrayBuffer(url));
            url = "";
        }
        else if (this._options.preload && !loaded)
            this.load();
    };
    WebAudioAPISound.__name__ = true;
    WebAudioAPISound.__interfaces__ = [IWaudSound];
    WebAudioAPISound.__super__ = BaseSound;
    WebAudioAPISound.prototype = $extend(BaseSound.prototype, {
        load: function (callback) {
            if (!this._isLoaded) {
                var request = new XMLHttpRequest();
                request.open("GET", this.url, true);
                request.responseType = "arraybuffer";
                request.onload = $bind(this, this._onSoundLoaded);
                request.onerror = $bind(this, this._error);
                request.send();
                if (callback != null)
                    this._options.onload = callback;
            }
            return this;
        },
        _base64ToArrayBuffer: function (base64) {
            var raw = window.atob(base64.split(",")[1]);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));
            var _g = 0;
            while (_g < rawLength) {
                var i = _g++;
                array[i] = HxOverrides.cca(raw, i);
            }
            return array.buffer;
        },
        _onSoundLoaded: function (evt) {
            this._manager.audioContext.decodeAudioData(evt.target.response, $bind(this, this._decodeSuccess), $bind(this, this._error));
        },
        _decodeAudio: function (data) {
            this._manager.audioContext.decodeAudioData(data, $bind(this, this._decodeSuccess), $bind(this, this._error));
        },
        _error: function () {
            if (this._options.onerror != null)
                this._options.onerror(this);
        },
        _decodeSuccess: function (buffer) {
            if (buffer == null) {
                console.log("empty buffer: " + this.url);
                this._error();
                return;
            }
            this._manager.bufferList.set(this.url, buffer);
            this._isLoaded = true;
            this._duration = buffer.duration;
            if (this._options.onload != null)
                this._options.onload(this);
            if (this._options.autoplay)
                this.play();
        },
        _makeSource: function (buffer) {
            var bufferSource = this._manager.audioContext.createBufferSource();
            bufferSource.buffer = buffer;
            this._gainNode = this._manager.createGain();
            bufferSource.connect(this._gainNode);
            bufferSource.playbackRate.value = this.rate;
            this._gainNode.connect(this._manager.masterGainNode);
            this._manager.masterGainNode.connect(this._manager.audioContext.destination);
            this._srcNodes.push(bufferSource);
            this._gainNodes.push(this._gainNode);
            if (this._muted)
                this._gainNode.gain.value = 0;
            else
                this._gainNode.gain.value = this._options.volume;
            return bufferSource;
        },
        getDuration: function () {
            if (!this._isLoaded)
                return 0;
            return this._duration;
        },
        play: function (sprite, soundProps) {
            var _g = this;
            this.spriteName = sprite;
            if (this._isPlaying && this._options.autostop)
                this.stop(this.spriteName);
            if (!this._isLoaded) {
                console.log("sound not loaded");
                return -1;
            }
            var start = 0;
            var end = -1;
            if (this.isSpriteSound && soundProps != null) {
                this._currentSoundProps = soundProps;
                start = soundProps.start + this._pauseTime;
                end = soundProps.duration;
            }
            var buffer;
            if (this._manager.bufferList != null)
                buffer = this._manager.bufferList.get(this.url);
            else
                buffer = null;
            if (buffer != null) {
                this.source = this._makeSource(buffer);
                if (start >= 0 && end > -1)
                    this._start(0, start, end);
                else {
                    this._start(0, this._pauseTime, this.source.buffer.duration);
                    this.source.loop = this._options.loop;
                }
                this._playStartTime = this._manager.audioContext.currentTime;
                this._isPlaying = true;
                this.source.onended = function () {
                    _g._pauseTime = 0;
                    _g._isPlaying = false;
                    if (_g.isSpriteSound && soundProps != null && soundProps.loop != null && soundProps.loop && start >= 0 && end > -1) {
                        _g.destroy();
                        _g.play(_g.spriteName, soundProps);
                    }
                    else if (_g._options.onend != null)
                        _g._options.onend(_g);
                };
            }
            return HxOverrides.indexOf(this._srcNodes, this.source, 0);
        },
        _start: function (when, offset, duration) {
            if (Reflect.field(this.source, "start") != null)
                this.source.start(when, offset, duration);
            else if (Reflect.field(this.source, "noteGrainOn") != null)
                Reflect.callMethod(this.source, Reflect.field(this.source, "noteGrainOn"), [when, offset, duration]);
            else if (Reflect.field(this.source, "noteOn") != null)
                Reflect.callMethod(this.source, Reflect.field(this.source, "noteOn"), [when, offset, duration]);
        },
        togglePlay: function (spriteName) {
            if (this._isPlaying)
                this.pause();
            else
                this.play();
        },
        isPlaying: function (spriteName) {
            return this._isPlaying;
        },
        loop: function (val) {
            this._options.loop = val;
            if (this.source != null)
                this.source.loop = val;
        },
        setVolume: function (val, spriteName) {
            this._options.volume = val;
            if (this._gainNode == null || !this._isLoaded || this._muted)
                return;
            this._gainNode.gain.value = this._options.volume;
        },
        getVolume: function (spriteName) {
            return this._options.volume;
        },
        mute: function (val, spriteName) {
            this._muted = val;
            if (this._gainNode == null || !this._isLoaded)
                return;
            if (val)
                this._gainNode.gain.value = 0;
            else
                this._gainNode.gain.value = this._options.volume;
        },
        toggleMute: function (spriteName) {
            this.mute(!this._muted);
        },
        autoStop: function (val) {
            this._options.autostop = val;
        },
        stop: function (spriteName) {
            this._pauseTime = 0;
            if (this.source == null || !this._isLoaded || !this._isPlaying)
                return;
            this.destroy();
        },
        pause: function (spriteName) {
            if (this.source == null || !this._isLoaded || !this._isPlaying)
                return;
            this.destroy();
            this._pauseTime += this._manager.audioContext.currentTime - this._playStartTime;
        },
        playbackRate: function (val, spriteName) {
            if (val == null)
                return this.rate;
            var _g = 0;
            var _g1 = this._srcNodes;
            while (_g < _g1.length) {
                var src = _g1[_g];
                ++_g;
                src.playbackRate.value = val;
            }
            return this.rate = val;
        },
        setTime: function (time) {
            if (!this._isLoaded || time > this._duration)
                return;
            if (this._isPlaying) {
                this.stop();
                this._pauseTime = time;
                this.play();
            }
            else
                this._pauseTime = time;
        },
        getTime: function () {
            if (this.source == null || !this._isLoaded || !this._isPlaying)
                return 0;
            return this._manager.audioContext.currentTime - this._playStartTime + this._pauseTime;
        },
        onEnd: function (callback, spriteName) {
            this._options.onend = callback;
            return this;
        },
        onLoad: function (callback) {
            this._options.onload = callback;
            return this;
        },
        onError: function (callback) {
            this._options.onerror = callback;
            return this;
        },
        destroy: function () {
            var _g = 0;
            var _g1 = this._srcNodes;
            while (_g < _g1.length) {
                var src = _g1[_g];
                ++_g;
                if (Reflect.field(src, "stop") != null)
                    src.stop(0);
                else if (Reflect.field(src, "noteOff") != null)
                    Reflect.callMethod(src, Reflect.field(src, "noteOff"), [0]);
                src.disconnect();
                src = null;
            }
            var _g2 = 0;
            var _g11 = this._gainNodes;
            while (_g2 < _g11.length) {
                var gain = _g11[_g2];
                ++_g2;
                gain.disconnect();
                gain = null;
            }
            this._srcNodes = [];
            this._gainNodes = [];
            this._isPlaying = false;
        },
        __class__: WebAudioAPISound
    });
    var haxe_IMap = function () { };
    haxe_IMap.__name__ = true;
    var haxe_Timer = function (time_ms) {
        var me = this;
        this.id = setInterval(function () {
            me.run();
        }, time_ms);
    };
    haxe_Timer.__name__ = true;
    haxe_Timer.delay = function (f, time_ms) {
        var t = new haxe_Timer(time_ms);
        t.run = function () {
            t.stop();
            f();
        };
        return t;
    };
    haxe_Timer.prototype = {
        stop: function () {
            if (this.id == null)
                return;
            clearInterval(this.id);
            this.id = null;
        },
        run: function () {
        },
        __class__: haxe_Timer
    };
    var haxe_ds__$StringMap_StringMapIterator = function (map, keys) {
        this.map = map;
        this.keys = keys;
        this.index = 0;
        this.count = keys.length;
    };
    haxe_ds__$StringMap_StringMapIterator.__name__ = true;
    haxe_ds__$StringMap_StringMapIterator.prototype = {
        hasNext: function () {
            return this.index < this.count;
        },
        next: function () {
            return this.map.get(this.keys[this.index++]);
        },
        __class__: haxe_ds__$StringMap_StringMapIterator
    };
    var haxe_ds_StringMap = function () {
        this.h = {};
    };
    haxe_ds_StringMap.__name__ = true;
    haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
    haxe_ds_StringMap.prototype = {
        set: function (key, value) {
            if (__map_reserved[key] != null)
                this.setReserved(key, value);
            else
                this.h[key] = value;
        },
        get: function (key) {
            if (__map_reserved[key] != null)
                return this.getReserved(key);
            return this.h[key];
        },
        setReserved: function (key, value) {
            if (this.rh == null)
                this.rh = {};
            this.rh["$" + key] = value;
        },
        getReserved: function (key) {
            if (this.rh == null)
                return null;
            else
                return this.rh["$" + key];
        },
        arrayKeys: function () {
            var out = [];
            for (var key in this.h) {
                if (this.h.hasOwnProperty(key))
                    out.push(key);
            }
            if (this.rh != null) {
                for (var key in this.rh) {
                    if (key.charCodeAt(0) == 36)
                        out.push(key.substr(1));
                }
            }
            return out;
        },
        iterator: function () {
            return new haxe_ds__$StringMap_StringMapIterator(this, this.arrayKeys());
        },
        __class__: haxe_ds_StringMap
    };
    var js__$Boot_HaxeError = function (val) {
        Error.call(this);
        this.val = val;
        this.message = String(val);
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, js__$Boot_HaxeError);
    };
    js__$Boot_HaxeError.__name__ = true;
    js__$Boot_HaxeError.__super__ = Error;
    js__$Boot_HaxeError.prototype = $extend(Error.prototype, {
        __class__: js__$Boot_HaxeError
    });
    var js_Boot = function () { };
    js_Boot.__name__ = true;
    js_Boot.getClass = function (o) {
        if ((o instanceof Array) && o.__enum__ == null)
            return Array;
        else {
            var cl = o.__class__;
            if (cl != null)
                return cl;
            var name = js_Boot.__nativeClassName(o);
            if (name != null)
                return js_Boot.__resolveNativeClass(name);
            return null;
        }
    };
    js_Boot.__string_rec = function (o, s) {
        if (o == null)
            return "null";
        if (s.length >= 5)
            return "<...>";
        var t = typeof (o);
        if (t == "function" && (o.__name__ || o.__ename__))
            t = "object";
        switch (t) {
            case "object":
                if (o instanceof Array) {
                    if (o.__enum__) {
                        if (o.length == 2)
                            return o[0];
                        var str2 = o[0] + "(";
                        s += "\t";
                        var _g1 = 2;
                        var _g = o.length;
                        while (_g1 < _g) {
                            var i1 = _g1++;
                            if (i1 != 2)
                                str2 += "," + js_Boot.__string_rec(o[i1], s);
                            else
                                str2 += js_Boot.__string_rec(o[i1], s);
                        }
                        return str2 + ")";
                    }
                    var l = o.length;
                    var i;
                    var str1 = "[";
                    s += "\t";
                    var _g2 = 0;
                    while (_g2 < l) {
                        var i2 = _g2++;
                        str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2], s);
                    }
                    str1 += "]";
                    return str1;
                }
                var tostr;
                try {
                    tostr = o.toString;
                }
                catch (e) {
                    if (e instanceof js__$Boot_HaxeError)
                        e = e.val;
                    return "???";
                }
                if (tostr != null && tostr != Object.toString && typeof (tostr) == "function") {
                    var s2 = o.toString();
                    if (s2 != "[object Object]")
                        return s2;
                }
                var k = null;
                var str = "{\n";
                s += "\t";
                var hasp = o.hasOwnProperty != null;
                for (var k in o) {
                    if (hasp && !o.hasOwnProperty(k)) {
                        continue;
                    }
                    if (k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
                        continue;
                    }
                    if (str.length != 2)
                        str += ", \n";
                    str += s + k + " : " + js_Boot.__string_rec(o[k], s);
                }
                s = s.substring(1);
                str += "\n" + s + "}";
                return str;
            case "function":
                return "<function>";
            case "string":
                return o;
            default:
                return String(o);
        }
    };
    js_Boot.__interfLoop = function (cc, cl) {
        if (cc == null)
            return false;
        if (cc == cl)
            return true;
        var intf = cc.__interfaces__;
        if (intf != null) {
            var _g1 = 0;
            var _g = intf.length;
            while (_g1 < _g) {
                var i = _g1++;
                var i1 = intf[i];
                if (i1 == cl || js_Boot.__interfLoop(i1, cl))
                    return true;
            }
        }
        return js_Boot.__interfLoop(cc.__super__, cl);
    };
    js_Boot.__instanceof = function (o, cl) {
        if (cl == null)
            return false;
        switch (cl) {
            case Int:
                return (o | 0) === o;
            case Float:
                return typeof (o) == "number";
            case Bool:
                return typeof (o) == "boolean";
            case String:
                return typeof (o) == "string";
            case Array:
                return (o instanceof Array) && o.__enum__ == null;
            case Dynamic:
                return true;
            default:
                if (o != null) {
                    if (typeof (cl) == "function") {
                        if (o instanceof cl)
                            return true;
                        if (js_Boot.__interfLoop(js_Boot.getClass(o), cl))
                            return true;
                    }
                    else if (typeof (cl) == "object" && js_Boot.__isNativeObj(cl)) {
                        if (o instanceof cl)
                            return true;
                    }
                }
                else
                    return false;
                if (cl == Class && o.__name__ != null)
                    return true;
                if (cl == Enum && o.__ename__ != null)
                    return true;
                return o.__enum__ == cl;
        }
    };
    js_Boot.__cast = function (o, t) {
        if (js_Boot.__instanceof(o, t))
            return o;
        else
            throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
    };
    js_Boot.__nativeClassName = function (o) {
        var name = js_Boot.__toStr.call(o).slice(8, -1);
        if (name == "Object" || name == "Function" || name == "Math" || name == "JSON")
            return null;
        return name;
    };
    js_Boot.__isNativeObj = function (o) {
        return js_Boot.__nativeClassName(o) != null;
    };
    js_Boot.__resolveNativeClass = function (name) {
        return $global[name];
    };
    var $_, $fid = 0;
    function $bind(o, m) { if (m == null)
        return null; if (m.__id__ == null)
        m.__id__ = $fid++; var f; if (o.hx__closures__ == null)
        o.hx__closures__ = {};
    else
        f = o.hx__closures__[m.__id__]; if (f == null) {
        f = function () { return f.method.apply(f.scope, arguments); };
        f.scope = o;
        f.method = m;
        o.hx__closures__[m.__id__] = f;
    } return f; }
    if (Array.prototype.indexOf)
        HxOverrides.indexOf = function (a, o, i) {
            return Array.prototype.indexOf.call(a, o, i);
        };
    String.prototype.__class__ = String;
    String.__name__ = true;
    Array.__name__ = true;
    Date.prototype.__class__ = Date;
    Date.__name__ = ["Date"];
    var Int = { __name__: ["Int"] };
    var Dynamic = { __name__: ["Dynamic"] };
    var Float = Number;
    Float.__name__ = ["Float"];
    var Bool = Boolean;
    Bool.__ename__ = ["Bool"];
    var Class = { __name__: ["Class"] };
    var Enum = {};
    var __map_reserved = {};
    Waud.PROBABLY = "probably";
    Waud.MAYBE = "maybe";
    Waud.version = "0.9.5";
    Waud.useWebAudio = true;
    Waud.defaults = { autoplay: false, autostop: true, loop: false, preload: true, webaudio: true, volume: 1, playbackRate: 1 };
    Waud.preferredSampleRate = 44100;
    Waud.isMuted = false;
    Waud._playbackRate = 1;
    WaudFocusManager.FOCUS_STATE = "focus";
    WaudFocusManager.BLUR_STATE = "blur";
    WaudFocusManager.ON_FOCUS = "onfocus";
    WaudFocusManager.ON_BLUR = "onblur";
    WaudFocusManager.PAGE_SHOW = "pageshow";
    WaudFocusManager.PAGE_HIDE = "pagehide";
    WaudFocusManager.WINDOW = "window";
    WaudFocusManager.DOCUMENT = "document";
    js_Boot.__toStr = {}.toString;
})(typeof console != "undefined" ? console : { log: function () { } }, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
function unlockSound() {
    window.removeEventListener("touchend", unlockSound, false);
    var context = new AudioContext();
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    if (source.noteOn) {
        source.noteOn(0);
    }
}
window.addEventListener("touchend", unlockSound, false);
var base;
(function (base) {
    var Circle = (function () {
        function Circle(x, y, radius) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (radius === void 0) { radius = 0; }
            this.position = new base.Vec2(x, y);
            this.radius = radius;
        }
        Circle.prototype.isPointInside = function (v) {
            return this.isPointInsideXY(v.x, v.y);
        };
        Circle.prototype.isPointInsideXY = function (x, y) {
            var dx = this.position.x - x;
            var dy = this.position.y - y;
            return Math.sqrt(dx * dx + dy * dy) < this.radius;
        };
        Circle.prototype.intersects = function (c) {
            var dx = this.position.x - c.position.x;
            var dy = this.position.y - c.position.y;
            var ddx = dx * dx;
            var ddy = dy * dy;
            return Math.sqrt(ddx + ddy) < (this.radius + c.radius);
        };
        return Circle;
    }());
    base.Circle = Circle;
})(base || (base = {}));
var base;
(function (base) {
    var Rect = (function () {
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.position = new base.Vec2(x, y);
            this.size = new base.Vec2(w, h);
        }
        Rect.prototype.isPointInside = function (v) {
            return this.isPointInsideXY(v.x, v.y);
        };
        Rect.prototype.isPointInsideXY = function (x, y) {
            var x0 = this.position.x;
            var x1 = x0 + this.size.x;
            var y0 = this.position.y;
            var y1 = y0 + this.size.y;
            if (x0 > x1) {
                var t = x0;
                x0 = x1;
                x1 = t;
            }
            if (y0 > y1) {
                var t = y0;
                y0 = y1;
                y1 = t;
            }
            return x >= x0 && x < x1 && y >= y0 && y < y1;
        };
        Rect.prototype.intersectsRect = function (r) {
            var x0 = this.position.x;
            var x1 = x0 + this.size.x;
            var y0 = this.position.y;
            var y1 = y0 + this.size.y;
            if (x0 > x1) {
                var t = x0;
                x0 = x1;
                x1 = t;
            }
            if (y0 > y1) {
                var t = y0;
                y0 = y1;
                y1 = t;
            }
            var x2 = r.position.x;
            var y2 = r.position.y;
            var x3 = x2 + r.size.x;
            var y3 = y2 + r.size.y;
            if (x2 > x3) {
                var t = x2;
                x2 = x3;
                x3 = t;
            }
            if (y2 > y3) {
                var t = y2;
                y2 = y3;
                y3 = t;
            }
            var xtest = !(x0 > x3 || x1 < x2);
            var ytest = !(y0 > y3 || y1 < y2);
            return xtest && ytest;
        };
        Rect.prototype.getRandomPoint = function () {
            var v = new base.Vec2();
            v.x = this.position.x + Math.random() * this.size.x;
            v.y = this.position.y + Math.random() * this.size.y;
            return v;
        };
        Rect.prototype.confine = function (r) {
            var cx = this.confineX(r);
            return this.confineY(r) || cx;
        };
        Rect.prototype.confineX = function (r) {
            var x = r.position.x;
            r.position.x = base.clamp(x, this.position.x, this.position.x + this.size.x - r.size.x);
            return x != r.position.x;
        };
        Rect.prototype.confineY = function (r) {
            var y = r.position.y;
            r.position.y = base.clamp(y, this.position.y, this.position.y + this.size.y - r.size.y);
            return y != r.position.y;
        };
        return Rect;
    }());
    base.Rect = Rect;
})(base || (base = {}));
var base;
(function (base) {
    var Random = (function () {
        function Random(size) {
            if (size === void 0) { size = 65536; }
            this._size = size;
            this._data = new Float64Array(size);
            this._position = 0;
            this.init();
        }
        Random.prototype.init = function () {
            for (var i = 0; i < this._size; ++i) {
                this._data[i] = Math.random();
            }
            return this;
        };
        Random.prototype.next = function () {
            var p = this._position;
            var v = this._data[p];
            this._data[p] = 1.0 - v;
            this._position = (p + 1) % this._size;
            return v;
        };
        Random.prototype.nextInRange = function (min, max) {
            var delta = max - min;
            var v = this.next();
            return min + v * delta;
        };
        return Random;
    }());
    base.Random = Random;
})(base || (base = {}));
var base;
(function (base) {
    var Vec2 = (function () {
        function Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vec2.prototype.length = function () {
            var dx = this.x * this.x;
            var dy = this.y * this.y;
            return Math.sqrt(dx + dy);
        };
        Vec2.prototype.normalize = function () {
            var l = 1.0 / this.length();
            this.x *= l;
            this.y *= l;
            return this;
        };
        Vec2.prototype.invert = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vec2.prototype.invertX = function () {
            this.x = -this.x;
            return this;
        };
        Vec2.prototype.invertY = function () {
            this.y = -this.y;
            return this;
        };
        Vec2.prototype.set = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vec2.prototype.setXY = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vec2.prototype.clamp = function (min, max) {
            return this.clampXY(min.x, max.x, min.y, max.y);
        };
        Vec2.prototype.clampX = function (xmin, xmax) {
            if (this.x < xmin)
                this.x = xmin;
            if (this.x > xmax)
                this.x = xmax;
            return this;
        };
        Vec2.prototype.clampY = function (ymin, ymax) {
            if (this.y < ymin)
                this.y = ymin;
            if (this.y > ymax)
                this.y = ymax;
            return this;
        };
        Vec2.prototype.clampXY = function (xmin, xmax, ymin, ymax) {
            this.clampX(xmin, xmax);
            this.clampY(ymin, ymax);
            return this;
        };
        Vec2.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vec2.prototype.addXY = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        Vec2.prototype.subtract = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vec2.prototype.subtractXY = function (x, y) {
            this.x -= x;
            this.y -= y;
            return this;
        };
        Vec2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vec2.prototype.multiplyXY = function (x, y) {
            if (y === void 0) { y = x; }
            this.x *= x;
            this.y *= y;
            return this;
        };
        Vec2.ZERO = new Vec2(0, 0);
        return Vec2;
    }());
    base.Vec2 = Vec2;
})(base || (base = {}));
var base;
(function (base) {
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.set = function (m) {
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
            this.tx = m.tx;
            this.ty = m.ty;
            return this;
        };
        Matrix.prototype.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        Matrix.prototype.prepend = function (m) {
            var a = m.a * this.a + m.c * this.b;
            var b = m.b * this.a + m.d * this.b;
            var c = m.a * this.c + m.c * this.d;
            var d = m.b * this.c + m.d * this.d;
            var tx = m.a * this.tx + m.c * this.ty + m.tx;
            var ty = m.b * this.tx + m.d * this.ty + m.ty;
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        Matrix.prototype.multiply = function (m) {
            var a = this.a * m.a + this.c * m.b;
            var b = this.b * m.a + this.d * m.b;
            var c = this.a * m.c + this.c * m.d;
            var d = this.b * m.c + this.d * m.d;
            var tx = this.a * m.tx + this.c * m.ty + this.tx;
            var ty = this.b * m.tx + this.d * m.ty + this.ty;
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        Matrix.prototype.scale = function (s) {
            return this.scaleXY(s.x, s.y);
        };
        Matrix.prototype.scaleXY = function (sx, sy) {
            this.a *= sx;
            this.b *= sx;
            this.c *= sy;
            this.d *= sy;
            return this;
        };
        Matrix.prototype.rotate = function (z) {
            var ca = Math.cos(z);
            var sa = Math.sin(z);
            var ta = this.a;
            var tb = this.b;
            var tc = this.c;
            var td = this.d;
            this.a = (ta * ca) - (tc * sa);
            this.b = (tb * ca) - (td * sa);
            this.c = (ta * sa) + (tc * ca);
            this.d = (tb * sa) + (td * ca);
            return this;
        };
        Matrix.prototype.translate = function (d) {
            return this.translateXY(d.x, d.y);
        };
        Matrix.prototype.translateXY = function (dx, dy) {
            var x = this.tx + this.a * dx + this.c * dy;
            var y = this.ty + this.b * dx + this.d * dy;
            this.tx = x;
            this.ty = y;
            return this;
        };
        Matrix.prototype.identity = function () {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
            return this;
        };
        Matrix.prototype.determinant = function () {
            var xx = this.a;
            var xy = this.b;
            var xz = .0;
            var yx = this.c;
            var yy = this.d;
            var yz = .0;
            var zx = this.tx;
            var zy = this.ty;
            var zz = 1.0;
            var determinant = +xx * (yy * zz - zy * yz)
                - xy * (yx * zz - yz * zx)
                + xz * (yx * zy - yy * zx);
            return determinant;
        };
        Matrix.prototype.normalize = function () {
            var lx = 1.0 / Math.sqrt(this.a * this.a + this.b * this.b);
            var ly = 1.0 / Math.sqrt(this.c * this.c + this.d * this.d);
            var lt = 1.0 / Math.sqrt(this.tx * this.tx + this.ty * this.ty);
            this.a *= lx;
            this.b *= lx;
            this.c *= ly;
            this.d *= ly;
            this.tx *= lt;
            this.ty *= lt;
            return this;
        };
        Matrix.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var ty1 = this.ty;
            var n = 1.0 / (a1 * d1 - b1 * c1);
            this.a = d1 * n;
            this.b = -b1 * n;
            this.c = -c1 * n;
            this.d = a1 * n;
            this.tx = (c1 * ty1 - d1 * tx1) * n;
            this.ty = -(a1 * ty1 - b1 * tx1) * n;
            return this;
        };
        Matrix.prototype.projectXY = function (x, y, target) {
            if (target === void 0) { target = new base.Vec2(); }
            target.x = x * this.a +
                y * this.c +
                this.tx;
            target.y = x * this.b +
                y * this.d +
                this.ty;
            return target;
        };
        Matrix.prototype.project = function (p, target) {
            if (target === void 0) { target = new base.Vec2(); }
            var tx = p.x * this.a +
                p.y * this.c +
                this.tx;
            var ty = p.x * this.b +
                p.y * this.d +
                this.ty;
            target.x = tx;
            target.y = ty;
            return target;
        };
        Matrix.prototype.equals = function (m) {
            return this.a === m.a
                && this.b === m.b
                && this.c === m.c
                && this.d === m.d
                && this.tx === m.tx
                && this.ty === m.ty;
        };
        Matrix.prototype.buildNodeMatrix = function (pos, scale, pivot, rot) {
            var ca = Math.cos(rot);
            var sa = Math.sin(rot);
            var a = (scale.x * ca);
            var b = -(scale.y * sa);
            var c = (scale.x * sa);
            var d = (scale.y * ca);
            var dx = 0;
            var dy = 0;
            var tx = pos.x + (a * dx + c * dy);
            var ty = pos.y + (b * dx + d * dy);
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        Matrix.IDENTITY = new Matrix();
        return Matrix;
    }());
    base.Matrix = Matrix;
})(base || (base = {}));
var base;
(function (base) {
    base.Easing = {
        Linear: {
            None: function (k) {
                return k;
            }
        },
        Quadratic: {
            In: function (k) {
                return k * k;
            },
            Out: function (k) {
                return k * (2 - k);
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k;
                }
                return -0.5 * (--k * (k - 2) - 1);
            }
        },
        Cubic: {
            In: function (k) {
                return k * k * k;
            },
            Out: function (k) {
                return --k * k * k + 1;
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        },
        Quartic: {
            In: function (k) {
                return k * k * k * k;
            },
            Out: function (k) {
                return 1 - (--k * k * k * k);
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        },
        Quintic: {
            In: function (k) {
                return k * k * k * k * k;
            },
            Out: function (k) {
                return --k * k * k * k * k + 1;
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        },
        Sinusoidal: {
            In: function (k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out: function (k) {
                return Math.sin(k * Math.PI / 2);
            },
            InOut: function (k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        },
        Exponential: {
            In: function (k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out: function (k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                if ((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        },
        Circular: {
            In: function (k) {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out: function (k) {
                return Math.sqrt(1 - (--k * k));
            },
            InOut: function (k) {
                if ((k *= 2) < 1) {
                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        },
        Elastic: {
            In: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            },
            Out: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
            },
            InOut: function (k) {
                if (k === 0) {
                    return 0;
                }
                if (k === 1) {
                    return 1;
                }
                k *= 2;
                if (k < 1) {
                    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
                }
                return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
            }
        },
        Back: {
            In: function (k) {
                var s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out: function (k) {
                var s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut: function (k) {
                var s = 1.70158 * 1.525;
                if ((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        },
        Bounce: {
            In: function (k) {
                return 1 - base.Easing.Bounce.Out(1 - k);
            },
            Out: function (k) {
                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                }
                else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                }
                else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                }
                else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            },
            InOut: function (k) {
                if (k < 0.5) {
                    return base.Easing.Bounce.In(k * 2) * 0.5;
                }
                return base.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        }
    };
})(base || (base = {}));
var base;
(function (base) {
    function lerp(bias, from, to) {
        return (to - from) * bias + from;
    }
    base.lerp = lerp;
    function parabola(bias, min, max) {
        var c = max - min;
        var a = -4 * c;
        var x = bias - 0.5;
        return (a * (x * x) + c) + min;
    }
    base.parabola = parabola;
})(base || (base = {}));
var base;
(function (base) {
    function sign(x) {
        if (x == 0)
            return 0;
        return x < 0 ? -1 : 1;
    }
    base.sign = sign;
    function sineWave(low, high, freq, time) {
        if (time === void 0) { time = base.getTimeCurrent(); }
        var tm = time * (Math.PI * 2 * 0.001);
        var phase = Math.sin(tm * freq);
        var range = (high - low) * .5;
        return phase * range + range + low;
    }
    base.sineWave = sineWave;
    function toZero(value, amount) {
        if ((Math.abs(value) - amount) < 0)
            return 0;
        if (value > 0)
            value -= amount;
        else
            value += amount;
        return value;
    }
    base.toZero = toZero;
    function clamp(value, min, max) {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
    base.clamp = clamp;
    function wrap(value, min, max) {
        if (min == max) {
            return min;
        }
        var v0 = value - min;
        var d = max - min;
        var v1 = v0 - (((v0 / d) | 0) * d);
        return min + v1 + (v1 < .0 ? d : .0);
    }
    base.wrap = wrap;
    function toRadian(deg) {
        return deg * 0.01745329251994329;
    }
    base.toRadian = toRadian;
    function toDegree(rad) {
        return rad * 57.2957795130832892;
    }
    base.toDegree = toDegree;
})(base || (base = {}));
var base;
(function (base) {
    var Keys;
    (function (Keys) {
        Keys[Keys["LEFT"] = 37] = "LEFT";
        Keys[Keys["RIGHT"] = 39] = "RIGHT";
        Keys[Keys["UP"] = 38] = "UP";
        Keys[Keys["DOWN"] = 40] = "DOWN";
        Keys[Keys["SPACE"] = 32] = "SPACE";
        Keys[Keys["SHIFT"] = 16] = "SHIFT";
        Keys[Keys["CTRL"] = 17] = "CTRL";
        Keys[Keys["ENTER"] = 13] = "ENTER";
        Keys[Keys["ESC"] = 27] = "ESC";
        Keys[Keys["A"] = 65] = "A";
        Keys[Keys["B"] = 66] = "B";
        Keys[Keys["C"] = 67] = "C";
        Keys[Keys["D"] = 68] = "D";
        Keys[Keys["E"] = 69] = "E";
        Keys[Keys["F"] = 70] = "F";
        Keys[Keys["G"] = 71] = "G";
        Keys[Keys["H"] = 72] = "H";
        Keys[Keys["I"] = 73] = "I";
        Keys[Keys["J"] = 74] = "J";
        Keys[Keys["K"] = 75] = "K";
        Keys[Keys["L"] = 76] = "L";
        Keys[Keys["M"] = 77] = "M";
        Keys[Keys["N"] = 78] = "N";
        Keys[Keys["O"] = 79] = "O";
        Keys[Keys["P"] = 80] = "P";
        Keys[Keys["Q"] = 81] = "Q";
        Keys[Keys["R"] = 82] = "R";
        Keys[Keys["S"] = 83] = "S";
        Keys[Keys["T"] = 84] = "T";
        Keys[Keys["U"] = 85] = "U";
        Keys[Keys["V"] = 86] = "V";
        Keys[Keys["W"] = 87] = "W";
        Keys[Keys["X"] = 88] = "X";
        Keys[Keys["Y"] = 89] = "Y";
        Keys[Keys["Z"] = 90] = "Z";
    })(Keys = base.Keys || (base.Keys = {}));
    var Keyboard = (function () {
        function Keyboard() {
            this._actual = [];
            this._current = [];
            this._last = [];
            this._nativeHandlers = [];
            for (var i = 0; i < 386; ++i) {
                this._actual[i] = false;
                this._current[i] = false;
                this._last[i] = false;
            }
        }
        Keyboard.prototype.addNativeHandler = function (fn) {
            this._nativeHandlers.push(fn);
        };
        Keyboard.prototype._executeNativeHandlers = function (e) {
            for (var i = 0; i < this._nativeHandlers.length; ++i) {
                this._nativeHandlers[i].call(null, e);
            }
        };
        Keyboard.prototype.keyDown = function (sym) {
            this._actual[sym] = true;
        };
        Keyboard.prototype.keyUp = function (sym) {
            this._actual[sym] = false;
        };
        Keyboard.prototype.isKeyDown = function (sym) {
            return this._current[sym];
        };
        Keyboard.prototype.isKeyPressed = function (sym) {
            return this._current[sym] && !this._last[sym];
        };
        Keyboard.prototype.isKeyReleased = function (sym) {
            return !this._current[sym] && this._last[sym];
        };
        Keyboard.prototype.isKeyHeld = function (sym) {
            return this._current[sym] && this._last[sym];
        };
        Keyboard.prototype.update = function () {
            for (var i = 0; i < 386; ++i) {
                this._last[i] = this._current[i];
                this._current[i] = this._actual[i];
            }
        };
        return Keyboard;
    }());
    base.Keyboard = Keyboard;
})(base || (base = {}));
var base;
(function (base) {
    var MouseButton;
    (function (MouseButton) {
        MouseButton[MouseButton["LEFT"] = 0] = "LEFT";
        MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
        MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
        MouseButton[MouseButton["WHEEL_UP"] = 4] = "WHEEL_UP";
        MouseButton[MouseButton["WHEEL_DOWN"] = 5] = "WHEEL_DOWN";
    })(MouseButton = base.MouseButton || (base.MouseButton = {}));
    var Mouse = (function () {
        function Mouse() {
            this._position_actual = new base.Vec2();
            this._position_current = new base.Vec2();
            this._position_last = new base.Vec2();
            this._position_delta = new base.Vec2();
            this._buttons_actual = [];
            this._buttons_current = [];
            this._buttons_last = [];
            for (var i = 0; i < 6; ++i) {
                this._buttons_actual[i] = false;
                this._buttons_current[i] = false;
                this._buttons_last[i] = false;
            }
        }
        Mouse.prototype.mouseMoved = function (x, y) {
            this._position_actual.x = x;
            this._position_actual.y = y;
        };
        Mouse.prototype.buttonDown = function (idx) {
            this._buttons_actual[idx] = true;
        };
        Mouse.prototype.buttonUp = function (idx) {
            this._buttons_actual[idx] = false;
        };
        Mouse.prototype.getX = function () {
            return this._position_current.x;
        };
        Mouse.prototype.getY = function () {
            return this._position_current.y;
        };
        Mouse.prototype.getPosition = function () {
            return this._position_current;
        };
        Mouse.prototype.getLastX = function () {
            return this._position_last.x;
        };
        Mouse.prototype.getLastY = function () {
            return this._position_last.y;
        };
        Mouse.prototype.getLastPosition = function () {
            return this._position_last;
        };
        Mouse.prototype.getDeltaX = function () {
            return this._position_delta.x;
        };
        Mouse.prototype.getDeltaY = function () {
            return this._position_delta.y;
        };
        Mouse.prototype.getDelta = function () {
            return this._position_delta;
        };
        Mouse.prototype.isButtonDown = function (idx) {
            return this._buttons_current[idx];
        };
        Mouse.prototype.isButtonPressed = function (idx) {
            return this._buttons_current[idx] && !this._buttons_last[idx];
        };
        Mouse.prototype.isButtonReleased = function (idx) {
            return !this._buttons_current[idx] && this._buttons_last[idx];
        };
        Mouse.prototype.isButtonHeld = function (idx) {
            return this._buttons_current[idx] && this._buttons_last[idx];
        };
        Mouse.prototype.update = function () {
            this._position_last.set(this._position_current);
            this._position_current.set(this._position_actual);
            this._position_delta.set(this._position_current).subtract(this._position_last);
            for (var i = 0; i < 6; ++i) {
                this._buttons_last[i] = this._buttons_current[i];
                this._buttons_current[i] = this._buttons_actual[i];
            }
            this._buttons_actual[MouseButton.WHEEL_UP] = false;
            this._buttons_actual[MouseButton.WHEEL_DOWN] = false;
        };
        return Mouse;
    }());
    base.Mouse = Mouse;
})(base || (base = {}));
var base;
(function (base) {
    var Touch = (function () {
        function Touch() {
            this._position_act = new base.Vec2();
            this._position_cur = new base.Vec2();
            this._position_last = new base.Vec2();
            this._delta = new base.Vec2();
            this._tm_last_touch = 0;
            this._tapped_act = false;
            this._tapped = false;
            this._down = false;
        }
        Touch.prototype.getPosition = function () {
            return this._position_cur;
        };
        Touch.prototype.getPositionLast = function () {
            return this._position_last;
        };
        Touch.prototype.getDelta = function () {
            return this._delta;
        };
        Touch.prototype.getDeltaX = function () {
            return this._delta.x;
        };
        Touch.prototype.getDeltaY = function () {
            return this._delta.y;
        };
        Touch.prototype.isDown = function () {
            return this._down;
        };
        Touch.prototype.isTapped = function () {
            return this._tapped;
        };
        Touch.prototype.update = function () {
            this._position_last.set(this._position_cur);
            this._position_cur.set(this._position_act);
            this._delta.set(this._position_cur);
            this._delta.subtract(this._position_last);
            this._tapped = this._tapped_act;
            this._tapped_act = false;
        };
        Touch.prototype.updateTouchPosition = function (x, y) {
            this._position_act.setXY(x, y);
        };
        Touch.prototype.touchStart = function () {
            this._position_cur.set(this._position_act);
            this._position_last.set(this._position_cur);
            this._tm_last_touch = base.getTimeCurrent();
            this._tapped_act = false;
            this._down = true;
        };
        Touch.prototype.touchEnd = function () {
            var tm = base.getTimeCurrent();
            this._tapped_act = tm - this._tm_last_touch < 500;
            this._down = false;
        };
        return Touch;
    }());
    base.Touch = Touch;
})(base || (base = {}));
var base;
(function (base) {
    var QueueItem = (function () {
        function QueueItem() {
        }
        return QueueItem;
    }());
    var Loader = (function () {
        function Loader() {
            this.onComplete = function () { };
            this.onProgress = function () { };
            this.onError = function () { };
            this._failed = false;
            this._images = {};
            this._sounds = {};
            this._musics = {};
            this._fonts = {};
            this._queue = [];
            this._queueSizeTotal = 0;
            this._loadedItems = 0;
        }
        Loader.prototype.hasFailed = function () {
            return this._failed;
        };
        Loader.prototype.getImage = function (id) {
            var img = this._images[id];
            if (!img) {
                window.alert("Error: Loader does not contain image named \"" + id + "\"");
                return null;
            }
            return img;
        };
        Loader.prototype.getSound = function (id) {
            var snd = this._sounds[id];
            if (!snd) {
                window.alert("Error: Loader does not contain sound named \"" + id + "\"");
                return null;
            }
            return new base.Sound(snd.url);
        };
        Loader.prototype.getMusic = function (id) {
            var mus = this._musics[id];
            if (!mus) {
                window.alert("Error: Loader does not contain music named \"" + id + "\"");
                return null;
            }
            return mus;
        };
        Loader.prototype.getFont = function (id) {
            var fnt = this._fonts[id];
            if (!fnt) {
                window.alert("Error: Loader does not contain font named \"" + id + "\"");
                return null;
            }
            return fnt;
        };
        Loader.prototype.queueImage = function (id, url) {
            var _this = this;
            var item = new QueueItem();
            var img = document.createElement('img');
            img.onload = function () {
                _this.itemComplete(item);
            };
            img.onerror = function () {
                _this.itemFailed(item);
            };
            item.resource = img;
            item.type = 'image';
            item.id = id;
            item.url = url;
            this.queueItem(item);
            img.src = url;
        };
        Loader.prototype.queueSound = function (id, url) {
            var _this = this;
            var item = new QueueItem();
            var snd = new WaudSound(url, {
                onload: function (instance) {
                    _this.itemComplete(item);
                },
                onerror: function (instance) {
                    _this.itemFailed(item);
                },
                preload: false,
                volume: 1.0,
                loop: false,
                autoplay: false
            });
            item.resource = snd;
            item.type = 'sound';
            item.id = id;
            item.url = url;
            this.queueItem(item);
            snd.load();
        };
        Loader.prototype.queueMusic = function (id, url) {
            var _this = this;
            var item = new QueueItem();
            var mus = new WaudSound(url, {
                onload: function (instance) {
                    _this.itemComplete(item);
                },
                onerror: function (instance) {
                    _this.itemFailed(item);
                },
                preload: false,
                volume: 1.0,
                loop: true,
                autoplay: false
            });
            item.resource = mus;
            item.type = 'music';
            item.id = id;
            item.url = url;
            this.queueItem(item);
            mus.load();
        };
        Loader.prototype.queueFont = function (id, dataurl, imageurl) {
            var _this = this;
            var item = new QueueItem();
            var res = {
                data: null,
                image: document.createElement('img'),
                imageloaded: false
            };
            item.resource = res;
            item.type = 'font';
            item.url = dataurl;
            item.id = id;
            this.queueItem(item);
            var imageComplete = function () {
                res.imageloaded = true;
                if (res.data != null) {
                    _this.itemComplete(item);
                }
            };
            var dataComplete = function (xml) {
                res.data = xml;
                if (res.imageloaded) {
                    _this.itemComplete(item);
                }
            };
            res.image.onload = imageComplete;
            res.image.src = imageurl;
            var req = new XMLHttpRequest();
            req.onerror = function () { return _this.itemFailed(item); };
            req.onload = function (e) {
                dataComplete(req.responseXML);
            };
            req.open('GET', dataurl, true);
            req.send();
        };
        Loader.prototype.queueItem = function (item) {
            this._queue.push(item);
            this._queueSizeTotal++;
        };
        Loader.prototype.dequeueItem = function (item) {
            var idx = this._queue.indexOf(item);
            if (idx >= 0) {
                this._queue.splice(idx, 1);
            }
            else {
                console.error("Did not find item " + item + " in queue!");
            }
            this._loadedItems++;
        };
        Loader.prototype.itemComplete = function (item) {
            this.dequeueItem(item);
            var msg = "[" + this._loadedItems + "/" + this._queueSizeTotal + "] ";
            switch (item.type) {
                case 'image':
                    this._images[item.id] = new base.Image(item.resource);
                    item.resource.onload = undefined;
                    item.resource.onerror = undefined;
                    msg += "Image " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'sound':
                    this._sounds[item.id] = { snd: item.resource, url: item.url };
                    msg += "Sound " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'music':
                    this._musics[item.id] = new base.Music(item.resource);
                    msg += "Music " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                case 'font':
                    var f = this._fonts[item.id] = new base.Font(new base.Image(item.resource.image));
                    f.initFromXML((item.resource.data));
                    msg += "Font " + item.url + " loaded with id \"" + item.id + "\"";
                    break;
                default:
                    msg += "ERROR: failed to determine type of item " + item;
                    break;
            }
            this.onProgress(msg);
            if (this._queue.length == 0) {
                this.loadComplete();
            }
        };
        Loader.prototype.itemFailed = function (item) {
            this._failed = true;
            this.dequeueItem(item);
            var msg = "[" + this._loadedItems + "/" + this._queueSizeTotal + "] ";
            switch (item.type) {
                case 'image':
                    item.resource.onload = undefined;
                    item.resource.onerror = undefined;
                    msg += "Image " + item.url + " load FAILED";
                    break;
                case 'sound':
                    msg += "Sound " + item.url + " load FAILED";
                    break;
                case 'music':
                    msg += "Music " + item.url + " load FAILED";
                    break;
                case 'font':
                    msg += "Font " + item.url + " load FAILED";
                    break;
                default:
                    msg += "ERROR: failed to determine type of item " + item;
                    break;
            }
            this.onError(msg);
        };
        Loader.prototype.loadComplete = function () {
            console.log("Load complete");
            this.onComplete();
        };
        Loader.prototype.load = function (assets) {
            if (assets.size() === 0) {
                console.log("Load complete");
                this.onComplete();
                return;
            }
            this._failed = false;
            var images = assets.getImages();
            var sounds = assets.getSounds();
            var musics = assets.getMusics();
            var fonts = assets.getFonts();
            for (var i = 0, l = images.length; i < l; ++i) {
                var item = images[i];
                this.queueImage(item.id, item.url);
            }
            for (var i = 0, l = sounds.length; i < l; ++i) {
                var item = sounds[i];
                this.queueSound(item.id, item.url);
            }
            for (var i = 0, l = musics.length; i < l; ++i) {
                var item = musics[i];
                this.queueMusic(item.id, item.url);
            }
            for (var i = 0, l = fonts.length; i < l; ++i) {
                var f = fonts[i];
                this.queueFont(f.id, f.dataurl, f.imageurl);
            }
        };
        return Loader;
    }());
    base.Loader = Loader;
})(base || (base = {}));
var base;
(function (base) {
    var AssetList = (function () {
        function AssetList() {
            this._images = [];
            this._sounds = [];
            this._musics = [];
            this._fonts = [];
            this._imageBaseUrl = "";
            this._musicBaseUrl = "";
            this._soundBaseUrl = "";
            this._fontBaseUrl = "";
        }
        AssetList.prototype.size = function () {
            return this._images.length +
                this._sounds.length +
                this._musics.length +
                this._fonts.length;
        };
        AssetList.prototype.setImageBaseURL = function (url) {
            this._imageBaseUrl = url == null ? "" : url;
            return this;
        };
        AssetList.prototype.setSoundBaseURL = function (url) {
            this._soundBaseUrl = url == null ? "" : url;
            return this;
        };
        AssetList.prototype.setMusicBaseURL = function (url) {
            this._musicBaseUrl = url == null ? "" : url;
            return this;
        };
        AssetList.prototype.setFontBaseUrl = function (url) {
            this._fontBaseUrl = url == null ? "" : url;
            return this;
        };
        AssetList.prototype.addImage = function (id, url) {
            this._images.push({ id: id, url: this._imageBaseUrl + url });
            return this;
        };
        AssetList.prototype.addSound = function (id, url) {
            this._sounds.push({ id: id, url: this._soundBaseUrl + url });
            return this;
        };
        AssetList.prototype.addMusic = function (id, url) {
            this._musics.push({ id: id, url: this._musicBaseUrl + url });
            return this;
        };
        AssetList.prototype.addFont = function (id, dataurl, imageurl) {
            dataurl = this._fontBaseUrl + dataurl;
            imageurl = this._fontBaseUrl + imageurl;
            this._fonts.push({ id: id, dataurl: dataurl, imageurl: imageurl });
            return this;
        };
        AssetList.prototype.getImages = function () {
            return this._images;
        };
        AssetList.prototype.getSounds = function () {
            return this._sounds;
        };
        AssetList.prototype.getMusics = function () {
            return this._musics;
        };
        AssetList.prototype.getFonts = function () {
            return this._fonts;
        };
        return AssetList;
    }());
    base.AssetList = AssetList;
})(base || (base = {}));
var base;
(function (base) {
    var SafeList = (function () {
        function SafeList() {
            this._data = [];
            this._items = 0;
            this._iterator = 0;
            this._locked = false;
            this._addQueue = [];
            this._killQueue = [];
            this._clear = false;
        }
        SafeList.prototype.add = function (item) {
            if (this._data.indexOf(item) >= 0)
                return;
            if (this._locked) {
                if (this._addQueue.indexOf(item) < 0) {
                    this._addQueue.push(item);
                }
            }
            else {
                this._data.push(item);
                this._items++;
            }
        };
        SafeList.prototype.remove = function (item) {
            if (this._locked) {
                this._killQueue.push(item);
            }
            else {
                var idx = this._data.indexOf(item);
                if (idx >= 0) {
                    this._data.splice(idx, 1);
                    this._items--;
                }
            }
        };
        SafeList.prototype.forEach = function (fn) {
            this._locked = true;
            for (this._iterator = 0; this._iterator < this._items; ++this._iterator) {
                var data = this._data[this._iterator];
                fn(data);
            }
            this._locked = false;
            while (this._killQueue.length) {
                var item = this._killQueue.pop();
                var idx = this._data.indexOf(item);
                if (idx >= 0) {
                    this._data.splice(idx, 1);
                    this._items--;
                }
            }
            while (this._addQueue.length) {
                this._data.push(this._addQueue.shift());
                this._items++;
            }
            if (this._clear) {
                this.clear();
            }
        };
        SafeList.prototype.clear = function () {
            if (this._locked) {
                this._clear = true;
            }
            else {
                while (this._data.length) {
                    this._data.pop();
                }
                this._items = 0;
            }
        };
        return SafeList;
    }());
    base.SafeList = SafeList;
})(base || (base = {}));
var base;
(function (base) {
    var Ringbuffer = (function () {
        function Ringbuffer(maxsize) {
            if (maxsize === void 0) { maxsize = 16; }
            this._data = [];
            for (var i = 0; i < maxsize; ++i) {
                this._data[i] = null;
            }
            this._size = maxsize;
            this._items = 0;
            this._pos = 0;
        }
        Ringbuffer.prototype.size = function () {
            return this._items;
        };
        Ringbuffer.prototype.add = function (item) {
            var idx = (this._pos + this._items) % this._size;
            this._data[idx] = item;
            if (this._items == this._size - 1) {
                this._pos = (this._pos + 1) % this._size;
            }
            else {
                this._items++;
            }
        };
        Ringbuffer.prototype.clear = function () {
            for (var i = 0; i < this._size; ++i) {
                this._data[i] = null;
            }
            this._items = 0;
            this._pos = 0;
        };
        Ringbuffer.prototype.get = function (idx) {
            var p = (this._pos + (idx % this._items)) % this._size;
            return this._data[p];
        };
        return Ringbuffer;
    }());
    base.Ringbuffer = Ringbuffer;
})(base || (base = {}));
var base;
(function (base) {
    var StaticList = (function () {
        function StaticList(initialSize, create, clear) {
            if (initialSize === void 0) { initialSize = 16; }
            if (create === void 0) { create = function () { return ({}); }; }
            if (clear === void 0) { clear = function () { }; }
            this._data = [];
            this._size = Math.max(4, initialSize) | 0;
            this._items = 0;
            this._fn_create = create;
            this._fn_init = clear;
            for (var i = 0; i < this._size; ++i) {
                this._data[i] = create();
            }
        }
        StaticList.prototype.getNext = function () {
            if (this._items == this._size) {
                var incr = Math.max(2, this._size >> 1) | 0;
                this._size += incr;
                while (incr--) {
                    this._data.push(this._fn_create());
                }
            }
            var obj = this._data[this._items++];
            this._fn_init(obj);
            return obj;
        };
        StaticList.prototype.get = function (idx) {
            if (idx > this._items || idx < 0)
                return null;
            return this._data[idx];
        };
        StaticList.prototype.size = function () {
            return this._items;
        };
        StaticList.prototype.clear = function () {
            this._items = 0;
        };
        return StaticList;
    }());
    base.StaticList = StaticList;
})(base || (base = {}));
var base;
(function (base) {
    var Pool = (function () {
        function Pool(size, create) {
            if (size === void 0) { size = 256; }
            this._free = [];
            this._used = [];
            this._total = size;
            this._numUsed = 0;
            this._numFree = size;
            for (var i = 0; i < size; ++i) {
                this._free[i] = create();
                this._used[i] = null;
            }
        }
        Pool.prototype.alloc = function () {
            var p = null;
            if (this._numFree > 0) {
                this._newestUsed = this._numUsed;
                p = this._used[this._numUsed++] = this._free[--this._numFree];
                this._free[this._numFree] = null;
            }
            else {
                p = this._used.shift();
                this._used.push(p);
            }
            return p;
        };
        Pool.prototype.free = function (t) {
            var idx = this._used.indexOf(t);
            if (idx >= 0) {
                var p = this._used[idx];
                this._used.splice(idx, 1);
                this._numUsed--;
                this._free[this._numFree++] = p;
            }
        };
        Pool.prototype.getTotalCount = function () {
            return this._total;
        };
        Pool.prototype.getFreeCount = function () {
            return this._numFree;
        };
        Pool.prototype.getUsedCount = function () {
            return this._numUsed;
        };
        Pool.prototype.getUsed = function (idx) {
            return this._used[idx];
        };
        return Pool;
    }());
    base.Pool = Pool;
})(base || (base = {}));
var base;
(function (base) {
    var Timer = (function () {
        function Timer(callback, interval) {
            if (interval === void 0) { interval = 30; }
            this._callback = callback;
            this._interval = interval;
            this._elapsed = 0;
        }
        Timer.prototype.getInterval = function () {
            return this._interval;
        };
        Timer.prototype.setInterval = function (msec) {
            this._interval = Math.max(1, msec);
            return this;
        };
        Timer.prototype.reset = function () {
            this._elapsed = 0;
            return this;
        };
        Timer.prototype.start = function () {
            base.addTimer(this);
            return this;
        };
        Timer.prototype.stop = function () {
            base.removeTimer(this);
            return this;
        };
        Timer.prototype.update = function (elapsed_msec) {
            var e = this._elapsed - elapsed_msec;
            while (e > this._interval) {
                this._callback();
                e -= this._interval;
            }
            this._elapsed = e;
            return this;
        };
        return Timer;
    }());
    base.Timer = Timer;
})(base || (base = {}));
var base;
(function (base) {
    var Tween = (function () {
        function Tween(duration_msec, ease, onProgress, onComplete) {
            if (onComplete === void 0) { onComplete = function () { }; }
            this._duration = duration_msec;
            this._elapsed = 0;
            this._ease = ease;
            this._onProgress = onProgress;
            this._onComplete = onComplete;
        }
        Tween.prototype.start = function () {
            this._elapsed = 0;
            this._onProgress(this._ease(this._elapsed / this._duration));
            base.addTween(this);
        };
        Tween.prototype.stop = function () {
            base.removeTween(this);
        };
        Tween.prototype.cancel = function () {
            base.removeTween(this);
            this._onProgress(this._ease(0));
            this._elapsed = 0;
        };
        Tween.prototype.update = function (delta_millis) {
            var e = this._elapsed + delta_millis;
            if (e > this._duration) {
                this._onProgress(this._ease(1));
                this._elapsed = 0;
                base.removeTween(this);
                this._onComplete();
            }
            else {
                this._onProgress(this._ease(e / this._duration));
            }
            this._elapsed = e;
        };
        return Tween;
    }());
    base.Tween = Tween;
})(base || (base = {}));
var base;
(function (base) {
    var Mixer = (function () {
        function Mixer() {
            this._music = null;
            this._soundQueue = [];
            this._soundVolume = 1;
            this._musicVolume = 1;
        }
        Mixer.prototype.getVolume = function () {
            return Waud.getVolume();
        };
        Mixer.prototype.setVolume = function (vol) {
            Waud.setVolume(base.clamp(vol, 0, 1));
            return this;
        };
        Mixer.prototype.getSoundVolume = function () {
            return this._soundVolume;
        };
        Mixer.prototype.setSoundVolume = function (vol) {
            this._soundVolume = base.clamp(vol, 0, 1);
            return this;
        };
        Mixer.prototype.setMusicVolume = function (vol) {
            this._musicVolume = base.clamp(vol, 0, 1);
            if (this._music != null) {
                this._music.getWaud().setVolume(this._musicVolume * this._music.getVolume());
            }
            return this;
        };
        Mixer.prototype.stopAllSounds = function () {
            Waud.stop();
        };
        Mixer.prototype.playSound = function (sound) {
            if (this._soundQueue.indexOf(sound) === -1) {
                this._soundQueue.push(sound);
            }
            if (this._soundQueue.length > Mixer.MAXSOUNDS) {
                this._soundQueue.shift();
            }
        };
        Mixer.prototype.playMusic = function (music) {
            if (this._music == music) {
                music.getWaud().stop();
            }
            this._music = music;
            this._music.getWaud().setVolume(this._musicVolume * this._music.getVolume());
            this._music.getWaud().play();
        };
        Mixer.prototype.stopMusic = function (music) {
            if (music === void 0) { music = null; }
            if (this._music == music) {
                this._music.getWaud().stop();
            }
        };
        Mixer.prototype.stopSound = function (sound) {
            var idx = this._soundQueue.indexOf(sound);
            if (idx >= 0) {
                this._soundQueue.splice(idx, 1);
            }
            else {
                sound.getWaud().stop();
            }
        };
        Mixer.prototype.update = function () {
            while (this._soundQueue.length) {
                var sound = this._soundQueue.pop();
                sound.getWaud().setVolume(sound.getVolume() * this._soundVolume);
                sound.getWaud().play();
            }
        };
        Mixer.MAXSOUNDS = 16;
        return Mixer;
    }());
    base.Mixer = Mixer;
})(base || (base = {}));
var base;
(function (base) {
    var Sound = (function () {
        function Sound(url) {
            this._data = new WaudSound(url, { loop: false, autoolay: false, volume: 1.0 });
            this._volume = 1.0;
            this._stereo = 0;
        }
        Sound.prototype.play = function () {
            base.getMixer().playSound(this);
            return this;
        };
        Sound.prototype.stop = function () {
            base.getMixer().stopSound(this);
            return this;
        };
        Sound.prototype.getVolume = function () {
            return this._volume;
        };
        Sound.prototype.setVolume = function (vol) {
            this._volume = base.clamp(vol, 0, 1);
            return this;
        };
        Sound.prototype.getStereoBias = function () {
            return this._stereo;
        };
        Sound.prototype.setStereoBias = function (bias) {
            if (bias === void 0) { bias = 0; }
            this._stereo = base.clamp(bias, -1, 1);
            return this;
        };
        Sound.prototype.getWaud = function () {
            return this._data;
        };
        return Sound;
    }());
    base.Sound = Sound;
})(base || (base = {}));
var base;
(function (base) {
    var Music = (function () {
        function Music(waud) {
            this._data = waud;
            this._volume = 1.0;
        }
        Music.prototype.play = function () {
            base.getMixer().playMusic(this);
        };
        Music.prototype.stop = function () {
            base.getMixer().stopMusic(this);
        };
        Music.prototype.getVolume = function () {
            return this._volume;
        };
        Music.prototype.setVolume = function (vol) {
            this._volume = vol;
            return this;
        };
        Music.prototype.getWaud = function () {
            return this._data;
        };
        return Music;
    }());
    base.Music = Music;
})(base || (base = {}));
var base;
(function (base) {
    var Color = (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 255; }
            if (g === void 0) { g = 255; }
            if (b === void 0) { b = 255; }
            if (a === void 0) { a = 255; }
            this._r = base.clamp(r, 0, 255);
            this._g = base.clamp(g, 0, 255);
            this._b = base.clamp(b, 0, 255);
            this._a = base.clamp(a, 0, 255);
            this._dirty = true;
            this.asString();
        }
        Color.prototype.setR = function (r) {
            this._r = base.clamp(r, 0, 255);
            this._dirty = true;
            return this;
        };
        Color.prototype.setG = function (g) {
            this._g = base.clamp(g, 0, 255);
            this._dirty = true;
            return this;
        };
        Color.prototype.setB = function (b) {
            this._b = base.clamp(b, 0, 255);
            this._dirty = true;
            return this;
        };
        Color.prototype.setA = function (a) {
            this._a = base.clamp(a, 0, 255);
            this._dirty = true;
            return this;
        };
        Color.prototype.set = function (c) {
            this._r = c._r;
            this._g = c._g;
            this._b = c._b;
            this._a = c._a;
            if (c._dirty) {
                this._dirty = true;
            }
            else {
                this._string = c._string;
                this._dirty = false;
            }
            return this;
        };
        Color.prototype.setRGBA = function (r, g, b, a) {
            this._r = base.clamp(r, 0, 255);
            this._g = base.clamp(g, 0, 255);
            this._b = base.clamp(b, 0, 255);
            this._a = base.clamp(a, 0, 255);
            this._dirty = true;
            return this;
        };
        Color.prototype.getR = function () {
            return this._r;
        };
        Color.prototype.getG = function () {
            return this._g;
        };
        Color.prototype.getB = function () {
            return this._b;
        };
        Color.prototype.getA = function () {
            return this._a;
        };
        Color.prototype.asString = function () {
            if (this._dirty) {
                this._string = 'rgba(' + (this._r | 0) + ',' + (this._g | 0) + ',' + (this._b | 0) + ',' + (this._a / 255.0) + ')';
                this._dirty = false;
            }
            return this._string;
        };
        Color.prototype.equals = function (c) {
            return this._r === c._r
                && this._g === c._g
                && this._b === c._b
                && this._a === c._a;
        };
        Color.BLACK = new Color(0, 0, 0, 255);
        Color.WHITE = new Color(255, 255, 255, 255);
        Color.TRANSPARENT = new Color(0, 0, 0, 0);
        Color.RED = new Color(255, 0, 0, 255);
        Color.GREEN = new Color(0, 255, 0, 255);
        Color.BLUE = new Color(0, 0, 255, 255);
        Color.CYAN = new Color(0, 255, 255, 255);
        Color.MAGENTA = new Color(255, 0, 255, 255);
        Color.YELLOW = new Color(255, 255, 0, 255);
        return Color;
    }());
    base.Color = Color;
})(base || (base = {}));
var base;
(function (base) {
    var DrawMode;
    (function (DrawMode) {
        DrawMode[DrawMode["ALPHA"] = 0] = "ALPHA";
        DrawMode[DrawMode["ADDITIVE"] = 1] = "ADDITIVE";
        DrawMode[DrawMode["MULTIPLY"] = 2] = "MULTIPLY";
    })(DrawMode = base.DrawMode || (base.DrawMode = {}));
    var PivotPosition;
    (function (PivotPosition) {
        PivotPosition[PivotPosition["TOP_LEFT"] = 0] = "TOP_LEFT";
        PivotPosition[PivotPosition["TOP_CENTER"] = 1] = "TOP_CENTER";
        PivotPosition[PivotPosition["TOP_RIGHT"] = 2] = "TOP_RIGHT";
        PivotPosition[PivotPosition["MIDDLE_LEFT"] = 3] = "MIDDLE_LEFT";
        PivotPosition[PivotPosition["MIDDLE"] = 4] = "MIDDLE";
        PivotPosition[PivotPosition["MIDDLE_RIGHT"] = 5] = "MIDDLE_RIGHT";
        PivotPosition[PivotPosition["BOTTOM_LEFT"] = 6] = "BOTTOM_LEFT";
        PivotPosition[PivotPosition["BOTTOM_CENTER"] = 7] = "BOTTOM_CENTER";
        PivotPosition[PivotPosition["BOTTOM_RIGHT"] = 8] = "BOTTOM_RIGHT";
    })(PivotPosition = base.PivotPosition || (base.PivotPosition = {}));
    var Node = (function () {
        function Node() {
            this._parentNode = null;
            this._firstChild = null;
            this._lastChild = null;
            this._nextNode = null;
            this._prevNode = null;
            this._childCount = 0;
            this._stage = null;
            this._position = new base.Vec2();
            this._scale = new base.Vec2(1, 1);
            this._rotation = 0;
            this._size = new base.Vec2(0, 0);
            this._pivot = new base.Vec2(0, 0);
            this._matrix = new base.Matrix();
            this._drawmode = DrawMode.ALPHA;
            this._alpha = 1;
            this._visible = true;
            this._dirty = true;
        }
        Node.prototype.getParent = function () {
            return this._parentNode;
        };
        Node.prototype.getNextNode = function () {
            return this._nextNode;
        };
        Node.prototype.getPrevNode = function () {
            return this._prevNode;
        };
        Node.prototype.getFirstChild = function () {
            return this._firstChild;
        };
        Node.prototype.getLastChild = function () {
            return this._lastChild;
        };
        Node.prototype.getChildCount = function () {
            return this._childCount;
        };
        Node.prototype.getChildCountDeep = function () {
            var sum = this._childCount;
            var n = this._firstChild;
            while (n != null) {
                sum += n.getChildCountDeep();
                n = n.getNextNode();
            }
            return sum;
        };
        Node.prototype.removeFromParent = function () {
            if (this._parentNode != null) {
                var p = this._parentNode;
                if (p._firstChild == this)
                    p._firstChild = this._nextNode;
                if (p._lastChild == this)
                    p._lastChild = this._prevNode;
                if (this._nextNode != null)
                    this._nextNode._prevNode = this._prevNode;
                if (this._prevNode != null)
                    this._prevNode._nextNode = this._nextNode;
                p._childCount--;
                this._parentNode = null;
                this._nextNode = null;
                this._prevNode = null;
                this.setStage(null);
            }
        };
        Node.prototype.addChild = function (child) {
            child.removeFromParent();
            child._parentNode = this;
            if (this._childCount == 0) {
                this._firstChild = child;
                this._lastChild = child;
                this._childCount = 1;
            }
            else {
                child._prevNode = this._lastChild;
                child._nextNode = null;
                this._lastChild._nextNode = child;
                this._lastChild = child;
                this._childCount++;
            }
            child.setStage(this._stage);
        };
        Node.prototype.clearChildren = function () {
            while (this._firstChild != null) {
                this._firstChild.removeFromParent();
            }
        };
        Node.prototype.setStage = function (s) {
            if (this._stage != s) {
                this._stage = s;
                var c = this._firstChild;
                while (c != null) {
                    c.setStage(s);
                    c = c._nextNode;
                }
            }
            return this;
        };
        Node.prototype.getStage = function () {
            return this._stage;
        };
        Node.prototype.bringToFront = function () {
            var p = this._parentNode;
            this.removeFromParent();
            p.addChild(this);
        };
        Node.prototype.isDirty = function () {
            return this._dirty;
        };
        Node.prototype.markAsDirty = function () {
            this._dirty = true;
        };
        Node.prototype.isVisible = function () {
            return this._visible;
        };
        Node.prototype.setVisible = function (b) {
            this._visible = b;
            return this;
        };
        Node.prototype.getAlpha = function () {
            return this._alpha;
        };
        Node.prototype.setAlpha = function (a) {
            this._alpha = base.clamp(a, 0, 1);
            return this;
        };
        Node.prototype.getDrawMode = function () {
            return this._drawmode;
        };
        Node.prototype.setDrawMode = function (mode) {
            this._drawmode = mode;
            return this;
        };
        Node.prototype.setSizeXY = function (w, h) {
            this._size.setXY(w, h);
            this.markAsDirty();
            return this;
        };
        Node.prototype.setSize = function (sz) {
            this._size.set(sz);
            this.markAsDirty();
            return this;
        };
        Node.prototype.getWidth = function () {
            return this._size.x;
        };
        Node.prototype.getHeight = function () {
            return this._size.y;
        };
        Node.prototype.getSize = function () {
            return this._size;
        };
        Node.prototype.getPosition = function () {
            return this._position;
        };
        Node.prototype.getX = function () {
            return this._position.x;
        };
        Node.prototype.getY = function () {
            return this._position.y;
        };
        Node.prototype.setPosition = function (p) {
            this._position.set(p);
            this.markAsDirty();
            return this;
        };
        Node.prototype.setPositionXY = function (x, y) {
            this._position.setXY(x, y);
            this.markAsDirty();
            return this;
        };
        Node.prototype.move = function (d) {
            this._position.add(d);
            this.markAsDirty();
            return this;
        };
        Node.prototype.moveXY = function (dx, dy) {
            this._position.addXY(dx, dy);
            this.markAsDirty();
            return this;
        };
        Node.prototype.getPivot = function () {
            return this._pivot;
        };
        Node.prototype.setPivotPosition = function (p) {
            switch (p) {
                case PivotPosition.TOP_LEFT:
                    this._pivot.setXY(0, 0);
                    break;
                case PivotPosition.TOP_CENTER:
                    this._pivot.setXY(this._size.x * .5, 0);
                    break;
                case PivotPosition.TOP_RIGHT:
                    this._pivot.setXY(this._size.x, 0);
                    break;
                case PivotPosition.MIDDLE_LEFT:
                    this._pivot.setXY(0, this._size.y * .5);
                    break;
                case PivotPosition.MIDDLE:
                    this._pivot.setXY(this._size.x * .5, this._size.y * .5);
                    break;
                case PivotPosition.MIDDLE_RIGHT:
                    this._pivot.setXY(this._size.x, this._size.y * .5);
                    break;
                case PivotPosition.BOTTOM_LEFT:
                    this._pivot.setXY(0, this._size.y);
                    break;
                case PivotPosition.BOTTOM_CENTER:
                    this._pivot.setXY(this._size.x * .5, this._size.y);
                    break;
                case PivotPosition.BOTTOM_RIGHT:
                    this._pivot.setXY(this._size.x, this._size.y);
                    break;
            }
            this._dirty = true;
            return this;
        };
        Node.prototype.setPivot = function (p) {
            this._pivot.set(p);
            this._dirty = true;
            return this;
        };
        Node.prototype.setPivotXY = function (x, y) {
            this._pivot.setXY(x, y);
            this._dirty = true;
            return this;
        };
        Node.prototype.getScale = function () {
            return this._scale;
        };
        Node.prototype.setScale = function (s) {
            this._scale.set(s);
            this.markAsDirty();
            return this;
        };
        Node.prototype.setScaleXY = function (x, y) {
            if (y === void 0) { y = x; }
            this._scale.setXY(x, y);
            this.markAsDirty();
            return this;
        };
        Node.prototype.scale = function (s) {
            this._scale.multiply(s);
            this.markAsDirty();
            return this;
        };
        Node.prototype.scaleXY = function (sx, sy) {
            if (sy === void 0) { sy = sx; }
            this._scale.multiplyXY(sx, sy);
            this.markAsDirty();
            return this;
        };
        Node.prototype.getRotation = function () {
            return base.toDegree(this._rotation);
        };
        Node.prototype.setRotation = function (deg) {
            this._rotation = base.toRadian(base.wrap(deg, 0, 360));
            this.markAsDirty();
            return this;
        };
        Node.prototype.rotate = function (deg) {
            this._rotation = base.toRadian(base.wrap(base.toDegree(this._rotation) + deg, 0, 360));
            this.markAsDirty();
            return this;
        };
        Node.prototype.getMatrix = function () {
            if (this._dirty) {
                this._matrix.buildNodeMatrix(this._position, this._scale, this._pivot, this._rotation);
                this._dirty = false;
            }
            return this._matrix;
        };
        Node.prototype.draw = function (r, mtx, alpha) {
        };
        return Node;
    }());
    base.Node = Node;
})(base || (base = {}));
var base;
(function (base) {
    var ColorLayer = (function (_super) {
        __extends(ColorLayer, _super);
        function ColorLayer(c) {
            if (c === void 0) { c = base.Color.WHITE; }
            var _this = _super.call(this) || this;
            _this._color = new base.Color();
            _this._color.set(c);
            return _this;
        }
        ColorLayer.prototype.draw = function (r, mtx, alpha) {
            r.setMatrix(base.Matrix.IDENTITY);
            r.setAlpha(alpha);
            r.setDrawMode(this.getDrawMode());
            r.setFillColor(this._color);
            r.drawRectFilled(0, 0, r.getWidth(), r.getHeight());
        };
        return ColorLayer;
    }(base.Node));
    base.ColorLayer = ColorLayer;
})(base || (base = {}));
var base;
(function (base) {
    var AnimationFrame = (function () {
        function AnimationFrame() {
        }
        return AnimationFrame;
    }());
    base.AnimationFrame = AnimationFrame;
    var Animation = (function () {
        function Animation(source, frameWidth, frameHeight) {
            this._source = source;
            this._frames = [];
            this._frameWidth = frameWidth;
            this._frameHeight = frameHeight;
            this._frameCount = 0;
        }
        Animation.prototype.getSource = function () {
            return this._source;
        };
        Animation.prototype.getFrameWidth = function () {
            return this._frameWidth;
        };
        Animation.prototype.getFrameHeight = function () {
            return this._frameHeight;
        };
        Animation.prototype.getFrameCount = function () {
            return this._frameCount;
        };
        Animation.prototype.getFrame = function (idx) {
            return this._frames[idx % this._frameCount];
        };
        Animation.prototype.addFrame = function (x, y, w, h) {
            if (w === void 0) { w = this._frameWidth; }
            if (h === void 0) { h = this._frameHeight; }
            var f = new AnimationFrame();
            f.x = x;
            f.y = y;
            f.w = w;
            f.h = h;
            this._frames.push(f);
            this._frameCount++;
            return this;
        };
        Animation.prototype.addFrameIndex = function (idx, frameW, frameH, startX, startY) {
            if (frameW === void 0) { frameW = this._frameWidth; }
            if (frameH === void 0) { frameH = this._frameHeight; }
            if (startX === void 0) { startX = 0; }
            if (startY === void 0) { startY = 0; }
            var imageW = this._source.getWidth();
            var imageH = this._source.getHeight();
            var x = (startX + (idx * frameW)) % imageW;
            var y = startY + ((startX + (idx * frameW)) / imageW) | 0;
            this.addFrame(x, y);
            return this;
        };
        Animation.prototype.addFrameSequence = function (num, startX, startY, frameW, frameH) {
            if (startX === void 0) { startX = 0; }
            if (startY === void 0) { startY = 0; }
            if (frameW === void 0) { frameW = this._frameWidth; }
            if (frameH === void 0) { frameH = this._frameHeight; }
            var imageW = this._source.getWidth();
            var imageH = this._source.getHeight();
            var x = startX;
            var y = startY;
            for (var i = 0; i < num; ++i) {
                this.addFrame(x, y, frameW, frameH);
                x += frameW;
                if (x > imageW) {
                    x -= imageW;
                    y += frameH;
                }
            }
            return this;
        };
        return Animation;
    }());
    base.Animation = Animation;
    var Animator = (function () {
        function Animator(anim) {
            this._oncomplete = new base.SafeList();
            this._animation = anim;
            this._srect = new base.Rect();
            this._currentFrame = 0;
            this._looping = false;
            this._animSpeed = 16;
            this._elapsed = 0;
            this.setFrame(0);
        }
        Animator.prototype.sync = function (anim) {
            this._elapsed = anim._elapsed;
        };
        Animator.prototype.getElement = function () {
            return (this._animation.getSource().getElement());
        };
        Animator.prototype.getWidth = function () {
            return this._animation.getFrameWidth();
        };
        Animator.prototype.getHeight = function () {
            return this._animation.getFrameHeight();
        };
        Animator.prototype.getSampleRect = function () {
            return this._srect;
        };
        Animator.prototype.setFrame = function (idx) {
            if (this._looping) {
                this._currentFrame = idx % this._animation.getFrameCount();
            }
            else {
                this._currentFrame = base.clamp(idx, 0, this._animation.getFrameCount() - 1);
            }
            var f = this._animation.getFrame(this._currentFrame);
            this._srect.position.setXY(f.x, f.y);
            this._srect.size.setXY(f.w, f.h);
            return this;
        };
        Animator.prototype.getFrame = function () {
            return this._currentFrame;
        };
        Animator.prototype.setLooping = function (b) {
            this._looping = b;
            return this;
        };
        Animator.prototype.isLooping = function () {
            return this._looping;
        };
        Animator.prototype.setAnimationSpeed = function (fps) {
            this._animSpeed = fps;
            return this;
        };
        Animator.prototype.getAnimationSpeed = function () {
            return this._animSpeed;
        };
        Animator.prototype.start = function () {
            base.addAnimator(this);
            return this;
        };
        Animator.prototype.stop = function () {
            base.removeAnimator(this);
            return this;
        };
        Animator.prototype.reset = function () {
            this.setFrame(0);
            return this;
        };
        Animator.prototype.onComplete = function (callback) {
            this._oncomplete.add(callback);
            return this;
        };
        Animator.prototype.clearOnComplete = function () {
            this._oncomplete.clear();
            return this;
        };
        Animator.prototype.update = function (delta) {
            if (this._animSpeed == 0)
                return;
            var ftime = 1.0 / this._animSpeed;
            var e = this._elapsed + delta;
            while (e >= ftime) {
                this.setFrame(this._currentFrame + 1);
                e -= ftime;
            }
            this._elapsed = e;
            if (!this._looping) {
                if (this._currentFrame === this._animation.getFrameCount() - 1) {
                    this._oncomplete.forEach(function (fn) { return fn(); });
                    base.removeAnimator(this);
                }
            }
        };
        return Animator;
    }());
    base.Animator = Animator;
})(base || (base = {}));
var base;
(function (base) {
    var Renderer = (function () {
        function Renderer(owner) {
            this._surface = owner;
            this._context = owner.getContext();
            this._drawmode = base.DrawMode.ALPHA;
            this._matrix = new base.Matrix();
            this._alpha = 1;
            this._fillColor = new base.Color(0, 0, 0, 255);
            this._lineColor = new base.Color(255, 255, 255, 255);
            this._lineWidth = 1;
            this.restore();
        }
        Renderer.prototype.getSurface = function () {
            return this._surface;
        };
        Renderer.prototype.getContext = function () {
            return this._context;
        };
        Renderer.prototype.getWidth = function () {
            return this._surface.getWidth();
        };
        Renderer.prototype.getHeight = function () {
            return this._surface.getHeight();
        };
        Renderer.prototype.restore = function () {
            this.setDrawMode(this._drawmode, true);
            this._context.setTransform(1, 0, 0, 1, 0, 0);
            this._context.globalAlpha = this._alpha;
            this._context.fillStyle = this._fillColor.asString();
            this._context.strokeStyle = this._lineColor.asString();
            this._context.lineWidth = this._lineWidth;
        };
        Renderer.prototype.setDrawMode = function (mode, force) {
            if (force === void 0) { force = false; }
            if (!force && mode === this._drawmode)
                return;
            switch (mode) {
                case base.DrawMode.ADDITIVE:
                    this._context.globalCompositeOperation = 'lighter';
                    break;
                case base.DrawMode.MULTIPLY:
                    this._context.globalCompositeOperation = 'multiply';
                    break;
                default:
                    this._context.globalCompositeOperation = 'source-over';
                    break;
            }
            this._drawmode = mode;
        };
        Renderer.prototype.setMatrix = function (m) {
            if (this._matrix.equals(m))
                return;
            this._matrix.set(m);
            this._context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
        };
        Renderer.prototype.getMatrix = function () {
            return this._matrix;
        };
        Renderer.prototype.setAlpha = function (a) {
            a = base.clamp(a, 0, 1);
            if (this._alpha === a)
                return;
            this._context.globalAlpha = a;
            this._alpha = a;
        };
        Renderer.prototype.getAlpha = function () {
            return this._alpha;
        };
        Renderer.prototype.setFillColor = function (c) {
            if (this._fillColor.equals(c))
                return;
            this._fillColor.set(c);
            this._context.fillStyle = c.asString();
        };
        Renderer.prototype.getFillColor = function () {
            return this._fillColor;
        };
        Renderer.prototype.setLineColor = function (c) {
            if (this._lineColor.equals(c))
                return;
            this._lineColor.set(c);
            this._context.strokeStyle = c.asString();
        };
        Renderer.prototype.getLineColor = function () {
            return this._lineColor;
        };
        Renderer.prototype.setLineWidth = function (w) {
            w = base.clamp(w, 0.001, 100);
            if (w === this._lineWidth)
                return;
            this._context.lineWidth = w;
            this._lineWidth = w;
        };
        Renderer.prototype.getLineWidth = function () {
            return this._lineWidth;
        };
        Renderer.prototype.drawRectFilled = function (x, y, w, h) {
            this._context.fillRect(x, y, w, h);
        };
        Renderer.prototype.drawRectOutline = function (x, y, w, h) {
            this._context.strokeRect(x, y, w, h);
        };
        Renderer.prototype.drawImage = function (img, x, y, w, h) {
            var e = img.getElement();
            var r = img.getSampleRect();
            this._context.drawImage(e, r.position.x, r.position.y, r.size.x, r.size.y, x, y, w, h);
        };
        return Renderer;
    }());
    base.Renderer = Renderer;
})(base || (base = {}));
var base;
(function (base) {
    var Image = (function () {
        function Image(elem) {
            this._element = elem;
            this._width = elem.width;
            this._height = elem.height;
            this._srect = new base.Rect(0, 0, this._width, this._height);
        }
        Image.prototype.getElement = function () {
            return this._element;
        };
        Image.prototype.getWidth = function () {
            return this._width;
        };
        Image.prototype.getHeight = function () {
            return this._height;
        };
        Image.prototype.getSampleRect = function () {
            return this._srect;
        };
        return Image;
    }());
    base.Image = Image;
})(base || (base = {}));
var base;
(function (base) {
    var Surface = (function () {
        function Surface(elem) {
            if (elem === void 0) { elem = null; }
            this._element = elem === null ? window.document.createElement('canvas') : elem;
            this._context = this._element.getContext('2d');
            this._width = this._element.width;
            this._height = this._element.height;
            this._srect = new base.Rect(0, 0, this._width, this._height);
            this._renderer = null;
        }
        Surface.prototype.getElement = function () {
            return this._element;
        };
        Surface.prototype.getWidth = function () {
            return this._width;
        };
        Surface.prototype.getHeight = function () {
            return this._height;
        };
        Surface.prototype.setSize = function (w, h) {
            w |= 0;
            h |= 0;
            this._element.style.width = w + 'px';
            this._element.style.height = h + 'px';
            this._element.width = w;
            this._element.height = h;
            this._width = w;
            this._height = h;
            this._srect.position.setXY(0, 0);
            this._srect.size.setXY(w, h);
        };
        Surface.prototype.getRenderer = function () {
            if (this._renderer == null) {
                this._renderer = new base.Renderer(this);
            }
            return this._renderer;
        };
        Surface.prototype.getContext = function () {
            return this._context;
        };
        Surface.prototype.getSampleRect = function () {
            return this._srect;
        };
        Surface.prototype.setSampleRect = function (x, y, w, h) {
            this._srect.position.setXY(x, y);
            this._srect.size.setXY(w, h);
            return this;
        };
        return Surface;
    }());
    base.Surface = Surface;
})(base || (base = {}));
var base;
(function (base) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(src) {
            var _this = _super.call(this) || this;
            _this.setImageSource(src);
            return _this;
        }
        Sprite.prototype.draw = function (r, mtx, alpha) {
            var p = this.getPivot();
            r.setDrawMode(this.getDrawMode());
            r.setAlpha(alpha);
            r.setMatrix(mtx);
            r.drawImage(this._image, -p.x, -p.y, this.getWidth(), this.getHeight());
        };
        Sprite.prototype.setImageSource = function (src) {
            this._image = src;
            this.setSize(src.getSampleRect().size);
            this.setPivotPosition(base.PivotPosition.MIDDLE);
        };
        return Sprite;
    }(base.Node));
    base.Sprite = Sprite;
})(base || (base = {}));
var base;
(function (base) {
    var Particle = (function () {
        function Particle() {
            this.x = 0;
            this.y = 0;
            this.s = 0;
            this.a = 0;
            this.xadd = 0;
            this.yadd = 0;
            this.sadd = 0;
            this.aadd = 0;
        }
        return Particle;
    }());
    var ParticleEmitter = (function (_super) {
        __extends(ParticleEmitter, _super);
        function ParticleEmitter() {
            var _this = _super.call(this) || this;
            _this._systems = [];
            _this._params = new ParticleSpawnParameters();
            _this._params.direction.setXY(1, 0);
            _this._projected_position = new base.Vec2();
            _this._projected_direction = new base.Vec2();
            _this._interval = 0.1;
            _this._elapsed = 0;
            return _this;
        }
        ParticleEmitter.prototype.setRate = function (pps) {
            pps = Math.max(1, pps);
            this._interval = 1.0 / pps;
            return this;
        };
        ParticleEmitter.prototype.getRate = function () {
            return 1.0 / this._interval;
        };
        ParticleEmitter.prototype.setParticleSpeed = function (speed_min, speed_max) {
            this._params.speed_min = speed_min;
            this._params.speed_max = speed_max;
            return this;
        };
        ParticleEmitter.prototype.setParticleLife = function (min_millis, max_millis) {
            this._params.life_min = min_millis * .001;
            this._params.life_max = max_millis * .001;
            return this;
        };
        ParticleEmitter.prototype.setParticleScale = function (initial, grow_min, grow_max) {
            this._params.scale_iniital = initial;
            this._params.scale_delta_min = grow_min;
            this._params.scale_delta_max = grow_max;
            return this;
        };
        ParticleEmitter.prototype.setParticleSpread = function (deg) {
            this._params.spread = deg;
            return this;
        };
        ParticleEmitter.prototype.setParticleAngle = function (deg) {
            var r = base.toRadian(deg);
            this._params.direction.x = Math.cos(r);
            this._params.direction.y = Math.sin(r);
            return this;
        };
        ParticleEmitter.prototype.getParticleAngle = function () {
            return base.toDegree(Math.atan2(this._params.direction.y, this._params.direction.x));
        };
        ParticleEmitter.prototype.addSystem = function (system) {
            if (this._systems.indexOf(system) < 0) {
                this._systems.push(system);
            }
            return this;
        };
        ParticleEmitter.prototype.removeSystem = function (system) {
            var idx = this._systems.indexOf(system);
            if (idx >= 0) {
                this._systems.splice(idx, 1);
            }
            return this;
        };
        ParticleEmitter.prototype.draw = function (r, mtx, alpha) {
            var t = base.getTimeDelta();
            var e = this._elapsed + t;
            var c = 0;
            var worldpos = mtx.project(base.Vec2.ZERO, this._projected_position);
            this.getStage().screenToWorld(worldpos, worldpos);
            var direction = mtx.project(this._params.direction, this._projected_direction);
            this.getStage().screenToWorld(direction, direction);
            direction.subtract(worldpos);
            direction.normalize();
            while (e > this._interval) {
                ++c;
                e -= this._interval;
            }
            this._elapsed = e;
            if (c > 0) {
                for (var i = 0, l = this._systems.length; i < l; ++i) {
                    var s = this._systems[i];
                    s.spawn(c, worldpos, direction, this._params);
                }
            }
        };
        return ParticleEmitter;
    }(base.Node));
    base.ParticleEmitter = ParticleEmitter;
    var ParticleSpawnParameters = (function () {
        function ParticleSpawnParameters() {
            this.direction = new base.Vec2();
            this.spread = 10;
            this.speed_min = 100;
            this.speed_max = 250;
            this.life_min = 1.0;
            this.life_max = 1.5;
            this.scale_iniital = 1.0;
            this.scale_delta_min = -0.5;
            this.scale_delta_max = 0.5;
        }
        return ParticleSpawnParameters;
    }());
    base.ParticleSpawnParameters = ParticleSpawnParameters;
    var ParticleSystem = (function (_super) {
        __extends(ParticleSystem, _super);
        function ParticleSystem(img, count) {
            if (count === void 0) { count = 256; }
            var _this = _super.call(this) || this;
            _this._image = img;
            _this._pool = new base.Pool(count, function () { return new Particle(); });
            _this._reap = [];
            _this._gravity = new base.Vec2();
            _this._scroll = new base.Vec2();
            _this._random = new base.Random();
            _this._inverse = new base.Matrix();
            _this._tpos = new base.Vec2();
            return _this;
        }
        ParticleSystem.prototype.sanitize = function (params) {
            params.life_min = Math.max(params.life_min, 0.01);
            params.life_max = Math.max(params.life_max, 0.015);
        };
        ParticleSystem.prototype.spawn = function (num, position, direction, params) {
            this.sanitize(params);
            this._inverse.set(this.getMatrix());
            var n = this.getParent();
            while (n != null) {
                this._inverse.prepend(n.getMatrix());
                n = n.getParent();
            }
            this._inverse.invert();
            this._inverse.project(position, this._tpos);
            var base_angle = base.toDegree(Math.atan2(direction.y, direction.x));
            var half_spread = params.spread * .5;
            params.direction.normalize();
            for (var i = 0; i < num; ++i) {
                var p = this._pool.alloc();
                var speed = this._random.nextInRange(params.speed_min, params.speed_max);
                var life = this._random.nextInRange(params.life_min, params.life_max);
                var scale = this._random.nextInRange(params.scale_delta_min, params.scale_delta_max);
                var angle = this._random.nextInRange(base_angle - half_spread, base_angle + half_spread);
                angle = base.toRadian(angle);
                p.x = this._tpos.x;
                p.y = this._tpos.y;
                p.s = params.scale_iniital;
                p.a = 1;
                p.xadd = Math.cos(angle) * speed;
                p.yadd = Math.sin(angle) * speed;
                p.aadd = -1.0 / life;
                p.sadd = scale;
            }
        };
        ParticleSystem.prototype.getGravity = function () {
            return this._gravity;
        };
        ParticleSystem.prototype.setGravity = function (g) {
            this._gravity.set(g);
            return this;
        };
        ParticleSystem.prototype.getScroll = function () {
            return this._scroll;
        };
        ParticleSystem.prototype.setScroll = function (s) {
            this._scroll.set(s);
            return this;
        };
        ParticleSystem.prototype.update = function () {
            var delta = base.getTimeDelta();
            var g = this._gravity;
            var s = this._scroll;
            var gxadd = g.x * delta;
            var gyadd = g.y * delta;
            var sxadd = s.x * delta;
            var syadd = s.y * delta;
            for (var i = 0, l = this._pool.getUsedCount(); i < l; ++i) {
                var p = this._pool.getUsed(i);
                p.x += p.xadd * delta + sxadd;
                p.y += p.yadd * delta + syadd;
                p.s += p.sadd * delta;
                p.a += p.aadd * delta;
                p.xadd += gxadd;
                p.yadd += gyadd;
                if (p.a < 0) {
                    this._reap.push(p);
                }
            }
            while (this._reap.length) {
                this._pool.free(this._reap.pop());
            }
        };
        ParticleSystem.prototype.draw = function (r, mtx, alpha) {
            this.update();
            r.setDrawMode(this.getDrawMode());
            r.setMatrix(mtx);
            r.setAlpha(alpha);
            var ctx = r.getContext();
            var sr = this._image.getSampleRect();
            var e = this._image.getElement();
            var sx = sr.position.x;
            var sy = sr.position.y;
            var sw = sr.size.x;
            var sh = sr.size.y;
            var pw = sw * .5;
            var ph = sw * .5;
            for (var i = 0, l = this._pool.getUsedCount(); i < l; ++i) {
                var p = this._pool.getUsed(i);
                ctx.globalAlpha = p.a * alpha;
                ctx.drawImage(e, sx, sy, sw, sh, p.x - pw * p.s, p.y - pw * p.s, sw * p.s, sh * p.s);
            }
            ctx.globalAlpha = alpha;
        };
        return ParticleSystem;
    }(base.Node));
    base.ParticleSystem = ParticleSystem;
})(base || (base = {}));
var base;
(function (base) {
    var Glyph = (function () {
        function Glyph() {
            this.x = 0;
            this.y = 0;
            this.w = 16;
            this.h = 16;
            this.xoffset = 0;
            this.yoffset = 0;
            this.advance = 16;
            this.kerning = {};
        }
        return Glyph;
    }());
    base.Glyph = Glyph;
    var Font = (function () {
        function Font(image) {
            this._image = image;
            this._lineHeight = 12;
            this._lineBase = 0;
            this._glyphs = {};
        }
        Font.prototype.getImage = function () {
            return this._image;
        };
        Font.prototype.getLineHeight = function () {
            return this._lineHeight;
        };
        Font.prototype.getLineBase = function () {
            return this._lineBase;
        };
        Font.prototype.defineGlyph = function (c, x, y, w, h, xoffset, yoffset, advance) {
            var g = new Glyph();
            g.x = x;
            g.y = y;
            g.w = w;
            g.h = h;
            g.xoffset = xoffset;
            g.yoffset = yoffset;
            g.advance = advance;
            this._glyphs[c] = g;
            return this;
        };
        Font.prototype.defineKerning = function (c, next, kern) {
            var g = this._glyphs[c];
            if (!g) {
                return null;
            }
            g.kerning[next] = kern;
            return this;
        };
        Font.prototype.getGlyph = function (c) {
            var g = this._glyphs[c];
            if (!g)
                return null;
            return g;
        };
        Font.prototype.getKerning = function (c, next) {
            var g = this.getGlyph(c);
            if (!g)
                return 0;
            var k = g.kerning[next];
            if (!k)
                return 0;
            return k;
        };
        Font.prototype.parseCommon = function (xml) {
            var lineHeight = parseInt(xml.getAttribute('lineHeight'));
            var lineBase = parseInt(xml.getAttribute('base'));
            this._lineHeight = lineHeight;
            this._lineBase = lineBase;
        };
        Font.prototype.parseChars = function (xml) {
            var i = 0;
            var c = xml.childNodes[0];
            while (c != undefined) {
                if (c.nodeName === 'char') {
                    this.parseChar(c);
                }
                c = xml.childNodes[++i];
            }
        };
        Font.prototype.parseChar = function (xml) {
            var code = parseInt(xml.getAttribute('id'));
            var x = parseInt(xml.getAttribute('x'));
            var y = parseInt(xml.getAttribute('y'));
            var w = parseInt(xml.getAttribute('width'));
            var h = parseInt(xml.getAttribute('height'));
            var xoffset = parseInt(xml.getAttribute('xoffset'));
            var yoffset = parseInt(xml.getAttribute('yoffset'));
            var advance = parseInt(xml.getAttribute('xadvance'));
            this.defineGlyph(String.fromCharCode(code), x, y, w, h, xoffset, yoffset, advance);
        };
        Font.prototype.parseKernings = function (xml) {
            var i = 0;
            var c = xml.childNodes[0];
            while (c != undefined) {
                if (c.nodeName === 'kerning') {
                    this.parseKern(c);
                }
                c = xml.childNodes[++i];
            }
        };
        Font.prototype.parseKern = function (xml) {
            var code = parseInt(xml.getAttribute('first'));
            var next = parseInt(xml.getAttribute('second'));
            var kern = parseInt(xml.getAttribute('amount'));
            this.defineKerning(String.fromCharCode(code), String.fromCharCode(next), kern);
        };
        Font.prototype.initFromXML = function (xml) {
            var c = xml.firstChild.firstChild;
            while (c != null) {
                if (c.nodeName === 'common') {
                    this.parseCommon(c);
                }
                else if (c.nodeName === 'chars') {
                    this.parseChars(c);
                }
                else if (c.nodeName === 'kernings') {
                    this.parseKernings(c);
                }
                c = c.nextSibling;
            }
            return this;
        };
        return Font;
    }());
    base.Font = Font;
})(base || (base = {}));
var base;
(function (base) {
    var RenderCoord = (function () {
        function RenderCoord() {
        }
        return RenderCoord;
    }());
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(font, text) {
            if (text === void 0) { text = ""; }
            var _this = _super.call(this) || this;
            _this._font = font;
            _this._text = text;
            _this._render = new base.StaticList(text.length, function () { return new RenderCoord(); });
            _this._length = 0;
            _this._bounds = new base.Rect();
            _this.rebuild();
            return _this;
        }
        Text.prototype.setFont = function (f) {
            this._font = f;
            this.rebuild();
            return this;
        };
        Text.prototype.setText = function (str) {
            this._text = str;
            this.rebuild();
            return this;
        };
        Text.prototype.getBounds = function () {
            return this._bounds;
        };
        Text.prototype.getText = function () {
            return this._text;
        };
        Text.prototype.rebuild = function () {
            var s = this._text;
            var l = this._length = s.length;
            this._render.clear();
            this._bounds.position.setXY(0, 0);
            this._bounds.size.y = this._font.getLineHeight();
            var yy = 0;
            var xx = 0;
            for (var i = 0; i < l; ++i) {
                var c = s.charAt(i);
                var g = this._font.getGlyph(c);
                if (g && g.w > 0 && g.h > 0) {
                    var r = this._render.getNext();
                    var k = 0;
                    if (i < l - 1) {
                        k = this._font.getKerning(c, s.charAt(i + 1));
                    }
                    r.sx = g.x;
                    r.sy = g.y;
                    r.sw = g.w;
                    r.sh = g.h;
                    r.dx = xx + g.xoffset;
                    r.dy = yy + g.yoffset;
                    r.dw = g.w;
                    r.dh = g.h;
                    xx += g.advance + k;
                }
                else {
                    xx += g.advance + k;
                }
            }
            this._bounds.size.x = xx;
            this.setSize(this._bounds.size);
        };
        Text.prototype.draw = function (r, mtx, alpha) {
            r.setMatrix(mtx);
            r.setDrawMode(this.getDrawMode());
            r.setAlpha(alpha);
            var ctx = r.getContext();
            var e = this._font.getImage().getElement();
            var p = this.getPivot();
            for (var i = 0, l = this._render.size(); i < l; ++i) {
                var g = this._render.get(i);
                ctx.drawImage(e, g.sx, g.sy, g.sw, g.sh, g.dx - p.x, g.dy - p.y, g.dw, g.dh);
            }
        };
        return Text;
    }(base.Node));
    base.Text = Text;
})(base || (base = {}));
var base;
(function (base) {
    var Camera = (function () {
        function Camera(stage) {
            this._position = new base.Vec2();
            this._scaling = new base.Vec2(1, 1);
            this._rotation = 0;
            this._matrix = new base.Matrix();
            this._dirty = true;
            this._stage = stage;
        }
        Camera.prototype.getPosition = function () {
            return this._position;
        };
        Camera.prototype.setPosition = function (p) {
            this._position.set(p);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        };
        Camera.prototype.move = function (d) {
            this._position.add(d);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        };
        Camera.prototype.getZoom = function () {
            return this._scaling.x;
        };
        Camera.prototype.setZoom = function (z) {
            this._scaling.setXY(z, z);
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        };
        Camera.prototype.getRotation = function () {
            return base.toDegree(this._rotation);
        };
        Camera.prototype.setRotation = function (deg) {
            this._rotation = base.toRadian(base.wrap(deg, 0, 360));
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        };
        Camera.prototype.rotate = function (deg) {
            this._rotation = base.toRadian(base.wrap(base.toDegree(this._rotation) + deg, 0, 360));
            this._dirty = true;
            this._stage.markAsDirty();
            return this;
        };
        Camera.prototype.getMatrix = function () {
            if (this._dirty) {
                this._position.invert();
                this._matrix.buildNodeMatrix(this._position, this._scaling, base.Vec2.ZERO, -this._rotation);
                this._position.invert();
                this._dirty = false;
            }
            return this._matrix;
        };
        return Camera;
    }());
    base.Camera = Camera;
})(base || (base = {}));
var base;
(function (base) {
    var DrawNode = (function () {
        function DrawNode() {
            this.node = null;
            this.matrix = new base.Matrix();
            this.alpha = 1;
        }
        return DrawNode;
    }());
    var Stage = (function () {
        function Stage(output) {
            if (output === void 0) { output = null; }
            this._root = new base.Node();
            this._camera = new base.Camera(this);
            this._drawOrder = new base.StaticList(128, function () { return new DrawNode(); });
            this._matrix = new base.Matrix();
            this._invMatrix = new base.Matrix();
            this._tempvector = new base.Vec2();
            this._dirty = true;
            if (output === null) {
                output = base.getScreen();
            }
            this._output = output;
            this._root.setStage(this);
        }
        Stage.prototype.markAsDirty = function () {
            this._dirty = true;
            return this;
        };
        Stage.prototype.isDirty = function () {
            return this._dirty;
        };
        Stage.prototype.getOutput = function () {
            return this._output;
        };
        Stage.prototype.setOutput = function (out) {
            this._output = (out == null ? base.getScreen() : out);
            return this;
        };
        Stage.prototype.getCamera = function () {
            return this._camera;
        };
        Stage.prototype.addChild = function (node) {
            this._root.addChild(node);
            return this;
        };
        Stage.prototype.clearChildren = function () {
            this._root.clearChildren();
            return this;
        };
        Stage.prototype.getChildCount = function () {
            return this._root.getChildCount();
        };
        Stage.prototype.getChildCountDeep = function () {
            return this._root.getChildCountDeep();
        };
        Stage.prototype.getDrawables = function (node, matrix, alpha) {
            var n = node.getFirstChild();
            while (n != null) {
                if (n.isVisible()) {
                    var d = this._drawOrder.getNext();
                    d.node = n;
                    d.matrix.set(matrix).multiply(n.getMatrix());
                    d.alpha = d.node.getAlpha() * alpha;
                    this.getDrawables(n, d.matrix, d.alpha);
                }
                n = n.getNextNode();
            }
        };
        Stage.prototype.draw = function () {
            this.updateMatrix();
            this._drawOrder.clear();
            this.getDrawables(this._root, this._matrix, 1.0);
            var r = this._output.getRenderer();
            for (var i = 0, l = this._drawOrder.size(); i < l; ++i) {
                var d = this._drawOrder.get(i);
                d.node.draw(r, d.matrix, d.alpha);
            }
        };
        Stage.prototype.updateMatrix = function () {
            if (this._dirty) {
                this._matrix
                    .identity()
                    .translateXY(this._output.getWidth() * .5, this._output.getHeight() * .5)
                    .multiply(this._camera.getMatrix());
                this._invMatrix.set(this._matrix).invert();
            }
        };
        Stage.prototype.screenToWorld = function (coordinates, target) {
            if (target === void 0) { target = this._tempvector; }
            this.updateMatrix();
            return this._invMatrix.project(coordinates, target);
        };
        Stage.prototype.worldToScreen = function (coordinates, target) {
            if (target === void 0) { target = this._tempvector; }
            this.updateMatrix();
            return this._matrix.project(coordinates, target);
        };
        return Stage;
    }());
    base.Stage = Stage;
})(base || (base = {}));
var base;
(function (base) {
    var Status;
    (function (Status) {
        Status[Status["LOAD"] = 0] = "LOAD";
        Status[Status["RUN"] = 1] = "RUN";
    })(Status || (Status = {}));
    var gamediv = (document.getElementById('game'));
    var canvas = document.createElement('canvas');
    var status = Status.LOAD;
    var loader = new base.Loader();
    var logbuffer = new base.Ringbuffer(16);
    var loops = new base.SafeList();
    var timers = new base.SafeList();
    var tweens = new base.SafeList();
    var animators = new base.SafeList();
    var screen = new base.Surface(canvas);
    var mixer = new base.Mixer();
    var keyboard = new base.Keyboard();
    var mouse = new base.Mouse();
    var touch = new base.Touch();
    var time_current = 0;
    var time_last = 0;
    var time_delta_millis = 0;
    var time_delta = 0;
    var screen_w = 800;
    var screen_h = 600;
    var sizeratio = 1.0;
    var triggerFullscreen = false;
    var triggerMouseCapture = false;
    loader.onProgress = function (msg) {
        log_preload(msg);
    };
    loader.onError = function (msg) {
        log_preload(msg);
        log_preload("Opening space inventory...");
        throw new Error("Opening space inventory...");
    };
    try {
        Waud.init();
    }
    catch (ignore) {
        console.error("Failed to init Waud.js - sound will not be available");
    }
    requestAnimationFrame(updateTime);
    gamediv.style.width = screen_w + "px";
    gamediv.style.height = screen_h + "px";
    console.log("***        Uncool Bens Jam Base        ***");
    console.log("***  Oldskool spirit - newschool tech  ***");
    function repaintlog() {
        if (status === Status.LOAD) {
            var content = '';
            for (var i = 0; i < logbuffer.size(); ++i) {
                var s = logbuffer.get(i);
                content += '<span>' + s + '</span><br>';
            }
            gamediv.innerHTML = content;
        }
    }
    function initInput() {
        var updateTouchXY = function (e) {
            if (e.touches.length == 0) {
                return;
            }
            var t = e.touches[0];
            var bounds = canvas.getBoundingClientRect();
            var touchx = (t.clientX - (bounds.left | 0)) / sizeratio;
            var touchy = (t.clientY - (bounds.top | 0)) / sizeratio;
            touch.updateTouchPosition(touchx, touchy);
        };
        var updateMouseXY = function (e) {
            var bounds = canvas.getBoundingClientRect();
            var mouseX = (e.clientX - (bounds.left | 0)) / sizeratio;
            var mouseY = (e.clientY - (bounds.top | 0)) / sizeratio;
            mouse.mouseMoved(mouseX, mouseY);
        };
        var cancel = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        var reservedKey = function (code) {
            switch (code) {
                case 18:
                case 115:
                case 116:
                case 122:
                case 123:
                    return true;
            }
            return false;
        };
        window.onkeydown = function (e) {
            if (triggerFullscreen) {
                requestFullscreenActual();
            }
            if (triggerMouseCapture) {
                requestMouseCaptureActual();
            }
            keyboard.keyDown(e.keyCode);
            keyboard._executeNativeHandlers(e);
            if (!reservedKey(e.keyCode)) {
                cancel(e);
            }
        };
        window.onkeyup = function (e) {
            keyboard.keyUp(e.keyCode);
            keyboard._executeNativeHandlers(e);
            if (!reservedKey(e.keyCode)) {
                cancel(e);
            }
        };
        window.onmousedown = function (e) {
            if (triggerFullscreen) {
                requestFullscreenActual();
            }
            if (triggerMouseCapture) {
                requestMouseCaptureActual();
            }
            updateMouseXY(e);
            mouse.buttonDown(e.button);
            cancel(e);
        };
        window.oncontextmenu = function (e) {
            updateMouseXY(e);
            mouse.buttonDown(e.button);
            cancel(e);
        };
        window.onmouseup = function (e) {
            updateMouseXY(e);
            mouse.buttonUp(e.button);
            cancel(e);
        };
        window.onmousemove = function (e) {
            updateMouseXY(e);
            cancel(e);
        };
        window.onmousewheel = function (e) {
            updateMouseXY(e);
            mouse.buttonDown(e.wheelDelta > 0 ? base.MouseButton.WHEEL_UP : base.MouseButton.WHEEL_DOWN);
            cancel(e);
        };
        window.ontouchstart = function (e) {
            updateTouchXY(e);
            touch.touchStart();
            e.stopPropagation();
        };
        window.ontouchmove = function (e) {
            updateTouchXY(e);
            e.stopPropagation();
        };
        window.ontouchend = function (e) {
            updateTouchXY(e);
            touch.touchEnd();
            e.stopPropagation();
        };
        document.addEventListener('gesturestart', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    }
    function updateTime(timestamp) {
        time_delta_millis = timestamp - time_current;
        time_last = time_current;
        time_current = timestamp;
        if (time_delta_millis > 667) {
            time_delta_millis = 0;
        }
        time_delta = time_delta_millis * 0.001;
    }
    function mainLoop(time) {
        updateTime(time);
        keyboard.update();
        mouse.update();
        touch.update();
        timers.forEach(function (t) { return t.update(time_delta_millis); });
        tweens.forEach(function (t) { return t.update(time_delta_millis); });
        animators.forEach(function (a) { return a.update(time_delta); });
        loops.forEach(function (loop) { return loop(); });
        mixer.update();
        requestAnimationFrame(mainLoop);
    }
    base.onResize = function () { };
    function run() {
        status = Status.RUN;
        gamediv.innerHTML = '';
        gamediv.appendChild(canvas);
        setScreenSize(screen_w, screen_h);
        gamediv.style.width = "100%";
        gamediv.style.height = "100%";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.transform = "translate(-50%,-50%)";
        canvas.style.position = "absolute";
        var resize = function () {
            base.onResize();
            var width = window.innerWidth;
            var height = window.innerHeight;
            var wratio = width / screen_w;
            var hratio = height / screen_h;
            sizeratio = Math.min(wratio, hratio);
            canvas.style.width = ((screen_w * sizeratio) | 0) + "px";
            canvas.style.height = ((screen_h * sizeratio) | 0) + "px";
        };
        window.onresize = resize;
        resize();
        requestAnimationFrame(mainLoop);
    }
    function requestFullscreenActual() {
        triggerFullscreen = false;
        try {
            screenfull.request(canvas);
            return true;
        }
        catch (ignore) {
            console.error("Failed to request fullscreen mode through screenfull.js");
        }
        return false;
    }
    function requestMouseCaptureActual() {
        triggerMouseCapture = false;
        canvas.requestPointerLock();
        return true;
    }
    function start(assetList, onSuccess) {
        if (assetList === void 0) { assetList = null; }
        if (onSuccess === void 0) { onSuccess = function () { }; }
        initInput();
        if (assetList != null) {
            loader.onComplete = function () {
                if (!loader.hasFailed()) {
                    run();
                    onSuccess();
                }
            };
            loader.load(assetList);
            log_preload("Loading " + assetList.size() + " items...");
        }
        else {
            run();
            onSuccess();
        }
    }
    base.start = start;
    function log_preload(msg) {
        console.log(msg);
        if (status === Status.LOAD) {
            logbuffer.add(msg);
            repaintlog();
        }
    }
    base.log_preload = log_preload;
    function getTimeCurrent() {
        return time_current;
    }
    base.getTimeCurrent = getTimeCurrent;
    function getTimeLast() {
        return time_last;
    }
    base.getTimeLast = getTimeLast;
    function getTimeDelta() {
        return time_delta;
    }
    base.getTimeDelta = getTimeDelta;
    function getTimeDeltaMillis() {
        return time_delta_millis;
    }
    base.getTimeDeltaMillis = getTimeDeltaMillis;
    function getScreen() {
        return screen;
    }
    base.getScreen = getScreen;
    function getMixer() {
        return mixer;
    }
    base.getMixer = getMixer;
    function getKeyboard() {
        return keyboard;
    }
    base.getKeyboard = getKeyboard;
    function getMouse() {
        return mouse;
    }
    base.getMouse = getMouse;
    function getTouch() {
        return touch;
    }
    base.getTouch = getTouch;
    function setScreenSize(w, h) {
        screen_w = w | 0;
        screen_h = h | 0;
        gamediv.style.width = screen_w + "px";
        gamediv.style.height = screen_h + "px";
        screen.setSize(screen_w, screen_h);
    }
    base.setScreenSize = setScreenSize;
    function getLoader() {
        return loader;
    }
    base.getLoader = getLoader;
    function addLoop(loop) {
        loops.add(loop);
    }
    base.addLoop = addLoop;
    function removeLoop(loop) {
        loops.remove(loop);
    }
    base.removeLoop = removeLoop;
    function addTimer(timer) {
        timers.add(timer);
    }
    base.addTimer = addTimer;
    function removeTimer(timer) {
        timers.remove(timer);
    }
    base.removeTimer = removeTimer;
    function addTween(tween) {
        tweens.add(tween);
    }
    base.addTween = addTween;
    function removeTween(tween) {
        tweens.remove(tween);
    }
    base.removeTween = removeTween;
    function addAnimator(animator) {
        animators.add(animator);
    }
    base.addAnimator = addAnimator;
    function removeAnimator(animator) {
        animators.remove(animator);
    }
    base.removeAnimator = removeAnimator;
    function requestMouseCapture() {
        triggerMouseCapture = true;
    }
    base.requestMouseCapture = requestMouseCapture;
    function exitMouseCaputre() {
        try {
            document.exitPointerLock();
        }
        catch (ignore) {
            console.log("Cannot exit pointer lock");
        }
    }
    base.exitMouseCaputre = exitMouseCaputre;
    function requestFullscreen() {
        triggerFullscreen = true;
    }
    base.requestFullscreen = requestFullscreen;
    function exitFullscreen() {
        try {
            screenfull.exit();
            return true;
        }
        catch (ignore) {
            console.error("Failed to exit fullscreen mode through screenfull.js");
        }
        return false;
    }
    base.exitFullscreen = exitFullscreen;
})(base || (base = {}));
var game;
(function (game) {
    var Crosshair = (function (_super) {
        __extends(Crosshair, _super);
        function Crosshair() {
            return _super.call(this, game.loader.getImage("crosshair")) || this;
        }
        Crosshair.prototype.update = function () {
            var mouse = base.getMouse();
            var mousepos = game.stage.screenToWorld(mouse.getPosition());
            this.setPosition(mousepos);
            this.setScaleXY(0.75 + Math.sin(base.getTimeCurrent() * 0.005) * 0.025);
        };
        return Crosshair;
    }(base.Sprite));
    game.Crosshair = Crosshair;
})(game || (game = {}));
var game;
(function (game) {
    var Actor = (function () {
        function Actor(sprite) {
            this._sprite = sprite;
            this._sprite.setVisible(false);
            this._alive = false;
            var w = sprite.getWidth();
            var h = sprite.getHeight();
            this._bounds = new base.Rect(-w, -h, w, h);
            game.game.addActor(this);
        }
        Actor.prototype.isAlive = function () {
            return this._alive;
        };
        Actor.prototype.spawn = function (position) {
            this._sprite.setPosition(position);
            this._sprite.setVisible(true);
            this._alive = true;
        };
        Actor.prototype.die = function () {
            this._sprite.setVisible(false);
            this._alive = false;
        };
        Actor.prototype.getSprite = function () {
            return this._sprite;
        };
        Actor.prototype.getBounds = function () {
            return this._bounds;
        };
        Actor.prototype.update = function () { };
        return Actor;
    }());
    game.Actor = Actor;
})(game || (game = {}));
var game;
(function (game) {
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet() {
            var _this = _super.call(this, new base.Sprite(base.getLoader().getImage("laser"))) || this;
            _this._sound = base.getLoader().getSound("laser");
            _this._direction = new base.Vec2();
            _this._speed = 100;
            _this._temp = new base.Vec2();
            return _this;
        }
        Bullet.prototype.setDirection = function (d) {
            this._direction.set(d).normalize();
        };
        Bullet.prototype.setSpeed = function (spd) {
            this._speed = spd;
        };
        Bullet.prototype.update = function () {
            if (this.isAlive()) {
                this._temp.set(this._direction).multiplyXY(this._speed);
                this.getSprite().move(this._temp);
            }
        };
        return Bullet;
    }(game.Actor));
    game.Bullet = Bullet;
})(game || (game = {}));
var game;
(function (game) {
    var Explosion = (function () {
        function Explosion() {
            var _this = this;
            if (Explosion.animation === null) {
                Explosion.animation = new base.Animation(game.loader.getImage("explosion"), 134, 134);
                Explosion.animation.addFrameSequence(12);
            }
            this._animator = new base.Animator(Explosion.animation);
            this._sprite = new base.Sprite(this._animator);
            this._animator.onComplete(function () {
                _this._animator.reset();
                _this._sprite.setVisible(false);
                _this._sprite.removeFromParent();
            });
            this._sound = game.loader.getSound("explosion1");
        }
        Explosion.prototype.spawn = function (pos) {
            this._sprite.setPosition(pos);
            this._sprite.setScaleXY(1);
            this._sprite.setVisible(true);
            this._animator.reset();
            this._animator.start();
            this._sound.play();
        };
        Explosion.prototype.getSprite = function () {
            return this._sprite;
        };
        Explosion.animation = null;
        return Explosion;
    }());
    game.Explosion = Explosion;
})(game || (game = {}));
var game;
(function (game) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this, new base.Sprite(game.loader.getImage("player"))) || this;
            var w = base.getScreen().getWidth();
            var h = base.getScreen().getHeight();
            _this._moveBounds = new base.Rect(-w * .5, -h * .5, w, h);
            return _this;
        }
        Player.prototype.update = function () {
            var mouse = base.getMouse();
            var keyboard = base.getKeyboard();
            var mousepos = game.stage.screenToWorld(mouse.getPosition());
            var dx = 0, dy = 0, speed = 225;
            if (keyboard.isKeyDown(base.Keys.W)) {
                dy -= speed;
            }
            if (keyboard.isKeyDown(base.Keys.S)) {
                dy += speed;
            }
            if (keyboard.isKeyDown(base.Keys.A)) {
                dx -= speed;
            }
            if (keyboard.isKeyDown(base.Keys.D)) {
                dx += speed;
            }
            var delta = base.getTimeDelta();
            var sprite = this.getSprite();
            sprite.moveXY(dx * delta, dy * delta);
            var pos = sprite.getPosition();
            var bounds = this.getBounds();
            bounds.position.setXY(pos.x - sprite.getWidth() * .5, pos.y - sprite.getHeight() * .5);
            this._moveBounds.confine(bounds);
            sprite.setPositionXY(bounds.position.x + sprite.getWidth() * .5, bounds.position.y + sprite.getHeight() * .5);
            var rot = base.wrap(base.toDegree(Math.atan2(pos.y - mousepos.y, mousepos.x - pos.x)), 0, 360);
            var invert = false;
            if (rot > 90)
                invert = true;
            if (rot > 270)
                invert = false;
            sprite.setRotation(invert ? 180 - rot : rot);
            sprite.setScaleXY(invert ? -1 : 1, 1);
        };
        return Player;
    }(game.Actor));
    game.Player = Player;
})(game || (game = {}));
var game;
(function (game_1) {
    game_1.loader = base.getLoader();
    game_1.stage = new base.Stage();
    game_1.game = null;
    function start() {
        game_1.game = new Game();
        game_1.game.init();
    }
    game_1.start = start;
    var Game = (function () {
        function Game() {
            var _this = this;
            this.explosions = [];
            base.addLoop(function () {
                _this.update();
            });
            for (var i = 0; i < 16; ++i) {
                this.explosions[i] = new game_1.Explosion();
            }
            this.actors = new base.SafeList();
            this.background = new base.Sprite(base.getLoader().getImage("background"));
            game_1.stage.addChild(this.background);
            this.actorLayer = new base.Node();
            game_1.stage.addChild(this.actorLayer);
            this.fxLayer = new base.Node();
            game_1.stage.addChild(this.fxLayer);
            this.uiLayer = new base.Node();
            game_1.stage.addChild(this.uiLayer);
            this.font = game_1.loader.getFont("font");
            this.text = new base.Text(this.font, "Score: 0000");
            this.text.setPivotPosition(base.PivotPosition.MIDDLE);
            this.text.setPositionXY(0, -250);
            this.uiLayer.addChild(this.text);
        }
        Game.prototype.init = function () {
            this.player = new game_1.Player();
            this.player.spawn(new base.Vec2());
            this.crosshair = new game_1.Crosshair();
            this.uiLayer.addChild(this.crosshair);
            this.particles = new base.ParticleSystem(game_1.loader.getImage("dot"));
            this.fxLayer.addChild(this.particles);
            this.emitter = new base.ParticleEmitter();
            this.emitter.addSystem(this.particles);
            this.crosshair.addChild(this.emitter);
            this.emitter.setRate(100);
            this.particles.setGravity(new base.Vec2(0, 200));
        };
        Game.prototype.addActor = function (a) {
            this.actors.add(a);
            this.actorLayer.addChild(a.getSprite());
        };
        Game.prototype.removeActor = function (a) {
            this.actors.remove(a);
            a.getSprite().removeFromParent();
        };
        Game.prototype.update = function () {
            var mouse = base.getMouse();
            var mousepos = game_1.stage.screenToWorld(mouse.getPosition());
            this.emitter.rotate(1);
            if (mouse.isButtonPressed(base.MouseButton.LEFT)) {
                var e = this.explosions.pop();
                e.spawn(mousepos);
                this.fxLayer.addChild(e.getSprite());
                this.explosions.unshift(e);
            }
            this.actors.forEach(function (a) { return a.update(); });
            this.crosshair.update();
            this.background.setScaleXY(1 + Math.cos(base.getTimeLast() * 0.00015) * 0.05);
            this.background.setRotation(Math.sin(base.getTimeCurrent() * 0.00025) * 5);
            game_1.stage.draw();
        };
        return Game;
    }());
    game_1.Game = Game;
})(game || (game = {}));
var main;
(function (main) {
    var assets = new base.AssetList();
    assets.setImageBaseURL("gfx/");
    assets.setSoundBaseURL("sfx/");
    assets.setMusicBaseURL("mus/");
    assets.setFontBaseUrl("font/");
    assets.addImage("player", "dude.png");
    assets.addImage("enemy", "enemy.png");
    assets.addImage("bullet", "laser.png");
    assets.addImage("crosshair", "crosshair.png");
    assets.addImage("explosion", "explosion_anim.png");
    assets.addImage("background", "space.png");
    assets.addImage("dot", "dot.png");
    assets.addFont("font", "font.xml", "font.png");
    assets.addSound("explosion1", "explosion1.mp3");
    assets.addSound("laser", "laser.mp3");
    base.log_preload("*** The Greatest Game Ever Initializing ***");
    base.log_preload("   ");
    base.start(assets, function () {
        game.start();
    });
})(main || (main = {}));
//# sourceMappingURL=game.js.map