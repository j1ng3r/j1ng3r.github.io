function der(A){
    let D=[];
    let add=(...a)=>a.forEach(v=>{
        if(v[0]!=0&&v[1]!=3){
            for(let i=0;i<D.length;i++){
                w=D[i];
                if(v[1]<w[1]||v[1]==w[1]&&(v[2]<w[2]||v[2]==w[2]&&(v[3]<w[3]||v[3]==w[3]&&v[4]<w[4]))){
                    return D.splice(i,0,v);
                } else if(v[1]==w[1]&&v[2]==w[2]&&v[3]==w[3]&&v[4]==w[4]){
                    return w[0]+=v[0];
                }
            }
            D.push(v);
        }
    });
    for(let i=0;i<A.length;i++){
        let t=A[i],k=t[0],a=t[1],p=t[2],b1=t[3],b2=t[4];
        add([k,a+1,p,b1,b2],[k,a,p+1,b1+1,b2],[k*b1,a,p,b1-1,b2+1],[6*k*b2,a,p,b1,b2-1]);
    }
    return D;
}
function ender(n){
    let A=[[1,0,0,0,0]];
    for(let i=0;i<n;i++)A=der(A);
    return A;
}
function neq(n){
    let A=ender(n);
    let s=`T_${n}(i)=`;
    let xp=(p,b)=>p==0?"":(b+(p==1?"":("^{"+p+"}")));
    for(let i=0;i<A.length;i++){
        v=A[i];
        if(i!=0)s+="+";
        s+=
            `${v[0]>1?v[0]:""}
            \\sum _{n=${v[2]}}^N
            ${v[2]==0?"":v[2]==1?"n":`\\frac{n!}{(n-${v[2]})!}`}
            ${["(c_0(n)+c_1(n)i+\\frac{c_2(n)}{2}i^2)","(c_1(n)+c_2(n)i)","c_2(n)"][v[1]]}
            P(i)^{n${v[2]==0?"":"-"+v[2]}}
            ${xp(v[4],"P_2(i)")}
            ${xp(v[3],"P_1(i)")}`;
    }
    return s.replace(/\s/g,"").replace(/\(/g,"\\left(").replace(/\)/g,"\\right)");
}

//matrix calculator code
function invert(N,K){
    let m=[];
    document.getElementsByName("n")[0].value=N*K;
    P=(j,k,l)=>k==0?l:P(j-1,k-1,l*j);
    for(var k=0;k<K;k++){
        for(var i=-1;i<=N-2;i++){
            m.push([]);
            for(var j=k;j<N*K;j++){
                m[m.length-1][j]=P(j,k,i**(j-k));
            }
        }
    }
    document.querySelector(".r-button").click();
    m.forEach((v,i)=>v.forEach((w,j)=>document.getElementsByName(`matrix[${i}][${j}]`)[0].value=w));
    document.querySelectorAll(".r-button")[3].click();
    document.querySelectorAll(".r-button")[4].click();
}