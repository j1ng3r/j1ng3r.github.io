CONFIG={
    rate:1,
    eff:0.001,
    time:0.001,
    weight:1,
    cost:0.001,
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
    size:1000,
    cost:10000,
    weight:10000,
    time:1,
    eff:0.001,
    rate:0.04
};
function Thresh(x){
    return(x-Math.sqrt(x*x+1))||0;
}
function Util(O){
    var p=0,i;
    //pow and log were off by 2.5% in favor of log, so log is fine.
    for(i in C){
        p+=Math.abs(C[i])*Thresh(C[i]*Math.log(O[i]/thresh[i]));
    }
    return p;
}
