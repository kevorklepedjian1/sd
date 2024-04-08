import React, { useState } from 'react';

const FirstPageComponent = ({ formData, handleChange, handleCalculateRisk, handleSubmit }) => {
  return (
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
  );
}

export default FirstPageComponent;
