CONFIG={
    rate:1,
    eff:1,
    time:0.1,
    weight:1,
    mcost:0.1,
    ocost:0.1,
    size:1
};

C={
    rate:1,
    eff:1,
    time:1,
    weight:-1,
    mcost:-1,
    ocost:-1,
    size:-1
};
for(let i in C)
    C[i]*=CONFIG[i];

thresh={
    rate:0.007,
    eff:0.8,
    time:3600,
    weight:5000,
    mcost:100,
    ocost:1, 
    size:1500
};
function Thresh(x){
    return(x-Math.sqrt(x*x+1)||0)+1;
}
function Util(O){
    var p=0,i;
    //pow and log were off by 2.5% in favor of log, so log is fine and preferred.
    for(i in C){
        p+=CONFIG[i]*Thresh(C[i]*Math.log(O[i]/thresh[i]));
    }
    return p;
}