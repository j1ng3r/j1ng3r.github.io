class Tree {
    constructor(a){
        this.setChildren(a);
        this.parent=null;
        this.isTree=true;
        this.clean();
        return this;
    }
    clone(){
        return new Tree(this);
    }
    addChild(A){
        if(!Array.isArray(this.children))this.children=[];
        if(Tree.isTree(A)){
            this.children.push(A);
            A.parent=this;
        }
        return this;
    }
    setChildren(a){
        this.children=[];
        return this.addChildren(a);
    }
    addChildren(a){
        if(Tree.isTree(a))a=a.children;
        if(Array.isArray(a))a.forEach(v=>this.addChild(v));
        return this;
    }
    order(){
        this.clean();
        return new Tree(this.children.sort(Tree.compare));
    }
    toString(){
        this.order();
        if(this.degree==0)return"[]";
        return`[${this.children.reduce((a,v)=>a+","+v.toString(),"").slice(1)}]`;
    }
    clean(){
        return this.setChildren(this.children.filter(v=>Tree.isTree(v)));
    }
    createNextOrder(a,n){
        let A=this.clone();
        A.children.forEach()
    }
    get isRoot(){
        return!Tree.isTree(this.parent);
    }
    get degree(){
        return this.children.length;
    }
    get height(){
        return this.children.reduce((a,v)=>Math.max(a,v.height),-1)+1;
    }
    get depth(){
        if(this.isRoot){
            return 0;
        } else return this.parent.depth+1;
    }
}
Object.assign(Tree,{
    /*compare: if A>B, returns -1. if A<B, returns 1. if A=B, returns 0*/
    compare(A,B){
        if(!Tree.isTree(A)||!Tree.isTree(B))throw new TypeError("Tree.compare requires two arguments of type Tree");
        if(A.degree===0||B.degree===0||A.degree!==B.degree)return Math.sign(A.degree-B.degree);
        let a=A.order();
        let b=B.order();
        for(let i=a.N-1;i>=0;i--){
            let c=Tree.compare(a.children[i],b.children[i]);
            if(c)return c;
        }
        return 0;
    },
    parse(q){
        if(typeof q=="string")return Tree.parseStr(q);
        if(Array.isArray(q))return Tree.parseArr(q);
        if(Tree.isTree(q))return new Tree(q);
        return new Tree();
    },
    parseStr(str){
        let a=[];
        let count=0;
        let collect="";
        let change=0;
        for(let i=0;i<str.length;i++){
            change=0;
            if(str[i]=="]")change=-1;
            if(str[i]=="[")change=1;
            count+=change;
            if(count>=2||(count==1&&change==-1)){
                collect+=str[i];
            }
            if(count==1&&change==-1){
                a.push(Tree.parseStr(collect));
                collect="";
            }
        }
        if(collect){
            a.push(Tree.parseStr(collect));
        }
        return new Tree(a);
    },
    parseArr(a){
        if(Array.isArray(a)){
            return new Tree(a.map(Tree.parseArr));
        }
        else return a;
    },
    isTree(A){
        return!!(A&&A.hasOwnProperty("isTree")&&A.isTree);
    }
});