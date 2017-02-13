CONFIG={
    rate:1,
    eff:1,
    time:0.1,
    weight:1,
    cost:0.2,
    size:1
};

C={
    rate:CONFIG.rate,
    eff:CONFIG.eff,
    time:CONFIG.time,
    weight:-CONFIG.weight,
    size:-CONFIG.size,
    cost:-CONFIG.cost
};
thresh={
    size:10000,
    cost:100,
    weight:2000,
    time:1800
};
for(var i in thresh)C[i]*=2*Math.PI;
function Thresh(x){
    return.5+Math.tanh(x)/2;
}
function Util(O){
    var p=1,i,s=0;
    //pow and log were off by 2.5% in favor of log, so log is fine.
    for(i in C){
        if(thresh.hasOwnProperty(i)){
            p*=Thresh(C[i]*Math.log(O[i]/thresh[i]));
        } else {
            s+=C[i]*Math.log(O[i]*O[i]+1);
        }
    }
    return p*s;
}
