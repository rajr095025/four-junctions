const lengthElement = document.getElementById("length");
const waterValuesElement = document.getElementById("values");

let lengthValue = "";
let waterValues = "";

lengthElement.onchange = (e) => {
  lengthValue = e.target.value;

  let tankError = document.getElementById("tank-length-error");
  if (tankError) {
    if (lengthValue < 0) {
      tankError.innerText = "Should be greater than -1";
    } else {
      tankError.innerText = "";
    }
  }

  let waterValues = document?.getElementById("values")?.value;
  if (waterValues && waterValues !== "") {
    let waterError = document.getElementById("water-values-error");
    let waterValuesArray = waterValues?.split(",");
    if (waterError) {
      if (waterValuesArray?.length != lengthValue) {
        waterError.innerText = "length not matched";
      } else {
        waterError.innerText = "";
      }
    }
  }

  finalResultContainer();
};

waterValuesElement.onchange = (e) => {
  waterValues = e.target.value;

  let waterError = document.getElementById("water-values-error");
  let isError = false;

  let waterValuesArray = waterValues?.split(",");

  waterValuesArray?.forEach((value) => {
    if (isNaN(Number(value))) {
      isError = true;
    }
  });

  isError = isError === true ? "Not a valid number formats." : false;

  isError =
    isError === false && waterValuesArray?.length != lengthValue
      ? "length not matched"
      : false;

  console.log("waterValuesArray", waterValuesArray, "isError", isError);
  if (waterError) {
    if (isError) {
      waterError.innerText = isError;
    } else {
      waterError.innerText = "";
    }
  }

  finalResultContainer();
};

function findTankCapacity(arr) {
  let lastGreaterValueIndex = 0;
  let i = 1;
  let finalAnswerArray = [];
  while (i < arr.length) {
    let j = lastGreaterValueIndex + 1;
    let diff = Math.min(arr[lastGreaterValueIndex], arr[i]);
    while (j < i) {
      let value = diff - arr[j] > 0 ? diff - arr[j] : 0;
      if (
        typeof finalAnswerArray[j] != "number" ||
        finalAnswerArray[j] < value
      ) {
        finalAnswerArray[j] = value;
      }
      j++;
    }
    if (arr[lastGreaterValueIndex] <= arr[i] || i === arr.length - 1) {
      lastGreaterValueIndex = i;
    }
    i++;
  }
  let finalAnswer = 0;

  finalAnswerArray = finalAnswerArray.map((ans, index) => {
    console.log(typeof ans, index);
    if (ans) {
      finalAnswer += ans;
      return ans;
    } else {
      0;
    }
  });

  console.log(
    arr[0],
    "final Answer ",
    finalAnswer,
    "finalAnswerArray",
    finalAnswerArray
  );
  return { finalAnswer, finalAnswerArray };
}

function findTankCapacityOptimized(arr) {
  let i = 0;
  let j = arr.length - 1;
  let lastGreaterValueIndexI = 0;
  let lastGreaterValueIndexIValue = arr[i];
  let lastGreaterValueIndexJ = 0;
  let lastGreaterValueIndexJValue = arr[j];
  let finalAnswerArray = Array(arr.length).fill(0);

  while (i < j) {
    if (arr[i] <= arr[j]) {
      i++;
      if (arr[i] > lastGreaterValueIndexIValue) {
        lastGreaterValueIndexIValue = arr[i];
        lastGreaterValueIndexI = i;
      }
      let value = lastGreaterValueIndexIValue - arr[i];

      // console.log(
      //   i,
      //   arr[i],
      //   "value > finalAnswerArray[i]",
      //   value > finalAnswerArray[i],
      //   value,
      //   finalAnswerArray[i]
      // );
      if (value > finalAnswerArray[i]) {
        finalAnswerArray[i] = value;
      }
    } else if (arr[i] > arr[j]) {
      j--;
      if (arr[j] > lastGreaterValueIndexJValue) {
        lastGreaterValueIndexJValue = arr[j];
        lastGreaterValueIndexJ = j;
      }
      let value = lastGreaterValueIndexJValue - arr[j];

      // console.log(
      //   "value > finalAnswerArray[i]",
      //   value > finalAnswerArray[j],
      //   value,
      //   finalAnswerArray[j]
      // );
      if (value > finalAnswerArray[j]) {
        finalAnswerArray[j] = value;
      }
    }
  }

  let finalAnswer = 0;
  finalAnswerArray?.forEach((value) => {
    finalAnswer += value;
  });

  // console.log(
  //   "finalAnswer ",
  //   finalAnswer,
  //   "finalAnswerArray",
  //   finalAnswerArray
  // );

  return { finalAnswer, finalAnswerArray };
}

