// This component is working on the updated sheet which I send to the client (merged the first two subsequent columns (number and factor) and made it like we had in our previous sheet (result of requirement)), Our previously created logic works on it very well. Now in this I will add a logic so that it could match the non numerical data and create a dropdown for it.
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Dropdown } from 'react-bootstrap';
import "../components/ReadFile.css"
import Form from 'react-bootstrap/Form';

const Update2 = () => {
    const [excelData, setExcelData] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState({ problem: '', index: null });
    const [selectedRequirement, setSelectedRequirement] = useState({ requirement: '', index: null });
    const [selectedResult, setSelectedResult] = useState({ result: '', index: null });
    const [selectedDifferentiation, setSelectedDifferentiation] = useState({ differentiation: '', index: null });
    const [selectedReason, setSelectedReason] = useState({ reason: '', index: null });
    const [selectedSolution, setSelectedSolution] = useState({ solution: '', index: null });
    const [counter, setCounter] = useState(0)
    const [userInput, setUserInput] = useState({})
    const [loading, setLoading] = useState(false);
    const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
    const [storeDropdown, setStoreDropdown] = useState([])

    useEffect(() => {
        const filePath = '/assets/merged column sheet.xlsx';

        const readExcelFile = () => {
            setLoading(true);
            fetch(filePath)
                .then(response => {
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    const data = new Uint8Array(arrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const excelRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                    setExcelData(excelRows);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error reading Excel file:', error);
                    setLoading(false);
                });
        };

        readExcelFile();
    }, []);


    // Function to handle problem selection 
    const handleProblemSelect = (problem, index) => {
        setSelectedProblem({ problem: problem, index: parseInt(index, 10) });
        const selectedRequirementIndex = excelData.findIndex((row) => row.Problem === problem);
        const selectedRequirement = excelData[selectedRequirementIndex]?.Requirement || '';
        setSelectedRequirement({ requirement: selectedRequirement, index: selectedRequirementIndex });
        setUserInput({})
        setStoreDropdown([]);
        setSelectedDropdownValues({})
        // If both Numerical Result of Requirement && Non Numerical Result of Requirement are empty then the we set requirment in the result it is done so that based on the requirement wer could show differentiation, reason and solution.
        const isEmpty = excelData[selectedRequirementIndex]
        if (isEmpty['Numerical Result of Requirement '] === "" && isEmpty['Non Numerical Result of Requirement '] === "") {
            setSelectedResult({ result: selectedRequirement, index: selectedRequirementIndex });
        } else {
            setSelectedResult({ result: '', index: -1 });
        }
        setSelectedDifferentiation({ differentiation: '', index: null });
        setSelectedReason({ reason: '', index: null });
        setSelectedSolution({ solution: '', index: null });
    };

    // Function to handle result of requirement selection
    // const handleResultSelect = (eventKey, event) => {
    //     const selectedIndex = event.target.getAttribute('data-index');
    //     setSelectedResult({ result: eventKey, index: parseInt(selectedIndex, 10) });
    //     setSelectedDifferentiation('');
    //     setSelectedReason('');
    //     setSelectedSolution('');
    // };

    // Function to handle differentiation selection
    const handleDifferentiationSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedDifferentiation({ differentiation: eventKey, index: parseInt(selectedIndex, 10) });

        // const selectedReasonIndex = excelData.findIndex((row) => row['Differentiation '] === eventKey);
        const reasonForProblem = excelData[selectedIndex]['Reason for Problem '] || '';
        const solution = excelData?.[selectedIndex]?.Solution || '';
        console.log("inside diff solution", solution);
        setSelectedReason({ reason: reasonForProblem, index: parseInt(selectedIndex, 10) });
        setSelectedSolution({ solution: solution, index: parseInt(selectedIndex, 10) });
    };

    // Function to handle Reason selection
    const handleReasonSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedReason({ reason: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedSolution({ solution: '', index: null });
    };

    // Function to handle Solution selection
    const handleSolutionSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedSolution({ solution: eventKey, index: parseInt(selectedIndex, 10) })
    }

    //If Differentiation is present in the Differentiation column then differentiationLength will have length of it.
    const differentiationLength = selectedResult.result ?
        excelData
            .slice(selectedResult.index)
            .reduce((acc, row, index, array) => {
                const isMatch = (row['Numerical Result of Requirement '] === selectedResult.result || row['Non Numerical Result of Requirement '] === selectedResult.result);
                const isEmpty = (row['Numerical Result of Requirement '] === "" && row['Non Numerical Result of Requirement '] === "" && (row.Requirement === "" || row.Requirement === selectedResult.result));
                //is empty ke andar ka or wala case (row.Requirement === selectedResult.result) tab chalega jab user requirement select karta hai or selected requirement ke Numerical Result of Requirement & Non Numerical Result of Requirement dono me data nahi hai to is case me usse Requirement blank nhi milegi to or wala case chalega or iske basis pr Differentiation dikhaya jayega.
                if (isMatch || isEmpty) {
                    const originalIndex = excelData.findIndex((item) => item['Differentiation '] === row['Differentiation ']);
                    acc.push(
                        <Dropdown.Item
                            key={row['Differentiation '] + index}
                            eventKey={row['Differentiation ']}
                            data-index={originalIndex}
                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        >
                            {row['Differentiation ']}
                        </Dropdown.Item>
                    );
                } else {
                    array.splice(0);
                }
                return acc;
            },
                [])
        : undefined;

    // console.log("differentiationLength", differentiationLength)


    //  If Differentiation is present in the differentiation column then show dropdown based on the selectedDifferentiation if not show reason based on the selectedResult.
    // console.log("selectedResult.differentiation", selectedResult.differentiation);
    const reasonLength = (selectedResult.result && selectedDifferentiation.differentiation) ? excelData.filter((row, index) => index === selectedDifferentiation.index)
        .map((row, index) => (
            <Dropdown.Item
                key={index}
                eventKey={row['Reason for Problem ']}
                data-index={excelData.findIndex((item) => item['Reason for Problem '] === row['Reason for Problem '])}
                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {row['Reason for Problem ']}
            </Dropdown.Item>
        ))
        : (differentiationLength && differentiationLength[0].props.eventKey === '') ? excelData.filter((row, index) => index === selectedResult.index)
            .map((row, index) => (
                <Dropdown.Item
                    key={index}
                    eventKey={row['Reason for Problem ']}
                    data-index={excelData.findIndex((item) => item['Reason for Problem '] === row['Reason for Problem '])}
                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {row['Reason for Problem ']}
                </Dropdown.Item>
            ))
            : null

    // console.log("reasonLength", reasonLength)

    // stores the numerical result of requirement that needs to be shown as an input field for the selectedRequirement
    const arr = selectedRequirement.requirement &&
        excelData.slice(selectedRequirement.index)
            .reduce((acc, row, index, array) => {
                if (row.Requirement === selectedRequirement.requirement || row.Requirement === "") {
                    const originalIndex = excelData.findIndex((item) => item['Numerical Result of Requirement '] === row['Numerical Result of Requirement ']);
                    acc.push(
                        <Dropdown.Item
                            key={row['Numerical Result of Requirement '] + index}
                            eventKey={row['Numerical Result of Requirement ']}
                            data-index={originalIndex}
                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        >
                            {row['Numerical Result of Requirement ']}
                        </Dropdown.Item>
                    );
                } else {
                    array.splice(0);
                }
                return acc;

            }, [])

    // console.log("excelData", excelData);
    // console.log("numerical result of requirement", arr);


    // Stores the non numerical result of requirement
    const nonNumericalResultOfRequirement = selectedRequirement.requirement &&
        excelData.slice(selectedRequirement.index)
            .reduce((acc, row, index, array) => {
                if (row.Requirement === selectedRequirement.requirement || row.Requirement === "") {
                    const originalIndex = excelData.findIndex((item) => item['Non Numerical Result of Requirement '] === row['Non Numerical Result of Requirement ']);
                    acc.push(
                        <Dropdown.Item
                            key={row['Non Numerical Result of Requirement '] + index}
                            eventKey={row['Non Numerical Result of Requirement ']}
                            data-index={originalIndex}
                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        >
                            {row['Non Numerical Result of Requirement ']}
                        </Dropdown.Item>
                    );
                } else {
                    array.splice(0);
                }
                return acc;

            }, [])

    // console.log("nonNumericalResultOfRequirement", nonNumericalResultOfRequirement);


    //arr is splited to get the fieldnames
    const cleanedArray = selectedRequirement.requirement && arr.reduce((uniqueItems, row) => {
        if (row.props.eventKey && row.props.eventKey !== '') {
            const values = row.props.eventKey.split(',')
                .map(value => value.trim());
            values.forEach(value => {
                const wordsBeforeSymbols = value.split(/(>|≤|<|≥)/);
                const whiteSpaceRemoved = wordsBeforeSymbols[0].trim();
                const cleanedThreshold = wordsBeforeSymbols[2]?.replace(/[^\d.]/g, '');
                const unit = wordsBeforeSymbols[2]?.replace(/\d|\./g, '').trim();
                uniqueItems.push([whiteSpaceRemoved, wordsBeforeSymbols[1], cleanedThreshold, unit]);
            });
        }
        return uniqueItems;
    }, []);

    // console.log("cleanedArray", cleanedArray)

    // const distinctArray = cleanedArray && cleanedArray.filter((arr, index, self) =>
    //     index === self.findIndex((innerArr) =>
    //         innerArr[0] === arr[0] && innerArr[2] === arr[2] && innerArr[3] === arr[3]
    //     )
    // );

    //This function is cleaning the cleanedArray and this will give us the unique field names and there is also an exceptional case inside it
    const uniqueFieldNames = cleanedArray && cleanedArray.filter((arr, index, self) =>
        index === self.findIndex((innerArr) => {
            const condition1 = innerArr[0] === arr[0];
            const condition2 = innerArr[3] === arr[3];

            // Check if both innerArr[2] and arr[2] are numbers then don't compare them but if even one of them doesn't come out as a number then do the comparison 
            const isInnerArrNumeric = !isNaN(parseFloat(innerArr[2]));
            const isArrNumeric = !isNaN(parseFloat(arr[2]));

            const condition3 = isInnerArrNumeric && isArrNumeric ? true : innerArr[2] === arr[2];

            return condition1 && condition2 && condition3;
        })
    );

    // console.log("uniqueFieldNames", uniqueFieldNames);

    // We only have numerical data till here for the selected problem, the below function will add the non numerical values in the distinctArray so that it will have both numerical and non numerical data
    const distinctArrayUpdated = nonNumericalResultOfRequirement && nonNumericalResultOfRequirement.map(row => {
        if (row.props.eventKey && row.props.eventKey !== '') {
            uniqueFieldNames.push([undefined, undefined, row.props.eventKey, undefined]);
        }
        return row;
    });

    // console.log("uniqueFieldNames", uniqueFieldNames);


    //distinctArray stores the uniqueFieldNames and non-numerical data, it is used to created input fields and dropdown that are shown to the user on the UI
    const distinctArray = uniqueFieldNames;
    // console.log("distinctArrayUpdated", distinctArray);


    //arr is splited and cleaned to get the parameterName, opertor, threshold and units separately
    const splitedValues = selectedRequirement.requirement && arr.reduce((uniqueItems, row) => {
        if (row.props.eventKey && row.props.eventKey !== '') {
            const values = row.props.eventKey.split(',')
                .map(value => value.trim());
            values.forEach(value => {
                const wordsBeforeSymbols = value.split(/(>|≤|<|≥)/);
                const whiteSpaceRemoved = wordsBeforeSymbols[0].trim();
                const cleanedThreshold = wordsBeforeSymbols[2]?.replace(/[^\d.]/g, '');
                const unit = wordsBeforeSymbols[2]?.replace(/\d|\./g, '').trim();
                uniqueItems.add([whiteSpaceRemoved, wordsBeforeSymbols[1], cleanedThreshold, unit]);
            });
        }
        return uniqueItems;
    }, new Set());

    const splitedArray = Array.from(splitedValues);

    // console.log("splitedArray", splitedArray);


    // splitedArray is filtered to remove the exact dupliacte array elements so it doesn't appear again with the matchingrows then this UniqueArray is used in the useEffect to compare the user's given value and get the accurate numerical result of requirement
    const UniqueArray = splitedArray.filter((arr, index, self) =>
        index === self.findIndex((innerArr) =>
            innerArr.every((element, innerIndex) => element === arr[innerIndex])
        )
    );

    // console.log("UniqueArray", UniqueArray);


    // This function is handling what to display in the dropdown "Yes" or "No" for the speicific field
    // This function will only show Yes in one dropdown at a time if user selects another dropdown it will show no in the all other dropdowns 
    const handleDropdownChange = (fieldName, value) => {
        if (value === "No") {
            setSelectedDropdownValues({ [fieldName]: "No" });
        } else {
            setSelectedDropdownValues({ [fieldName]: "Yes" });
        }
    }

    // This function is handling what to display in the dropdown "Yes" or "No" for the speicific field
    // This function shows yes in the multiple dropdown commenting it out so that only one dropdown can be selected at once 
    // const handleDropdownChange = (fieldName, value) => {
    //     if (value === "No") {
    //         setSelectedDropdownValues(prevState => ({
    //             ...prevState,
    //             [fieldName]: "No"
    //         }));
    //     } else {
    //         setSelectedDropdownValues(prevState => ({
    //             ...prevState,
    //             [fieldName]: "Yes"
    //         }));
    //     }
    // }

    const handleInputChange = (fieldName, value) => {
        setSelectedDifferentiation({ differentiation: '', index: null });
        setSelectedReason({ reason: '', index: null });
        setSelectedSolution({ solution: '', index: null });

        if (value !== undefined) {
            // const matchedRow = excelData[parseInt(filteredRows[0].props['data-index'], 10)];
            // const nonNumericalEmpty = matchedRow['Non Numerical Result of Requirement '];
            // if (nonNumericalEmpty === "") {
            //     setSelectedResult({ result: filteredRows[0].props.eventKey, index: parseInt(filteredRows[0].props['data-index'], 10) });
            // }
            // setSelectedDropdownValues({}); // Clean the dropdown when the input is given in the input field
            setUserInput(prevUserInput => ({ ...prevUserInput, [fieldName]: value }));
        } else {
            // setUserInput({}) // Clean the userInput when the dropdown is selected
            if (fieldName !== "No") {
                const eventKeyOfMatchedRow = nonNumericalResultOfRequirement && nonNumericalResultOfRequirement.filter((row) => fieldName.replace(/\s/g, '') === row.props.eventKey.replace(/\s/g, ''));
                if (eventKeyOfMatchedRow.length > 0) {
                    const selectedIndex = eventKeyOfMatchedRow[0].props['data-index'];

                    // const matchedRow = excelData[parseInt(eventKeyOfMatchedRow[0].props['data-index'])];
                    // const numericalEmpty = matchedRow['Numerical Result of Requirement '];
                    // // It checks if Numerical Result of Requirement is empty then userInput should be empty
                    // if (numericalEmpty === "") {
                    //     setUserInput({});
                    // }

                    setStoreDropdown([eventKeyOfMatchedRow[0].props.eventKey, selectedIndex]);
                    // setSelectedResult({ result: eventKeyOfMatchedRow[0].props.eventKey, index: parseInt(selectedIndex, 10) });
                }
            } else {
                setStoreDropdown([]);
            }
        }
    };

    //This useeffect is responsible to autofill the reason and the solution
    useEffect(() => {
        if (differentiationLength && differentiationLength[0].props.eventKey === '') {
            const reasonForProblem = excelData[selectedResult.index]['Reason for Problem ']
            const solution = excelData[selectedResult.index].Solution
            setSelectedReason({ reason: reasonForProblem, index: parseInt(selectedResult.index, 10) });
            setSelectedSolution({ solution: solution, index: parseInt(selectedResult.index, 10) });
        }
    }, [selectedResult])

    //useEffect is run to compare the user's input with our threshold and it also sets the result for the selected dropdown
    useEffect(() => {
        if (Object.keys(userInput).length !== 0 || storeDropdown.length !== 0) {
            setSelectedResult({ result: "", index: -1 });
            // console.log("useEffect Running");
            const findMatchingRows = () => {
                const matchingRows = [];
                // console.log("UniqueArray", UniqueArray);
                UniqueArray.forEach((condition) => {
                    const parameterName = condition[0];
                    const operator = condition[1];
                    const threshold = parseFloat(condition[2]);
                    const units = condition[3];

                    if (userInput.hasOwnProperty(parameterName)) {
                        const userInputValue = parseFloat(userInput[parameterName]);
                        if ((operator === '≥' && userInputValue >= threshold) ||
                            (operator === '<' && userInputValue < threshold) ||
                            (operator === '>' && userInputValue > threshold) ||
                            (operator === '≤' && userInputValue <= threshold)) {
                            matchingRows.push(`${parameterName} ${operator} ${threshold} ${units}`);
                        }
                    }
                });
                return matchingRows;
            };

            const matchingRows = findMatchingRows();
            // console.log("matchingRows", matchingRows);













            // New code starts here**************************

            // This section of code handles cases where duplicate values exist, such as in the problem "Hypernatriämie, Serumkonzentration >145 mmol/L". In this scenario, we may have the same numerical result for a requirement but with different thresholds (e.g., "Urinosmolalität ≥ 800 mosmol/kg" and "Urinosmolalität ≥ 1000 mosmol/kg"). This function is used to handle such cases.

            // Step 1: Filter the elements with the same prefix
            const prefixMap = {};

            matchingRows.forEach(row => {
                // Remove the numerical part from the row
                const prefix = row.replace(/\d+/g, '').trim();

                // Create an array property for each unique prefix
                if (!prefixMap[prefix]) {
                    prefixMap[prefix] = [];
                }

                // Push the row into the corresponding prefix array
                prefixMap[prefix].push(row);
            });

            // Filter out the elements with duplicate prefixes
            const filteredElements = Object.values(prefixMap).filter(group => group.length > 1).flat();

            // Step 2: Exclude each filtered element from the matching rows
            const result = filteredElements.map(element => {
                return matchingRows.filter(row => row !== element);
            });

            // console.log("result", result);

            // In the filteredResults, we will get the matched value
            let filteredRows;

            if (result.length > 1) {
                // If result has data
                filteredRows = result.map(subArray => {
                    // Concatenate the elements of each sub-array
                    const concatenatedRows = subArray.join(', ').replace(/\s/g, '');

                    // Filter the arr using the concatenated rows
                    const filteredArr = concatenatedRows && arr.filter(row => {
                        const rowEventKeyNoSpaces = row.props.eventKey.replace(/\s/g, '');
                        return rowEventKeyNoSpaces === concatenatedRows;
                    });

                    // Return filtered array
                    return filteredArr;
                }).flat(); // Flatten the array
            } else {
                // If result doesn't have data
                const concatenatedRows = matchingRows.join(', ').replace(/\s/g, '');

                // Filter the arr using the concatenated rows
                filteredRows = concatenatedRows && arr.filter(row => {
                    const rowEventKeyNoSpaces = row.props.eventKey.replace(/\s/g, '');
                    return rowEventKeyNoSpaces === concatenatedRows;
                });
            }

            // filteredRows now stores the filtered rows


            // Check if result has data or not
            // const concatenatedRows = result.length > 1 ? result.map(subArray => subArray.join(', ').replace(/\s/g, '')) : matchingRows.join(', ').replace(/\s/g, '');

            // console.log("concatenatedRows",concatenatedRows);

            // // Filter the arr using the concatenated rows
            // const filteredRows = concatenatedRows && arr.filter(row => {
            //     const rowEventKeyNoSpaces = row.props.eventKey.replace(/\s/g, '');
            //     return concatenatedRows.includes(rowEventKeyNoSpaces);
            // }).flat(); // Flatten the array if necessary

            // console.log("filteredRows",filteredRows);



            // If both userInput and storeDropdown have data
            if (filteredRows.length > 0 && storeDropdown.length > 1) {
                //Match index of both numerical and non numerical if both are same then proceed to next.
                const isMatch = filteredRows[0].props['data-index'] == storeDropdown[1];
                console.log("both have data");
                setSelectedResult(isMatch ? { result: storeDropdown[0], index: parseInt(storeDropdown[1], 10) } : { result: '', index: -1 });
                // if (differentiationLength && differentiationLength[0].props.eventKey === '') {
                //     console.log("check both")
                //     const selectedReason = excelData[storeDropdown[1]]['Reason for Problem ']
                //     setSelectedReason({ reason: selectedReason, index: parseInt(storeDropdown[1], 10) });
                // }
            }
            // If only storeDropdown has data
            else if (storeDropdown.length > 1 && filteredRows.length === 0) {
                // We are checking that if Non Numerical Result of Requirement is selected and there is also data in Numerical Result of Requirement in the same row, then in this case we do not let setSelectedResult be selected. We are doing this so that if there is data in both columns, then differentiation is not only shown when data of both the columns are selected.
                const matchedRow = excelData[parseInt(storeDropdown[1], 10)];
                const numericalEmpty = matchedRow['Numerical Result of Requirement '];
                if (numericalEmpty === "") {
                    // If a dropdown is selected where the Numerical Result of Requirement column is empty, the below code ensures the reason or differentiation is shown only when userInput is empty, as userInput holds the data for the Numerical Result of Requirement.
                    if (Object.values(userInput).every(value => value === '')) {
                        setSelectedResult({ result: storeDropdown[0], index: parseInt(storeDropdown[1], 10) });
                    }

                    // console.log("Inside useffect differentiationLength", differentiationLength);
                    // if (differentiationLength && differentiationLength[0].props.eventKey === '') {
                    //     console.log("check storeDropdown.length > 1")
                    //     const selectedReason = excelData[storeDropdown[1]]['Reason for Problem ']
                    //     setSelectedReason({ reason: selectedReason, index: parseInt(storeDropdown[1], 10) });
                    // }
                }
            }
            // If only filteredRows has data
            else if (filteredRows.length > 0 && storeDropdown.length === 0) {
                // We are checking that if Numerical Result of Requirement is selected and there is also data in Non Numerical Result of Requirement in the same row, then in this case we do not let setSelectedResult be selected. We are doing this so that if there is data in both columns, then differentiation is only shown when data of both the columns are selected.
                const matchedRow = excelData[parseInt(filteredRows[0].props['data-index'], 10)];
                const nonNumericalEmpty = matchedRow['Non Numerical Result of Requirement '];
                if (nonNumericalEmpty === "") {
                    setSelectedResult({ result: filteredRows[0].props.eventKey, index: parseInt(filteredRows[0].props['data-index'], 10) });
                    // if (differentiationLength && differentiationLength[0].props.eventKey === '') {
                    //     console.log("check filteredRows.length > 0")
                    //     const selectedReason = excelData[parseInt(filteredRows[0].props['data-index'], 10)]['Reason for Problem ']
                    //     setSelectedReason({ reason: selectedReason, index: parseInt(filteredRows[0].props['data-index'], 10) });
                    // }
                }
            }
            // If both filteredRows and storeDropdown are empty
            else {
                console.log("both filteredRows and dropdown are empty");
                setSelectedResult({ result: '', index: -1 });
            }
        }
    }, [userInput, storeDropdown]);


    //The below is to used to stop the default behaviour of number input field it won't increase or decrease when scrolling up and down 
    // const handleScroll = (e) => {
    //     if (e.target.type === 'number') {
    //         e.preventDefault();
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener('wheel', handleScroll, { passive: false });

    //     return () => {
    //         window.removeEventListener('wheel', handleScroll);
    //     };
    // }, []);



    return (

        <div className='main-container'>
            <h2 className='text-center mt-4'>Hospital Consultative Questions</h2>
            <div className='d-flex justify-content-between btnDiv'>
                <img
                    src='images/arrow-left-circle-fill.svg'
                    className='btn mx-5 custombtn'
                    onClick={() => {
                        // if differentiation is empty don't show it to the user
                        if (counter === 3 && differentiationLength && differentiationLength.length > 0 && differentiationLength[0].props.eventKey === '') {
                            setCounter(prevCounter => Math.max(prevCounter - 2, 0)); // Ensure counter doesn't go below 0
                        } else {
                            setCounter(prevCounter => Math.max(prevCounter - 1, 0)); // Ensure counter doesn't go below 0
                        }
                    }}
                    alt="Previous"
                />

                <img
                    src='images/arrow-right-circle-fill.svg'
                    className='btn mx-5 custombtn'
                    onClick={() => {
                        // if differentiation is empty don't show it to the user
                        if (counter === 1 && differentiationLength && differentiationLength.length > 0 && differentiationLength[0].props.eventKey === '') {
                            setCounter(prevCounter => Math.min(prevCounter + 2, 4)); // Ensure counter doesn't exceed 4
                        } else {
                            setCounter(prevCounter => Math.min(prevCounter + 1, 4)); // Ensure counter doesn't exceed 4
                        }
                    }}
                    alt="Next"
                />
            </div>


            <div className='d-flex justify-content-center'>
                <div>
                    {loading && <p>Loading...</p>}

                    {counter === 0 &&
                        <div className=''>
                            <h5 className='text-center mb-3'>Select a problem:</h5>
                            <Dropdown className='text-center' onSelect={(eventKey, event) => handleProblemSelect(eventKey, event.target.getAttribute('data-index'))} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedProblem.problem ? selectedProblem.problem : "Select a problem"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='text-center m-100 max-width max-height'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select a problem</Dropdown.Item>
                                    {excelData.map((row, index) => (
                                        row.Problem && (
                                            <Dropdown.Item className='word-break' key={row.Problem} eventKey={row.Problem} data-index={index} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                {row.Problem}
                                            </Dropdown.Item>
                                        )
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    }

                    {counter === 1 && (
                        <div>
                            <div className=''>
                                <h5 className='text-center mb-3'>Selected requirement:</h5>
                                <div className="text-center common-class pad-1 rounded">
                                    {selectedRequirement.requirement ? selectedRequirement.requirement : "No Requirement Selected"}
                                </div>
                            </div>

                            <div className='text-center mt-4 common-input-class fw-semibold'>
                                {selectedRequirement.requirement && distinctArray.map((fieldName, index) => (
                                    <div key={index} className='m-auto'>
                                        {!isNaN(parseFloat(fieldName[2])) ? (
                                            <div>
                                                <label htmlFor={`${fieldName[0]}`}>Enter {fieldName[0]} value Here</label>
                                                <br />
                                                <Form.Control
                                                    id={`${fieldName[0]}`}
                                                    type="number"
                                                    className='text-center customInput noSpinButtons'
                                                    placeholder="Enter value here..."
                                                    value={userInput[fieldName[0]] || ''}
                                                    onChange={(e) => handleInputChange(fieldName[0], e.target.value)}
                                                />
                                                <br />
                                            </div>
                                        ) : (
                                            <div className='mb-3'>
                                                <p className='text-center'>{`${fieldName[2]}`}</p>
                                                <Dropdown className='text-center'
                                                    onSelect={(eventKey) => {
                                                        handleInputChange(eventKey);
                                                        handleDropdownChange(fieldName[2], eventKey)
                                                    }}
                                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>

                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                                        {selectedDropdownValues[fieldName[2]] === "Yes" ? "Yes" : "No"}
                                                    </Dropdown.Toggle>


                                                    <Dropdown.Menu className='text-center m-100 max-width max-height'>
                                                        <Dropdown.Item key="empty" eventKey="" disabled>Select an option</Dropdown.Item>
                                                        <Dropdown.Item className='word-break' key="Yes"
                                                            eventKey={`${fieldName[2]}`}>
                                                            Yes
                                                        </Dropdown.Item>
                                                        <Dropdown.Item className='word-break' key="No" eventKey="No">
                                                            No
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* <div className='mt-3'>
                        <h5 className='text-center'>Select Result of Requirement:</h5>
                        <Dropdown className='text-center' onSelect={handleResultSelect} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedResult.result ? selectedResult.result : "Select Result of Requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="" disabled>Select Result of Requirement:</Dropdown.Item>
                                {selectedRequirement.requirement &&
                                    excelData.slice(selectedRequirement.index)
                                        .reduce((acc, row, index, array) => {
                                            if (row.Requirement === selectedRequirement.requirement || row.Requirement === "") {
                                                const originalIndex = excelData.findIndex((item) => item['Result of Requirement '] === row['Result of Requirement ']);
                                                console.log("originalIndex", originalIndex)
                                                acc.push(
                                                    <Dropdown.Item
                                                        key={row['Result of Requirement '] + index}
                                                        eventKey={row['Result of Requirement ']}
                                                        data-index={originalIndex}
                                                        style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                    >
                                                        {row['Result of Requirement ']}
                                                    </Dropdown.Item>
                                                );
                                            } else {
                                                array.splice(0);
                                            }
                                            return acc;

                                        },
                                            []
                                        )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div> */}

                    {
                        counter === 2 && // Assuming this condition is correct
                        <div className=''>
                            <h5 className='text-center mb-3'>Select Differentiation</h5>
                            <Dropdown className='text-center' onSelect={handleDifferentiationSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedDifferentiation.differentiation ? selectedDifferentiation.differentiation : "Select Differentiation"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='text-center m-100 max-width'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select Differentiation</Dropdown.Item>
                                    {/* {console.log("selectedResult.index", selectedResult.index)} */}
                                    {selectedResult.result &&
                                        excelData
                                            .slice(selectedResult.index)
                                            .reduce((acc, row, index, array) => {
                                                const isMatch = (row['Numerical Result of Requirement '] === selectedResult.result || row['Non Numerical Result of Requirement '] === selectedResult.result);
                                                const isEmpty = (row['Numerical Result of Requirement '] === "" && row['Non Numerical Result of Requirement '] === "" && (row.Requirement === "" || row.Requirement === selectedResult.result));

                                                if (isMatch || isEmpty) {
                                                    const originalIndex = excelData.findIndex((item) => item['Differentiation '] === row['Differentiation ']);
                                                    acc.push(
                                                        <Dropdown.Item
                                                            key={row['Differentiation '] + index}
                                                            eventKey={row['Differentiation ']}
                                                            data-index={originalIndex}
                                                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                        >
                                                            {row['Differentiation ']}
                                                        </Dropdown.Item>
                                                    );
                                                } else {
                                                    array.splice(0);
                                                }
                                                return acc;
                                            }, [])
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    }


                    {/* This is the backup code for Differentiation */}
                    {/* {
                        counter === 2 &&
                        <div className=''>
                            <h5 className='text-center mb-3'>Select Differentiation</h5>
                            <Dropdown className='text-center' onSelect={handleDifferentiationSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedDifferentiation.differentiation ? selectedDifferentiation.differentiation : "Select Differentiation"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='text-center m-100 max-width'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select Differentiation</Dropdown.Item>

                                    {selectedResult.result &&
                                        excelData
                                            .slice(selectedResult.index)
                                            .reduce((acc, row, index, array) => {
                                                const numericalRowMatched = arr.filter((item) => item.props.eventKey == selectedResult.result);
                                                const nonNumericalRowMatched = nonNumericalResultOfRequirement.filter((row) => row.props.eventKey == selectedResult.result);

                                                console.log("numericalRowMatched", numericalRowMatched);
                                                console.log("nonNumericalRowMatched", nonNumericalRowMatched);

                                                let keyToCheck = numericalRowMatched.length > 0 ? 'Numerical Result of Requirement ' :
                                                    nonNumericalRowMatched.length > 0 ? 'Non Numerical Result of Requirement ' :
                                                        undefined;

                                                if (keyToCheck && (row[keyToCheck] === selectedResult.result || row[keyToCheck] === "")) {
                                                    const originalIndex = excelData.findIndex((item) => item['Differentiation '] === row['Differentiation ']);
                                                    acc.push(
                                                        <Dropdown.Item
                                                            key={row['Differentiation '] + index}
                                                            eventKey={row['Differentiation ']}
                                                            data-index={originalIndex}
                                                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                        >
                                                            {row['Differentiation ']}
                                                        </Dropdown.Item>
                                                    );
                                                } else {
                                                    array.splice(0);
                                                }
                                                return acc;
                                            }, [])
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    } */}




                    {
                        counter === 3 &&
                        <div className=''>

                            <div className=''>
                                <h5 className='text-center mb-3'>Select Reason</h5>
                                <div className="text-center common-class pad-1 rounded">
                                    {selectedReason.reason ? selectedReason.reason : "No Reason for the problem"}
                                </div>
                            </div>



                            {/* <h5 className='text-center mb-3'>Select Reason</h5>
                            <Dropdown className='text-center' onSelect={handleReasonSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedReason.reason ? selectedReason.reason : "Select Reason"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='text-center m-100 max-width'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select Reason</Dropdown.Item>
                                    {selectedResult.result && selectedDifferentiation.differentiation ? excelData.filter((row, index) => index === selectedDifferentiation.index)
                                        .map((row, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                eventKey={row['Reason for Problem ']}
                                                data-index={excelData.findIndex((item) => item['Reason for Problem '] === row['Reason for Problem '])}
                                                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                {row['Reason for Problem ']}
                                            </Dropdown.Item>
                                        ))
                                        : (differentiationLength && differentiationLength[0].props.eventKey === '') ? excelData.filter((row, index) => index === selectedResult.index)
                                            .map((row, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={row['Reason for Problem ']}
                                                    data-index={excelData.findIndex((item) => item['Reason for Problem '] === row['Reason for Problem '])}
                                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                    {row['Reason for Problem ']}
                                                </Dropdown.Item>
                                            )) : null
                                    }
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </div>
                    }



                    {
                        counter === 4 &&

                        <div className=''>
                            <h5 className='text-center mb-3'>Select Solution</h5>
                            <div className="text-center common-class pad-1 rounded">
                                {selectedSolution.solution ? selectedSolution.solution : "No Solution for the problem"}
                            </div>
                        </div>



                        // <div className=''>
                        //     <h5 className='text-center mb-3'>Select Solution</h5>
                        //     <Dropdown className='text-center' onSelect={handleSolutionSelect}>
                        //         <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                        //             {selectedSolution.solution ? selectedSolution.solution : "Select Solution"}
                        //         </Dropdown.Toggle>
                        //         <Dropdown.Menu className='text-center m-100 max-width'>
                        //             <Dropdown.Item key="empty" eventKey="" disabled>Select Solution</Dropdown.Item>
                        //             {selectedResult.result && selectedReason.reason ?
                        //                 excelData
                        //                     .filter((row, index) => index === selectedReason.index)
                        //                     .map((row, index) => (
                        //                         <Dropdown.Item
                        //                             key={row.Solution + index}
                        //                             eventKey={row.Solution}
                        //                             data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                        //                             style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        //                         >
                        //                             {row.Solution}
                        //                         </Dropdown.Item>
                        //                     ))
                        //                 :
                        //                 selectedDifferentiation.differentiation && reasonLength && reasonLength[0].props.eventKey === "" ?
                        //                     excelData
                        //                         .filter((row, index) => index === selectedDifferentiation.index)
                        //                         .map((row, index) => (
                        //                             <Dropdown.Item
                        //                                 key={row.Solution + index}
                        //                                 eventKey={row.Solution}
                        //                                 data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                        //                                 style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        //                             >
                        //                                 {row.Solution}
                        //                             </Dropdown.Item>
                        //                         ))
                        //                     :
                        //                     (differentiationLength && differentiationLength[0].props.eventKey === '') &&
                        //                     (reasonLength && reasonLength[0].props.eventKey === '') &&
                        //                     excelData
                        //                         .filter((row, index) => index === selectedResult.index)
                        //                         .map((row, index) => (
                        //                             <Dropdown.Item
                        //                                 key={row.Solution + index}
                        //                                 eventKey={row.Solution}
                        //                                 data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                        //                                 style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                        //                             >
                        //                                 {row.Solution}
                        //                             </Dropdown.Item>
                        //                         ))
                        //             }
                        //         </Dropdown.Menu>
                        //     </Dropdown>

                        // </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default Update2;