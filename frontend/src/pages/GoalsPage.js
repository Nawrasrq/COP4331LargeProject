import React from 'react'
import NavigationBar from '../components/NavigationBar.js';
import GoalsDisplay from '../components/GoalsDisplay.js';

function GoalsPage() 
{

  function goBack()
  {
    window.location.href = "/Progress"
  }

  function goToEditGoals()
  {
    window.location.href = '/Progress/Goals/EditGoals';
  }

  return (
    <div>
        <NavigationBar />
        <button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
        <GoalsDisplay />
        <button type="button" id="editGoalsButton" class="buttons" onClick={goToEditGoals}> Edit Goals </button>
    </div>
  )
}

export default GoalsPage;