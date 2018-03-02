//Requires expand.js
/*
Terminology
    AI = the AI constructor
    ai = an AI instance, or the ai managing the organism
    Organism = the Organism constructor
    Q = an Organism instance
    q = another Organism instance
    dna[] = an organism's dna. An array of values as arguments to f.
    v = value of dna at k
    k = index in dna
    N = length of dna
    cost = to be minimized
    oldcost = the cost of an organism's ancestor.
    f(dna) = the function to be minimized. outputs cost
    food = how much food the organism. When food runs out the organism dies.
    P = hyperparameters
        altruism = how much food an organism gives to its children
        learningrate = how aggresive the organisms are. Higher learningrate means faster convergence but possibly missing the minimum.
        minValueSoft[] = an array holding the lowest expected values for the best point
        maxValueSoft[] = an array holding the highest expected values for the best point
        resets = the number of times the AI will try to reset.
        resetProb = the probability that a reset attempt will be successful.
        muts = the number of times the Organism creates a mutated clone
        epsilon = value to use for derivatives
    R = static hyperparameters (restrictions)
        minValue[] = an array holding the minimum values for the kth dna value
        maxValue[] = an array holding the maximum values for the kth dna value
        maxFood = the maximum amount of food an organism can have.
        costgain(Δcost) = multiplies a constant by Δcost to find how much food to give to the organism.
        hunger = how much food the organisms lose each turn.
        stipend(M) = how much food an organism gets for position M in ai.population
    B = other useful values
        
    feed(food) = a function that gives food to an organism (with max and min)
    test() = a function that sets the gradient, cost, and derivatives
    grad = the gradient vector
    grad = the magnitude of the gradient
    gradnorm = the norm of the gradient vector
    d = an array holding the derivatives of f at dna with respect to the line search
    t = position on the line search
    pt(t) = maps t onto the linesearch
    pf(t) = maps t to the value of f on the linesearch
    e = an array holding the values of f along the linesearch for values of epsilon (used to calculate d).
    giveFoodTo(Q,food) = a function that gives food to Q and takes food away from itself
    starve(food) = take food from itself
    searches() = based on d, returns possible (calculated) next directions
    reproduce(dna, food) = creates a new organism with dna and gives it food
    reproduceNormal(dna) = reproduces with standard food altruism
    generateRandomValue(R,k) = generates a random value for the kth index of dna using constraints from R
    generateRandomDNA(R,N) = generates a new dna with random values for each index
    generateRandomOrganism(AI,P,N,food) = generates a new organism (giving it the arguments as properties), giving it food
    step() = how the organism and AI update
    population[] = the population of Organisms
*/
AI=function(){
    class Organism{
        /*
            argument order:
            a,fn,ai,Q,q,B,R,P,f,dna,v,k,N,food,oldcost,t
        */
        constructor(ai,P,dna,food,oldcost){
            this.isDead=false;
            this.hasSearched=false;
            this.children=[];
            this.searchChildren=[];
            this.ai=ai;
            this.oldcost=oldcost;
            this.f=ai.f;
            this.P=Object.deepCopy(P);
            this.dna=Organism.createDNA(ai.R,dna);
            for(let i=0;i<this.dna.length;i++){
                if(isNaN(this.dna[i])){
                    this.kill();
                    return;
                }
            }
            this.food=0;
            this.feed(food);
            this.testCost();
        }
        testCost(){
            this.d=[this.cost=this.f(this.dna)];
            return this;
        }
        testGrad(){
            let e=this.P.epsilon;
            this.grad=this.dna.map((v,i)=>(this.f(this.dna.map((w,j)=>w+(i==j?e:0)))-this.d[0])/e);
            this.gradmag=Math.sqrt(this.grad.reduce((a,v)=>a+v*v,0));
            this.gradnorm=this.grad.map(v=>v/this.gradmag);
            this.d[1]=-1;
            this.pt=t=>this.dna.map((v,i)=>v-t*this.gradnorm[i]/this.gradmag);
            this.pf=t=>this.f(this.pt(t));
            this.e=[this.d[0],this.pf(e),this.pf(2*e),this.pf(3*e)];
            this.d.push((this.e[2]-2*this.e[1]+this.e[0])/e**2,(this.e[3]-3*this.e[2]+3*this.e[1]-this.e[0])/e**3);
            if(isNaN(this.oldcost)){
                this.feed(this.R.maxFood*this.R.firstFood);   
            } else {
                this.feed(this.ai.R.carrot(this.cost-this.oldcost));
            }
            return this;
        }
        test(){
            //this.ai.log(this);
            return this.testCost().testGrad();
        }
        addToPopulation(){
            this.ai.addOrganism(this);
            return this;
        }
        giveFoodTo(Q,food){
            food=Math.min(this.food,food);
            Q.feed(food);
            this.starve(food);
            return this;
        }
        starve(food){
            this.food-=Math.floor(Number.eval(food));
            if(this.food<=0)this.kill();
            return this;
        }
        feed(food){
            this.food+=Math.floor(Number.eval(food));
            return this;
        }
        searches(){
            return[
                -this.d[1]/Math.abs(this.d[2])*this.P.learningrate,//Quadratic line search with learningrate
                -(this.d[2]-Math.sqrt(this.d[2]**2-2*this.d[1]*this.d[3]))/this.d[3], //Cubic line search
                -this.d[1]/Math.abs(this.d[2]),//Quadratic line search
                -this.d[1]/Math.sqrt(this.d[2]**2+this.d[3]**2), //Non scale-invariant, possibly remove
                this.P.learningrate,-this.P.learningrate //Gradient descent as a backup
            ].filter(v=>+v);//Remove potential "undefined"s, "0"s, or "NaN"s
        }
        reproduce(dna,food,search){
            if(this.isDead)return this;
            for(let i=0;i<dna.length;i++){
                if(isNaN(dna[i])){
                    return this;
                }
            }
            if(food<1)return this;
            let Q=new Organism(this.ai,this.P,dna,0,this.cost);
            if(search){
                this.searchChildren.push(Q);
            } else {
                this.giveFoodTo(Q,food);
                this.children.push(Q);
                Q.addToPopulation();
            }
            return this;
        }
        reproduceNormal(dna,search){
            //console.log(dna);
            return this.reproduce(dna,this.P.altruism,search);
        }
        step(){
            if(this.isDead)return this;
            if(!this.grad)this.testGrad();
            //console.log(this);
            if(!this.hasSearched){
                this.hasSearched=true;
                this.searches().map(v=>this.reproduceNormal(this.pt(v),1));
                this.searchChildren.sort((Q,q)=>Q.cost-q.cost).filter((Q,i)=>i<this.ai.R.maxSearches).forEach(Q=>{
                    this.children.push(Q);
                    Q.addToPopulation();
                    this.giveFoodTo(Q,this.P.altruism);
                });
                this.searchChildren=[];
                //console.log(this.grad,this.children);
            }
            this.learningrate=5/(this.ai.generation+27)**0.33;
            Array.map(()=>{
                if(Boolean.random(this.P.resetProb))this.reproduceNormal(Organism.generateRandomDNA(this.P,this.dna.length))
            },this.P.resets*(this.hasSearched+1));
            Array.map(()=>{
                if(Boolean.random(this.P.mutProb))this.reproduceNormal(Organism.mutateDNA(this.ai.R,this.P,this.dna));
            },this.P.muts*(this.hasSearched+1));
            //console.log(this.children);
            return this;
        }
        kill(){
            this.isDead=true;
            this.ai.kill(this);
            return this;
        }
    }
    Object.assign(Organism,{
        createDNA(R,dna){
            return dna.map((v,k)=>Math.min(R.maxValue[k],Math.max(R.minValue[k],v)));
        },
        generateRandomValue(P,k){
            let value=Math.rand(P.minValueSoft[k],P.maxValueSoft[k]);
            return value;
        },
        generateRandomDNA(P,N){
            return Array.map(k=>Organism.generateRandomValue(P,k),N);
        },
        mutateValue(P,v,k){
            let value=v+Math.rand(-1,1)*P.learningrate*P.maxMut[k];
            return value;
        },
        generateNewValue(P,v,k){
            return Boolean.random(P.resetProb)?Organism.generateRandomValue(P,k):Organism.mutateValue(P,v,k);
        },
        mutateDNA(R,P,dna){
            let k=Math.floor(Math.rand(dna.length));
            let a=Organism.createDNA(R,dna);
            let K=Array.map(i=>i==k,dna.length);
            a[k]=Organism.generateNewValue(P,dna[k],k);
            while(Boolean.random(P.mutProb)&&K.length<dna.length){
                k=~~Math.rand(dna.length);
                if(!K[k]){
                    K[k]=true;
                    a[k]=Organism.generateNewValue(P,dna[k],k);
                }
            }
            return a;
        },
        generateRandomOrganism(ai,P,N,food,oldcost){
            return new Organism(ai,P,Organism.generateRandomDNA(P,N),food,oldcost);
        }
    });
    class AI{
        constructor(B,R,P,f,N){
            this.time=Date.now();
            this.generation=0;
            this.R=Object.assign({
                maxSearches:1,
                stipend:M=>6-Math.floor(Math.sqrt(2*M+1/4)-1/2),
                maxFood:10,
                hunger:2,
                costgain:6,
                carrot:Acost=>-Acost*this.R.costgain,
            },R);
            this.N=N;
            this.R.names=this.map(this.R.names,(v,i)=>v!==undefined?v:i);
            this.B=Object.assign({
                iterationCount:5,
                organismCount:30
            },B);
            this.P=Object.assign({
                epsilon:0.0001,
                mutProb:0.3,
                resetProb:0.01,
                resets:1,
                muts:3,
                altruism:3,
                learningrate:0.5
            },P);
            this.population=[];
            this.newPopulation=[];
            this.DEBUG=false;
            this.defineCostFunction(f);
        }
        kill(Q){
            for(let i=0;i<this.population.length;i++){
                if(this.population[i]==Q){
                    this.population.splice(i,1);
                    return;
                }
            }
        }
        map(a,fn){
            return Array.isArray(a)?a.map(fn):Array.map(i=>fn(undefined,i),this.N);
        }
        defineCostFunction(f){
            this._f=f;
            this.f=dna=>this._f(dna.map((v,k)=>this.R.getDNAValue[k](v)));
            return this;
        }
        defineNames(names){
            this.R.names=names;
            this.N=this.R.names.length;
            return this;
        }
        defineNameLength(N){
            this.N=N;
        }
        addOrganism(Q){
            if(!Q.isDead)this.newPopulation.push(Q);
            return this;
        }
        addNewPopulation(){
            this.newPopulation.forEach(Q=>Q.food&&this.population.push(Q));
            this.newPopulation=[];
            return this;
        }
        stepPopulation(){
            this.population.forEach(Q=>Q.step());
            return this;
        }
        sortPopulation(){
            this.population.sort((Q,q)=>Q.cost-q.cost).splice(50);
            return this;
        }
        cleanPopulation(){
            this.population.forEach(Q=>Q.food=Math.max(0,Math.min(this.R.maxFood,Q.food)));
            return this;
        }
        feedPopulation(){
            for(let M=0;M<this.population.length;){
                let Q=this.population[M];
                //console.log(this.R.maxFood,Q.food,this.R.stipend(M),this.R.hunger);
                Q.food=Math.max(0,Math.min(this.R.maxFood,Q.food+Math.floor(this.R.stipend(Q.index=M))-this.R.hunger));
                if(Q.food===0){
                    this.population.splice(M,1);
                } else {
                    M++;
                }
            }
            return this;
        }
        step(){
            return this
                .runFunction(()=>console.error("Generation:",this.generation,"Population:",this.population.map(Q=>new Object({food:Q.food,cost:Q.cost,dna:readDNA(Q.dna.map(v=>v)),grad:(Q.grad||[]).map(v=>v),gradnorm:(Q.gradnorm||[]).map(v=>v)})),"Lowest Cost",this.population.reduce((a,Q)=>Math.min(a,Q.cost),Infinity)))
                .stepPopulation().sortPopulation().feedPopulation().addNewPopulation().runFunction(()=>this.generation++);
        }
        stepN(n){
            Array.map(()=>this.step(),n);
            return this;
        }
        stepPerfect(n,iterationCount=100,fn=I=>I){
            let cost=Infinity;
            let count=0;
            for(let i=0;i<iterationCount;i++){
                fn(this);
                this.step();
                let newCost=this.population.reduce((a,Q)=>Math.min(a,Q.cost),Infinity);
                if(Math.abs(cost-newCost)<Number.EPSILON){
                    count++;
                } else {
                    count=0;
                }
                if(count>=n){
                    return this;
                }
                cost=newCost;
            }
            return this;
        }
        formatValues(){
            this.R.getDNAValue=this.map(this.R.getDNAValue,fn=>typeof fn=="function"?fn:v=>v);
            this.R.minValue=this.map(this.R.minValue,w=>Math.max_(w,-Infinity));
            this.R.maxValue=this.map(this.R.maxValue,w=>Math.min_(w,Infinity));
            this.P.minValueSoft=this.map(this.P.minValueSoft,(w,k)=>Math.max_(w,this.R.minValue[k]));
            this.P.maxValueSoft=this.map(this.P.maxValueSoft,(w,k)=>Math.min_(w,this.R.maxValue[k]));
            this.P.maxMut=this.map(this.maxMut,(w,k)=>{
                let value = Math.min_(w,this.P.maxValueSoft[k]-this.P.minValueSoft[k]);
                return value||1;
            });
            return this;
        }
        initPopulation(){
            this.population=Array.map(i=>Organism.generateRandomOrganism(this,this.P,this.N,0,Infinity),this.B.organismCount);
            this.cleanPopulation();
            return this;
        }
        init(){
            return this.formatValues().initPopulation();
        }
        execute(){
            return this.init().stepAll();
        }
        stepAll(){
            return this.stepN(this.B.iterationCount);
        }
        runFunction(fn){
            fn();
            return this;
        }
        debug(){
            this.DEBUG=true;
            return this;
        }
        log(a){
            if(this.DEBUG)console.log(a);
            return a;
        }
    }
    Object.assign(AI,{
        Organism:Organism,
    });
    /*
    function Organism(DNA,food){
        this.DNA=DNA;
        this.data={};
    }
    Object.assign(Gene,{
        resetValue(prop){
            return Math.rand(Number.eval(prop.minValSoft),Number.eval(prop.maxValSoft));
        },
        makeNew(prop){
            var _=new Gene(prop),j;
            for(j of Object.keys(prop))
                _.data[j]=Gene.resetValue(prop[j]);
            return _;
        }
    });
    Object.assign(Gene.prototype,{
    	clone(THIS){
    		var P=this.properties,_=new Gene(P),i=Object.keys(this.data)[0];
            function p(g){
                return Number.eval(P[i][g],THIS);
            }
            if(p("makeNewProb")>Math.rand())return Gene.makeNew(this.properties);
            for(i in this.data){
                _.data[i]=Math.max(p("minVal"),Math.min(p("maxVal"),
                    p("mutProb")<Math.rand()?
                        this.data[i]
                    :p("resetProb")>Math.rand()?
                        Gene.resetValue(P[i])
                    :
                        this.data[i]+Math.rand(-p("maxMut"),p("maxMut"))
                ));
            }
            return _;
    	},
        getValue(i){
            return this.properties[i].returnFunc(this.data[i]);
        }
    });
    Object.assign(AI,{
        Gene:Gene,
        cloneFuncs:{
            linear(genes,num,mod){
                var g=[],i=0,j=0;
                mod=Number.eval(mod,0);
    			while(g.length<num){
                    if(mod>0){
                        mod--;
                        g.push(genes[i]);
                    } else if(j>i){
    					g.push(genes[i]);
    					i++;
    				} else {
    					i=0;
    					j++;
    				}
    			}
                return g;
            },
            random(genes,num,mod){
                var g=[];
                while(g.length<num)
                    g.push(genes[Math.floor(Math.rand(num))]);
                return g;
            }
        },
        getResult(genes){
            var ret=[],i,j,a;
            for(i in genes){
                a=genes[i].cost+":";
                for(j in genes[i].data){
                    a+=`\n\t${j}=${genes[i].data[j]}`;
                }
                ret.push(a);
            }
            return ret.join('\n');
        }
    });
    Object.assign(AI.prototype,{
        DEBUG:false,
        geneCount:0,
        iterationCount:0,
        genes:null,
        geneProp:null,
        geneProperties:{},
        geneNames:[],
        checkpoint:{
            func(){},
            gen:Infinity
        },
        simulation:{
            func(){},
            args:[],
            return(){}
        },
        debug(){
            this.DEBUG=true;
            return this;
        },
        log(a){
            if(this.DEBUG)console.log(a);
            return a;
        },
        runFunction(f){
            f();
            return this;
        },
        addGeneName(n){
            if(!this.geneNames.includes(n))this.geneNames.push(n);
            return this;
        },
        defineArguments(...a){
            this.defineGeneNames(a).simulation.args=a;
            return this;
        },
        defineGeneNames(...a){
            a=Array.level(a);
            for(var i in a)this.addGeneName(a[i]);
            return this;
        },
        defineType(t){
            this.type=t+"";
            return this;
        },
        defineGeneCount(n){
            this.geneCount=Number.requirePositiveInteger(n);
            return this;
        },
        defineIterations(n){
            this.iterationCount=Number.requirePositiveInteger(n);
            return this;
        },
        defineReproduction(func,...mod){
            if(typeof func=="string"&&AI.cloneFuncs.hasOwnProperty(func)){
                this.cloneFunc=AI.cloneFuncs[func];
                this.cloneMod=mod;
            } else if(typeof func=="function"){
                this.cloneFunc=func;
            } else {
                throw new TypeError("Reproduction must be a function or predefined string.");
            }
            return this;
        },
        defineCostFunction(sim,args){
            this.simulation.func=sim;
            this.simulation.args=args||this.simulation.args;
            return this;
        },
        defineCompletionFunction(func,sub){
            if(typeof func=="string"){
                if(func=="return"){
                    this.simulation.return=typeof sub=="function"?(
                        genes=>sub(AI.getResult(genes))
                    ):genes=>AI.getResult(genes);
                }
            } else if(typeof func=="function"){
                this.simulation.return=func;
            }
            return this;
        },
        defineGeneProperties(all,specific){
            this.geneProperties.all=all||this.geneProperties.all;
            this.geneProperties.specific=Object.assign({},this.geneProperties.specific,specific);
            if(typeof specific=="object"&&specific){
                this.defineGeneNames(Object.keys(specific));
            }
            return this;
        },
        defineCheckPoint(func,gen){
            this.checkpoint={
                func:func,
                gen:Math.floor(gen)||1,
            };
            return this;
        },
        _createNewGenes(_,j,i){
            this.genes=[];
            for(i=0;i<this.geneCount;i++)
                this.genes.push(Gene.makeNew(this.geneProp));
            return this;
        },
        _defineGeneProperties(p,i,g,s){
            p=this.geneProperties;
            this.geneProp={};
            s=a=>{
                return isNaN(g[a+"Val"])&&isNaN(g[a+"ValSoft"]);
            };
            for(i of this.geneNames){
                this.geneProp[i]=Object.assign({},p.all,p.specific[i]);
                if(this.geneProp[i].hasOwnProperty("array")){
                    this.geneProp[i]=function(a){
                        var array=a.array;
                        return Object.assign(a,{
                            minValSoft:0,
                            maxValSoft:array.length,
                            maxMut:array.length,
                            returnFunc:v=>array[Math.floor(Math.mod(v,array.length))]
                        });
                    }(this.geneProp[i]);
                }
                g=this.geneProp[i];
                if(s('max')||s('min'))throw new RangeError("Please define the value range before executing.");
                +function(m,a,x){
                    for(x in a)
                        if(!m.hasOwnProperty(x))m[x]=a[x];
                }(this.geneProp[i],{
                    minValSoft:this.geneProp[i].minVal,
                    maxValSoft:this.geneProp[i].maxVal,
                    minVal:-Infinity,
                    maxVal:Infinity,
                    returnFunc:v=>v
                });
            }
            return this;
        },
        getGenes(){
            var gene,g=[];
            for(i in this.genes){
                gene=this.genes[i];
                g[i]={
                    cost:gene.cost,
                    data:{}
                };
                for(j in gene.data)
                    g[i].data[j]=gene.getValue(j);
            }
            return g;
        },
        execute(){
            var i,j,k,args,gene,val;
            this._defineGeneProperties()._createNewGenes();
            for(this.iterations=0;this.iterations<this.iterationCount;this.iterations++){
                this.genes=this.cloneFunc(new Proxy(this,{
                    get(o,k,p){return o.genes[k].clone.apply(o.genes[k],[o]);}
                }),this.geneCount,this.cloneMod);
                for(j in this.genes){
                    args=[];
                    gene=this.genes[j];
                    this.log(gene);
                    for(k of this.simulation.args)
                        args.push(gene.getValue(k));
                    this.log(args);
                    val=this.simulation.func.apply({},args);
                    if(isNaN(val)){this.error=args;console.error(`Input function ${this.simulation.func.name} returned NaN with the given arguments:`,args);throw new Error();}
                    gene.cost=val;
                }
                this.genes.sort(function(a,b){return a.cost-b.cost;});
                if(!Math.mod(this.iterations,this.checkpoint.gen))
                    this.checkpoint.func(this.getGenes());
            }
            this.log(this.genes);
            return this.simulation.return(this.getGenes());
        }
    });*/
    return AI;
}();
/*
(new AI)
    .defineCostFunction(LopBowl)

    .defineGeneProperties(
        mutProb
        resetProb
        maxVal
        minVal
        maxMut
        returnFunc
        array (optional)
    )
    .execute()
;

new AI({},{
    maxVal:[10,10],
    minVal:[-10,-10]
},{},function(X){
    let a=20,b=0.2,c=Math.TAU;
    return -a*Math.exp(-b*Math.sqrt(X.reduce((a,v)=>a+v*v/X.length,0)))-Math.exp(X.reduce((a,v)=>a+Math.cos(c*v)/X.length))+a+Math.exp(1);
}).execute();
/**/
