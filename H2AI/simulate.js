function Simulate(I){
    //Defining some preliminary, independant things
    var O=Object.deepCopy(I);
    O.electrolyte_weight=math.divide(O.water_weight,1/O.percentMass-1);
    O["L/mol"]=T=>math.divide(math.multiply(math.gasConstant,T),math.unit("1 atm"));
    O.getGasDensity=_=>math.divide(K.mass("2H2O"),math.multiply(3,O["L/mol"](_)));
    O.xtra_water_weight=math.subtract(O.water_weight,math.multiply(O.plate_dist,O.plate_length,O.plate_height,K.d.H2O));
    if(O.xtra_water_weight.toNumber()<0)O.xtra_water_weight=math.unit("0 g");
    //Getting the material properties
    O.mat=K.MAT[O.plate_material];

    //Defining plate properties through simple multiplications
    O.plate_area=math.multiply(O.plate_length,O.plate_height);
    O.plate_volume=math.multiply(O.plate_width,O.plate_area);
    O.plate_weight=math.multiply(O.mat.density,O.plate_volume,O.number_of_plates);

    //Here we define the cell voltage of our system. It may be different based on the Nernst equation, but I don't understand that yet
    O.cell_voltage=K.ideal_cell_voltage;

    /*/Based on that cell voltage, we now calculate the overpotential used in future calculations
    O.overpotential=math.subtract(O.voltage,O.cell_voltage);

    //Curve with max at 1.48, zero at 1.23, always less than but approaching 1.23/x
    O.amp_multiplier=K.reaction.ideal_cell_voltage*O.overpotential/
        (O.voltage*O.overpotential+Math.sq(K.getOverPotential(K.reaction.cell_voltage)));//*/

    //The energy required to heat or cool the system
    O.temp_energy=math.multiply(math.abs(math.subtract(O.temperature,K.room_temperature)),K["J/Cal"],O.water_weight);

    //The maximum outflow of hydrogen in grams per second (proof below)
    O.maxFlow=math.multiply(O.plate_dist,O.plate_length,math.sqrt(O.plate_height),K.maxFlow);
    //*/

    O.cathodeR=math.divide(O.mat.cathode,O.plate_area);
    O.anodeR=math.divide(O.mat.anode,O.plate_area);
    //resistance of a single plate, assuming 2 plates
    O.plate_R=math.divide(
        math.multiply(O.mat.rho,O.plate_length),
        math.multiply(O.plate_height,O.plate_width)
    );

    //approx based on data
    O.datafit=math.eval("f(x)=(30275+35858000x)/(x+25679)*e^(-16.247x)");
    O.conductivity=math.unit(math.divide(O.temperature,K.room_temperature)*O.datafit(O.percentMass),"mS/cm");
    if(O.conductivity.toNumber()<0)O.conductivity=math.unit("0 mS/cm");

    //Calculating mass transfer
    O.H2O_R=math.divide(O.plate_dist,math.multiply(O.conductivity,O.plate_area));
    O.exteriorR=math.add(O.plate_R,O.cathodeR,O.anodeR,O.plate_R);
    O.flowR=math.divide(O.voltage,math.multiply(O.plate_dist,O.plate_length,math.sqrt(O.plate_height),K.flow));
    var a=O.flowR.toNumber("ohm"),b=O.exteriorR.toNumber("ohm"),c=O.H2O_R.toNumber("ohm");
    O.percentWater=Math.abs(b-a-c+Math.sqrt((b-a)*(b-a)+c*c+2*c*(a+b)))/(2*b);
    O.waterR=math.divide(O.H2O_R,O.percentWater);

    //Solving for the resistance of a single system, assuming 2 plates
    O.systemR=math.add(O.waterR,O.exteriorR);

    //TODO, assuming 2 plates
    O.resistance=O.systemR;

    //I=V/R
    O.amps=math.divide(O.voltage,O.resistance);
    //the production in mols of gas per second
    O.rate=math.divide(math.multiply(O.amps,3/4),math.faraday);

    //the production in grams per second
    O["g/s"]=math.multiply(O.rate,K.mass("2H2O"),1/3);

    //the production of hydrogen at STP
    O["L/s"]=math.multiply(O.rate,O["L/mol"](K.room_temperature));

    //The total time that the system can run for
    O.production_time=math.divide(O.xtra_water_weight,O["g/s"]);

    O.temp_watts=math.divide(O.temp_energy,O.production_time);
    /*If the voltage is the cell voltage, the efficiency is 1.
    Thus, the output watts is the amps times the cell voltage.*/
    O.out_watts=math.multiply(O.amps,O.cell_voltage);

    //W=VI
    O.watts=math.add(math.multiply(O.voltage,O.amps),O.temp_watts);

    //Energy out/energy in. Unitless
    O.efficiency=math.divide(O.out_watts,O.watts)||0;

    //The total weight of the system
    O.weight=math.add(O.water_weight,O.electrolyte_weight,O.plate_weight);

    //Calculating cost
    O.plate_cost=math.multiply(O.plate_weight,O.mat.cost);
    O.water_cost=math.multiply(O.water_weight,K.cost.H2O);
    O.electrolyte_cost=math.multiply(O.electrolyte_weight,K.cost[O.electrolyte_name]);
    O.mcost=math.add(O.plate_cost,O.water_cost,O.electrolyte_cost);
    O.ocost=math.multiply(O.watts,K.cost.electron); //Cost of electricity

    //Calculating size
    O.system_width=math.add(math.multiply(O.plate_dist,O.number_of_plates-1),math.multiply(O.plate_width,O.number_of_plates));
    O.water_size=math.multiply(math.pow(math.divide(O.xtra_water_weight,K.d.H2O),1/3),3);
    O.size=math.add(O.system_width,O.plate_length,O.plate_height);

    //Cleaning and parsing O
    var S={};
    for(let i in O){
        S[i]=typeof O[i]=="function"?O[i]:O[i].toString();
    }
    let ret={
        data:S,
        rate:O.rate.toNumber("mol/s"),
        time:O.production_time.toNumber("s"),
        eff:O.efficiency,
        weight:O.weight.toNumber("g"),
        mcost:O.mcost.toNumber("USD"),
        size:O.size.toNumber("mm"),
        ocost:O.ocost.toNumber("USD / day")
    };
    return ret;
}
argprops={
    "voltage":{
        minVal:1.48,
        maxValSoft:10,
        maxMut:0.1,
        returnFunc:_=>math.unit(_,"V")
    },
    "plate_dist":{
        minVal:-Math.LN2,
        maxValSoft:5,
        maxMut:0.5,
        returnFunc:_=>math.unit(Math.exp(_),"mm")
    },
    "plate_width":{
        minVal:0,
        maxValSoft:5,
        maxMut:0.5,
        returnFunc:_=>math.unit(Math.exp(_),"mm")
    },
    "plate_length":{
        minVal:0,
        maxValSoft:11,
        maxMut:0.5,
        returnFunc:_=>math.unit(Math.exp(_),"mm")
    },
    "plate_height":{
        minVal:0,
        maxValSoft:9,
        maxMut:0.5,
        returnFunc:_=>math.unit(Math.exp(_),"mm")
    },
    "plate_material":{
        array:Object.keys(K.MAT)
    },
    "number_of_plates":{
        array:[2]
    },
    "electrolyte_name":{
        array:["Na2CO3"]
    },
    "percentMass":{
        minVal:0,
        maxValSoft:0.1,
        maxVal:1,
        maxMut:0.01
    },
    "temperature":{
        minVal:50,
        maxVal:180,
        maxMut:10,
        returnFunc:_=>math.eval(_+"degF to K")
    },
    "water_weight":{
        minVal:0,
        minValSoft:3,
        maxValSoft:13,
        maxMut:0.5,
        returnFunc:_=>math.unit(Math.exp(_),"g")
    }
}
args=Object.keys(argprops);




