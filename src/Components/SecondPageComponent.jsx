import React from 'react';

const SecondPageComponent = ({ formData, selectedIdentifierData, handleChange, handleCalculateRisk, handleSubmit }) => {
  return (
    <>
      <select value={selectedIdentifier} onChange={(e) => handleIdentifierSelect(e.target.value)}>
        <option value="" key="default">Select an identifier</option>
        {allForms.map(form => (
          <option key={form.identifier} value={form.identifier}>{form.identifier}</option>
        ))}
      </select>

      {selectedIdentifierData && (
        <>
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

            <button type="button" className="btn-calculate" onClick={handleCalculateRisk}>Calculate</button>
            <button type="button" className="btn-submit" onClick={handleSubmit}>Submit</button>
          </form>
        </>
      )}
    </>
  );
}

export default SecondPageComponent;
