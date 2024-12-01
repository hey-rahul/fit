function submitSuggestion() {
    const suggestedDate = document.getElementById("suggestedDate").value;
    const dietSuggestion = document.getElementById("dietSuggestion").value;
    const exerciseSuggestion = document.getElementById("exerciseSuggestion").value;
  
    console.log("Suggestion submitted:", { suggestedDate, dietSuggestion, exerciseSuggestion });
    alert("Suggestion submitted!");
  }
  