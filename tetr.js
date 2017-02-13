k=[0,'x','z'];
d=[[],[]];
var i,j;
function P(v,n){
    if(n){
        if(typeof v=="number")
            return Math.pow(2,P(v,n-1));
        else
            return`p(${P(v,n-1)})`;
    } else return v;
}
for(i in k){
    if(typeof k[i]=='number')
        d[0].push(Math.log2(k[i]));
    else
        d[0].push(`log2(${k[i]})`);
}
for(i in'hello'){
    for(j in k){
        d[0].push(P(k[j],+i));
    }
}
for(i=0;i<d[0].length-1;i++){
    terms={};
    d[1].push((d[0][i+1]-d[0][i])/k.length);
}
