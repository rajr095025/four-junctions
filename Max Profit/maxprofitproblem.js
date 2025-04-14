const { Console } = require("console");
const { timingSafeEqual } = require("crypto");
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

function maxProfitDpMemo(timeUnits, propertiesMap, memo = {}) {
  if (memo[timeUnits]) {
    // console.log(
    //   "inside if ",
    //   timeUnits,
    //   "answer",
    //   memo[timeUnits],
    //   "memo",
    //   JSON.stringify(memo)
    // );

    return memo[timeUnits];
  }

  let pubChoosenProfit = 0;
  let theatreChoosenProfit = 0;
  let commercialParkChoosenProfit = 0;
  let pubChoosenProfitMap = 0;
  let theatreChoosenProfitMap = 0;
  let commercialParkChoosenMap = 0;

  propertiesMap = deepClone(propertiesMap);

  if (timeUnits > 4) {
    let remainingTimeUnits = timeUnits - 4;
    const [pubChoosenProfitRemaining, pubChoosenProfitMapRemaining] =
      maxProfitDpMemo(remainingTimeUnits, propertiesMap, memo);

    pubChoosenProfit = 1000 * remainingTimeUnits + pubChoosenProfitRemaining;

    pubChoosenProfitMap = pubChoosenProfitMapRemaining?.map((map) => {
      map = deepClone(map);
      map["P"] = map["P"] ? map["P"] + 1 : 1;
      return map;
    });
  }

  if (timeUnits > 5) {
    let remainingTimeUnits = timeUnits - 5;
    const [theatreChoosenProfitRemaining, theatreChoosenProfitMapRemaining] =
      maxProfitDpMemo(remainingTimeUnits, propertiesMap, memo);
    theatreChoosenProfit =
      1500 * remainingTimeUnits + theatreChoosenProfitRemaining;

    theatreChoosenProfitMap = theatreChoosenProfitMapRemaining?.map((map) => {
      map = deepClone(map);
      map["T"] = map["T"] ? map["T"] + 1 : 1;
      return map;
    });
  }

  if (timeUnits > 10) {
    let remainingTimeUnits = timeUnits - 10;
    const [
      commercialParkChoosenProfitRemaining,
      commercialParkChoosenProfitMapRemaining,
    ] = maxProfitDpMemo(remainingTimeUnits, propertiesMap, memo);

    commercialParkChoosenProfit =
      3000 * remainingTimeUnits + commercialParkChoosenProfitRemaining;

    commercialParkChoosenMap = commercialParkChoosenProfitMapRemaining?.map(
      (map) => {
        map = deepClone(map);
        map["C"] = map["C"] ? map["C"] + 1 : 1;
        return map;
      }
    );
  }

  let finalProfit = [0, propertiesMap];

  if (
    pubChoosenProfit > theatreChoosenProfit &&
    pubChoosenProfit > commercialParkChoosenProfit
  ) {
    finalProfit = [pubChoosenProfit, pubChoosenProfitMap];
  } else if (
    theatreChoosenProfit > pubChoosenProfit &&
    theatreChoosenProfit > commercialParkChoosenProfit
  ) {
    finalProfit = [theatreChoosenProfit, theatreChoosenProfitMap];
  } else if (
    commercialParkChoosenProfit > theatreChoosenProfit &&
    commercialParkChoosenProfit > pubChoosenProfit
  ) {
    finalProfit = [commercialParkChoosenProfit, commercialParkChoosenMap];
  } else if (
    pubChoosenProfit !== 0 &&
    pubChoosenProfit === theatreChoosenProfit &&
    theatreChoosenProfit === commercialParkChoosenProfit
  ) {
    finalProfit = [
      pubChoosenProfit,
      [
        ...pubChoosenProfitMap,
        ...theatreChoosenProfitMap,
        ...commercialParkChoosenMap,
      ],
    ];
  } else if (
    pubChoosenProfit !== 0 &&
    pubChoosenProfit === theatreChoosenProfit
  ) {
    finalProfit = [
      pubChoosenProfit,
      [...pubChoosenProfitMap, ...theatreChoosenProfitMap],
    ];
  } else if (
    theatreChoosenProfit !== 0 &&
    theatreChoosenProfit === commercialParkChoosenProfit
  ) {
    finalProfit = [
      theatreChoosenProfit,
      [...theatreChoosenProfitMap, ...commercialParkChoosenMap],
    ];
  } else if (
    pubChoosenProfit !== 0 &&
    pubChoosenProfit === commercialParkChoosenProfit
  ) {
    finalProfit = [
      pubChoosenProfit,
      [...pubChoosenProfitMap, ...commercialParkChoosenMap],
    ];
  }

  memo[timeUnits] = finalProfit;

  // console.log(timeUnits, "memo", JSON.stringify(memo));
  return finalProfit;
}

