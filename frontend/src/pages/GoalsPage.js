import React from 'react'
import PageTitle from '../components/PageTitle.js';
import GoalsDisplay from '../components/GoalsDisplay.js';

function GoalsPage() 
{

  function goBack()
  {
    window.location.href = "/Progress"
  }

  function goToEditGoals()
  {
    window.location.href = '/Goals/EditGoals';
  }

  return (
    <div>
        <PageTitle />
        <button type="button" id="backButton" class="buttons" onClick={goBack}> Back </button>
        <GoalsDisplay />
        <button type="button" id="editGoalsButton" class="buttons" onClick={goToEditGoals}> Edit Goals </button>
    </div>
  )
}

export default GoalsPage;