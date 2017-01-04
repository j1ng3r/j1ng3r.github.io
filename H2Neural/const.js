K={
    "H2O":{
        "kg/L":0.9982,
    },
    "H2":{
        "kg/L":8.988e-5,
    },
    ideal_cell_voltage:math.unit("1.23 Volts"),
    cell_voltage:math.unit("1.48 Volts"),

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
    faraday:96485.3329,
    "J/Cal":4190,
    room_temperature:293,
    "L/m^3":1000,
};

K.rate=K.reaction.H2_mols/K.reaction/K.faraday;
