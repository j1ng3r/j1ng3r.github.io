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
            fn,ai,Q,q,B,R,P,f,dna,v,k,N,food,oldcost,t
        */
        constructor(ai,P,dna,food,oldcost){
            this.ai=ai;
            this.oldcost=oldcost;
            this.f=ai.f;
            this.P=Object.deepCopy(P);
            this.dna=Organism.createDNA(dna);
            this.food=0;
            this.feed(food);
            this.test();
        }
        test(){
            let e=this.P.epsilon;
            this.d=[this.cost=this.f(this.DNA)];
            this.grad=this.dna.map((v,i)=>(this.f(this.dna.map((w,j)=>w+(i==j?e:0)))-Q.d0)/e);
            this.gradmag=this.grad.magnitude;
            this.gradnorm=this.grad.map(v=>v/this.gradmag);
            this.d[1]=this.gradmag;
            this.pt=t=>this.dna.map((v,i)=>v+t*this.gradnorm[i]);
            this.pf=t=>this.f(this.pt(t));
            this.e=[this.d[0],this.pf(e),this.pf(2*e),this.pf(3*e)];
            this.d.push((this.e[2]-2*this.e[1]+this.e[0])/e**2,(this.e[3]-3*this.e[2]+3*this.e[1]-this.e[0])/e**3);
            this.feed(this.ai.R.carrot(this.cost-this.oldcost));
            return this;
        }
        addToPopulation(){
            this.ai.addOrganism(this);
            return this;
        }
        giveFoodTo(Q,food){
            food=Math.max(this.food,food);
            Q.feed(food);
            this.starve(food);
            return this;
        }
        starve(food){
            this.food-=Math.floor(Number.eval(food));
            return this;
        }
        feed(food){
            this.food+=Math.floor(Number.eval(food));
            return this;
        }
        searches(){
            return[
                -this.d[1]/Math.abs(this.d[2]),//Quadratic Newton's search
                -this.d[1]/Math.abs(this.d[2])*this.P.learningrate,//Quadratic Newton's search with learningrate
                -Math.sign(this.d[1])*this.P.learningrate, //Classic gradient descent: Non scale-invariant, possibly remove
                -(this.d[2]-Math.sqrt(this.d[2]**2-2*this.d[1]*this.d[3]))/this.d[3],
                -this.d[1]/Math.sqrt(this.d[2]**2+this.d[3]**2), //Non scale-invariant, possibly remove
                this.P.learningrate,-this.P.learningrate //As a backup
            ].filter(v=>+v===v);//Remove potential "undefined"s or "NaN"s
        }
        reproduce(dna,food){
            return this.giveFoodTo(new Organism(this.ai,this.P,dna,0,this.cost).addToPopulation(),food);
        }
        reproduceNormal(dna){
            return this.reproduce(dna,this.P.altruism);
        }
        step(){
            this.searches().map(v=>this.reproduceNormal(this.pf(v)));
            Array.map(()=>{
                if(Boolean.random(this.P.resetProb))this.reproduceNormal(Organism.generateRandomDNA(this.P,this.dna.length))
            },this.P.resets);
            Array.map(()=>{
                if(Boolean.random(this.P.mutProb))this.reproduceNormal(Organism.mutateDNA(this.ai.R,this.P,this.dna));
            },this.P.muts);
            return this;
        }
    }
    Object.assign(Organism,{
        createDNA(R,dna){
            return dna.map((v,k)=>Math.min(R.maxValue[k],Math.max(R.minValue[k],v)));
        },
        generateRandomValue(P,k){
            return Math.rand(Number.eval(P.minValueSoft[k]),Number.eval(P.maxValueSoft[k]));
        },
        generateRandomDNA(P,N){
            return Array.map((v,k)=>Organism.generateRandomValue(P,k),N);
        },
        mutateValue(P,v,k){
            return v+Math.rand(-1,1)*P.learningrate*P.maxMut[k];
        },
        generateNewValue(P,v,k){
            return Boolean.random(P.resetProb)?Organism.generateRandomValue(P,k):Organism.mutateValue(P,v,k);
        },
        mutateDNA(R,P,dna){
            let k=Math.floor(Math.rand(dna.length));
            let a=Organism.createDNA(R,dna);
            let K=Array.map(i=>i==k,dna.length);
            a[k]=Organism.generateNewValue(P,dna[k],k);
            while(Boolan.random(P.mutProb)&&K.length<dna.length){
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
        constructor(B,R,P,f){
            this.R=Object.assign({
                stipend:M=>10-Math.floor(Math.sqrt(2*M+1/4)-1/2),
                maxFood:40,
                hunger:1,
                costgain:2,
                carrot:Δcost=>Δcost*this.R.costgain,
            },R);
            this.R.names=R.names||Array.map(i=>i,R.maxValue.length);
            this.B=Object.assign({
                organismCount:44
            },B);
            this.P=Object.assign({
                epsilon:0.0001,
                mutProb:0.25,
                resetProb:0.8,
                resets:1,
                muts:4,
                altruism:2
            },P);
            this.N=this.R.names.length;
            this.population=[];
            this.DEBUG=false;
            this.defineCostFunction(f);
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
            this.population.push(Q);
            return this;
        }
        step(){
            //Stepping each Q
            this.population.forEach(Q=>Q.step());

            //Resetting food
            this.population.sort((Q,q)=>Q.food-q.food);
            for(let M=0;M<this.population.length;){
                let Q=this.population[M];
                Q.food=Math.max(0,Math.min(this.R.maxFood,food+Math.floor(this.R.stipend(Q.index=M))-this.R.hunger));
                if(Q.food===0){
                    this.population.splice(M,1);
                } else {
                    M++;
                }
            }
            return this;
        }
        stepN(n){
            Array.map(()=>this.step(),n);
            return this;
        }
        init(){
            this.R.getDNAValue.map(fn=>typeof fn=="function"?fn:v=>v);
            this.R.minValue.map(w=>+w==w?+w:-Infinity);
            this.R.maxValue.map(w=>+w==w?+w:Infinity);
            this.P.minValueSoft.map((w,k)=>Math.max(Number.eval(w),this.R.minValue[k]));
            this.P.maxValueSoft.map((w,k)=>Math.min(Number.eval(w),this.R.maxValue[k]));
            this.population=Array.map(i=>Organism.generateRandomOrganism(this,this.P,Organism.generateRandomDNA(this.P,this.N),0,Infinity),this.B.organismCount);
            return this;
        }
        execute(){
            this.init();
            return this.stepN(this.iterationCount);
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
},{})
    .defineCostFunction(function(X){
        let a=20,b=0.2,c=Math.TAU;
        return -a*Math.exp(-b*Math.sqrt(X.reduce((a,v)=>a+v*v/X.length,0))
    })
    .
/**/
new AI({},{
    maxVal:[10,10],
    minVal:[-10,-10]
},{},function(X){
    let a=20,b=0.2,c=Math.TAU;
    return -a*Math.exp(-b*Math.sqrt(X.reduce((a,v)=>a+v*v/X.length,0)))-Math.exp(X.reduce((a,v)=>a+Math.cos(c*v)/X.length))+a+Math.exp(1);
}).execute();