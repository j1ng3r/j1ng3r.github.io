(new AI)
    .defineGeneCount(50)
    .defineIterations(500)
    .defineCostFunction(function(...a){
        var o={},i;
        for(i in a)
            o[args[i]]=a[i];
        return Cost(Simulate(o));
    },args)
    .defineReproduction("linear")
    .defineCompletionFunction(function(genes){
        console.log(genes);
    })
    .defineGeneProperties({
        makeNewProb:0.01,
        mutProb:0.4,
        resetProb:0.1,
        maxValSoft:10,
        minValSoft:-10,
        maxMut:0.1,
        returnFunc:_=>_
    })
    .execute()
;
