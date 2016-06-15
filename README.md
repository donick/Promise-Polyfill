# PromisePolyfill
ES6 PromisePolyfill for browsers do not support ES6 Promise

#####ES6 Promise usage
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  > **Tip:** `catch` is reserved wording in IE6-IE8.
  If code working on them, using following code instead:
  ```
  promiseInstace['catch'](function(v){
  });
  ```
  
#####How to use?

  Download [promisepolyfill.min.js](https://github.com/donick/PromisePolyfill/blob/master/dist/promisepolyfill.min.js)
  
  in browser: IE6+, Chrome, Firefox, Safari, Opera
  ```
  load js file in html: 
  <script src="https://github.com/donick/PromisePolyfill/blob/master/dist/promisepolyfill.min.js"></script>
  
  //get Promise Object
  var Promise = PromisePolyfill();
  
  //using PromisePolyfill instead of global Promise
  //window.Promise or self.Promise(in worker)
  PromisePolyfill(true);
  ```
  in node.js:
  ```
  var promisepolyfill = require('./promisepolyfill.min.js');
  ```
  in AMD:
  ```
  define(['promisepolyfill'], function(promise) {
    //do something
  });
  ```
#####License
  [MIT License](https://github.com/donick/PromisePolyfill/blob/master/LICENSE)
