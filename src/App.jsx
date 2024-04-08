import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Chart from 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({
    identifier: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    smokerType: '',
    lungDisease: '',
    familyHistory: ''
    ,name:'',
    phonenumber:'',
    race:'',
    education:''
    
  });
  const [riskData, setRiskData] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [resetModalIsOpen, setResetModalIsOpen] = useState(false);
  const [identifiers, setIdentifiers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10000);
  const [totalPages] = useState(10000);
  const [selectedIdentifier, setSelectedIdentifier] = useState('');
  const [selectedIdentifierData, setSelectedIdentifierData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [allForms, setAllForms] = useState([]);

  useEffect(() => {
    const fetchIdentifiers = async () => {
      try {
        const response = await axios.get(`https://backend-lake-psi.vercel.app/api/identifiers?page=${currentPage}&perPage=${perPage}&searchTerm=${searchTerm}`);
        setIdentifiers(response.data);
      } catch (error) {
        console.error('Error fetching identifiers:', error);
      }
    };

    const fetchAllForms = async () => {
      try {
        const response = await axios.get('https://backend-lake-psi.vercel.app/api/allForms');
        setAllForms(response.data);
        console.log(allForms);
      } catch (error) {
        console.error('Error fetching all forms:', error);
      }
    };

    fetchIdentifiers();
    fetchAllForms();
  }, [currentPage, perPage, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (selectedIdentifier) {
      setSelectedIdentifierData(prevData => ({
        ...prevData,
        [name]: value
      }));
    } else {
      if (name === "identifier") {
        setFormData({ ...formData, identifier: value.startsWith("MRN-") ? value : `MRN-${value}` });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };
  

  const handleCalculateRisk = async () => {
    toast.info('Calculating...');
    const riskData = {
      labels: ['Smoker Risk', 'Non-Smoker Risk'],
      datasets: [{
        label: 'Risk %',
        data: [calculateSmokerRisk(), calculateNonSmokerRisk()],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    };
    console.log('Risk Data:', riskData);
    setRiskData(riskData);
    setShowSummary(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://backend-lake-psi.vercel.app/api/form', formData);
      toast.success('Form submitted successfully!');
      console.log('Form data submitted successfully! ' );
      console.log(allForms);      setAllForms([...allForms, formData]);
      

    } catch (error) {
      toast.error('Error submitting form. Please try again later.');
      console.error('Error submitting form data:', error);
    }
  };
  
  

  const calculateSmokerRisk = () => {
    const { age, height, weight } = formData;
    const smokerRisk = ((age * 0.5) + (height * 0.2) - (weight * 0.1)); 
    return smokerRisk;
  };

  const calculateNonSmokerRisk = () => {
    const { age, height, weight } = formData;
    const nonSmokerRisk = ((age * 0.3) + (height * 0.1) - (weight * 0.05)); 
    return nonSmokerRisk;
  };

  const handleReset = () => {
    setResetModalIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      identifier: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      ethnicity: '',
      education: '',
      smokerType: '',
      familyHistory: '',name:'',phonenumber:'',race:'',education:'',
      lungDisease: '',
    });
    setShowSummary(false);
    setRiskData({});
    setResetModalIsOpen(false);
  };

  const handleSaveSummary = async () => {
    try {
      const response = await axios.post('https://backend-lake-psi.vercel.app/api/saveSummary/pdf', { formData, riskData }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.pdf');
      document.body.appendChild(link);
      link.click();
      toast.success('Download pdf  successfully!');
    } catch (error) {
      toast.success('Failed');
      console.error('Error saving summary:', error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post('https://backend-lake-psi.vercel.app/api/saveSummary/csv', { formData, riskData });
      const csvData = response.data;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.csv');
      document.body.appendChild(link);
      link.click();
      toast.success('Downloaded csv successfully!');
    } catch (error) {
      toast.warn('Errorr didnt download ');
      console.error('Error downloading CSV:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setSelectedIdentifier('');
    setShowSummary(false);
    setFormData({
      identifier: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      ethnicity: '',
      education: '',
      smokerType: '',
      lungDisease: '',
      familyHistory: '',name:'',phonenumber:'',race:'',education:''
    });
  };

  const handleIdentifierSelect = async (selectedId) => {
    const selectedData = allForms.find(form => form.identifier === selectedId);
    
    // Ensure selected data is found before updating state
    if (selectedData) {
      setSelectedIdentifier(selectedId);
      setSelectedIdentifierData(selectedData);
  
      // Update form data with selected data
      setFormData({
        identifier: selectedData.identifier,
        age: selectedData.age,
        gender: selectedData.gender,
        height: selectedData.height,
        weight: selectedData.weight,
        ethnicity: selectedData.ethnicity,
        education: selectedData.education,
        smokerType: selectedData.smokerType,
        lungDisease: selectedData.lungDisease,
        familyHistory: selectedData.familyHistory
      });
  
      // Set edit mode to true to enable editing
      setEditMode(true);
    }
  };
  
  
  console.log(selectedIdentifierData);
  
// console.log(identifiers);
  return (
    <div className="container">
      <h1>Lung Cancer Risk Assessment</h1>
      {currentPage === 1 && (<>
        <form className="form">
          <div className="form-group">
            <label htmlFor="identifier">Unique Identifier:</label>
            <input type="text" id="identifier" name="identifier" value={formData.identifier} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phonenumber">number:</label>
            <input type="number" id="number" name="phonenumber" value={formData.phonenumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
    <label htmlFor="race">Race:</label>
    <select id="race" name="race" value={formData.race} onChange={handleChange}>
      <option value="">Select...</option>
      <option value="White">White</option>
      <option value="Black">Black</option>
      <option value="Asian">Asian</option>
      <option value="Hispanic">Hispanic</option>
      <option value="American Indian or Alaskan Native">American Indian or Alaskan Native</option>
      <option value="Native Hawaiian or Pacific Islanders">Native Hawaiian or Pacific Islanders</option>
    </select>
  </div>
          <div className="form-group">
                <label htmlFor="education">Education:</label>
                <select id="education" name="education" value={formData.education} onChange={handleChange}>
                  <option value="">Select...</option> 
                  <option value="Less than high school">Less than high school</option>
                  <option value="Hight school graduate">Hight school graduate</option>
                  <option value="Some training after high school">Some training after high school</option>
                  <option value="Some college">Some college</option>
                  <option value="College graduate">College graduate</option>
                  <option value="Postgraduate or professional degree">Postgraduate or professional degree</option>
                </select>
              </div>

          <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
          <button type="button" className="btn-submit" onClick={handleSubmit}>Submit</button>
        </form>
        
        </>
      )}
            {currentPage === 2 && (
        <>
  <select value={selectedIdentifier} onChange={(e) => handleIdentifierSelect(e.target.value)}>
  <option value="" key="default">Select an identifier</option>
  {allForms.map (form => (
    <option key={form.identifier} value={form.identifier}>{form.identifier}</option>
  ))}
</select>


      

          {selectedIdentifierData && (<>
             <h1>Lifestyle behavior</h1>
            <form className="form">
            <div className="form-group">
    <label htmlFor="exercise">Exercise:</label>
    <select id="exercise" name="exercise" value={selectedIdentifierData.exercise} onChange={handleChange}>
      <option value="">Select...</option>
      <option value="No activity">No activity</option>
      <option value="Light activity">Light activity</option>
      <option value="Modest activity">Modest activity</option>
      <option value="High intensity">High intensity</option>
    </select>
  </div>
  {selectedIdentifierData && selectedIdentifierData.exercise === "Modest activity" && (
  <div className="form-group">
    <label htmlFor="modestactivityhours">Modest Activity Hours per Week:</label>
    <input type="number" id="modestactivityhours" name="modestactivityhours" value={selectedIdentifierData.modestactivityhours} onChange={handleChange} />
  </div>
)}

{selectedIdentifierData && selectedIdentifierData.exercise === "High intensity" && (
  <div className="form-group">
    <label htmlFor="highintensityhours">High Intensity Hours per Week:</label>
    <input type="number" id="highintensityhours" name="highintensityhours" value={selectedIdentifierData.highintensityhours} onChange={handleChange} />
  </div>
)}
<div className="form-group">
  <label htmlFor="vegetablesservings">Vegetables Servings per Week:</label>
  <input type="number" id="vegetablesservings" name="vegetablesservings" value={selectedIdentifierData.vegetablesservings} onChange={handleChange} />
</div>
<div className="form-group">
  <label htmlFor="redmeatservings">Red Meat Servings per Week:</label>
  <input type="number" id="redmeatservings" name="redmeatservings" value={selectedIdentifierData.redmeatservings} onChange={handleChange} />
</div>
<div className="form-group">
        <label htmlFor="drinksalcohol">Drinks alcohol:</label>
        <select id="drinksalcohol" name="drinksalcohol" value={selectedIdentifierData.drinksalcohol} onChange={handleChange}>
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      
      {selectedIdentifierData.drinksalcohol === "Yes" && (
        <div className="form-group">
          <label htmlFor="drinksperweek">How many drinks per week:</label>
          <input type="number" id="drinksperweek" name="drinksperweek" value={selectedIdentifierData.drinksperweek} onChange={handleChange} />
        </div>
      )}

              
<div className="form-group">
        <label htmlFor="smokertype">Smoker Type:</label>
        <select id="smokertype" name="smokertype" value={selectedIdentifierData.smokertype} onChange={handleChange}>
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Former Smoker">Former Smoker</option>
          <option value="Current Smoker">Current Smoker</option>
        </select>
      </div>
      
      {selectedIdentifierData.smokertype === "Former Smoker" && (
        <>
          <div className="form-group">
            <label htmlFor="quitsmoking">When did you quit smoking:</label>
            <input type="date" id="quitsmoking" name="quitsmoking" value={selectedIdentifierData.quitsmoking} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="startsmoking">When did you start smoking:</label>
            <input type="date" id="startsmoking" name="startsmoking" value={selectedIdentifierData.startsmoking} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cigarettesperday">How many cigarettes per day did you smoke:</label>
            <input type="number" id="cigarettesperday" name="cigarettesperday" value={selectedIdentifierData.cigarettesperday} onChange={handleChange} />
          </div>
        </>
      )}
      
      {selectedIdentifierData.smokertype === "Current Smoker" && (
        <>
          <div className="form-group">
            <label htmlFor="startsmoking">When did you start smoking:</label>
            <input type="date" id="startsmoking" name="startsmoking" value={selectedIdentifierData.startsmoking} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cigarettesperday">How many cigarettes per day do you smoke:</label>
            <input type="number" id="cigarettesperday" name="cigarettesperday" value={selectedIdentifierData.cigarettesperday} onChange={handleChange} />
          </div>
        </>
      )}
      
      {/* {selectedIdentifierData.smokertype && (
        <div className="form-group">
          <label htmlFor="yearssmoked">How many years:</label>
          <input type="number" id="yearssmoked" name="yearssmoked" value={selectedIdentifierData.yearssmoked} onChange={handleChange} />
        </div>
      )}
      
      {selectedIdentifierData.smokertype && (
        <div className="form-group">
          <label htmlFor="quitdate">Quit:</label>
          <input type="date" id="quitdate" name="quitdate" value={selectedIdentifierData.quitdate} onChange={handleChange} />
        </div>
      )} */}
              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
      {showSummary && (
        <div className="summary">
          <h2>Summary</h2>
          <div className="summary-data">
            {/* Display summary data here */}
          </div>
          <div className="risk-chart">
            <h3>Risk Data</h3>
            <Bar data={riskData} />
          </div>
          <div className="buttons">
            <button type="button" className="btn-save" onClick={handleSaveSummary}>Save Summary</button>
            <button type="button" className="btn-download" onClick={handleDownloadCSV}>Download CSV</button>
          </div>
        </div>
      )}
      {currentPage < totalPages && (
        <button type="button" onClick={handleNextPage}>Next</button>
      )}
      <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
      <Modal
        isOpen={resetModalIsOpen}
        onRequestClose={() => setResetModalIsOpen(false)}
        contentLabel="Reset Modal"
        className="modal"
        overlayClassName="overlay"
        style={{
          content: {
            position:'absolute',
            background:'White',
            textAlign:"center",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%', // Adjust the width as needed
            maxWidth: '400px' // Set max-width if needed
          }
        }}
      >
        <h2>Are you sure you want to reset?</h2>
        <div className="modal-buttons">
          <button className="btn-save" onClick={resetForm}>Yes</button>
          <button className="btn-reset" onClick={() => setResetModalIsOpen(false)}>No</button>
        </div>
      </Modal>
      <ToastContainer />
      
    </div>
  );
}

export default App;