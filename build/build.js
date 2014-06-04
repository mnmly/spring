/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("mnmly~remap@0.0.1", Function("exports, module",
"/**\n\
 * Exopse `remap`\n\
 */\n\
\n\
module.exports = remap;\n\
\n\
/**\n\
* Re-maps a number from one range to another. In the example above, the number '25' is converted from\n\
* a value in the range 0..100 into a value that ranges from the left edge (0) to the right edge (width) of the screen.\n\
* Numbers outside the range are not clamped to 0 and 1, because out-of-range values are often intentional and useful.\n\
*\n\
* @param {float} value        The incoming value to be converted\n\
* @param {float} istart       Lower bound of the value's current range\n\
* @param {float} istop        Upper bound of the value's current range\n\
* @param {float} ostart       Lower bound of the value's target range\n\
* @param {float} ostop        Upper bound of the value's target range\n\
*\n\
* @returns {float}\n\
*/\n\
\n\
function remap(value, istart, istop, ostart, ostop) {\n\
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));\n\
};\n\
\n\
//# sourceURL=components/mnmly/remap/0.0.1/index.js"
));

require.modules["mnmly-remap"] = require.modules["mnmly~remap@0.0.1"];
require.modules["mnmly~remap"] = require.modules["mnmly~remap@0.0.1"];
require.modules["remap"] = require.modules["mnmly~remap@0.0.1"];


require.register("component~raf@1.1.3", Function("exports, module",
"/**\n\
 * Expose `requestAnimationFrame()`.\n\
 */\n\
\n\
exports = module.exports = window.requestAnimationFrame\n\
  || window.webkitRequestAnimationFrame\n\
  || window.mozRequestAnimationFrame\n\
  || window.oRequestAnimationFrame\n\
  || window.msRequestAnimationFrame\n\
  || fallback;\n\
\n\
/**\n\
 * Fallback implementation.\n\
 */\n\
\n\
var prev = new Date().getTime();\n\
function fallback(fn) {\n\
  var curr = new Date().getTime();\n\
  var ms = Math.max(0, 16 - (curr - prev));\n\
  var req = setTimeout(fn, ms);\n\
  prev = curr;\n\
  return req;\n\
}\n\
\n\
/**\n\
 * Cancel.\n\
 */\n\
\n\
var cancel = window.cancelAnimationFrame\n\
  || window.webkitCancelAnimationFrame\n\
  || window.mozCancelAnimationFrame\n\
  || window.oCancelAnimationFrame\n\
  || window.msCancelAnimationFrame\n\
  || window.clearTimeout;\n\
\n\
exports.cancel = function(id){\n\
  cancel.call(window, id);\n\
};\n\
\n\
//# sourceURL=components/component/raf/1.1.3/index.js"
));

require.modules["component-raf"] = require.modules["component~raf@1.1.3"];
require.modules["component~raf"] = require.modules["component~raf@1.1.3"];
require.modules["raf"] = require.modules["component~raf@1.1.3"];


require.register("spring", Function("exports, module",
"/**\n\
 * Expose `Spring`\n\
 */\n\
\n\
module.exports = Spring;\n\
\n\
function Spring(opt){\n\
\n\
  opt = opt || {};\n\
  this.speed = opt.speed || 1 / 60.0;\n\
  this.tension = opt.tension || 80;\n\
  this.friction = opt.friction || 8;\n\
  this.velocity = opt.velocity || 0;\n\
  this.tolerance = opt.tolerance || 0.1;\n\
  this.reset();\n\
\n\
}\n\
\n\
/**\n\
 * Reset properties\n\
 */\n\
\n\
Spring.prototype.reset = function(){\n\
  this.start = 0;\n\
  this.current = this.start;\n\
  this.end = 100;\n\
  this.moving = true;\n\
};\n\
\n\
\n\
/**\n\
 * Step frame\n\
 *\n\
 * @return {Number} current [0-1]\n\
 */\n\
\n\
Spring.prototype.step = function(){\n\
\n\
  var target = this.current;\n\
  var before = {\n\
    x: target - this.end,\n\
    v: this.velocity,\n\
    tension: this.tension,\n\
    friction: this.friction\n\
  };\n\
\n\
  var after = this.integrate(before, this.speed);\n\
  var velocity = after.v;\n\
  var netFloat = after.x;\n\
  var net1DVelocity = after.v;\n\
  var netValueIsLow = Math.abs(netFloat) < this.tolerance;\n\
  var netVelocityIsLow = Math.abs(net1DVelocity) < this.tolerance;\n\
  var stop = netVelocityIsLow && netVelocityIsLow;\n\
\n\
  this.current = this.end + after.x;\n\
\n\
  this.moving = !stop;\n\
\n\
  if(stop){\n\
    velocity = 0;\n\
    this.current = this.end;\n\
  }\n\
\n\
  this.velocity = velocity;\n\
  return this.current;\n\
};\n\
\n\
/**\n\
 * Returns all steps\n\
 *\n\
 * @param {Array} results\n\
 */\n\
\n\
Spring.prototype.all = function() {\n\
  this.reset();\n\
\n\
  var count = 0;\n\
  var results = [];\n\
  while (this.moving) {\n\
    if(count > 3000) {\n\
      throw Error(\"Spring: twoo many values\");\n\
    }\n\
    count++;\n\
    results.push(this.step());\n\
  }\n\
  return results;\n\
};\n\
\n\
/**\n\
 * Total time\n\
 *\n\
 * @return {Number} total time\n\
 */\n\
\n\
Spring.prototype.time = function() {\n\
  return this.all().length * this.speed;\n\
};\n\
\n\
/**\n\
 * Integarate state\n\
 * \n\
 * @param {Object} state\n\
 * @param {Number} speed\n\
 * @return {Object}\n\
 */\n\
\n\
Spring.prototype.integrate = function(state, speed) {\n\
\n\
  var a = this.evaluate(state);\n\
  var b = this.evaluate(state, speed * 0.5, a);\n\
  var c = this.evaluate(state, speed * 0.5, b);\n\
  var d = this.evaluate(state, speed, c);\n\
  \n\
  var dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);\n\
  var dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);\n\
\n\
  state.x = state.x + dxdt * speed;\n\
  state.v = state.v + dvdt * speed;\n\
\n\
  return state;\n\
};\n\
\n\
/**\n\
 * Evaluate acceleration\n\
 *\n\
 * @param {Object} state\n\
 * @param {Number} speed\n\
 * @param {Object} derivative\n\
 *\n\
 * @return {Object}\n\
 */\n\
\n\
Spring.prototype.evaluate = function(state, dt, derivative) {\n\
\n\
\tvar output = {};\n\
  var _state = {};\n\
\n\
  if(3 === arguments.length) {\n\
    _state.x = state.x + derivative.dx * dt;\n\
    _state.v = state.v + derivative.dv * dt;\n\
    _state.tension = state.tension;\n\
    _state.friction = state.friction;\n\
  } else {\n\
    _state = state;\n\
  }\n\
\n\
  output.dx = _state.v;\n\
\toutput.dv = this.accelerationForState(_state);\n\
\treturn output;\n\
};\n\
\n\
/**\n\
 * Calculate acceleration with setting\n\
 *\n\
 * @param {Object} state\n\
 * @return {Number} acceleration\n\
 */\n\
\n\
Spring.prototype.accelerationForState = function(state) {\n\
\treturn -state.tension * state.x - state.friction * state.v;\n\
};\n\
\n\
//# sourceURL=index.js"
));

require.modules["spring"] = require.modules["spring"];


require("spring")
