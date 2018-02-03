CONFIG={
    rate:0.01,
    eff:1,
    time:0.01,
    weight:0.01,
    mcost:0.005,
    ocost:0.005,
    size:0.01
};

C={
    rate:1,
    eff:1,
    time:1,
    weight:-1,
    size:-1,
    mcost:-1,
    ocost:-1
};
for(let i in C)
    C[i]*=CONFIG[i];

thresh={
    rate:0.02,
    eff:0.8,
    time:1800,
    weight:10000,
    mcost:1000,
    ocost:10,
    size:3000
};
function Thresh(x){
    return(x-Math.sqrt(x*x+1))||0;
}
function Util(O){
    var p=0,i;
    //pow and log were off by 2.5% in favor of log, so log is fine and preferred.
    for(i in C){
        p+=CONFIG[i]*Thresh(C[i]*Math.log(O[i]/thresh[i]));
    }
    return p;
}