const tab1 = document.getElementById('tab1');
const tab2 = document.getElementById('tab2');
// const contentDiv = document.querySelector('.content');

tab1.addEventListener('click', () => {
  tab1.classList.add('active');
  tab2.classList.remove('active');
  // Display content for Tab 1
//   contentDiv.innerHTML = "Content for Tab 1"; 
document.getElementById('content-1').style.display = "none";
document.getElementById('content-2').style.display = "block";



});

tab2.addEventListener('click', () => {
  tab1.classList.remove('active');
  tab2.classList.add('active');
  // Display content for Tab 2
//   contentDiv.innerHTML = "Content for Tab 2"; 


document.getElementById('content-1').style.display = "block";
document.getElementById('content-2').style.display = "none";


});

// Initially show content for Tab 1 (optional)
tab1.classList.add('active');

document.getElementById('content-2').style.display = "block";