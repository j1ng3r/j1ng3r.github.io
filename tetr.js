/* VarKey
  * i,j  = key
  * v,w  = value
  * f    = function
  * d    = number of times to derivate
  * N    = number of times to tetrate up
  * n    = number of values to find (3 finds values for 0/3, 1/3, 2/3)
  * p    = iterated set of values (n==p.length)
  * M    = memo(r)izer
  * np   = possible next p
  * grad = gradient vector
  * mag  = what to scale the gradient by
  * d0   = what the original set of points to derivate is
  * tetr = recursive 2^x. tetr(x,0)==x, tetr(x,3)==2^2^2^x
  * dedr = (d/dx) tetr
  * min  = minimum value and index
  * nim  = possible next min
  * scl  = decreasing number that denotes the length of the vector
*/
N=4;
M=f=>{
    let o={};
    return(...a)=>a in o?o[a]:(o[a]=f.apply(this,a));
};
tetr=M((x,n)=>n?Math.pow(2,tetr(x,n-1)):x);
dedr=M((x,n)=>n?tetr(x,n)*Math.LN2*dedr(x,n-1):1);
derivate=(d0,d)=>d?derivate(d0,d-1).map((v,i,m)=>m[i+1]-v).slice(0,-1):d0;
spread=M((p,u,f)=>p.map(u).concat(new Array(N).fill(0).reduce((a,v,i)=>a.concat(p.map(w=>f(w,i))),[])));
val=(p,d)=>derivate(spread(p,Math.log2,tetr),d);
getmin=(p,d)=>{
    let v=val(p,d),a=Math.min(...v);
    return[a,v.indexOf(a)];
};
getgrad=(p,d,I)=>p.map((v,i)=>derivate(spread(p,(v,i)=>1/p[i]/Math.LN2,dedr).map((w,j)=>j%p.length==i?w:0),d)[I]);
getmag=(scl,grad)=>scl/Math.sqrt(grad.reduce((a,v)=>a+v*v,0));
getdif=n=>new Array(n).fill(0).map((v,i)=>Math.log2(1+i/n)-i/n);
getp=n=>new Array(n).fill(0).map((v,i)=>(Math.log2(1+i/n)+i/n)/2);
function iterate(p,min,scl,d,dif){
    let grad=getgrad(p,d,min[1]);
    let mag=getmag(scl,grad);
    let np=p.map((v,i)=>v+dif[i]*mag*grad[i]);
    console.log("grad:",grad,"np:",np);
    let nim=getmin(np,d);
    return nim[0]>min[0]?[np,nim,scl,d,dif]:[p,min,scl/2,d,dif];
}
function findMax(n,d,t){
    let dif=getdif(n);
    let p=getp(n);
    let scl=1/4;
    let min=getmin(p,d);
    for(let gen=0;gen<t;gen++)[p,min,scl,d,dif]=iterate(p,min,scl,d,dif);
    return p;
}
console.assert(findMax(16,5,1000)>=0);
