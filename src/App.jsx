import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import Chart from 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({});
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (selectedIdentifier) {
  //     setSelectedIdentifierData(prevData => ({
  //       ...prevData,
  //       [name]: value
  //     }));
  //   } else {
  //     if (name === "identifier") {
  //       setFormData({ ...formData, identifier: value.startsWith("MRN-") ? value : `MRN-${value}` });
  //     } else {
  //       setFormData({ ...formData, [name]: value });
  //     }
  //   }
  // };
  

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
      // Update formData for modestactivityhours and highintensityhours
      if (name === "modestactivityhours" || name === "highintensityhours") {
        setFormData({ ...formData, [name]: value });
      }
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (!editMode) {  await axios.post('http://localhost:5000/api/form', formData);toast.success('Form submitted successfully!');
        
      } else {
        // Construct exercise string based on selected exercise type and hours per week
      
      await axios.put(`http://localhost:5000/api/form/${selectedIdentifierData._id}`, selectedIdentifierData);
        toast.success('Form updated successfully!');
        
      }
      // Fetch the latest data after submission
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
      exercise: '',
      modestactivityhours: '',
      highintensityhours: '',
      weight: '',
      race: '',
      education: '',
      smokertype: '',
      lungDisease: '',
      familyHistory: '',
      name: '',
      vegetablesservings: '',
      redmeatservings: '',
      drinksalcohol: '',
      number: '',
      drinksperweek: '',
      quitsmoking: '',
      startsmoking: '',
      cigarettesperday: '',
      yearssmoked: '',
      quitdate: '',
      colorectalCancer: '',
      colorectalCancerAge: '',
      breastCancerWomen: '',
      breastCancerWomenSiblings: '',
      breastCancerWomenAge: '',
      lungCancer: '',
      lungCancerAge: '',
      bladderCancer: '',
      bladderCancerAge: '',
      prostateCancerMen: '',
      prostateCancerMenAge: '',
      abdominalAorticAneurysm: '',
      abdominalAorticAneurysmAge: '',
      coronaryArteryDisease: '',
      coronaryArteryDiseaseAge: '',
      hypertension: '',
      diabetesMellitus: '',
      dyslipidemia: '',
      inflammatoryBowelDisease: '',
      stress: '',
      mood: '',
      mutationInBRCA: '',
      ageAtFirstMenstrualPeriod: '',
      ageAtFirstChild: '',
      antihypertensives: '',
      antilipidemic: '',
      aspirin: '',
      aspirinLast30Days: '',
      nsaid: '',
      nsaidLast30Days: '',
      otherMedication: '',
      colonoscopy: '',
      sigmoidoscopy: '',
      lungCT: '',
      breastMammography: '',
      breastBiopsy: '',
      papSmear: '',
      abdominalUltrasound: '',
      colonoscopyDate: '',
      sigmoidoscopyDate: '',
      lungCTDate: '',
      breastMammographyDate: '',
      breastBiopsyDate: '',
      papSmearDate: '',
      abdominalUltrasoundDate: ''
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
      exercise: '',
      modestactivityhours: '',
      highintensityhours: '',
      weight: '',
      race: '',
      education: '',
      smokertype: '',
      lungDisease: '',
      familyHistory: '',
      name: '',
      vegetablesservings: '',
      redmeatservings: '',
      drinksalcohol: '',
      number: '',
      drinksperweek: '',
      quitsmoking: '',
      startsmoking: '',
      cigarettesperday: '',
      yearssmoked: '',
      quitdate: '',
      colorectalCancer: '',
      colorectalCancerAge: '',
      breastCancerWomen: '',
      breastCancerWomenSiblings: '',
      breastCancerWomenAge: '',
      lungCancer: '',
      lungCancerAge: '',
      bladderCancer: '',
      bladderCancerAge: '',
      prostateCancerMen: '',
      prostateCancerMenAge: '',
      abdominalAorticAneurysm: '',
      abdominalAorticAneurysmAge: '',
      coronaryArteryDisease: '',
      coronaryArteryDiseaseAge: '',
      hypertension: '',
      diabetesMellitus: '',
      dyslipidemia: '',
      inflammatoryBowelDisease: '',
      stress: '',
      mood: '',
      mutationInBRCA: '',
      ageAtFirstMenstrualPeriod: '',
      ageAtFirstChild: '',
      antihypertensives: '',
      antilipidemic: '',
      aspirin: '',
      aspirinLast30Days: '',
      nsaid: '',
      nsaidLast30Days: '',
      otherMedication: '',
      colonoscopy: '',
      sigmoidoscopy: '',
      lungCT: '',
      breastMammography: '',
      breastBiopsy: '',
      papSmear: '',
      abdominalUltrasound: '',
      colonoscopyDate: '',
      sigmoidoscopyDate: '',
      lungCTDate: '',
      breastMammographyDate: '',
      breastBiopsyDate: '',
      papSmearDate: '',
      abdominalUltrasoundDate: ''
    });
  };

  const handleIdentifierSelect = async (selectedId) => {
    const selectedData = allForms.find((form) => form.identifier === selectedId);
    
    // Ensure selected data is found before updating state
    if (selectedData) {
      setSelectedIdentifier(selectedId);
      setSelectedIdentifierData(selectedData);
      
      // Update form data with selected data
      setFormData({
        ...selectedData, // Copy all fields from selectedData
      });
    
      // Set edit mode to true to enable editing
      setEditMode(true);
    } else {
      // If no data is found for the selected identifier, reset the form data and edit mode
      setSelectedIdentifier('');
      setSelectedIdentifierData(''); // Set selectedIdentifierData to null
      setFormData({});
      setEditMode(false);
    }
  };
  
  
  
  
  
  
  console.log(selectedIdentifierData);
  console.log(formData);
  
