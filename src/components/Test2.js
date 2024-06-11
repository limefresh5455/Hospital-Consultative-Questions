import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Dropdown } from 'react-bootstrap';
import "../components/ReadFile.css"

const Test2 = () => {
    const [excelData, setExcelData] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [selectedResult, setSelectedResult] = useState('');
    const [selectedDifferentiation, setSelectedDifferentiation] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [selectedSolution, setSelectedSolution] = useState('');
    const [requirementKnown, setRequirementKnown] = useState('')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const filePath = '/assets/data1.xlsx';

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
    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
        setRequirementKnown('')
        setSelectedRequirement('');
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('')
    };

    const handleRequirementKnownSelect = (select) => {
        setRequirementKnown(select)
        setSelectedRequirement('');
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('')
    }

    // Function to handle requirement selection
    const handleRequirementSelect = (requirement) => {
        setSelectedRequirement(requirement);
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('')
    };

    // Function to handle result of requirement selection
    const handleResultSelect = (result) => {
        setSelectedResult(result);
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('');
        handleConditionalRendering();
    };

    // Function to handle differentiation selection
    const handleDifferentiationSelect = (differentiation) => {
        showReasonForProblem();
        setSelectedDifferentiation(differentiation);
        setSelectedReason('');
        setSelectedSolution('');
    };


    const handleReasonSelect = (reason) => {
        showSolution();
        setSelectedReason(reason);
        setSelectedSolution('');
    };

    const handleSolutionSelect = (solution) => {
        setSelectedSolution(solution)
    }


    // function to handle solution based on the requirements
    const handleConditionalRendering = () => {
        const noDataInBothColumns = excelData.filter(row =>
            row['Result of Requirement '] === selectedResult &&
            row['Differentiation '] === '' &&
            row['Reason for Problem '] === ''
        );

        const hasDifferentiation = excelData.filter(row =>
            row['Result of Requirement '] === selectedResult &&
            row['Differentiation '] !== '' &&
            row['Reason for Problem '] === ''
        );

        const hasReasonForProblem = excelData.filter(row =>
            row['Result of Requirement '] === selectedResult &&
            row['Reason for Problem '] !== '' &&
            row['Differentiation '] === ''
        );


        if (noDataInBothColumns.length > 0) {
            // console.log("No data in both Differentiation and Reason for Problem columns");
            showSolution();
        } else if (hasDifferentiation.length > 0) {
            // console.log("Data in Differentiation column, but Reason for Problem is empty");
            showDifferentiation();
        } else {
            // console.log("Data in Reason for Problem column, but Differentiation is empty");
            showReasonForProblem();
        }
    }

    const showSolution = () => {
        if (selectedResult) {
            if (selectedReason) {
                return excelData.filter(row => row['Reason for Problem '] === selectedReason)
                    .map((row, index) => (
                        <Dropdown.Item key={index} eventKey={row.Solution} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            {row.Solution}
                        </Dropdown.Item>
                    ))
            } else {
                return excelData.filter(row => row['Result of Requirement '] === selectedResult)
                    .map((row, index) => (
                        <Dropdown.Item key={index} eventKey={row.Solution} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            {row.Solution}
                        </Dropdown.Item>
                    ))
            }
        }

    }

    const showDifferentiation = () => {
        if (selectedResult) {
            return excelData
                .slice(excelData.findIndex(item => item['Result of Requirement '] === selectedResult))
                .reduce((acc, row, index, array) => {
                    if (index === 0 || row['Result of Requirement '] === selectedResult || row['Result of Requirement '] === "") {
                        acc.push(
                            <Dropdown.Item key={index} eventKey={row['Differentiation ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                {row['Differentiation ']}
                            </Dropdown.Item>
                        );
                    } else {
                        array.splice(1);
                    }
                    return acc;
                }, [])
        }

    }

    const showReasonForProblem = () => {
        if (selectedResult) {
            if (selectedDifferentiation) {
                return excelData.filter(row => row['Differentiation '] === selectedDifferentiation)
                    .map((row, index) => (
                        <Dropdown.Item key={index} eventKey={row['Reason for Problem ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            {row['Reason for Problem ']}
                        </Dropdown.Item>
                    ))
            } else {
                excelData.filter(row => row['Result of Requirement '] === selectedResult)
                // Show data based on selectedResult
                return excelData.filter(row => row['Result of Requirement '] === selectedResult)
                    .map((row, index) => (
                        <Dropdown.Item key={index} eventKey={row['Reason for Problem ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            {row['Reason for Problem ']}
                        </Dropdown.Item>
                    ));
            }
        }
    }



    return (

        <div className='main-container'>
            <h1 className='text-center pt-3'>Hospital Consultative Questions</h1>
            <div className='d-flex justify-content-center'>
                <div>
                    {loading && <p>Loading...</p>}
                    <h2 className='text-center'>Select a problem:</h2>
                    <Dropdown className='text-center' onSelect={handleProblemSelect} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                            {selectedProblem ? selectedProblem : "Select a problem"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className='text-center m-100'>
                            <Dropdown.Item key="empty" eventKey="">Select a problem</Dropdown.Item>
                            {excelData.map((row, index) => (
                                row.Problem && (
                                    <Dropdown.Item className='word-break' key={index} eventKey={row.Problem} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                        {row.Problem}
                                    </Dropdown.Item>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className=''>
                        <h2 className='text-center'>Do you know the requirement for this disease?</h2>
                        <Dropdown className='text-center' onSelect={handleRequirementKnownSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class' style={{ whiteSpace: "break-words" }}>
                                {requirementKnown ? requirementKnown : "Select an option"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select an option</Dropdown.Item>
                                {selectedProblem && (
                                    <>
                                        <Dropdown.Item key="yes" eventKey="Yes" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                            Yes
                                        </Dropdown.Item>
                                        <Dropdown.Item key="no" eventKey="No" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                            No
                                        </Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {requirementKnown === 'No' &&
                        excelData.filter(row => row.Problem === selectedProblem)
                            .map(row => (
                                <div className='common-class text-center mt-2 px-1'>
                                    <h5>Kindly get the below reports to proceed further</h5>
                                    <h6>{row.Requirement}</h6>
                                </div>
                            ))}

                    <div className=''>
                        <h2 className='text-center'>Select a requirement:</h2>
                        <Dropdown className='text-center' onSelect={handleRequirementSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class' style={{ whiteSpace: "break-words" }}>
                                {selectedRequirement ? selectedRequirement : "Select a requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a requirement</Dropdown.Item>
                                {requirementKnown === 'Yes' && selectedProblem && excelData
                                    .filter((row) => row.Problem === selectedProblem)
                                    .map((row, index) => (
                                        row.Requirement && (
                                            <Dropdown.Item key={index} eventKey={row.Requirement} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                {row.Requirement}
                                            </Dropdown.Item>
                                        )
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className=''>
                        <h2 className='text-center'>Select Result of Requirement:</h2>
                        <Dropdown className='text-center' onSelect={handleResultSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedResult ? selectedResult : "Select Result of Requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a Result of Requirement:</Dropdown.Item>
                                {requirementKnown === 'Yes' && selectedRequirement && excelData
                                    .slice(excelData.findIndex(item => item.Requirement === selectedRequirement))
                                    .reduce((acc, row, index, array) => {
                                        if (index === 0 || row.Requirement === selectedRequirement || row.Requirement === "") {
                                            acc.push(
                                                <Dropdown.Item key={index} eventKey={row['Result of Requirement ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                    {row['Result of Requirement ']}
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


                    <div className=''>
                        <h2 className='text-center'>Select Differentiation</h2>
                        <Dropdown className='text-center' onSelect={handleDifferentiationSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedDifferentiation ? selectedDifferentiation : "Select Differentiation"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a Differentiation</Dropdown.Item>
                                {requirementKnown === 'Yes' && selectedResult && showDifferentiation()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className=''>
                        <h2 className='text-center'>Select Reason for Problem</h2>
                        <Dropdown className='text-center' onSelect={handleReasonSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedReason ? selectedReason : "Select Reason"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select Reason for Problem</Dropdown.Item>
                                {/* {renderReasonForProblem && showReasonForProblem()} */}
                                {requirementKnown === 'Yes' && showReasonForProblem()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div className=''>
                        <h2 className='text-center'>Select Solution</h2>
                        <Dropdown className='text-center' onSelect={handleSolutionSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedSolution ? selectedSolution : "Select Solution"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select Solution</Dropdown.Item>
                                {/* {renderSolution && showSolution()} */}
                                {requirementKnown === 'Yes' && showSolution()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Test2;