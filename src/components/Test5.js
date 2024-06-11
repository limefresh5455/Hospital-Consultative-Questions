import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Dropdown } from 'react-bootstrap';
import "../components/ReadFile.css"

const Test5 = () => {
    const [excelData, setExcelData] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState({ problem: '', index: null });
    const [selectedRequirement, setSelectedRequirement] = useState({ requirement: '', index: null });
    const [selectedResult, setSelectedResult] = useState({ result: '', index: null });
    const [selectedDifferentiation, setSelectedDifferentiation] = useState({ differentiation: '', index: null });
    const [selectedReason, setSelectedReason] = useState({ reason: '', index: null });
    const [selectedSolution, setSelectedSolution] = useState({ solution: '', index: null });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const filePath = '/assets/data.xlsx';

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
        setSelectedRequirement('');
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('')
    };

    // Function to handle requirement selection
    const handleRequirementSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedRequirement({ requirement: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('');
    };

    // Function to handle result of requirement selection
    const handleResultSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedResult({ result: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedDifferentiation('');
        setSelectedReason('');
        setSelectedSolution('');
    };

    // Function to handle differentiation selection
    const handleDifferentiationSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedDifferentiation({ differentiation: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedReason('');
        setSelectedSolution('');
    };


    const handleReasonSelect = (eventKey, event) => {
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedReason({ reason: eventKey, index: parseInt(selectedIndex, 10) });
        setSelectedSolution('');
    };

    const handleSolutionSelect = (eventKey, event) => {
        console.log("object", eventKey)
        const selectedIndex = event.target.getAttribute('data-index');
        setSelectedSolution({ solution: eventKey, index: parseInt(selectedIndex, 10) })
    }

    const differentiationLength = selectedResult.result ?
        excelData
            .slice(selectedResult.index)
            .reduce((acc, row, index, array) => {
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
        : (differentiationLength && differentiationLength[0].key == 0) ? excelData.filter((row, index) => index === selectedResult.index)
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


    return (

        <div className='main-container'>
            <h2 className='text-center pt-3'>Hospital Consultative Questions</h2>
            <div className='d-flex justify-content-center'>
                <div>
                    {loading && <p>Loading...</p>}

                    <div className='mt-2'>
                        <h5 className='text-center mb-3'>Select a problem:</h5>
                        <Dropdown className='text-center' onSelect={(eventKey, event) => handleProblemSelect(eventKey, event.target.getAttribute('data-index'))} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedProblem.problem ? selectedProblem.problem : "Select a problem"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100'>
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


                    <div className='mt-4'>
                        <h5 className='text-center'>Select a requirement:</h5>
                        <Dropdown className='text-center' onSelect={handleRequirementSelect} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class' style={{ whiteSpace: "break-words" }}>
                                {selectedRequirement.requirement ? selectedRequirement.requirement : "Select a requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="" disabled>Select a requirement:</Dropdown.Item>
                                {selectedProblem.problem && excelData.filter((row, index) => index === selectedProblem.index)
                                    .map((row) => (
                                        row.Requirement && (
                                            <Dropdown.Item
                                                key={row.Requirement}
                                                eventKey={row.Requirement}
                                                data-index={excelData.findIndex((item) => item.Requirement === row.Requirement)}
                                                style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}
                                            >
                                                {row.Requirement}
                                            </Dropdown.Item>
                                        )
                                    ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>


                    <div className='mt-3'>
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
                    </div>


                    <div className='mt-4'>
                        <h5 className='text-center'>Select Differentiation</h5>
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


                    <div className='mt-4'>
                        <h5 className='text-center'>Select Reason for Problem</h5>
                        <Dropdown className='text-center' onSelect={handleReasonSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedReason.reason ? selectedReason.reason : "Select Reason"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="" disabled>Select Reason for Problem</Dropdown.Item>
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




                    <div className='mt-4'>
                        <h5 className='text-center'>Select Solution</h5>
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
                </div>
            </div>
        </div >
    )
}

export default Test5;