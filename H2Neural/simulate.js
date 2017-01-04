function Simulate(I){
    var O={},T={};
    T.true_cell_voltage=K.ideal_cell_voltage-math.constant("")
    T.overpotential=K.getOverPotential(I.voltage);
    T.kg_of_water=I.liters_of_water*K.getWaterDensity(I.temperature);
    T.plate_volume=I.plate_width*I.plate_length*I.plate_height;
    T.amp_multiplier=K.reaction.ideal_cell_voltage*T.overpotential*Math.sq(O.voltage)/
        (O.voltage*T.overpotential+Math.sq(K.getOverPotential(K.reaction.cell_voltage)));
    T.temp_energy=Math.abs(I.temperature-K.room_temperature)*K["J/Cal"];
    T.theo_production=T.theo_amps*I.plate_length*I.plate_height*K.rate*T.amp_multiplier;
    T.maxFlow=16/27*Math.sqrt(2*I.plate_height*K["H2"]["kg/L"]/K.gravity/(K.getWaterDensity(I.temperature)-K["H2"]["kg/L"]))*I.plate_dist;
    O.production=function(h,g,x){//mols/s
        h=Math.sqrt(1-Math.sq(h/g));
        return(x+g-Math.sqrt(x*x-2*g*h*x+g*g))/(1+h);
    }(K.flow_constant,T.maxFlow,T.theo_production);
    T.amps=O.production/K.rate;
    T.watts=T.amps*I.voltage;
    T["L/s"]=O.production;
    O.efficiency=O.production/I.voltage;
    O.weight=T.kg_of_water+I.number_of_plates*K[I.plate_material]["kg/mm^3"]*T.plate_volume;
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
    "electrolyte_mols",
    "temperature",
];
