        var Promise = window.PromisePolyfill();

        new Promise(function(resolve, reject){
             setTimeout(function(){
                  resolve();
             }, 1000);
        }).then(function(){
             return new Promise(function(resolve, reject){
                 //setTimeout(function(){
                      reject('111111');
                 //}, 1000);
             });
        }).then(function(v){
             console.info(v);
        }, function(v){
             console.info(v);
        });
        
        
        
        if(isThenable(val)){
            val.then(onResolved, onRejected);

            return;
        }
        
        
        if(isThenable(val)){
            val.catch(onRejected);

            return;
        }
