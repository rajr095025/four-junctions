const { Console } = require("console");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function maxProfit(timeUnits, propertiesMap) {
  let pubChoosenProfit = 0;
  let theatreChoosenProfit = 0;
  let commercialParkChoosenProfit = 0;
  let pubChoosenProfitMap = 0;
  let theatreChoosenProfitMap = 0;
  let commercialParkChoosenMap = 0;

  propertiesMap = deepClone(propertiesMap);

  // console.log("initial", timeUnits, propertiesMap);

  if (timeUnits > 4) {
    let remainingTimeUnits = timeUnits - 4;
    const [pubChoosenProfitRemaining, pubChoosenProfitMapRemaining] = maxProfit(
      remainingTimeUnits,
      propertiesMap
    );

    pubChoosenProfit = 1000 * remainingTimeUnits + pubChoosenProfitRemaining;

    pubChoosenProfitMap = pubChoosenProfitMapRemaining?.map((map) => {
      map["P"] = map["P"] ? map["P"] + 1 : 1;
      return map;
    });
  }

  if (timeUnits > 5) {
    // let remainingTimeUnits = timeUnits - 5;
    // [theatreChoosenProfit, theatreChoosenProfitMap] =
    //   1500 * remainingTimeUnits +
    //   maxProfit(remainingTimeUnits, { ...propertiesMap });

    let remainingTimeUnits = timeUnits - 5;
    const [theatreChoosenProfitRemaining, theatreChoosenProfitMapRemaining] =
      maxProfit(remainingTimeUnits, propertiesMap);
    theatreChoosenProfit =
      1500 * remainingTimeUnits + theatreChoosenProfitRemaining;

    theatreChoosenProfitMap = theatreChoosenProfitMapRemaining?.map((map) => {
      map["T"] = map["T"] ? map["T"] + 1 : 1;
      return map;
    });
  }

  if (timeUnits > 10) {
    let remainingTimeUnits = timeUnits - 10;
    const [
      commercialParkChoosenProfitRemaining,
      commercialParkChoosenProfitMapRemaining,
    ] = maxProfit(remainingTimeUnits, propertiesMap);

    commercialParkChoosenProfit =
      3000 * remainingTimeUnits + commercialParkChoosenProfitRemaining;

    commercialParkChoosenMap = commercialParkChoosenProfitMapRemaining?.map(
      (map) => {
        map["C"] = map["C"] ? map["C"] + 1 : 1;
        return map;
      }
    );
  }

  // console.log("Final Answer pub ", pubChoosenProfit, pubChoosenProfitMap);

  // console.log(
  //   "Final Answer theatre ",
  //   theatreChoosenProfit,
  //   theatreChoosenProfitMap
  // );

  // console.log(
  //   "Final Answer commercial park  ",
  //   commercialParkChoosenProfit,
  //   commercialParkChoosenMap
  // );

  if (
    pubChoosenProfit > theatreChoosenProfit &&
    pubChoosenProfit > commercialParkChoosenProfit
  ) {
    return [pubChoosenProfit, pubChoosenProfitMap];
  }

  if (
    theatreChoosenProfit > pubChoosenProfit &&
    theatreChoosenProfit > commercialParkChoosenProfit
  ) {
    return [theatreChoosenProfit, theatreChoosenProfitMap];
  }

  if (
    commercialParkChoosenProfit > theatreChoosenProfit &&
    commercialParkChoosenProfit > pubChoosenProfit
  ) {
    return [commercialParkChoosenProfit, commercialParkChoosenMap];
  }

  if (
    pubChoosenProfit !== 0 &&
    pubChoosenProfit === theatreChoosenProfit &&
    theatreChoosenProfit === commercialParkChoosenProfit
  ) {
    return [
      pubChoosenProfit,
      [
        ...pubChoosenProfitMap,
        ...theatreChoosenProfitMap,
        ...commercialParkChoosenMap,
      ],
    ];
  }

  if (pubChoosenProfit !== 0 && pubChoosenProfit === theatreChoosenProfit) {
    return [
      pubChoosenProfit,
      [...pubChoosenProfitMap, ...theatreChoosenProfitMap],
    ];
  }

  if (
    theatreChoosenProfit !== 0 &&
    theatreChoosenProfit === commercialParkChoosenProfit
  ) {
    return [
      theatreChoosenProfit,
      [...theatreChoosenProfitMap, ...commercialParkChoosenMap],
    ];
  }

  if (
    pubChoosenProfit !== 0 &&
    pubChoosenProfit === commercialParkChoosenProfit
  ) {
    return [
      pubChoosenProfit,
      [...pubChoosenProfitMap, ...commercialParkChoosenMap],
    ];
  }

  return [0, propertiesMap];
}

function processInput() {
  rl.question("Please Enter Number of units of time ", (timeUnits) => {
    let finalProfit = maxProfit(timeUnits, [{ T: 0, P: 0, C: 0 }]);

    console.log(
      `Time Unit: ${timeUnits}
Earnings: $${finalProfit?.[0]}
Solutions`
    );

    finalProfit?.[1]?.forEach((item, index) => {
      console.log(`${index + 1}. T: ${item.T} P: ${item.P} C: ${item.C}`);
    });

    processInput();
  });
}

processInput();
