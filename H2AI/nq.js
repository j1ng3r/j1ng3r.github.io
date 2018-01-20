f(x)=sin(x)

C(a)=-D1(f(a))/D2(f(a))
l=1;
iter(a)=>{
    r=[a];
    
    //Trying quadratic search
    if D2(f(a))<=0
        b=a+[1...4]*C(a)/2
        b0=mindex(f(b));
        b1=mindex(b0+-C(a)/2)
        r[-]=(b0+b1)/2,b0;
    
    //Gradient descent
    r[-]=

}