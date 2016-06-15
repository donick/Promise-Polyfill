# PromisePolyfill
PromisePolyfill for browsers do not support ES6 Promise

##ES6 Promise usage
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

##How to use PromisePolyfill?

  Download [promisepolyfill.min.js](https://github.com/donick/PromisePolyfill/blob/master/dist/promisepolyfill.min.js)
  
**`In browser: (supports IE6+, Chrome, Firefox, Safari, Opera)`**
  ```
  load js file in html: 
  <script src="https://github.com/donick/PromisePolyfill/blob/master/dist/promisepolyfill.min.js"></script>
  
  //get Promise Object
  var Promise = PromisePolyfill();
  
  //using PromisePolyfill instead of global Promise
  //window.Promise or self.Promise(in worker)
  PromisePolyfill(true);
  ```
    
 >**Note:** `catch` is reserved wording in IE6-IE8. If code working on them, using following solution instead.
  
  ```
  var Promise = PromisePolyfill();
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
  [MIT License](https://github.com/donick/PromisePolyfill/blob/master/LICENSE)
