# Promise-Polyfill
Promise-Polyfill for browsers do not support ES6 Promise, such as IE<=11, Safari<=7.1

##ES6 Promise usage
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  
##ES6 Promise standard
  http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects

##How to use Promise-Polyfill?

  Download [promisepolyfill.min.js](https://github.com/donick/Promise-Polyfill/blob/master/dist/promisepolyfill.min.js)
  
**`In browser: (supports IE6+, Chrome, Firefox, Safari, Opera)`**
  ```
  load promisepolyfill.js in html: 
  <script src="https://github.com/donick/Promise-Polyfill/blob/master/dist/promisepolyfill.min.js"></script>
  
  //get Promise Object of promisepolyfill
  var Promise = PromisePolyfill();
  
  //parameter set to true. change the  global.Promise(window.Promise or self.Promise in worker)
  //if native Promise is not exist, using PromisePolyfill instead of global.Promise
  //otherwise keep using native Promise on global.Promise
  PromisePolyfill(true);
  ```
    
 >**Note:** `catch` is reserved wording in IE6-IE8. If code working on them, using following solution instead.
  
  ```
  var Promise = PromisePolyfill(),
      p = new Promise(function(resolve, reject){
          setTimeout(reject, 1000, 'reject');
      });
  
  //p.catch(function(v){//do something});
  p['catch'](function(v){//do something});
  ```
**`In node.js:`**
  ```
  var promisepolyfill = require('./promisepolyfill.min.js');
  ```
**`In AMD:`**
  ```
  define(['promisepolyfill'], function(promise) {
    //do something
  });
  ```
##License
  [MIT License](https://github.com/donick/Promise-Polyfill/blob/master/LICENSE)
