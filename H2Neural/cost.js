CONFIG={
    rate:1,
    eff:1,
    time:0.1,
    weight:0.3,
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
function Util(O){
    var p=0;
    //pow and log were off by 2.5% in favor of log, so log is fine.
    for(var i in C)p+=C[i]*Math.log(O[i]);
    return p;
}
