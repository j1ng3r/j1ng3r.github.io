mat={
    new(n){
        let a=[];
        for(let i=0;i<=n;i++){
            a.push([]);
            for(let j=0;j<=n;j++){
                a[i][j]=j**i;
            }
        }
        return math.matrix(a);
    },
    vec(n){
        let a=[];
        for(let i=0;i<=n;i++){
            a[i]=n**(i+1)/(i+1);
        }
        return math.matrix(a);
    },
    get(n){
        return math.multiply(math.inv(mat.new(n)),mat.vec(n));
    }
};
0=>(1)/(1) *0
1=>(1)/(2) *1
2=>(1,4)/(6) *2
3=>(1,3)/(2^3) *3
4=>(7,32,12)/(2*3^2*5) *4
5=>(19,75,50)/(2^5*3^2) *5
6=>(41,216,27,272)/(2^3*3*5*7) *6


//https://books.google.com/books?id=Gwygh5csmV4C&printsec=frontcover, page 59