//Requires expand.js
window.AI=function(){
    function AI(type){
        this.type=type||"any";
        return this;
    }
    function Gene(properties){
        this.properties=properties;
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
    });
    return AI;
}();
/*
(new AI)
    .defineGeneCount(50)
    .defineIterations(100)
    .defineArguments("x","y")
    .defineCostFunction(LopBowl)
    .defineReproduction("linear",5)
    .defineCompletionFunction("return",console.log)
    .defineGeneProperties(
        makeNewProb
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
*/
