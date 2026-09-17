import { useState } from 'react';

function App() {
  // 1. State to hold the applicant's information
  const [formData, setFormData] = useState({
    checking_status: '<0',
    duration: 24,
    credit_history: 'critical/other existing credit',
    credit_amount: 5000,
    employment: '1<=X<4',
    personal_status: 'male single',
    housing: 'rent',
    age: 25
  });

  const [prediction, setPrediction] = useState(null);

  // 2. Handle changes when the user types in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure numeric fields stay as numbers, not strings
    const numericFields = ['duration', 'credit_amount', 'age'];
    const finalValue = numericFields.includes(name) ? Number(value) : value;
    
    setFormData({
      ...formData,
      [name]: finalValue
    });
  };

  // 3. The Bridge: Send the form data to Python
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: formData })
      });
      const data = await response.json();
      setPrediction(data.prediction); // Save the AI's answer
    } catch (error) {
      console.error("Error connecting to API:", error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>AI Bank Manager</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Enter applicant details to predict loan risk.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Checking Account Status:</label>
          <select name="checking_status" value={formData.checking_status} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="<0">Negative ( &lt; 0 )</option>
            <option value="0<=X<200">Low ( 0 to 200 )</option>
            <option value=">=200">High ( &gt;= 200 )</option>
            <option value="no checking">No Checking Account</option>
          </select>
        </div>

        <div>
          <label>Credit History:</label>
          <select name="credit_history" value={formData.credit_history} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="critical/other existing credit">Critical / Existing Credit Elsewhere</option>
            <option value="delayed previously">Delayed Previously</option>
            <option value="existing paid">Existing Paid</option>
            <option value="all paid">All Paid</option>
            <option value="no credits/all paid">No Credits / All Paid</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Loan Amount (N):</label>
            <input type="number" name="credit_amount" value={formData.credit_amount} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Duration (Months):</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Housing:</label>
            <select name="housing" value={formData.housing} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              <option value="rent">Rent</option>
              <option value="own">Own</option>
              <option value="for free">For Free</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <button type="submit" style={{ padding: '12px', fontSize: '16px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
          Analyze Risk
        </button>
      </form>

      {/* Display the Prediction Result dynamically */}
      {prediction && (
        <div style={{ 
          marginTop: '25px', 
          padding: '20px', 
          textAlign: 'center', 
          borderRadius: '8px',
          backgroundColor: prediction.includes('Approve') ? '#1c3e1c' : '#93020e',
          color: prediction.includes('Approve') ? '#155724' : '#721c24',
          border: `1px solid ${prediction.includes('Approve') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <h2>{prediction}</h2>
        </div>
      )}
    </div>
  );
}

export default App;