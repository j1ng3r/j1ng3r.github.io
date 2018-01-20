math.createUnit("USD");//The US dollar; math won't accept $ as a name
math.createUnit("cal","4.184 J");
K={
    MAT:{
        "platinum":{
            density:"21.45 g/cm3",
            rho:"1.06e-7 ohm m",
            cathode:"1e-5 ohm m^2",//false
            anode:"1e-5 ohm m^2",//false
            cost:"31742.41 USD/kg",
        },
        "iron":{
            rho:"9.71e-8 ohm m",
            cost:"4.46 USD/kg",
            density:"7.87 g/cm3",
            cathode:"5e-5 ohm m^2",//false
            anode:"4.5e-5 ohm m^2",//false
        },
        "NiFeO2":{
            rho:"8.36e-8 ohm m",//average between iron and nickel
            cost:"55 USD/kg",//more than average between iron and nickel
            density:"8.39 g/cm3",//avg of Ni & Fe
            anode:"3e-5 ohm m^2",//false
            cathode:"5e-5 ohm m^2"//false
        },
        "copper":{
            rho:"1.68e-8 ohm m",
            cost:"5.8762 USD/kg",
            density:"8.96 g/cm3",
            cathode:"9e-5 ohm m^2",//false
            anode:"10e-5 ohm m^2"//false
        },
        "aluminum":{
            rho:"2.65e-8 ohm m",
            cost:"0.83 USD/lb",
            density:"2.70 g/cm3",
            cathode:"3.5e-4 ohm m^2",//false
            anode:"4e-4 ohm m^2",//false
        },
        "graphene":{
            rho:"1e-6 ohm cm",
            cost:"100 USD/g",
            density:"2.0 g/cm3",
            cathode:"6e-4 ohm m^2",//false
            anode:"6e-4 ohm m^2",//false
        },
        "nickel":{
            rho:"7.0e-8 ohm m",
            cost:"77 USD/kg",
            density:"8.908 g/cm3",
            cathode:"3e-5 ohm m^2",//false
            anode:"4e-5 ohm m^2",//false
        }
    },
    mass(){
        return math.unit(36.03056,"g/mol");
    },
    cost:{
        H2O:math.unit("1 USD/kg"),
        Na2CO3:math.unit("10 USD/kg"),
        electron:math.unit("0.12 USD/(kW hour)")
    },
    d:{
        H2O:math.unit("0.9982 kg/L"),
        gas:math.unit("36 g/L"),
    },
    "J/Cal":math.unit("cal/(K g)"),
    room_temperature:math.eval("65 degF to K"),
    ideal_cell_voltage:math.unit("1.23 V"),
    cell_voltage:math.unit("1.48 V"),
    gravity:math.unit("9.81 m/s^2"),
};
K.maxFlow=math.divide(math.sqrt(
    math.multiply(8,K.gravity,math.subtract(K.d.H2O,K.d.gas),K.d.gas)
),K.mass("2H2+O2"));
K.flow=math.multiply(4/3,math.faraday,K.maxFlow);//58869.78696862518 A/cm^2.5
K.flow=math.unit("60 A / cm^2.5");//Not true
+function(i,j){
    for(i in K.MAT){
        for(j in K.MAT[i]){
            K.MAT[i][j]=math.unit(K.MAT[i][j]);
        }
    }
}();
