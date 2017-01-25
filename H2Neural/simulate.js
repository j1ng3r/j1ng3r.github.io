//TO-DO use math library, use units, and implement
function Simulate(I){
    //Initializing the temporary varibles object, and the the output variables object
    var O={},T={};

    //Here we define the cell voltage of our system. It may be different based on the Nernst equation, but I don't understand that yet
    T.cell_voltage=K.ideal_cell_voltage;

    //Based on that cell voltage, we now calculate the overpotential used in future calculations
    T.overpotential=I.voltage-T.cell_voltage;

    //Defining the plate volume and area through simple multiplications
    T.plate_volume=I.plate_width*I.plate_length*I.plate_height;
    T.plate_area=I.plate_length*I.plate_height;

    //Curve with max at 1.48, zero at 1.23, always less than but approaching 1.23/x
    T.amp_multiplier=K.reaction.ideal_cell_voltage*T.overpotential/
        (O.voltage*T.overpotential+Math.sq(K.getOverPotential(K.reaction.cell_voltage)));

    //The energy required to heat or cool the system
    T.temp_energy=Math.abs(I.temperature-K.room_temperature)*K["J/Cal"];

    //
    T.theo_production=T.theo_amps*I.plate_length*I.plate_height*K.rate*T.amp_multiplier;

    //The maximum outflow of hydrogen in grams per second
    T.maxFlow=I.plate_dist*I.plate_length*Math.sqrt(8*I.plate_height*K.G*(K.d("H2O")-K.d.gas)*K.d.gas)/3;
    T.plate_R=K.rho[I.plate_material]*
    T.resistance=T.plate_R+T.cathodeR+T.waterR+T.anodeR+T.plate_R;

    /*/Outdated, need to build better equation
    O.production=function(h,g,x){//mols/s
        h=Math.sqrt(1-Math.sq(h/g));
        return(x+g-Math.sqrt(x*x-2*g*h*x+g*g))/(1+h);
    }(K.flow_constant,T.maxFlow,T.theo_production);//*/

    T.amps=I.voltage/T.resistance;
    T.out_watts=T.amps*I.voltage;
    T.watts=T.amps*I.voltage;
    O["mol/s"]=T.amps*3/4/K.F;
    O["g/s"]=O["mol/s"]*K.mass("2H2O");
    O.efficiency=T.out_watts/T.watts;
    O.weight=T.kg_of_water+I.number_of_plates*K[I.plate_material].density*T.plate_volume+K.mass(I.electrolyte_name)*I.electrolyte_weight;
    return O;
}
args=[
    "voltage",

    "plate_dist",
    "plate_width",
    "plate_length",
    "plate_height",
    "plate_material",
    "number_of_plates",

    "electrolyte_name",
    "electrolyte_weight",
    "temperature",
];




/*
    For a bubble of hydrogen with volume Vm^3, the gravity pulling it down has a force of
        F0=-Vm^3*d(H2)g/m^3*Gm/s^2
    but has a force pushing it up at a force of
        F1=Vm^3*d(H2O)g/m^3*G
    the total force pushing it up is
        F_t=Vm^3*G*(d(H2O)g/m^3-d(H2)g/m^3)
    thus its acceleration upwards is
        a=F_t/(Vm^3*d(H2)g/m^3)
         =(F_t/Vm^3)/(d(H2)g/m^3)
         =G*(d(H2O)-d(H2))/d(H2)

    we start with
        s(t)=s0+v0t+1/2at^2
        v(t)=v0+at
    however, v0 can be assumed to be 0, so we get
        s(t)=s0+1/2at^2
        v(t)=at
    now, for a given s0<0 we want to know the time it takes to get to the surface at s=0.
        s(t)=0
        h=-s0
        0=-h+1/2aT^2
        h=1/2aT^2
        T=sqrt(2h/a)
        v(T)=a*sqrt(2h/a)=sqrt(2ha)
    we now consider that particles are being generated uniformly along a plate of height H.
    the average velocity =
        sum=0;
        num=0;
        for(h=0;h<H;h+=epsilon)
            sum+=v(h);
            num+=1;
        avg=sum/num;
    so we can use integration, we change it to
        sum=0;
        for(h=0;h<H/epsilon;h++)
            sum+=v(h*epsilon)*epsilon;
        avg=sum/(H/epsilon)=sum/H;
    this becomes
        avg=(int(0=>H) v(h)dh)/H
    solving for the indefinite integral, we get
        int=int v(h)dh=int sqrt(2ah)dh=sqrt(2a)*(int sqrt(h)dh=int h^1/2 dh=(h^3/2)/(3/2)=2/3 h^3/2)=sqrt(8a/9)*h^3/2
    completing the integral gives us
        avg=sqrt(8a/9)*H^(3/2)/H=sqrt(8aH)/3=sqrt(8HG*(d(H2O)-d(H2))/d(H2))/3
    We now find the maximum amount of hydrogen leaving the plates
        g=avg*plate_dist*plate_length*d(H2)
         =plate_dist*plate_length*d(H2)*sqrt(8HG*()/d(H2))/3
         =plate_dist*plate_length*sqrt(8HG*(d(H2O)-d(H2))*d(H2))/3
        mol=g/mass(H2)=plate_dist*plate_length*sqrt(8*plate_height*G*(d(H2O)-d(H2))*d(H2))/(3*mass(H2))
    thus, the maximum amount of hydrogen able to leave a set of plates is equivalent to
        plate_dist*plate_length*sqrt(8*plate_height*G*(d(H2O)-d(H2))*d(H2))/(3*mass(H2))
************************************************
Presentation:
    Why/What?
    Real-time H2 Gen 2 Power Cars
    Need to optimize and span large trade space
        The optimum results will be different depending on priorities.
        If you value efficiency, the optimum plate material is probably platinum.
        If you value your money, steel is probably the way to go.
    Built custom AI to find maximum value
        AI Library (Bio-inspired)
            Picks random points on a multivariable surface
            These points are assigned "genes" which describe where they are on the surface
                If a gene does well, it gets cloned, and its gene gets "mutated", or slightly changed.
                    This allows the AI to explore the area around the gene that did well.
                If not, it gets deleted.
            Over time, the AI will reach the optimum conditions, and it then returns these conditions to you
        Simulation
            Focuses on a few general areas: Geometry, Material, Power, and Reactant Solution
        Cost function
            User defined
            Tells the AI what is important and what isn't
        AI code
            Calls the library
            Has some user controls
    Get Results from AI and rebuild H2 Generator
        *Need to finish model and put it into code
*/
