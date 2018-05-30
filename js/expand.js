Object.assign(Boolean,{
    random:v=>Math.random()<v
});
Object.assign(String,{
    reverse(s){
        return s.split('').reverse().join('');
    }
});
Object.assign(Object,{
    deepCopy(o){
        try{
            JSON.stringify(o);
        	if(typeof o=='object'){
        		var i,r=Array.isArray(o)?[]:{};
        		for(i in o)r[i]=Object.deepCopy(o[i]);
        		return r;
        	} else return o;
        } catch(e){
            throw"Can't deepCopy circular object (yet).";
        }
    },
    indexOf(o,v){
        for(var i in o)
            if(o[i]==v)return i;
        return-1;
    },
    defaultSetThis(o,v){
        for(var i in v)
            o[i]=o[i]||v[i];
    },
    defaultSetThat(o,v){
        for(var i in v)
            o[i]=v[i]||o[i];
    },
    forEach(o,fn){
        Object.keys(o).forEach(v=>fn(o[v],v,o));
    },
    map(o,fn){
        return Object.keys(o).reduce((a,v)=>Object.assign(a,{[v]:fn(o[v],v,o)}),{});
    }
});
Object.assign(Array,{
    level(a){
        return Array.level(a);
    },
    flatten(a){
        if(typeof a!='object')
    		return a;
    	var _=[],i;
    	for(i in a)
    		_=_.concat(Array.flatten(a[i]));
    	return _;
    },
    repeat(e,n){
    	for(var a=[],i=0;i<n;i++)a.push(e);
    	return a;
    },
    map(f,n){
        return new Array(n).fill(undefined).map((v,i)=>f(i));
    },
    convertToObject(k,v){
        let o={};
        k.forEach((j,i)=>o[j]=v[i]);
        return o;
    }
});
Object.assign(Number,{
    characters:"0123456789-",
    decimalCharacters:"0123456789",
    hexCharacters:"0123456789ABCDEF",
    requirePositiveInteger(n){
        n=Number.eval(n);
        if(Number.isInteger(n)&&n>0){
            return n;
        } else throw new TypeError("Input must be a positive integer.");
    },
    eval(n,a){
        return"number"==typeof n?n:Number.eval(typeof n=="function"?n(a):n&&n.hasOwnProperty(a)?n[a]:+n||0,a);
    }
});
Object.assign(Math,{
    TAU:2*Math.PI,
    rand(a,b){return arguments.length?Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:Number.eval(a)+(Number.eval(b)-Number.eval(a))*Math.random():Math.random();},
    sq(a){return a*a;},
    mod(a,b){return a-b*Math.floor(a/b);},
    factor(n){
        if(n=Math.floor(n)){
            var a=[],i;
            if(n<0){
                a=[-1];
                n*=-1;
            }
            for(i=2;i<=Math.sqrt(n);i++)
                if(!Math.mod(n,i)){
                    n/=i;
                    a.push(i--);
                }
            if(n>1)a.push(n);
            return a;
        } else return[n];
    },
    factorial(n){
        return!Math.mod(n,1)&&n>0?n*Math.factorial(n-1):1;
    },
    min_(...a){
        return Math.min.apply(Math,a.filter(v=>!isNaN(v)));
    },
    max_(...a){
        return Math.max.apply(Math,a.filter(v=>!isNaN(v)));
    }
});
Object.assign(console,{
    print(a){
    	try{
    		console.log(JSON.stringify(a));
    	} catch(e){
    		console.log(a);
    	}
    	return a;
    }
});
Object.assign(window,{
    readTextFile(file,callback){
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    },
    readJSONFile(file, cb) {
        var req = new XMLHttpRequest();
        req.responseType = 'json';
        req.onload=function(){cb(req.response);};
        req.open("GET", file, true);
        req.send(null);
    },
    interval(step,draw,step_fps){
		window.requestAnimationFrame(function a(){
			draw();
			window.requestAnimationFrame(a);
		});
		setInterval(step,1000/step_fps);
	}
});
