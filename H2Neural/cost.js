CONFIG={
    rate:1,
    eff:0.1,
    time:0.1,
    weight:0.1,
    cost:0,
    size:0.1
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
    size:1500,
    cost:100,
    weight:5000,
    time:3600,
    eff:0.8,
    rate:0.01
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