console.log(identifiers);
  return (
    <div className="container">
      <h1>Testing</h1>
      {currentPage === 1 && (<>
      <h1>Stage 1</h1>
      <h1>Demographics</h1>
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
        <><h1>Stage 2</h1>
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
    <select id="exercise" name="exercise" value={selectedIdentifierData.exercise ? selectedIdentifierData.exercise : ''} onChange={handleChange}>
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
    <input type="number" id="modestactivityhours" name="modestactivityhours" value={selectedIdentifierData.modestactivityhours ? selectedIdentifierData.modestactivityhours : ''} onChange={handleChange} />
  </div>
)}

{selectedIdentifierData && selectedIdentifierData.exercise === "High intensity" && (
  <div className="form-group">
    <label htmlFor="highintensityhours">High Intensity Hours per Week:</label>
    <input type="number" id="highintensityhours" name="highintensityhours" value={selectedIdentifierData.highintensityhours ? selectedIdentifierData.highintensityhours : ''} onChange={handleChange} />
  </div>
)}
<div className="form-group">
  <label htmlFor="vegetablesservings">Vegetables Servings per Week:</label>
  <input type="number" id="vegetablesservings" name="vegetablesservings" value={selectedIdentifierData.vegetablesservings ? selectedIdentifierData.vegetablesservings : ''} onChange={handleChange} />
</div>
<div className="form-group">
  <label htmlFor="redmeatservings">Red Meat Servings per Week:</label>
  <input type="number" id="redmeatservings" name="redmeatservings" value={selectedIdentifierData.redmeatservings ? selectedIdentifierData.redmeatservings : ''} onChange={handleChange} />
</div>
<div className="form-group">
        <label htmlFor="drinksalcohol">Drinks alcohol:</label>
        <select id="drinksalcohol" name="drinksalcohol" value={selectedIdentifierData.drinksalcohol ? selectedIdentifierData.drinksalcohol : ''} onChange={handleChange}>
          <option value="">Select...</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      
      {selectedIdentifierData.drinksalcohol === "Yes" && (
        <div className="form-group">
          <label htmlFor="drinksperweek">How many drinks per week:</label>
          <input type="number" id="drinksperweek" name="drinksperweek" value={selectedIdentifierData.drinksperweek ? selectedIdentifierData.drinksperweek : ''} onChange={handleChange} />
        </div>
      )}

              
<div className="form-group">
        <label htmlFor="smokertype">Smoker Type:</label>
        <select id="smokertype" name="smokertype" value={selectedIdentifierData.smokertype ? selectedIdentifierData.smokertype : ''} onChange={handleChange}>
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
            <input type="date" id="quitsmoking" name="quitsmoking" value={selectedIdentifierData.quitsmoking ? selectedIdentifierData.quitsmoking : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="startsmoking">When did you start smoking:</label>
            <input type="date" id="startsmoking" name="startsmoking" value={selectedIdentifierData.startsmoking ? selectedIdentifierData.startsmoking : ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cigarettesperday">How many cigarettes per day did you smoke:</label>
            <input type="number" id="cigarettesperday" name="cigarettesperday" value={selectedIdentifierData.cigarettesperday ? selectedIdentifierData.cigarettesperday : ''} onChange={handleChange} />
          </div>
        </>
      )}
      
      {selectedIdentifierData.smokertype === "Current Smoker" && (
        <>
          <div className="form-group">
            <label htmlFor="startsmoking">When did you start smoking:</label>
            <input type="date" id="startsmoking" name="startsmoking" value={selectedIdentifierData.startsmoking ? selectedIdentifierData.startsmoking : '' } onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cigarettesperday">How many cigarettes per day do you smoke:</label>
            <input type="number" id="cigarettesperday" name="cigarettesperday" value={selectedIdentifierData.cigarettesperday ? selectedIdentifierData.cigarettesperday : ''} onChange={handleChange} />
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
            {currentPage === 3 && (
        <><h1>Stage 3</h1>
        <h1>Family History</h1>
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
  <label htmlFor="colorectalCancer">Colorectal Cancer:</label>
  <select id="colorectalCancer" name="colorectalCancer" value={selectedIdentifierData.colorectalCancer ? selectedIdentifierData.colorectalCancer : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.colorectalCancer === "Yes" && (
    <div className="form-group">
      <label htmlFor="colorectalCancerAge">At what Age:</label>
      <input type="number" id="colorectalCancerAge" name="colorectalCancerAge" value={selectedIdentifierData.colorectalCancerAge ? selectedIdentifierData.colorectalCancerAge : ''} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="breastCancerWomen">Breast Cancer (Women):</label>
  <select id="breastCancerWomen" name="breastCancerWomen" value={selectedIdentifierData.breastCancerWomen ? selectedIdentifierData.breastCancerWomen : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.breastCancerWomen === "Yes" && (
    <>
      <div className="form-group">
        <label htmlFor="breastCancerWomenSiblings">How many siblings:</label>
        <input type="number" id="breastCancerWomenSiblings" name="breastCancerWomenSiblings" value={selectedIdentifierData.breastCancerWomenSiblings ? selectedIdentifierData.breastCancerWomenSiblings : ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="breastCancerWomenAge">At what age:</label>
        <input type="number" id="breastCancerWomenAge" name="breastCancerWomenAge" value={selectedIdentifierData.breastCancerWomenAge ? selectedIdentifierData.breastCancerWomenAge : ''} onChange={handleChange} />
      </div>
    </>
  )}
</div>

<div className="form-group">
  <label htmlFor="lungCancer">Lung Cancer:</label>
  <select id="lungCancer" name="lungCancer" value={selectedIdentifierData.lungCancer ? selectedIdentifierData.lungCancer : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.lungCancer === "Yes" && (
    <div className="form-group">
      <label htmlFor="lungCancerAge">At what Age:</label>
      <input type="number" id="lungCancerAge" name="lungCancerAge" value={selectedIdentifierData.lungCancerAge ? selectedIdentifierData.lungCancerAge : ''} onChange={handleChange} />
    </div>
  )}
</div>
<div className="form-group">
  <label htmlFor="bladderCancer">Bladder Cancer:</label>
  <select id="bladderCancer" name="bladderCancer" value={selectedIdentifierData.bladderCancer ? selectedIdentifierData.bladderCancer : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.bladderCancer === "Yes" && (
    <div className="form-group">
      <label htmlFor="bladderCancerAge">At what Age:</label>
      <input type="number" id="bladderCancerAge" name="bladderCancerAge" value={selectedIdentifierData.bladderCancerAge ? selectedIdentifierData.bladderCancerAge : ''} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="prostateCancerMen">Prostate Cancer (Men):</label>
  <select id="prostateCancerMen" name="prostateCancerMen" value={selectedIdentifierData.prostateCancerMen ? selectedIdentifierData.prostateCancerMen : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.prostateCancerMen === "Yes" && (
    <>
      <div className="form-group">
        <label htmlFor="prostateCancerMenAge">At what Age:</label>
        <input type="number" id="prostateCancerMenAge" name="prostateCancerMenAge" value={selectedIdentifierData.prostateCancerMenAge ? selectedIdentifierData.prostateCancerMen : ''} onChange={handleChange} />
      </div>
    </>
  )}
</div>

<div className="form-group">
  <label htmlFor="abdominalAorticAneurysm">Abdominal Aortic Aneurysm:</label>
  <select id="abdominalAorticAneurysm" name="abdominalAorticAneurysm" value={selectedIdentifierData.abdominalAorticAneurysm ? selectedIdentifierData.abdominalAorticAneurysm : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.abdominalAorticAneurysm === "Yes" && (
    <div className="form-group">
      <label htmlFor="abdominalAorticAneurysmAge">At what Age:</label>
      <input type="number" id="abdominalAorticAneurysmAge" name="abdominalAorticAneurysmAge" value={selectedIdentifierData.abdominalAorticAneurysmAge ? selectedIdentifierData.abdominalAorticAneurysmAge : ''} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="coronaryArteryDisease">Coronary Artery Disease:</label>
  <select id="coronaryArteryDisease" name="coronaryArteryDisease" value={selectedIdentifierData.coronaryArteryDisease ? selectedIdentifierData.coronaryArteryDisease : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.coronaryArteryDisease === "Yes" && (
    <div className="form-group">
      <label htmlFor="coronaryArteryDiseaseAge">At what Age:</label>
      <input type="number" id="coronaryArteryDiseaseAge" name="coronaryArteryDiseaseAge" value={selectedIdentifierData.coronaryArteryDiseaseAge ? selectedIdentifierData.coronaryArteryDiseaseAge : ''} onChange={handleChange} />
    </div>
  )}
</div>




              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
            {currentPage === 4 && (
        <><h1>Stage </h1>
        <h1> History</h1>
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
  <label htmlFor="hypertension">Hypertension:</label>
  <select id="hypertension" name="hypertension" value={selectedIdentifierData.hypertension ? selectedIdentifierData.hypertension : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="diabetesMellitus">Diabetes Mellitus:</label>
  <select id="diabetesMellitus" name="diabetesMellitus" value={selectedIdentifierData.diabetesMellitus ? selectedIdentifierData.diabetesMellitus : '' } onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="dyslipidemia">Dyslipidemia:</label>
  <select id="dyslipidemia" name="dyslipidemia" value={selectedIdentifierData.dyslipidemia ? selectedIdentifierData.dyslipidemia : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="inflammatoryBowelDisease">Inflammatory Bowel Disease:</label>
  <select id="inflammatoryBowelDisease" name="inflammatoryBowelDisease" value={selectedIdentifierData.inflammatoryBowelDisease ? selectedIdentifierData.inflammatoryBowelDisease : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="lungDisease">Lung Disease:</label>
  <select id="lungDisease" name="lungDisease" value={selectedIdentifierData.lungDisease ? selectedIdentifierData.lungDisease : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="COPD/emphysema">COPD/emphysema</option>
    <option value="None">None</option>
    <option value="Unknown">Unknown</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="musculoskeletalProblems">Musculoskeletal Problems:</label>
  <input type="text" id="musculoskeletalProblems" name="musculoskeletalProblems" value={selectedIdentifierData.musculoskeletalProblems ? selectedIdentifierData.musculoskeletalProblems : ''} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="carotidArteryDisease">Carotid Artery Disease:</label>
  <select id="carotidArteryDisease" name="carotidArteryDisease" value={selectedIdentifierData.carotidArteryDisease ? selectedIdentifierData.carotidArteryDisease : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="sunExposure">Sun Exposure:</label>
  <input type="text" id="sunExposure" name="sunExposure" value={selectedIdentifierData.sunExposure ? selectedIdentifierData.sunExposure : ''} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="mentalHealth">Mental Health - Stress:</label>
  <input type="text" id="mentalHealth" name="mentalHealth" value={selectedIdentifierData.mentalHealth ? selectedIdentifierData.mentalHealth : ''} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="mood">Mental Health - Mood:</label>
  <input type="text" id="mood" name="mood" value={selectedIdentifierData.mood ? selectedIdentifierData.mood : ''} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="womenHealth">Women Health:</label>
  <select id="womenHealth" name="womenHealth" value={selectedIdentifierData.womenHealth ? selectedIdentifierData.womenHealth : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

{selectedIdentifierData.womenHealth === "Yes" && (
  <>
    <div className="form-group">
      <label htmlFor="mutationInBRCA">Mutation in either the BRCA1 or BRCA2 gene:</label>
      <select id="mutationInBRCA" name="mutationInBRCA" value={selectedIdentifierData.mutationInBRCA ? selectedIdentifierData.mutationInBRCA : ''} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="ageAtFirstMenstrualPeriod">Age at First Menstrual Period:</label>
      <input type="number" id="ageAtFirstMenstrualPeriod" name="ageAtFirstMenstrualPeriod" value={selectedIdentifierData.ageAtFirstMenstrualPeriod ? selectedIdentifierData.ageAtFirstMenstrualPeriod : ''} onChange={handleChange} />
    </div>

    <div className="form-group">
      <label htmlFor="ageAtFirstChild">Age at First Child:</label>
      <input type="number" id="ageAtFirstChild" name="ageAtFirstChild" value={selectedIdentifierData.ageAtFirstChild ? selectedIdentifierData.ageAtFirstChild : ''} onChange={handleChange} />
    </div>
  </>
)}


<div className="form-group">
  <label htmlFor="coronaryArteryDisease">Coronary Artery Disease:</label>
  <select id="coronaryArteryDisease" name="coronaryArteryDisease" value={selectedIdentifierData.coronaryArteryDisease ? selectedIdentifierData.coronaryArteryDisease : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.coronaryArteryDisease === "Yes" && (
    <div className="form-group">
      <label htmlFor="coronaryArteryDiseaseAge">At what Age:</label>
      <input type="number" id="coronaryArteryDiseaseAge" name="coronaryArteryDiseaseAge" value={selectedIdentifierData.coronaryArteryDiseaseAge ? selectedIdentifierData.coronaryArteryDiseaseAge : ''} onChange={handleChange} />
    </div>
  )}
</div>




              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
            {currentPage === 5 && (
        <><h1>Stage 5</h1>
        <h1> History</h1>
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
  <label htmlFor="antihypertensives">Antihypertensives:</label>
  <select id="antihypertensives" name="antihypertensives" value={selectedIdentifierData.antihypertensives ? selectedIdentifierData.antihypertensives : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="antilipidemic">Antilipidemic:</label>
  <select id="antilipidemic" name="antilipidemic" value={selectedIdentifierData.antilipidemic ? selectedIdentifierData.antilipidemic : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</div>

<div className="form-group">
  <label htmlFor="aspirin">Aspirin:</label>
  <select id="aspirin" name="aspirin" value={selectedIdentifierData.aspirin ? selectedIdentifierData.aspirin : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.aspirin === "Yes" && (
    <div className="form-group">
      <label htmlFor="aspirinLast30Days">Taken over past 30 days:</label>
      <select id="aspirinLast30Days" name="aspirinLast30Days" value={selectedIdentifierData.aspirinLast30Days ? selectedIdentifierData.aspirinLast30Days : ''} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="nsaid">NSAID:</label>
  <select id="nsaid" name="nsaid" value={selectedIdentifierData.nsaid ? selectedIdentifierData.nsaid : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
  {selectedIdentifierData.nsaid === "Yes" && (
    <div className="form-group">
      <label htmlFor="nsaidLast30Days">Taken over past 30 days:</label>
      <select id="nsaidLast30Days" name="nsaidLast30Days" value={selectedIdentifierData.nsaidLast30Days ? selectedIdentifierData.nsaid : ''}  onChange={handleChange}>
        <option value="">Select...</option>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="other">Other:</label>
  <select id="other" name="other" value={selectedIdentifierData.other ? selectedIdentifierData.other : ''} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</div>







              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
            {currentPage === 6 && (
        <><h1>Stage 6</h1>
        <h1> History</h1>
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
  <label htmlFor="sigmoidoscopy">Sigmoidoscopy:</label>
  <select id="sigmoidoscopy" name="sigmoidoscopy" value={selectedIdentifierData.sigmoidoscopy} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.sigmoidoscopy === "Yes" && (
    <div className="form-group">
      <label htmlFor="sigmoidoscopyDate">When:</label>
      <input type="date" id="sigmoidoscopyDate" name="sigmoidoscopyDate" value={selectedIdentifierData.sigmoidoscopyDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="colonoscopy">Colonoscopy:</label>
  <select id="colonoscopy" name="colonoscopy" value={selectedIdentifierData.colonoscopy} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.colonoscopy === "Yes" && (
    <div className="form-group">
      <label htmlFor="colonoscopyDate">When:</label>
      <input type="date" id="colonoscopyDate" name="colonoscopyDate" value={selectedIdentifierData.colonoscopyDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="lungCT">Lung CT:</label>
  <select id="lungCT" name="lungCT" value={selectedIdentifierData.lungCT} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.lungCT === "Yes" && (
    <div className="form-group">
      <label htmlFor="lungCTDate">When:</label>
      <input type="date" id="lungCTDate" name="lungCTDate" value={selectedIdentifierData.lungCTDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="breastMammography">Breast Mammography:</label>
  <select id="breastMammography" name="breastMammography" value={selectedIdentifierData.breastMammography} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.breastMammography === "Yes" && (
    <div className="form-group">
      <label htmlFor="breastMammographyDate">When:</label>
      <input type="date" id="breastMammographyDate" name="breastMammographyDate" value={selectedIdentifierData.breastMammographyDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="breastBiopsy">Breast Biopsy for Suspected Breast Cancer:</label>
  <select id="breastBiopsy" name="breastBiopsy" value={selectedIdentifierData.breastBiopsy} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.breastBiopsy === "Yes" && (
    <div className="form-group">
      <label htmlFor="breastBiopsyDate">When:</label>
      <input type="date" id="breastBiopsyDate" name="breastBiopsyDate" value={selectedIdentifierData.breastBiopsyDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="papSmear">PAP Smear:</label>
  <select id="papSmear" name="papSmear" value={selectedIdentifierData.papSmear} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.papSmear === "Yes" && (
    <div className="form-group">
      <label htmlFor="papSmearDate">When:</label>
      <input type="date" id="papSmearDate" name="papSmearDate" value={selectedIdentifierData.papSmearDate} onChange={handleChange} />
    </div>
  )}
</div>

<div className="form-group">
  <label htmlFor="ultrasoundAbdomen">Ultrasound of Abdomen:</label>
  <select id="ultrasoundAbdomen" name="ultrasoundAbdomen" value={selectedIdentifierData.ultrasoundAbdomen} onChange={handleChange}>
    <option value="">Select...</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {selectedIdentifierData.ultrasoundAbdomen === "Yes" && (
    <div className="form-group">
      <label htmlFor="ultrasoundAbdomenDate">When:</label>
      <input type="date" id="ultrasoundAbdomenDate" name="ultrasoundAbdomenDate" value={selectedIdentifierData.ultrasoundAbdomenDate} onChange={handleChange} />
    </div>
  )}
</div>








              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
            {currentPage === 7 && (
        <><h1>Stage 7</h1>
        <h1> History</h1>
  <select value={selectedIdentifier} onChange={(e) => handleIdentifierSelect(e.target.value)}>
  <option value="" key="default">Select an identifier</option>
  {allForms.map (form => (
    <option key={form.identifier} value={form.identifier}>{form.identifier}</option>
  ))}
</select>


      

          {selectedIdentifierData && (<>
            
      
             <h1>Lifestyle behavior</h1>
            <form className="form">
            <h1>W/H/BMI</h1>
          <div className="form-group">
            <label htmlFor="weight">Weight:</label>
            <input type="number" id="weight" name="weight" value={selectedIdentifierData.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height:</label>
            <input type="number" id="height" name="height" value={selectedIdentifierData.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bmi">BMI:</label>
            <input type="number" id="bmi" name="bmi" value={selectedIdentifierData.bmi} onChange={handleChange} />
          </div>

          <h1>Skin</h1>
          <div className="form-group">
            <label htmlFor="fairSkin">Fair skin:</label>
            <select id="fairSkin" name="fairSkin" value={selectedIdentifierData.fairSkin} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <h1>Vital signs</h1>
          <div className="form-group">
            <label htmlFor="bloodPressure">Blood Pressure:</label>
            <input type="text" id="bloodPressure" name="bloodPressure" value={selectedIdentifierData.bloodPressure} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="heartRate">Heart Rate:</label>
            <input type="number" id="heartRate" name="heartRate" value={selectedIdentifierData.heartRate} onChange={handleChange} />
          </div>

          <h1>Blood test</h1>
          <div className="form-group">
            <label htmlFor="totalCholesterol">Total Cholesterol:</label>
            <input type="number" id="totalCholesterol" name="totalCholesterol" value={selectedIdentifierData.totalCholesterol} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="hdlCholesterol">HDL Cholesterol:</label>
            <input type="number" id="hdlCholesterol" name="hdlCholesterol" value={selectedIdentifierData.hdlCholesterol} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="ldlCholesterol">LDL Cholesterol:</label>
            <input type="number" id="ldlCholesterol" name="ldlCholesterol" value={selectedIdentifierData.ldlCholesterol} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="hba1c">HbA1c:</label>
            <input type="number" id="hba1c" name="hba1c" value={selectedIdentifierData.hba1c} onChange={handleChange} />
          </div>








              

              <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
              <button type="button" onClick={handleSubmit}>
        edit
      </button>
            </form>
            </>
          )}
        </>
      )}
            {currentPage === 8 && (
        <><h1>Stage 7</h1>
        <h1> History</h1>
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
  <label htmlFor="readinessToImprove">Readiness to improve on health:</label>
  <input type="text" id="readinessToImprove" name="readinessToImprove" value={selectedIdentifierData.readinessToImprove} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="healthKnowledgeQuestions">Questions about their knowledge about their health:</label>
  <input type="text" id="healthKnowledgeQuestions" name="healthKnowledgeQuestions" value={selectedIdentifierData.healthKnowledgeQuestions} onChange={handleChange} />
</div>

<div className="form-group">
  <label htmlFor="accessToHealthCare">Access to health care:</label>
  <input type="text" id="accessToHealthCare" name="accessToHealthCare" value={selectedIdentifierData.accessToHealthCare} onChange={handleChange} />
</div>








              

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