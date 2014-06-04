
# spring

  Sometimes you want to use awesome [Framer.js](http://framerjs.com) Spring Animation outside of Framer.

  ![](http://c.mnmly.com/VtzI/spring.gif)

  ☞ [Demo](http://mnmly.github.io/spring)
  

## Installation

  Install with [component(1)](http://component.io):

    $ component install mnmly/spring


## Example
```javascript

var raf = require('raf');
var remap = require('mnmly-remap');
var Spring = require('spring');

var box = document.getElementById('box');
var target = {x: 200, y: 200};
var spring = new Spring({ velocity: 0.1, tension: 300, friction: 10 }); // Create spring instance

function step(){

  var p = spring.step();
  var x = remap(p, 0, 100, 0, target.x); // Map range  of [0..100] to [0..target.x]
  var y = remap(p, 0, 100, 0, target.y); // Map range of [0..100] to [0..target.y]

  box.style.transform = 'translate3d(' + p.x + 'px, ' + p.y + 'px, 0)';

  if(p.moving) {
    raf(step);
  } else {
    alert('Animation has finished!');
  }
}

step();
```
  

## API
  - [Spring](#spring)
  - [Spring.reset()](#springreset)
  - [Spring.step()](#springstep)

## Spring(opt)

  `opt` is an object that contains following:

  - `speed`: step interval (`1 / 60.0`)
  - `tension`: tenstion of spring (80)
  - `friction`: friction (8)
  - `velocity`: initial velocity (0)
  - `tolerance`: Threshold to check if this is still moving or not (0.1)

## Spring::reset()

  Reset properties

## Spring::step()

  Step frame. typically call this in `requestAnimationFrame`

## Spring::moving
  Boolean value indicating if the spring animation has ended or not.
