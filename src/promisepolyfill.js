/*!
 * @overview PromisePolyfill JavaScript Library
 *
 * @copyright Donick Li
 * @author Donick Li <donick.li@gmail.com>
 * @license Released under the MIT license
 * https://github.com/donick/PromisePolyfill
 * @version v1.1.0
 * Date: 2016-06-21T11:00Z
 */
(function(){
    'use strict';

    var states = ['pending', 'resolved', 'rejected'],
        err = {
            isNotInstance: 'undefined is not a promise',
            isNotFunction: 'Promise resolver undefined is not a function'
        },
        baseId = 0,
        G = this,
        exportName = 'PromisePolyfill',
        promiseInfo = {};

    function hasOwnProp(o, prop){
        return o.hasOwnProperty(prop);
    }

    function isString(o){
        return typeof o === 'string';
    }

    function isFunction(o){
        return typeof o === 'function';
    }

    function isStringOrArray(o){
        return /(String|Array)/.test(Object.prototype.toString.call(o));
    }

    function isThenable(o){
        return o && (typeof o.then === 'function');
    }

    /**
     * check global whether have native promise
     * @return {Boolean} result
     */
    function haveNativePromise(){
        var NP = G.Promise;

        if(isFunction(NP) && NP.toString().indexOf('[native code]')){
            return true;
        }

        return false;
    }

    /**
     * get promise id
     * @return {String} promise id
     */
    function getId(){
        return 'promise-'+ baseId++;
    }

    /**
     * get promise info
     * @param  {String|Object} id
     * @return {Object}    promise info
     */
    function getInfo(id){
        if(isString(id)){
            if(!hasOwnProp(promiseInfo, id)){
                promiseInfo[id] = {};
            }

            return promiseInfo[id];
        }

        if(id instanceof Promise){
            return promiseInfo[id.id];
        }
    }

    /**
     * set promise info
     * @param {String|Object} id
     * @param {Object} o
     */
    function setInfo(id, o){
        var info = getInfo(id);

        function setProp(prop){
            return hasOwnProp(o, prop) ? o[prop] : info[prop];
        }
        info.id = id;
        info.status = setProp('status');
        info.value = setProp('value');
        info.next = setProp('next');
    }

    /**
     * Promise constructor
     * @param {Function} fn
     */
    function Promise(fn){
        if(!(this instanceof Promise)){
            throw err.isNotInstance;
        }

        if(!isFunction(fn)){
            throw err.isNotFunction;
        }

        var me = this,
            id = this.id = getId();

        setInfo(id, {
            status: states[0],
            value: void 0,
            next: []
        });

        function cbResolve(val){
            var id = me.id,
                info = getInfo(id);

            if(info.status !== states[0]){
                return;
            }

            setInfo(id, {
                status: states[1],
                value: val
            });

            notifyNext(id);
        }

        function cbReject(val){
            var id = me.id,
                info = getInfo(id),
                followed = info.next.length;

            if(info.status !== states[0]){
                return;
            }

            setInfo(id, {
                status: states[2],
                value: val
            });

            if(!followed){
                throw val;
            }else{
                notifyNext(id);
            }
        }

        setTimeout(function(){
            var info = getInfo(me),
                followed = info.next.length;

            try{
               fn(cbResolve, cbReject);
            }catch(e){
                if(info.status === states[1]){
                    //promise had been resolved, avoid the error
                    return;
                }

                if(followed){
                    cbReject(e);
                }else{
                    throw '(in promise) ' + e;
                }
            }
        }, 0);
    }

    /**
     * notify next when resolved or rejected
     * @param  {String} id promise id
     */
    function notifyNext(id){
        var next = getInfo(id).next;

        while(next.length){
            setTimeout(next.shift(), 0);
        }
    }

    /**
     * internal promise factory
     * @param  {Function} fn
     * @return {Object}      promise instance
     */
    function factory(fn){
        return new Promise(function(resolve, reject){
                fn(resolve, reject);
            });
    }

    /**
     * handle promise.all
     * @param  {Array|String}   o
     * @param  {Function} callback
     */
    function handleAll(o, callback){
        var len = o.length,
            count = len,
            vals = [],
            hadRejected = false,
            item;

        function onItemChanged(result, index, val){
            vals[index] = val;

            if(result){
                if(--count){
                    return;
                }

                callback(true, vals);
                //resolve(vals);

            }else{
                //avoid handle second reject
                if(hadRejected){
                    return;
                }

                hadRejected = true;

                callback(false, val);
                //reject(val);
            }
        }

        if(isString(o)){
            callback(true, o.split(''));
            //resolve(o.split(''));
        }else{
            for(var i = 0; i < len; i++){
                if(hadRejected){
                    break;
                }

                item = o[i];

                if(isThenable(item)){
                    item.then(
                        (function(i){
                            return function(v){
                                onItemChanged(true, i, v);
                            };
                        }(i)),
                        (function(i){
                            return function(v){
                                onItemChanged(false, i, v);
                            };
                        }(i)));
                }else{
                    Promise.resolve({
                            i: i,
                            item: item
                        })
                        .then(function(v){
                            onItemChanged(true, v.i, v.item);
                        });
                }
            }
        }
    }

    /**
     * promise.all
     * @param  {Array|String} o
     * @return {Object}   promise instance
     */
    function all(o){
        var callback;

        if(!isStringOrArray(o)){
            return;
        }

        handleAll(o, function(result, val){
            if(callback){
                //factory had done
                callback(result, val);
                return;
            }

            callback = function(resolve, reject){
                if(result){
                    resolve(val);
                }else{
                    reject(val);
                }
            };
        });

        return factory(function(resolve, reject){
            if(callback){
                //all specified promises had done
                callback(resolve, reject);
                return;
            }

            callback = function(result, val){
                if(result){
                    resolve(val);
                }else{
                    reject(val);
                }
            };
        });
    }

    /**
     * handle promise.race
     * @param  {Array|String}   o
     * @param  {Function} callback
     */
    function handleRace(o, callback){
        var len = o.length,
            hadDone = false,
            item;

        function onItemChanged(result, val){
            if(hadDone){
                return;
            }

            hadDone = true;

            if(result){
                callback(true, val);
                //resolve(val);
            }else{
                callback(false, val);
                //reject(val);
            }
        }

        if(isString(o)){
            callback(true, o.charAt(0));
            //resolve(o.charAt(0));
        }else{
            for(var i = 0; i < len; i++){
                if(hadDone){
                    break;
                }

                item = o[i];

                if(isThenable(item)){
                    item.then(
                        function(v){
                            onItemChanged(true, v);
                        },
                        function(v){
                            onItemChanged(false, v);
                        });
                }else{
                    Promise.resolve(item).then(function(v){
                        onItemChanged(true, v);
                    });
                }
            }
        }
    }

    /**
     * promise.race
     * @param  {Array|String} o
     * @return {Object}   promise instance
     */
    function race(o){
        var callback;

         if(!isStringOrArray(o)){
            return;
        }

        handleRace(o, function(result, val){
            if(callback){
                //factory had done
                callback(result, val);
                return;
            }

            callback = function(resolve, reject){
                if(result){
                    resolve(val);
                }else{
                    reject(val);
                }
            };
        });

        return factory(function(resolve, reject){
            if(callback){
                //one of specified promises had done
                callback(resolve, reject);
                return;
            }

            callback = function(result, val){
                if(result){
                    resolve(val);
                }else{
                    reject(val);
                }
            };
        });
    }

    /**
     * promise.resolve
     * @param  {Object} val passed value
     * @return {Object}     promise instance
     */
    function resolve(val){
        return factory(function(resolve, reject){
            resolve(val);
        });
    }

    /**
     * promise.reject
     * @param  {Object} val passed value
     * @return {Object}     promise instance
     */
    function reject(val){
        return factory(function(resolve, reject){
            reject(val);
        });
    }

    //Instance methods
    /**
     * promise.prototype.then
     * @param  {Function} onResolved resolve callback
     * @param  {Function} onRejected reject callback
     * @return {Object}     promise instance
     */
    function then(onResolved, onRejected){
        var me = this,
            info = getInfo(me),
            status = info.status,
            callback = function(){};

        if(status === states[0]){
            //add callback to the previous promise
            //after its status changed, this callback will be invoked
            info.next.push(function(){
                callback();
            });
        }

        function fn(resolve, reject){
            var info = getInfo(me),
                status = info.status,
                val = info.value;

            if(isThenable(val)){
                val.then(onResolved, onRejected);

                return;
            }

            if(status === states[0]){
                //set callback with resolve and reject of context
                callback = function(){
                    fn(resolve, reject);
                };

                return;
            }
            
            if(status === states[1]){
                if(isFunction(onResolved)){
                    try{
                        val = onResolved(val);

                        handleThenable(val, resolve, reject);
                    }catch(e){
                        reject(e);
                        //return;
                    }
                }else{
                    resolve(val);
                }

                //resolve(val);
            }else if(status === states[2]){
                //if onRejected was not provided, pass val to next then/catch
                if(isFunction(onRejected)){
                    try{
                        //resolved this reject, and pass val to next then
                        val = onRejected(val);

                        handleThenable(val, resolve, reject);
                    }catch(e){
                        //catch error in onRejected
                        reject(e);
                    }

                }else{
                    reject(val);
                }
            }
        }

        return factory(fn);
    }

    /**
     * promise.prototype.catch
     * @param  {Function} onRejected reject callback
     * @return {Object}     promise instance
     */
    function catch_(onRejected){
        var me = this,
            info = getInfo(me),
            status = info.status,
            callback = function(){};

        if(status === states[0]){
            info.next.push(function(){
                callback();
            });
        }

        function fn(resolve, reject){
            var info = getInfo(me),
                status = info.status,
                val = info.value;

            if(isThenable(val)){
                val.catch(onRejected);

                return;
            }

            if(status === states[0]){
                //set callback with resolve and reject of context
                callback = function(){
                    fn(resolve, reject);
                };

                return;
            }

            if(status === states[2]){
                if(isFunction(onRejected)){
                    try{
                        val = onRejected(val);

                        handleThenable(val, resolve, reject);
                    }catch(e){
                        //catch error in onRejected
                        reject(e);
                    }
                }else{
                    reject(val);
                }
            }
        }

        return factory(fn);
    }

    /**
     * handle thenable for returning new-promise in then
     * @param  {Object} val     value from then
     * @param  {Function} resolve resolver callback
     * @param  {Function} reject  rejecter callback
     */
    function handleThenable(val, resolve, reject){
        if(isThenable(val)){
            val.then(
                function(v){
                    resolve(v);
                },
                function(v){
                    reject(v);
                });
        }else{
            resolve(val);
        }
    }

    Promise.all = all;
    Promise.race = race;
    Promise.reject = reject;
    Promise.resolve = resolve;
    Promise.$info = function(P, prop){
        if(!isThenable(P)){
            return;
        }

        var info = getInfo(P.id),
            result = prop ? info[prop] : info;

        return result;
    };

    Promise.prototype = {
        constructor: Promise,
        then: then,
        //fix IE6-IE8 `catch` is reserved
        "catch": catch_
    };

    //for browsers, on window or self object(worker)
    if(G){
        G[exportName] = function(force){
            if(force){
                if(haveNativePromise()){
                    //if have native promise, choose native promise
                    return G.Promise;
                }

                G.Promise = Promise;
            }

            return Promise;
        };
    }

    //as AMD module
    if (typeof define === "function" && define.amd) {
        define(exportName, [], function() {
            return Promise;
        });
    }

    //as CommonJS/node module
    if(typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = Promise;
    }
}).call(this);
