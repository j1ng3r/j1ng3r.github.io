//Requires expand.js
window.AI=function(){
    function AI(type){
        this.type=type||"any";
        this.geneCount=0;
        this.iterationCount=0;
        this.genes=null;
        this.geneNames=[];
        this.geneProperties={};
        this.geneProp=null;
        this.simulation={
            func(){},
            args:[],
            return(){}
        };
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
            _=new Gene(prop);
            for(j of Object.keys(prop))
                _.data[j]=Gene.resetValue(prop[j]);
            return _;
        }
    });
    Object.assign(Gene.prototype,{
    	/*mutateNumber(num){
    		if(this.mut<Math.rand())
    			return num;
    		if(Math.rand()<this.reset)
    			return Math.rand(this.min,this.maxGene);
    		return num+Math.rand(-this.geneVar,this.geneVar);
    	},*/
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
    	}
    });
    Object.assign(AI,{
        Gene:Gene,
        cloneFuncs:{
            linear(genes,num){
                var g=[],i=0,j=0;
    			while(g.length<num){
    				if(j>i){
    					g.push(genes[i]);
    					i++;
    				} else {
    					i=0;
    					j++;
    				}
    			}
                return g;
            },
            random(genes){
                var g=[];
                while(g.length<num)
                    g.push(genes[Math.floor(Math.rand(num))]);
                return g;
            }
        }
    });
    Object.assign(AI.prototype,{
        addGeneName(n){
            if(!this.geneNames.includes(n))this.geneNames.push(n);
            return this;
        },
        defineGeneNames(...a){
            a=Array.level(a);
            for(var i in a)this.addGeneName(a[i]);
            return this;
        },
        defineType(t){
            this.type=t.toString();
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
        defineReproduction(func){
            if(typeof func=="string"&&AI.cloneFuncs.hasOwnProperty(func)){
                this.cloneFunc=AI.cloneFuncs[func];
            } else if(typeof func=="function"){
                this.cloneFunc=func;
            } else {
                throw new TypeError("Reproduction must be a function or predefined string.");
            }
            return this;
        },
        defineCostFunction(sim,args){
            this.simulation.func=sim;
            this.simulation.args=args;
            return this;
        },
        defineCompletionFunction(func){
            this.simulation.return=func;
            return this;
        },
        defineGeneProperties(all,specific){
            Object.defaultSetThat(this.geneProperties,{all:all});
            this.geneProperties.specific=Object.assign({},this.geneProperties.specific,specific);
            if(typeof specific=="object"&&specific){
                this.defineGeneNames(Object.keys(specific));
            }
            return this;
        },
        _createNewGenes(){
            this.genes=[];
            for(var _,j,i=0;i<this.geneCount;i++)
                this.genes.push(Gene.makeNew(this.geneProp));
            return this;
        },
        _defineGeneProperties(p,i,g){
            p=this.geneProperties;
            this.geneProp={};
            for(i of this.geneNames){
                this.geneProp[i]=Object.assign({},p.all,p.specific[i]);
                if(this.geneProp[i].hasOwnProperty("array")){
                    this.geneProp[i]=function(a){
                        var array=a.array;
                        return Object.assign(a,{
                            minValSoft:0,
                            maxValSoft:array.length,
                            maxMut:array.length,
                            returnFunc:v=>array[Math.floor(v%array.length)]
                        });
                    }(this.geneProp[i]);
                }
                g=this.geneProp[i];
                function b(a){
                    return isNaN(g[a+"Val"])&&isNaN(g[a+"ValSoft"]);
                }
                if(b('max')||b('min'))throw new RangeError("Please define the value range before executing.");
                Object.defaultSetThis(this.geneProp[i],{
                    minValSoft:this.geneProp[i].minVal,
                    maxValSoft:this.geneProp[i].maxVal,
                    minVal:-Infinity,
                    maxVal:Infinity,
                    returnFunc:v=>v
                });
            }
            return this;
        },
        execute(){
            this._defineGeneProperties()._createNewGenes();
            for(this.iterations=0;this.iterations<this.iterationCount;this.iterations++){
                this.genes=this.cloneFunc(new Proxy(this,{
                    get(o,k,p){return o.genes[k].clone.apply(o.genes[k],[o]);}
                }),this.geneCount);
                for(var j in this.genes){
                    var args=[],gene=this.genes[j];
                    for(var k of this.simulation.args)
                        args.push(Number.eval(gene.properties[k].returnFunc,gene.data[k]));
                    gene.cost=this.simulation.func.apply({},args);
                }
                this.genes.sort(function(a,b){return a.cost-b.cost;});
            }
            return this.simulation.return(this.genes);
        }
    });
    return AI;
}();
