import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Dropdown } from 'react-bootstrap';
import "../components/ReadFile.css"

const ReadFile = () => {
    const [excelData, setExcelData] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [selectedResult, setSelectedResult] = useState('');
    const [selectedDifferentiation, setSelectedDifferentiation] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
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
    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
        setSelectedRequirement('');
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
    };

    // Function to handle requirement selection
    const handleRequirementSelect = (requirement) => {
        setSelectedRequirement(requirement);
        setSelectedResult('');
        setSelectedDifferentiation('');
        setSelectedReason('');
    };

    // Function to handle result of requirement selection
    const handleResultSelect = (result) => {
        setSelectedResult(result);
        setSelectedDifferentiation('');
        setSelectedReason('');
    };

    // Function to handle differentiation selection
    const handleDifferentiationSelect = (differentiation) => {
        setSelectedDifferentiation(differentiation);
        // const selectedRow = excelData.find(row =>
        //     row.Problem === selectedProblem &&
        //     row.Requirement === selectedRequirement &&
        //     row['Result of Requirement'] === selectedResult &&
        //     row.Differentiation === differentiation
        // );
        // setSelectedReason(selectedRow ? selectedRow['Reason for Problem'] : '');
    };

    return (

        <div className='main-container'>
            <h1 className='text-center pt-5'>Hospital Consultative Questions</h1>
            <div className='d-flex justify-content-center mt-4'>
                <div>
                    {loading && <p>Loading...</p>}

                    <h2 className='text-center'>Select a problem:</h2>
                    <Dropdown className='text-center' onSelect={handleProblemSelect}>
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

                    <div>
                        <h2 className='text-center'>Select a requirement:</h2>
                        <Dropdown className='text-center' onSelect={handleRequirementSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedRequirement ? selectedRequirement : "Select a requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a requirement</Dropdown.Item>
                                {excelData
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

                    <div>
                        <h2 className='text-center'>Select Result of Requirement:</h2>
                        <Dropdown className='text-center' onSelect={handleResultSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedResult ? selectedResult : "Select Result of Requirement"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a Result of Requirement:</Dropdown.Item>
                                {excelData
                                    .slice(excelData.findIndex(item => item.Problem === selectedProblem))
                                    .reduce((acc, row, index, array) => {
                                        if (index === 0 || row.Problem === selectedProblem || row.Problem === "") {
                                            acc.push(
                                                <Dropdown.Item key={index} eventKey={row['Result of Requirement ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                    {row['Result of Requirement ']}
                                                </Dropdown.Item>
                                            );
                                        } else {
                                            array.splice(1);
                                        }
                                        return acc;
                                    }, [])
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* <div>
                        <h2 className='text-center'>Select Differentiation</h2>
                        <Dropdown className='text-center' onSelect={handleDifferentiationSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" className='common-class'>
                                {selectedDifferentiation ? selectedDifferentiation : "Select Differentiation"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='text-center m-100 max-width'>
                                <Dropdown.Item key="empty" eventKey="">Select a Differentiation</Dropdown.Item>
                                {excelData
                                    .slice(excelData.findIndex(item => item['Result of Requirement '] === selectedResult))
                                    .reduce((acc, row, index, array) => {
                                        if (index === 0 || row.Problem === selectedProblem || row.Problem === "") {
                                            acc.push(
                                                <Dropdown.Item key={index} eventKey={row['Result of Requirement ']} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                    {row['Result of Requirement ']}
                                                </Dropdown.Item>
                                            );
                                        } else {
                                            array.splice(1);
                                        }
                                        return acc;
                                    }, [])
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div> */}


                    {/* <div>
                        <h2>Select Differentiation:</h2>
                        <select
                            value={selectedDifferentiation}
                            onChange={(e) => handleDifferentiationSelect(e.target.value)}
                        >
                            <option value="">Select Differentiation</option>
                            {excelData
                                .filter(row =>
                                    row.Problem === selectedProblem &&
                                    row.Requirement === selectedRequirement &&
                                    row['Result of Requirement'] === selectedResult
                                )
                                .map((row, index) => (
                                    <option key={index} value={row.Differentiation}>
                                        {row.Differentiation}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <h2>Reason for Problem:</h2>
                        <p>{selectedReason}</p>
                    </div> */}
                </div>
            </div>
        </div >
    );
};

export default ReadFile;


































// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';

// const ReadFile = () => {
//     const [excelData, setExcelData] = useState([]);
//     const [selectedProblem, setSelectedProblem] = useState('');
//     const [selectedRequirement, setSelectedRequirement] = useState('');
//     const [selectedResult, setSelectedResult] = useState('');
//     const [selectedDifferentiation, setSelectedDifferentiation] = useState('');
//     const [selectedReason, setSelectedReason] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const filePath = '/assets/data.xlsx';

//         const readExcelFile = () => {
//             setLoading(true);
//             fetch(filePath)
//                 .then(response => {
//                     return response.arrayBuffer();
//                 })
//                 .then(arrayBuffer => {
//                     const data = new Uint8Array(arrayBuffer);
//                     const workbook = XLSX.read(data, { type: 'array' });
//                     const sheetName = workbook.SheetNames[0];
//                     const sheet = workbook.Sheets[sheetName];
//                     const excelRows = XLSX.utils.sheet_to_json(sheet);
//                     setExcelData(excelRows);
//                     console.log(excelRows)
//                     setLoading(false);
//                 })
//                 .catch(error => {
//                     console.error('Error reading Excel file:', error);
//                     setLoading(false);
//                 });
//         };

//         readExcelFile();
//     }, []);

//     // Function to handle problem selection
//     const handleProblemSelect = (problem) => {
//         setSelectedProblem(problem);
//         setSelectedRequirement('');
//         setSelectedResult('');
//         setSelectedDifferentiation('');
//         setSelectedReason('');
//     };

//     // Function to handle requirement selection
//     const handleRequirementSelect = (requirement) => {
//         setSelectedRequirement(requirement);
//         setSelectedResult('');
//         setSelectedDifferentiation('');
//         setSelectedReason('');
//     };

//     // Function to handle result of requirement selection
//     const handleResultSelect = (result) => {
//         setSelectedResult(result);
//         setSelectedDifferentiation('');
//         setSelectedReason('');
//     };

//     // Function to handle differentiation selection
//     const handleDifferentiationSelect = (differentiation) => {
//         setSelectedDifferentiation(differentiation);
//         const selectedRow = excelData.find(row =>
//             row.Problem === selectedProblem &&
//             row.Requirement === selectedRequirement &&
//             row['Result of Requirement'] === selectedResult &&
//             row.Differentiation === differentiation
//         );
//         setSelectedReason(selectedRow ? selectedRow['Reason for Problem'] : '');
//     };

//     return (
//         <div>
//             {loading && <p>Loading...</p>}
//             <h2>Select a problem:</h2>
//             <select onChange={(e) => handleProblemSelect(e.target.value)}>
//                 <option value="">Select a problem</option>
//                 {excelData.map((row, index) => (
//                     <option key={index} value={row.Problem}>
//                         {row.Problem}
//                     </option>
//                 ))}
//             </select>

//             {selectedProblem && (
//                 <div>
//                     <h2>Select a requirement:</h2>
//                     <select
//                         value={selectedRequirement}
//                         onChange={(e) => handleRequirementSelect(e.target.value)}
//                     >
//                         <option value="">Select a requirement</option>
//                         {excelData
//                             .filter(row => row.Problem === selectedProblem)
//                             .map((row, index) => (
//                                 <option key={index} value={row.Requirement}>
//                                     {row.Requirement}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>
//             )}

//             {selectedRequirement && (
//                 <div>
//                     <h2>Select Result of Requirement:</h2>
//                     <select
//                         value={selectedResult}
//                         onChange={(e) => handleResultSelect(e.target.value)}
//                     >
//                         <option value="">Select Result of Requirement</option>
//                         {excelData
//                             .filter(row => row.Problem === selectedProblem && row.Requirement === selectedRequirement)
//                             .map((row, index) => (
//                                 <option key={index} value={row['Result of Requirement']}>
//                                     {row['Result of Requirement']}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>
//             )}

//             {selectedResult && (
//                 <div>
//                     <h2>Select Differentiation:</h2>
//                     <select
//                         value={selectedDifferentiation}
//                         onChange={(e) => handleDifferentiationSelect(e.target.value)}
//                     >
//                         <option value="">Select Differentiation</option>
//                         {excelData
//                             .filter(row =>
//                                 row.Problem === selectedProblem &&
//                                 row.Requirement === selectedRequirement &&
//                                 row['Result of Requirement'] === selectedResult
//                             )
//                             .map((row, index) => (
//                                 <option key={index} value={row.Differentiation}>
//                                     {row.Differentiation}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>
//             )}

//             {selectedDifferentiation && (
//                 <div>
//                     <h2>Reason for Problem:</h2>
//                     <p>{selectedReason}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReadFile;
