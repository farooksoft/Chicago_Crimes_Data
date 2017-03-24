var fs = require('fs');
var readline = require('readline');

// Array for Theft Crime
var theft_data = [];
var over = [];
var under = [];

// Array for Assault case - Arrested or Not
var arrest_data = [];
var noArrest = [];
var arrested = [];

// objects for the arrays
var theft = {};
var arrest = {};

//variable decleration
var i = 0;
var year = 0;
var type = 0;
var description = 0;
var arrest = 0;

// Common loop for Iterating data from 2001 - 2016
for (i = 0; i <= 15; i = i + 1) {
    over[i] = 0;
    under[i] = 0;
    arrested[i] = 0;
    noArrest[i] = 0;
}

//Reading the data from CSV file for performing the task
var rl = readline.createInterface({
    input: fs.createReadStream('./data/Crimes_-_2001_to_present.csv')
});

/* conditional checks to perform the mentioned tasks
    1. Aggregating the data of "THEFT OVER $500" & "THEFT $500 AND UNDER" over the time frame 2001 - 2016.
    2. Aggregating all assault cases over the time frame 2001 - 2016 
        on whether the crime resulted in an arrest or not. 
    */

rl.on('line', function(line) {
    var value = line.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    if (value[5] === 'THEFT' && value[6] === 'OVER $500') {
        over[value[17] - 2001] = over[value[17] - 2001] + 1;
    } else if (value[5] === 'THEFT' && value[6] === '$500 AND UNDER') {
        under[value[17] - 2001] = under[value[17] - 2001] + 1;
    } else if (value[5] === 'ASSAULT' && value[8] === 'true') {
        arrested[value[17] - 2001] = arrested[value[17] - 2001] + 1;
    } else if (value[5] === 'ASSAULT' && value[8] === 'false') {
        noArrest[value[17] - 2001] = noArrest[value[17] - 2001] + 1;
    }
});

//Performing the functional operation on csv data to obtain the expected aggregated result
rl.on('close', function() {
    for (i = 0; i <= 15; i = i + 1) {
// 1. Aggregating the data of "THEFT OVER $500" & "THEFT $500 AND UNDER" over the time frame 2001 - 2016.
        theft = {};
        theft.Year = i + 2001;
        theft['Theft Over $500'] = over[i];
        theft['Theft Under $500'] = under[i];
        theft_data.push(theft);

/* 2. Aggregating all assault cases over the time frame 2001 - 2016 
        on whether the crime resulted in an arrest or not.        */
        arrest = {};
        arrest.Year = i + 2001;
        arrest.Arrested = arrested[i];
        arrest['Not Arrested'] = noArrest[i];
        arrest_data.push(arrest);
    }
//Conversion of resultant csv data into JSON format
    fs.writeFileSync('output/theft_data.json', JSON.stringify(theft_data), 'utf8');
    fs.writeFileSync('output/assault_data.json', JSON.stringify(arrest_data), 'utf8');    
});