// function maxProfitDpBottom(timeUnits) {
// console.log("maxProfitDpBottom", timeUnits);
// let dp = [];
// for (let i = 0; i <= timeUnits; i++) {
//   dp[i] = {
//     profit: 0,
//     profitMap: [{}],
//   };
// }
// for (let currentTime = 0; currentTime <= timeUnits; currentTime++) {
//   if (currentTime + 4 <= timeUnits) {
//     let newProfit =
//       dp[currentTime].profit + 1000 * (timeUnits - currentTime - 4);
//     console.log(dp[currentTime + 4].profit, "new profit", newProfit);
//     if (newProfit > dp[currentTime + 4].profit) {
//       dp[currentTime + 4].profit = newProfit;
//       dp[currentTime + 4].profitMap = dp[currentTime]?.profitMap?.map(
//         (pm) => {
//           let updatedPm = { ...pm };
//           updatedPm["P"] = (updatedPm["P"] || 0) + 1;
//           return updatedPm;
//         }
//       );
//     }
//   }
//   if (currentTime + 5 <= timeUnits) {
//     let newProfit =
//       dp[currentTime].profit + 1500 * (timeUnits - currentTime - 5);
//     if (newProfit > dp[currentTime + 5].profit) {
//       dp[currentTime + 5].profit = newProfit;
//       dp[currentTime + 5].profitMap = dp[currentTime]?.profitMap?.map(
//         (pm) => {
//           let updatedPm = { ...pm };
//           updatedPm["T"] = (updatedPm["T"] || 0) + 1;
//           return updatedPm;
//         }
//       );
//     }
//   }
//   if (currentTime + 10 <= timeUnits) {
//     let newProfit =
//       dp[currentTime].profit + 3000 * (timeUnits - currentTime - 10);
//     if (newProfit > dp[currentTime + 10].profit) {
//       dp[currentTime + 10].profit = newProfit;
//       dp[currentTime + 10].profitMap = dp[currentTime]?.profitMap?.map(
//         (pm) => {
//           let updatedPm = { ...pm };
//           updatedPm["C"] = (updatedPm["C"] || 0) + 1;
//           return updatedPm;
//         }
//       );
//     }
//   }
// }
// console.log("dp ", dp);
// return [dp[timeUnits].profit, dp[timeUnits].profitMap];
// }

function processInput() {
  rl.question(
    `Which way you want? 
Press 1 for only recursion 
Press 2 for Memo Dynamic Programming  
${/* Press 3 for Bottom UP Dynamic Programming  */ ""}
`,
    (way) => {
      if (way == 1 || way == 2) {
        rl.question(
          `
Please Enter Number of units of time : `,
          (timeUnits) => {
            // let finalProfit = maxProfit(timeUnits, [{ T: 0, P: 0, C: 0 }]);

            let finalProfit =
              way == 1
                ? maxProfit(timeUnits, [{ T: 0, P: 0, C: 0 }])
                : way == 2
                ? maxProfitDpMemo(timeUnits, [{ T: 0, P: 0, C: 0 }])
                : // way == 3
                  // ? maxProfitDpBottom(Number(timeUnits)) :
                  maxProfit(timeUnits, [{ T: 0, P: 0, C: 0 }]);

            console.log(
              `
Way : ${
                way == 1
                  ? "Only Recursion"
                  : way == 2
                  ? "Memo Dynamic Programming"
                  : // way == 3
                    // ? "Bottom UP Dynamic Programming" :
                    "Else"
              }
Time Unit: ${timeUnits}
Earnings: $${finalProfit?.[0]}
Solutions : `
            );

            finalProfit?.[1]?.forEach((item, index) => {
              console.log(
                `${index + 1}. T: ${item.T} P: ${item.P} C: ${item.C} ${
                  index === finalProfit?.[1]?.length - 1 ? "\n" : ""
                }`
              );
            });
            processInput();
          }
        );
      } else {
        console.log(`
Wrong Input`);
        processInput();
      }
    }
  );
}

processInput();
