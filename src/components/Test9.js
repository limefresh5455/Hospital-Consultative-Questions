//writing exception case in this component for theoratical or non-numeric data e.g. BD > 140/90 mmHg, Urinosmolalität > Plasmaosmolalität
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Dropdown } from 'react-bootstrap';
import "../components/ReadFile.css"
import Form from 'react-bootstrap/Form';

const Test9 = () => {
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

    useEffect(() => {
        const filePath = '/assets/Test.xlsx';

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
        setSelectedDropdownValues({})
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('');
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
        setSelectedReason('');
        setSelectedSolution('');
    };

    // Function to handle Reason selection
    const handleReasonSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedReason({ reason: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedSolution('');
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
                // console.log("diff running")
                if (row['Result of Requirement '] === selectedResult.result || row['Result of Requirement '] === "") {
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
            )) : null

    // console.log("reasonLength", reasonLength)

    // stores the result of requirement that needs to be shown as an input field for the selectedRequirement
    const arr = selectedRequirement.requirement &&
        excelData.slice(selectedRequirement.index)
            .reduce((acc, row, index, array) => {
                if (row.Requirement === selectedRequirement.requirement || row.Requirement === "") {
                    const originalIndex = excelData.findIndex((item) => item['Result of Requirement '] === row['Result of Requirement ']);
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

            }, [])


    //arr is splited to get the unique Field names
    const cleanedArray = selectedRequirement.requirement && arr.reduce((uniqueItems, row) => {
        if (row.props.eventKey && row.props.eventKey !== '') {
            const values = row.props.eventKey.split(',')
                .map(value => value.trim());
            values.forEach(value => {
                const wordsBeforeSymbols = value.split(/(>|≤|<|≥)/);
                const cleanedThreshold = wordsBeforeSymbols[2]?.replace(/[^\d.]/g, '');
                const unit = wordsBeforeSymbols[2]?.replace(/\d|\./g, '').trim();
                uniqueItems.push([wordsBeforeSymbols[0], wordsBeforeSymbols[1], cleanedThreshold, unit]);
            });
        }
        return uniqueItems;
    }, []);

    console.log("cleanedArray", cleanedArray)

    // const distinctArray = cleanedArray && cleanedArray.filter((arr, index, self) =>
    //     index === self.findIndex((innerArr) =>
    //         innerArr[0] === arr[0] && innerArr[2] === arr[2] && innerArr[3] === arr[3]
    //     )
    // );

    //This function is cleaning the array and there is also an exceptional case inside it 
    const distinctArray = cleanedArray && cleanedArray.filter((arr, index, self) =>
        index === self.findIndex((innerArr) => {
            const condition1 = innerArr[0] === arr[0];
            const condition2 = innerArr[3] === arr[3];

            // Check if both innerArr[2] and arr[2] are numbers the don't compare them but if even of them doesn't come out as a number then do the comparison 
            const isInnerArrNumeric = !isNaN(parseFloat(innerArr[2]));
            const isArrNumeric = !isNaN(parseFloat(arr[2]));

            const condition3 = isInnerArrNumeric && isArrNumeric ? true : innerArr[2] === arr[2];

            return condition1 && condition2 && condition3;
        })
    );

    console.log("distinctArray", distinctArray)

    //arr is split and cleaned to get the parameterName, opertor, threshold and units separately
    const splitedValues = selectedRequirement.requirement && arr.reduce((uniqueItems, row) => {
        if (row.props.eventKey && row.props.eventKey !== '') {
            const values = row.props.eventKey.split(',')
                .map(value => value.trim());
            values.forEach(value => {
                const wordsBeforeSymbols = value.split(/(>|≤|<|≥)/);
                const cleanedThreshold = wordsBeforeSymbols[2]?.replace(/[^\d.]/g, '');
                const unit = wordsBeforeSymbols[2]?.replace(/\d|\./g, '').trim();
                uniqueItems.add([wordsBeforeSymbols[0], wordsBeforeSymbols[1], cleanedThreshold, unit]);
            });
        }
        return uniqueItems;
    }, new Set());

    const splitedArray = Array.from(splitedValues);


    // splitedArray is filtered to remove the exact dupliacte array elements so it doesn't appear again the matchingrows
    const UniqueArray = splitedArray.filter((arr, index, self) =>
        index === self.findIndex((innerArr) =>
            innerArr.every((element, innerIndex) => element === arr[innerIndex])
        )
    );
    // console.log("UniqueArray", UniqueArray)


    // This function is handling the what to display in the dropdown "Yes" or "No"
    const handleDropdownChange = (fieldName, value) => {
        if (value === "No") {
            setSelectedDropdownValues(prevState => ({
                ...prevState,
                [fieldName]: "No"
            }));
        } else {
            setSelectedDropdownValues(prevState => ({
                ...prevState,
                [fieldName]: "Yes"
            }));
        }
    }

    const handleInputChange = (fieldName, value) => {
        setSelectedDifferentiation({ differentiation: '', index: null });
        setSelectedReason({ reason: '', index: null });
        setSelectedSolution({ solution: '', index: null });
        if (value !== undefined) {
            setSelectedDropdownValues({}) //clean the dropdown when the input is given in the input field
            setUserInput(prevUserInput => ({ ...prevUserInput, [fieldName]: value }));
        } else {
            setUserInput({}) //clean the userInput when the dropdown is selected
            if (fieldName !== "No") {
                const eventKeyOfMatchedRow = arr && arr.filter((row) => fieldName.replace(/\s/g, '') === row.props.eventKey.replace(/\s/g, ''))
                const selectedIndex = eventKeyOfMatchedRow[0].props['data-index'];
                setSelectedResult({ result: eventKeyOfMatchedRow[0].props.eventKey, index: parseInt(selectedIndex, 10) });
            } else {
                return null;
            }
        }
    };


    //useEffect is run to compare the user's input with our threshold
    useEffect(() => {
        const findMatchingRows = () => {
            const matchingRows = [];
            UniqueArray.forEach((condition) => {
                const parameterName = condition[0];
                const operator = condition[1];
                const threshold = parseFloat(condition[2]);
                const units = condition[3]

                if (userInput.hasOwnProperty(parameterName)) {
                    const userInputValue = parseFloat(userInput[parameterName]);
                    if (operator === '≥' && userInputValue >= threshold) {
                        matchingRows.push(`${parameterName} ${operator} ${threshold} ${units}`);
                    } else if (operator === '<' && userInputValue < threshold) {
                        matchingRows.push(`${parameterName} ${operator} ${threshold} ${units}`);
                    } else if (operator === '>' && userInputValue > threshold) {
                        matchingRows.push(`${parameterName} ${operator} ${threshold} ${units}`);
                    } else if (operator === '≤' && userInputValue <= threshold) {
                        matchingRows.push(`${parameterName} ${operator} ${threshold} ${units}`);
                    }
                }
            });
            return matchingRows;
        };

        const matchingRows = findMatchingRows();

        const concatenatedRows = matchingRows.join(', ');

        const concatenatedRowsNoSpaces = concatenatedRows.replace(/\s/g, '');

        const filteredRows = concatenatedRowsNoSpaces && arr.filter((row) => {
            const rowEventKeyNoSpaces = row.props.eventKey.replace(/\s/g, '');
            return rowEventKeyNoSpaces === concatenatedRowsNoSpaces
        });

        if (filteredRows.length > 0) {
            const eventKeyOfMatchedRow = filteredRows[0].props.eventKey;
            const selectedIndex = filteredRows[0].props['data-index'];
            setSelectedResult({ result: eventKeyOfMatchedRow, index: parseInt(selectedIndex, 10) });
        } else {
            setSelectedResult({ result: '', index: -1 });
        }
    }, [userInput]);



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
                    onClick={() => setCounter(prevCounter => prevCounter === 0 ? 0 : prevCounter - 1)}
                    alt="Previous"
                />

                <img
                    src='images/arrow-right-circle-fill.svg'
                    className='btn mx-5 custombtn'
                    onClick={() => setCounter(prevCounter => prevCounter === 4 ? 4 : prevCounter + 1)}
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
                                                    spinButtons={false}
                                                />
                                                <br />
                                            </div>
                                        ) : (
                                            <div className='mb-3'>
                                                <p className='text-center'>{`${fieldName[0]} ${fieldName[1] !== undefined || '' ? fieldName[1] : ''} ${fieldName[2] !== undefined || '' ? fieldName[2] : ''} ${fieldName[3] !== undefined || '' ? fieldName[3] : ''}`}</p>
                                                <Dropdown className='text-center'
                                                    onSelect={(eventKey) => {
                                                        handleInputChange(eventKey);
                                                        handleDropdownChange(fieldName[0], eventKey)
                                                    }}
                                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>

                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                                        {selectedDropdownValues[fieldName[0]] === "Yes" ? "Yes" : "No"}
                                                    </Dropdown.Toggle>


                                                    <Dropdown.Menu className='text-center m-100 max-width max-height'>
                                                        <Dropdown.Item key="empty" eventKey="" disabled>Select an option</Dropdown.Item>
                                                        <Dropdown.Item className='word-break' key="Yes"
                                                            eventKey={`${fieldName[0]} ${fieldName[1] !== undefined || '' ? fieldName[1] : ''} ${fieldName[2] !== undefined || '' ? fieldName[2] : ''} ${fieldName[3] !== undefined || '' ? fieldName[3] : ''}`}>
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
                        counter === 2 &&
                        <div className=''>
                            <h5 className='text-center mb-3'>Select Differentiation</h5>
                            <Dropdown className='text-center' onSelect={handleDifferentiationSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedDifferentiation.differentiation ? selectedDifferentiation.differentiation : "Select Differentiation"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='text-center m-100 max-width'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select Differentiation</Dropdown.Item>
                                    {/* {console.log("selectedResult.index",selectedResult.index)} */}
                                    {selectedResult.result &&
                                        excelData
                                            .slice(selectedResult.index)
                                            .reduce((acc, row, index, array) => {
                                                if ((row['Result of Requirement '] === selectedResult.result) || row['Result of Requirement '] === "") {
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
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    }

                    {
                        counter === 3 &&
                        <div className=''>
                            <h5 className='text-center mb-3'>Select Reason</h5>
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
                            </Dropdown>
                        </div>
                    }



                    {
                        counter === 4 &&
                        <div className=''>
                            <h5 className='text-center mb-3'>Select Solution</h5>
                            <Dropdown className='text-center' onSelect={handleSolutionSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                    {selectedSolution.solution ? selectedSolution.solution : "Select Solution"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='text-center m-100 max-width'>
                                    <Dropdown.Item key="empty" eventKey="" disabled>Select Solution</Dropdown.Item>
                                    {selectedResult.result && selectedReason.reason ?
                                        excelData
                                            .filter((row, index) => index === selectedReason.index)
                                            .map((row, index) => (
                                                <Dropdown.Item
                                                    key={row.Solution + index}
                                                    eventKey={row.Solution}
                                                    data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                                                    style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                >
                                                    {row.Solution}
                                                </Dropdown.Item>
                                            ))
                                        :
                                        selectedDifferentiation.differentiation && reasonLength && reasonLength[0].props.eventKey === "" ?
                                            excelData
                                                .filter((row, index) => index === selectedDifferentiation.index)
                                                .map((row, index) => (
                                                    <Dropdown.Item
                                                        key={row.Solution + index}
                                                        eventKey={row.Solution}
                                                        data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                                                        style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                    >
                                                        {row.Solution}
                                                    </Dropdown.Item>
                                                ))
                                            :
                                            (differentiationLength && differentiationLength[0].props.eventKey === '') &&
                                            (reasonLength && reasonLength[0].props.eventKey === '') &&
                                            excelData
                                                .filter((row, index) => index === selectedResult.index)
                                                .map((row, index) => (
                                                    <Dropdown.Item
                                                        key={row.Solution + index}
                                                        eventKey={row.Solution}
                                                        data-index={excelData.findIndex((item) => item.Solution === row.Solution)}
                                                        style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                                    >
                                                        {row.Solution}
                                                    </Dropdown.Item>
                                                ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown>

                        </div>
                    }
                </div>
            </div>
        </div >
    )
}

export default Test9;