/*
    For a bubble of hydrogen with volume Vm^3, the gravity pulling it down has a force of
        F0=-V*d(H2)*G [d(R) is the density of R, G is 9.81 m/s^2]
    but has a force pushing it up at a force of
        F1=V*d(H2O)*G
    the total force pushing it up is
        F_t=V*G*(d(H2O)-d(H2))
    thus its acceleration upwards is
        a=F_t/(V*d(H2))
         =(F_t/V)/(d(H2))
         =V*G*(d(H2O)-d(H2))/V/d(H2)
         =G*(d(H2O)-d(H2))/d(H2)

    we start with
        s(t)=s0+v0t+1/2at^2
        v(t)=v0+at
    however, v0 can be assumed to be 0, so we get
        s(t)=s0+1/2at^2
        v(t)=at
    now, for a given s0<0 we want to know the time T it takes to get to the surface at s=0.
        s(t)=0
        h=-s0
        0=-h+1/2aT^2
        h=1/2aT^2
        T=sqrt(2h/a)
        u(h)=v(T)=a*sqrt(2h/a)=sqrt(2ha)
    we now consider that particles are being generated uniformly along a plate of height H.
    the average velocity =
        sum=0;
        num=0;
        for(h=0;h<H;h+=epsilon)
            sum+=u(h);
            num+=1;
        avg=sum/num;
    so we can use integration, we change it to
        sum=0;
        for(h=0;h<H/epsilon;h++)
            sum+=u(h*epsilon)*epsilon;
        avg=sum/(H/epsilon)=sum/H;
    this becomes
        avg=(int(0=>H) u(h)dh)/H
    solving for the indefinite integral, we get
        int=int u(h)dh=int sqrt(2ah)dh=sqrt(2a)*(int sqrt(h)dh=int h^1/2 dh=(h^3/2)/(3/2)=2/3 h^3/2)=sqrt(8a/9)*h^3/2
    completing the integral gives us
        avg=sqrt(8a/9)*H^(3/2)/H=sqrt(8aH)/3=sqrt(8HG*(d(H2O)-d(H2))/d(H2))/3
    We now find the maximum amount of hydrogen leaving the plates
        M=avg*plate_dist*plate_length*d(H2)
         =plate_dist*plate_length*d(H2)*sqrt(8HG*()/d(H2))/3
         =plate_dist*plate_length*sqrt(8HG*(d(H2O)-d(H2))*d(H2))/3
        mol=M/mass(H2)=plate_dist*plate_length*sqrt(8*plate_height*G*(d(H2O)-d(H2))*d(H2))/(3*mass(H2))
    thus, the maximum amount of hydrogen able to leave a set of plates is equivalent to
        P_max=plate_dist*plate_length*sqrt(8*plate_height*G*(d(H2O)-d(H2))*d(H2))/(3*mass(H2))
    To save time, let us define:
        X=sqrt(8*G*(d(H2O)-d(H2))*d(H2))/(3*mass(H2))
    such that
        P_max=plate_dist*plate_length*sqrt(plate_height)*X
    It is safe to assume that the percent water W_P is
        W_P=1-rate/P_max;
    We now re-write rate as its calculated form and solve for W_P
        W_P=1-(I*3/4F)/P_max #F=faraday constant
        W_P=1-((V*3/4F)/P_max)/R
        W_P=1-((V*3/4F)/P_max)/(2R_E+R_C+R_A+R_W)
        W_P=1-((V*3/4F)/P_max)/(2R_E+R_C+R_A+plate_dist/(C*plate_height*plate_length))
            C=f(T,K)*W_P
        W_P=1-((V*3/4F)/P_max)/(2R_E+R_C+R_A+D/(f(T,K)*W_P*H*L))
            X=sqrt(8*G*(d(H2O)-d(H2))*d(H2))/(3*mass(2H2O))
            x=8F*sqrt(2*G*(d(H2O)-d(H2))*d(H2))/(3*mass(2H2O))
            K1=V*3/(4F*P_max)=V*3/(4F*S*L*sqrt(H)*X)=V/(SL*sqrt(H)*x)
            K2=2R_E+R_C+R_A
            K3=S/(f(T,K)*H*L)
        W_P=1-K1/(K2+K3/W_P);
        W_P=1-((V*3/4F)/P_max)/(2R_E+R_C+R_A+1/*plate_dist/())
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
