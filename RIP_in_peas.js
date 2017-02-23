//requires expand.dong
Object.defineProperty(window,"maybe",{get:function(){return Math.random()<0.5;}});
function Chromosome(g){
    this.genes=typeof g=="string"?g.split(""):g;
}
Object.assign(Chromosome.prototype,{
    cross(C){
        for(var i in this.genes){
            if(maybe){
                [C.genes[i],this.genes[i]]=[this.genes[i],C.genes[i]];
            }
        }
    }
});
function Gamete(c){
    this.chromosomes=c;
}
Object.assign(Gamete.prototype,{
    cross(G){
        var l=[];
        for(var i in this.chromosomes)
            l.push(this.chromosomes[i],G.chromosomes[i]);
        return new Plant(l);
    }
});
function Plant(c){
    this.chromosomes=c;
    this.offspring=[];
}
Object.assign(Plant.prototype,{
    offspring:[],
    meiosis(){
        for(var i=0,l=[[],[]],a=[];i<this.chromosomes.length;i+=2){
            a=[new Chromosome(this.chromosomes[i].genes),new Chromosome(this.chromosomes[i+1].genes)];
            a[0].cross(a[1]);
            if(maybe){
                l[0].push(a[0]);
                l[1].push(a[1]);
            } else {
                l[1].push(a[0]);
                l[0].push(a[1]);
            }
        }
        console.log(l);
        this.offspring.push(new Gamete(l[0]),new Gamete(l[0]),new Gamete(l[1]),new Gamete(l[1]));
    },
    getRandomOffspring(){
        this.meiosis();
        return this.offspring.splice(Math.floor(Math.random()*this.offspring.length),1)[0];
    },
    cross(P){
        return this.getRandomOffspring().cross(P.getRandomOffspring());
    },
    getDominantGenes(){
        var l="";
        for(var i=0,j;i<this.chromosomes.length;i+=2){
            for(j=0;j<this.chromosomes[i].genes.length;j++){
                l+=this.chromosomes[i+console.print(this.chromosomes[i].genes[j].charCodeAt(0)>this.chromosomes[i+1].genes[j].charCodeAt(0))].genes[j];
            }
        }
        return l;
    }
});

var RoundYellow=new Gamete([new Chromosome("YR")]).cross(new Gamete([new Chromosome("yR")]));
var WrinkledGreen=new Gamete([new Chromosome("yr")]).cross(new Gamete([new Chromosome("yr")]));
