let genkeys=(()=>{
    let A=[[[]]],genkeys=n=>{
        if(A[n])return A[n];
        let last=genkeys(n-1),r=[];
        for(let i=0;i<n;i++)
            r=r.concat(last.map((v,j)=>v.map((w,k)=>w>=i?w+1:w).concat([i])));
        return A[n]=r;
    };
    return genkeys;
})();
let genG=(a,b)=>{
    let G={n:a+b-1,a:a,b:b,arr:[],val:{},done:false,marked:[],
        getNext(){
            return G.marked[0];
        },
        set(key,lr){
            let obj=G.arr[G.val[key].i];
            obj.val[lr]=1;
            G.handle(obj);
        },
        mark(o){
            o.val.marked=G.marked.push(o);
        },
        handle(o){
            if(o.val.l+o.val.r==1){
                G.mark(o);
            } else if(o.val.marked){
                G.marked.splice(o.val.marked-1,1);
                G.marked.forEach((v,i)=>v.val.marked=i+1);
            }
        },
        iter_l(key){
            let B=key.split(","),A=B.splice(0,this.a);
            for(let i=1;i<this.a;i++)
                G.set(A.slice(i).concat(A.slice(0,i),B).join(),"l");
        },
        iter_r(key){
            let A=key.split(","),B=A.splice(-this.b);
            for(let i=1;i<this.b;i++)
                G.set(A.concat(B.slice(i),B.slice(0,i)).join(),"r");
        },
        iterate(){
            let o=this.getNext();
            if(!o)return this.done();
            if(!o.val.l){
                G.iter_l(o.key);
                o.val.l=1;
            }
            if(!o.val.r){
                G.iter_r(o.key);
                o.val.r=1;
            }
            G.handle(o);
        },
        done(){
            console.log("Done!");
            let sum=G.getSum();
            console.log(`Total count is: ${sum}`);
            return"Done!";
        },
        getSum(){
            return this.arr.reduce((a,o)=>a+(o.val.l+o.val.r)/2,0);
        },
        caution(){
            while(!G.iterate());
        }
    };
    console.log("done loading keys");
    G.arr=(G.key=genkeys(G.n)).map((v,i)=>({i:i,key:""+v,val:(G.val[v]={i:i,l:0,r:0,marked:0})}));
    G.mark(G.arr[0]);
    console.log("done generating group");
    return G;
};
let g=(a,b)=>genG(a,b).caution();

/*
g(1,n)=n
g(2,n)=n!
g(3,1...)=3,24,60,720,2520,40320
*/