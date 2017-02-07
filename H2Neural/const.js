math.createUnit("USD");//The US dollar; math won't accept $ as a name
math.createUnit("cal","4.184 J");
K={
    MAT:{
        "platinum":{
            density:"21.45 g/cm3",
            rho:"1.06e-7 ohm m",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
            cost:"31742.41 USD/kg",
        },
        "iron":{
            rho:"9.71e-8 ohm m",
            cost:"0.00446 USD/g",
            density:"7.87 g/cm3",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
        },
        "copper":{
            rho:"1.68e-8 ohm m",
            cost:"5.8762 USD/kg",
            density:"8.96 g/cm3",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
        },
        "aluminum":{
            rho:"2.65e-8 ohm m",
            cost:"0.83 USD/lb",
            density:"2.70 g/cm3",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
        },
        "graphene":{
            rho:"10e-6 ohm cm",
            cost:"100 USD/g",
            density:"2.0 g/cm3",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
        },
        "nickel":{
            rho:"7.0e-8 ohm m",
            cost:"77 USD/kg",
            density:"8.908 g/cm3",
            cathode:"1e-6 ohm m^2",//false
            anode:"1e-6 ohm m^2",//false
        }
    },
    mass(){
        return math.unit(36.03056,"g/mol");
    },
    d:{
        H2O:math.unit("0.9982 kg/L"),
        gas:math.unit("36 g/L"),
    },
    "J/Cal":math.unit("cal/(K g)"),
    room_temperature:math.eval("65 degF to K"),
    ideal_cell_voltage:math.unit("1.23 V"),
    cell_voltage:math.unit("1.48 V"),
    //Other
    "H2":{
        "kg/L":8.988e-5,
    },

    reaction:{
        cell_voltage:1.48,
        ideal_cell_voltage:1.23,
        getOverPotential(V){
            return V-K.reaction.ideal_cell_voltage;
        },
        electron_mols:4,
        H2_mols:2,
    },
    gravity:9810,//mm/s^2
    getWaterDensity(t){return(-0.6013*t*t+3.6544*t-9.2849)/100000+1;},
    flow_constant:1,
};
+function(i,j){
    for(i in K.MAT){
        for(j in K.MAT[i]){
            K.MAT[i][j]=math.unit(K.MAT[i][j]);
        }
    }
}();
