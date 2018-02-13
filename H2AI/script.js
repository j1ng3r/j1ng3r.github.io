function Do(a){
    var o={};
    a.forEach((v,i)=>o[args[i]]=v);
    var A=Simulate(o);
    if(window.Cost)
        return Cost(A);
    return-Util(A);
}
ai=new AI({
    iterationCount:30,
    geneCount:50
},{
    getDNAValue:args.map(k=>argprops[k].array?(v=>argprops[k].array[Math.floor(v)]):argprops[k].returnFunc),
    minValue:args.map(k=>argprops[k].array?0:argprops[k].minVal),
    maxValue:args.map(k=>argprops[k].array?argprops[k].array.length-0.01:argprops[k].maxVal)
},{
    minValueSoft:args.map(k=>argprops[k].minValSoft),
    maxValueSoft:args.map(k=>argprops[k].maxValSoft),
    maxMut:args.map(k=>argprops[k].array?argprops[k].array.length-0.01:argprops[k].maxValSoft),
    epsilon:0.00001
},Do,args.length);
ai.execute();
/*
ai
    .defineGeneCount(60)
    .defineIterations(600)
    .runFunction(function(){
        Input=["Genes: "+ai.geneCount,"Generations: "+ai.iterationCount];
        for(var i in CONFIG)
            Input.push(i+`: ${CONFIG[i]}, ${thresh[i]}`);
        Input=Input.join("\n");
        console.log(Input);
    })
    .defineCostFunction(DO,args)
    .defineReproduction("linear",5)
    .defineCheckPoint(function(genes){
        genes=genes[0];
        var res="Cost: "+genes.cost;
        for(var i in genes.data)res+=`\n${i}: ${genes.data[i]}`;
        console.log(res);
    },60)
    .defineCompletionFunction(function(genes){
        var gene,i,j;
        Q=Object.deepCopy(genes);
        M=Simulate(Q[0].data);
        m=M.data;
        m["L/s"]=math.unit(m["L/s"]).toNumber("L/min")+" L/min";
        for(i in genes){
            gene=genes[i];
            for(j in gene.data)
                gene.data[j]+="";
        }
        console.log(q=genes);
    })
    .defineGeneProperties({
        makeNewProb:0.01,
        mutProb:0.3,
        resetProb:0.1
    },argprops)
    .execute(console.time())
;
console.timeEnd();
*/