function Cost(O){
    var C={};
    C.production=1/O.rate;
    C.efficiency=1/O.eff;
    C.weight=Math.log(Math.sq(O.weight)+1);
    C.time=1/O.time
    return C.efficiency*(C.production+C.weight+C.time);
}
