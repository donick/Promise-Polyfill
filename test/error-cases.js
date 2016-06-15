(function(){
    'use strict';
    var Promise = window.PromisePolyfill();
    //-------- reject in constructor
    new Promise(function(resolve, reject){
        reject('reject-err');
    });

    new Promise(function(resolve, reject){
        reject('reject-then-non-rejecter');
    }).then();

    new Promise(function(resolve, reject){
        reject('reject-catch-non-rejecter');
    }).catch();


    new Promise(function(resolve, reject){
        reject('reject-before-resolve');
        resolve('resolve-after-reject');
    });

    //-------- throw in construtor
    new Promise(function(resolve, reject){
        throw 'throw-err';
    });

    new Promise(function(resolve, reject){
        throw 'throw-before-resolve';
        resolve();
    });

    new Promise(function(resolve, reject){
        throw 'throw-before-reject';
        reject();
    });

    new Promise(function(resolve, reject){
        resolve('throw-after-reject');
        throw 'throw-after-resolve';
    });

    //pass to each handle of next chain
    var p = new Promise(function(resolve, reject){
        throw 'throw-then-err';
    });
    p.then();
    p.then();

    //-------- throw in handlers of then or catch 
    Promise.resolve().then(function(v){
        throw 'throw-in-then-resolver';
    });

    Promise.reject().then(null, function(v){
        throw 'throw-in-then-rejecter';
    });

    Promise.reject().catch(function(v){
        throw 'throw-in-catch-rejecter';
    });

})();

/*
Uncaught (in promise) reject-err
Uncaught (in promise) reject-before-resolve
Uncaught (in promise) throw-err
Uncaught (in promise) throw-before-resolve
Uncaught (in promise) throw-before-reject
✔ Uncaught (in promise) reject-then-non-rejecter
✔ Uncaught (in promise) reject-catch-non-rejecter
Uncaught (in promise) throw-then-err
Uncaught (in promise) throw-then-err
Uncaught (in promise) throw-in-then-resolver
Uncaught (in promise) throw-in-then-rejecter
Uncaught (in promise) throw-in-catch-rejecter



Uncaught (in promise) reject-err
✔ Uncaught (in promise) reject-then-non-rejecter
✔ Uncaught (in promise) reject-catch-non-rejecter
Uncaught (in promise) reject-before-resolve
Uncaught (in promise) throw-err
Uncaught (in promise) throw-before-resolve
Uncaught (in promise) throw-before-reject
Uncaught (in promise) throw-then-err
Uncaught (in promise) throw-then-err
Uncaught (in promise) throw-in-then-resolver
Uncaught (in promise) throw-in-then-rejecter
Uncaught (in promise) throw-in-catch-rejecter
*/
