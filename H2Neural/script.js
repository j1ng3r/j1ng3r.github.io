function Do(a){
    var o={},i;
    for(i in a)
        o[args[i]]=a[i];
    return Simulate(o);
}
function DO(...a){
    var A=Do(a);
    if(window.Cost)
        return Cost(A);
    return-Util(A);
}
Input=[];
ai=new AI;
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
