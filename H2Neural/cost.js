function Cost(O){
    var C={};
    C.production=1/O.production;
    C.efficiency=1-O.efficiency;
    C.weight=O.weight;
    C.cost=Math.log(O.cost);
    return C.efficiency*(C.production+C.weight+C.cost);
}
