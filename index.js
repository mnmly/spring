/**
 * Expose `Spring`
 */

module.exports = Spring;

function Spring(opt){

  opt = opt || {};
  this.speed = opt.speed || 1 / 60.0;
  this.tension = opt.tension || 80;
  this.friction = opt.friction || 8;
  this.velocity = opt.velocity || 0;
  this.tolerance = opt.tolerance || 0.1;
  this.reset();

}

/**
 * Reset properties
 */

Spring.prototype.reset = function(){
  this.start = 0;
  this.current = this.start;
  this.end = 100;
  this.moving = true;
};


/**
 * Step frame
 *
 * @return {Number} current [0-1]
 */

Spring.prototype.step = function(){

  var target = this.current;
  var before = {
    x: target - this.end,
    v: this.velocity,
    tension: this.tension,
    friction: this.friction
  };

  var after = this.integrate(before, this.speed);
  var velocity = after.v;
  var netFloat = after.x;
  var net1DVelocity = after.v;
  var netValueIsLow = Math.abs(netFloat) < this.tolerance;
  var netVelocityIsLow = Math.abs(net1DVelocity) < this.tolerance;
  var stop = netVelocityIsLow && netVelocityIsLow;

  this.current = this.end + after.x;

  this.moving = !stop;

  if(stop){
    velocity = 0;
    this.current = this.end;
  }

  this.velocity = velocity;
  return this.current;
};

/**
 * Returns all steps
 *
 * @param {Array} results
 */

Spring.prototype.all = function() {
  this.reset();

  var count = 0;
  var results = [];
  while (this.moving) {
    if(count > 3000) {
      throw Error("Spring: twoo many values");
    }
    count++;
    results.push(this.step());
  }
  return results;
};

/**
 * Total time
 *
 * @return {Number} total time
 */

Spring.prototype.time = function() {
  return this.all().length * this.speed;
};

/**
 * Integarate state
 * 
 * @param {Object} state
 * @param {Number} speed
 * @return {Object}
 */

Spring.prototype.integrate = function(state, speed) {

  var a = this.evaluate(state);
  var b = this.evaluate(state, speed * 0.5, a);
  var c = this.evaluate(state, speed * 0.5, b);
  var d = this.evaluate(state, speed, c);
  
  var dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
  var dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

  state.x = state.x + dxdt * speed;
  state.v = state.v + dvdt * speed;

  return state;
};

/**
 * Evaluate acceleration
 *
 * @param {Object} state
 * @param {Number} speed
 * @param {Object} derivative
 *
 * @return {Object}
 */

Spring.prototype.evaluate = function(state, dt, derivative) {

	var output = {};
  var _state = {};

  if(3 === arguments.length) {
    _state.x = state.x + derivative.dx * dt;
    _state.v = state.v + derivative.dv * dt;
    _state.tension = state.tension;
    _state.friction = state.friction;
  } else {
    _state = state;
  }

  output.dx = _state.v;
	output.dv = this.accelerationForState(_state);
	return output;
};

/**
 * Calculate acceleration with setting
 *
 * @param {Object} state
 * @return {Number} acceleration
 */

Spring.prototype.accelerationForState = function(state) {
	return -state.tension * state.x - state.friction * state.v;
};
