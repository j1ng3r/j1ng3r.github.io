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
    .defineIterations(360)
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
    },{
        "voltage":{
            minVal:1.48,
            maxValSoft:10,
            maxMut:0.1,
            returnFunc:_=>math.unit(_,"V")
        },
        "plate_dist":{
            minValSoft:-5,
            maxValSoft:5,
            maxMut:0.5,
            returnFunc:_=>math.unit(Math.exp(_),"mm")
        },
        "plate_width":{
            minVal:0,
            maxValSoft:5,
            maxMut:0.5,
            returnFunc:_=>math.unit(Math.exp(_),"mm")
        },
        "plate_length":{
            minVal:0,
            maxValSoft:11,
            maxMut:0.5,
            returnFunc:_=>math.unit(Math.exp(_),"mm")
        },
        "plate_height":{
            minVal:0,
            maxValSoft:9,
            maxMut:0.5,
            returnFunc:_=>math.unit(Math.exp(_),"mm")
        },
        "plate_material":{
            array:Object.keys(K.MAT)
        },
        "number_of_plates":{
            array:[2]
        },
        "electrolyte_name":{
            array:["Na2CO3"]
        },
        "percentMass":{
            minVal:0,
            maxValSoft:0.1,
            maxVal:1,
            maxMut:0.01
        },
        "temperature":{
            minVal:50,
            maxVal:180,
            maxMut:10,
            returnFunc:_=>math.eval(_+"degF to K")
        },
        "water_weight":{
            minValSoft:3,
            maxValSoft:13,
            maxMut:0.5,
            returnFunc:_=>math.unit(Math.exp(_),"g")
        }
    })
    .execute(console.time())
;
console.timeEnd();