function finalResultContainer() {
  let tankError = document.getElementById("tank-length-error").innerText;
  let waterError = document.getElementById("water-values-error").innerText;
  let waterValue = waterValuesElement?.value;
  let length = lengthElement?.value;
  let finalOutput = document.getElementById("final-output");

  const isOptimized = document.getElementById("optimize-check-box").checked;

  if (length == "" || waterValue == "") {
    finalOutput.innerText = "Give input values for generating output.";
    return;
  }

  if (tankError) {
    finalOutput.innerText = `Error in length  : ${tankError} `;
    return;
  }

  if (waterError) {
    finalOutput.innerText = `Error in water values  : ${waterError} `;
    return;
  }

  finalOutput.innerText = "";

  let waterValuesArray = waterValue?.split(",");

  waterValuesArray = waterValuesArray?.map((value) => Number(value));

  let maximumValue = Math.max(...waterValuesArray);

  let { finalAnswer, finalAnswerArray } = isOptimized
    ? findTankCapacityOptimized(waterValuesArray)
    : findTankCapacity(waterValuesArray);

  let colorMatrix = [];

  for (let i = 0; i < maximumValue; i++) {
    let colorMatrixRow = [];
    for (let j = 0; j < length; j++) {
      if (maximumValue - waterValuesArray[j] - i <= finalAnswerArray[j]) {
        colorMatrixRow[j] = "#66d9e8";
      } else {
        colorMatrixRow[j] = "white";
      }

      if (maximumValue - i <= waterValuesArray[j]) {
        colorMatrixRow[j] = "yellow";
      }
    }

    colorMatrix[i] = colorMatrixRow;
  }

  let unitsContainer = document.createElement("p");

  unitsContainer.innerText = `Total Units : ${finalAnswer}`;

  finalOutput.appendChild(unitsContainer);

  let finalTableElement = document.createElement("table");

  finalTableElement.style =
    "  border-collapse: collapse; border: 1px solid black;";

  let finalTableHead = document.createElement("thead");
  let finalTableHeadRow = document.createElement("tr");

  for (let i = 0; i < length; i++) {
    let tableCell = document.createElement("th");
    tableCell.style = `border: 1px solid black; background-color: white; width: 50px; height: 30px;`;
    finalTableHeadRow.appendChild(tableCell);
  }

  finalTableHead.appendChild(finalTableHeadRow);

  finalTableElement.appendChild(finalTableHead);

  let finalTableBody = document.createElement("tbody");

  colorMatrix?.forEach((row) => {
    let tableRow = document.createElement("tr");

    row?.forEach((cell) => {
      let tableCell = document.createElement("td");
      tableCell.style = `border: 1px solid black; background-color: ${cell} ; width: 50px; height: 30px;`;
      tableRow.appendChild(tableCell);
    });

    finalTableBody.appendChild(tableRow);
  });

  finalTableElement.appendChild(finalTableBody);

  finalOutput.appendChild(finalTableElement);

  console.log(
    "tankError",
    tankError,
    "waterError",
    waterError,
    "length",
    length,
    "values ",
    waterValue,
    "waterValuesArray",
    waterValuesArray,
    "maximumValue",
    maximumValue,
    "finalAnswer",
    finalAnswer,
    "finalAnswerArray",
    finalAnswerArray,
    "colorMatrix",
    colorMatrix,
    "isOptimized",
    isOptimized
  );
}
