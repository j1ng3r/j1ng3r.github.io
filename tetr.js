D=5;
function tetr(b,n){
    return n?Math.pow(2,tetr(b,n-1)):b;
}
function getVal(v,D){
    var d,L=[],i,j,P=[[],[],[],[]],V;
    /*
        v is an array storing values between 0 and 1.
        D is the derivative you are finding
        tetr is a function where
            tetr(0.5,0)=0.5
            tetr(0.5,1)=2^0.5
            tetr(0.5,2)=2^2^0.5
        d is an array of the arrays of all the points for each derivative=[
            [-Infinity,0,1,2,4,16,65536],
            [Infinity,1,1,2,12,65520],
            [-Infinity,0,1,10,65508],
            [Infinity,1,9,65498]
        ]
        L takes the log2 of each point in v
        P[0] takes 2^ each point in v, then P[1] takes 2^ each point in P[0], etc
        i and j are iterators
        V stores the
    */
    for(i in v){
        L.push(Math.log2(v[i]));
        for(j in P)
            P[j].push(tetr(v[i],+j+1));
    }
    d=[L.concat(v)];
    for(i in P)d[0]=d[0].concat(P[i]);
    for(i=1;i<=D;i++){
        d[i]=[];
        for(j=0;j<d[i-1].length-1;j++)
            d[i][j]=v.length*(d[i-1][j+1]-d[i-1][j]);
    }
    console.log(Q=d);
    return Math.min.apply(0,d.slice(~0)[0]);
}
S=[];

function findMax(n,g){
    var list,data,arr,pos=new Array(n-1).fill(0),gen=0,dist,base,max,i,j;
    while(gen<g){
        gen++;
        list=[];
        data=[];
        for(i=1;i<n;i++){
            dist=(Math.log2(i/n+1)-i/n)/2/Math.pow(1.1,gen-1);
            base=gen==1?(Math.log2(i/n+1)+i/n)/2:max.data[i-1];
            data.push([base-dist,base,base+dist]);
        }
        loop:while(1){
            pos[0]++;
            i=0;
            while(pos[i]>=data[i].length){
                pos[i++]=0;
                if(i==data.length)break loop;
                pos[i]++;
            }
            arr=[];
            for(i in pos)
                arr.push(data[i][pos[i]]);
            var val={
                val:getVal(arr.concat([1])),
                data:arr
            };
            list.push(val);
        }
        max={val:-1/0};
        for(i in list){
            if(max.val<list[i].val)max=list[i];
        }
        S.push([list,max]);
    }
    return max;
}
k=[0,'a','b','c','d','f'];
d=[[],[],[]];
var i,j;
function P(v,n){
    if(n){
        if(typeof v=="number")
            return Math.pow(2,P(v,n-1));
        else
            return`p\\left(${P(v,n-1)}\\right)`;
    } else return v;
}
for(i in k){
    if(typeof k[i]=='number')
        d[0].push(Math.log2(k[i]));
    else
        d[0].push(`log_2${k[i]}`);
}
for(i in'sans.'){
    for(j in k){
        d[0].push(P(k[j],+i));
    }
}
for(i=0;i<d[0].length-1;i++){
    terms={};
    if(typeof d[0][i+1]=="number"){
        terms[1]=d[0][i+1];
    } else {
        terms[d[0][i+1]]=1;
    }
    if(typeof d[0][i]=="number"){
        terms[1]=(terms[1]||0)-d[0][i];
    } else {
        terms[d[0][i]]=(terms[d[0][i]]||0)-1;
    }
    d[1].push(terms);
}
for(k=1;k<8;k++){
    d[k+1]=[];
    for(i=0;i<d[k].length-1;i++){
        terms=Object.assign({},d[k][i+1]);
        for(j in d[k][i])
            terms[j]=(terms[j]||0)-d[k][i][j];
        d[k+1].push(terms);
    }
}
function toString(a,b){
    var T=d[a][b],t,r=""+(T[1]||""),R;
    if(1/T[1]!=0){//jshint ignore:line
        for(t in T){
            if(+t!=t){
                R=Math.abs(T[t]);
                r+=(T[t]>0?r&&"+":"-")+(R==1?"":R)+t;
            }
        }
    }
    return r;
}

f=function(a,f=[],i=0,g=[]){
    while(1){
        try{
            g.push(toString(D,++i))
            if(!(i%3)){
                f.push(`\\left[${""+g}\\right]`);
                g=[];
            }
        }catch(e){console.log(e,i);if(g.length)f.push(`\\left[${""+g}\\right]`);
            for(let i in f){
                f[i]=`k_${i}=`+f[i];
            }
        return f;}
    }
}();
q=_=>console.log(f[_]);
ai=new AI;
ai
    .defineCostFunction(function(x,y,z){
        var min=Infinity,i;
        for(i in f){
            min=Math.min(f[i](x,y,z),min);
        }
        return-min;
    },"xyz".split(""))
    .defineGeneCount(80)
    .defineIterations(500)
    .defineReproduction("linear",8)
    .defineCompletionFunction(function(genes){
        console.log(genes);
    })
    .defineGeneProperties({
        makeNewProb:0.005,
        mutProb:0.2,
        resetProb:0.02
    },{
        "x":{
            minVal:0.25,
            maxVal:Math.log2(5/4),
            maxMut:T=>1/(5*Math.pow(T.iterations+2,1/3))
        },
        "y":{
            minVal:0.5,
            maxVal:Math.log(3/2),
            maxMut:T=>1/(5*Math.pow(T.iterations+2,1/3))
        },
        "z":{
            minVal:0.75,
            maxVal:Math.log2(7/4),
            maxMut:T=>1/(5*Math.pow(T.iterations+2,1/3))
        }
    })
    //.execute(console.time())
;
//console.timeEnd();
/*function go(x){
return"y\\left\\{y\\ge 0\\right\\}\\left\\{U\\ge x\\ge L\\right\\}\\ge "+toString(D,x);
}*/
