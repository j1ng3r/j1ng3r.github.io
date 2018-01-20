function get(a,k){
    for(let i=0;i<k.length;i++){
        if(!a||!a.hasOwnProperty(k[i]))return 0;
        a=a[k[i]];
    }
    return a||0;
}
function set(a,k,v){
    k=Object.assign([],k);
    while(k.length>1){
        if(!Array.isArray(a[k[0]])){
            a[k[0]]=[];
        }
        a=a[k.splice(0,1)[0]];
    }
    a[k[0]]=v;
}
function add(a,k,v){
    set(a,k,get(a,k)+v);
}
function iterate(a,f){
    let k=new Array(a.depth).fill(0);
    for(;;){
        f(get(a,k),Object.assign([],k),a);
        k[0]++;
        for(let i=0;k[i]>=get(a,k.slice(0,i)).length;k[i]++){
            k[i++]=0;
            if(i==k.length)return;
        }
    }
}
Object.defineProperty(Array.prototype,"depth",{
    get:function depth(){
        return this.reduce((r,v)=>Math.max(r,Array.isArray(v)?v.depth:0),0)+1;
    }
});
Object.defineProperty(Array.prototype,"exclude",{
    value:function exclude(n){
        return this.slice(0,n).concat(this.slice(n+1));
    }
});
function update(a){
    let b=[],n=a.depth;
    iterate(a,function(v,K){
        for(let i=0;i<n;i++)K[i]++;
        K.push(1);
        console.log(K,v);
        for(let i=0;i<n+1;i++){
            add(b,K.exclude(i),v/(n+1));
        }
    });
    return b;
}
function N(a,n){
    for(let i=0;i<n;i++)a=update(a);
    return a;
}
function E(a){
    let v=0;
    iterate(a,function(w,k){
        v+=w*k.reduce((r,v)=>r+v,0);
    });
    return v;
}

F=n=>Math.floor((2*n+1/4)**0.5-0.5);
Nn=n=>F(n)+1;
Kn=n=>n-F(n)*(F(n)+1)/2+1;

function run(N,K,L){
    let E=0;
    A=new Array(N).fill(0);
    let dist=new Array(N).fill(0);
    for(let l=0;l<L;l++){
        A=A.map(v=>v+1);
        let R=[];
        for(let i=0;i<N||R.length==K;i++)Math.random()<(K-R.length)/(N-i)&&R.push(i); //Just accept that it works
        R.map(v=>dist[v]++);
        R.map(v=>A[v]=0);
        E+=A.reduce((r,v)=>r+v,0)/N;
    }
    return {
        E:E/L,
        final:A,
        dist:dist
    }
}
runn=(n,L)=>run(Nn(n),Kn(n),L);
runall=(N,L)=>{
    let Y=[];
    for(let n=0;n<N;n++){
        Y.push(runn(n,L).E);
    }
    return Y;
}