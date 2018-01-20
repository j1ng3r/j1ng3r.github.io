Object.defineProperty(Array.prototype,"random",{
    value:function random(){
        return this[~~(Math.random()*this.length)];
    }
})
class Grammar {
    constructor(rules){
        this.rules=this.extractRules(rules.rules||rules);
    }
    extractRules(rules){
        let obj={};
        for(let i in rules){
            obj[i]=Array.isArray(rules[i])?rules[i]:rules[i].split(",");
        }
        return obj;
    }
    iterate(str){
        for(let i=0;i<str.length;i++){
            if(this.rules.hasOwnProperty(str[i])){
                return str.slice(0,i)+"("+this.rules[str[i]].random()+")"+str.slice(i+1);
            }
        }
        return str;
    }
    iterateN(str,n){
        let rst=str;
        for(let i=0;i<n;i++){
            rst=this.iterate(str);
            if(rst==str)return rst;
            str=rst;
        }
        return str;
    }
}

let Real = new Grammar({
    "R":"R+R,R-R,R*R,R/R,R^R,0,1,2,3,4,5,6,7,8,9,x"
});

class Expression {
    constructor(str,rules){
        this.str="("+str+")";
        this.grammar=new Grammar(rules);
    }
    iterate(){
        this.str=this.grammar.iterate(this.str);
        return this;
    }
    iterateN(n){
        this.str=this.grammar.iterateN(this.str,n);
        return this;
    }
    getMaxDepth(){
        let max=0;
        let counter=0;
        for(let i=0;i<this.str.length;i++){
            if(this.str[i]=="(")counter++;
            if(this.str[i]==")")counter--;
            max=Math.max(counter,max);
        }
        return max;
    }
}

let Equation = new Expression("R=R",Real);

let testEq=_=>(new Expression("R=R",Real).iterateN(100).getMaxDepth());
let testEqs=n=>{
    let sum=0;
    for(let i=0;i<n;i++){
        sum+=testEq();
    }
    return sum/n;
}
let getRange=(n,m)=>{
    let a=[];
    for(let i=0;i<m;i++)a.push(testEqs(n));
    return Stats.getTwoSigma(a);
}
let getRange_=(n,m,p,o)=>{
    let a=[];
    for(let i=0;i<m;i++)a.push((_=>{
        let sum=0;
        for(let i=0;i<n;i++){
            sum+=new Expression("R=R",o).iterateN(p).getMaxDepth();
        }
        return sum/n;
    })());
    return Stats.getTwoSigma(a);
};