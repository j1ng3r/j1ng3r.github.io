window.getter=function(){
    var getter={
        createCommand(name,func){
            getter.setGet(window,name,func);
        },
        command:new Proxy({},{
            set(obj,name,func){getter.createCommand(name,func);}
        }),
        setGet(obj,name,func){
            Object.defineProperty(obj,name,{get:func});
        },
        setSet(obj,name,func){
            Object.defineProperty(obj,name,{set:func});
        },
        createProxy(obj,key,o){
            return obj[key]=new Proxy({},o);
        },
    };
    var trolr=1;
    getter.setGet(getter,"trolr",function(){
        if(trolr){
            var a=Date.now();
            while(Date.now()-a<1000);
            return getter.createProxy({},0,{
                get(a,b,c){trolr--;a[b]}
            });
        }
    });
    return getter;
}();
