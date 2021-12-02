
var vacfinderBtn = document.querySelector('#vacfinder-btn');
var vacalertBtn = document.querySelector('#vacalert-btn');
var vactrackerBtn = document.querySelector('#vactracker-btn');


var vaccineBody = document.querySelector('#vaccineBody');
var vaccinesNearByTitle = document.querySelector('#vaccinesNearBy-title');
var vaccinesNearByList = document.querySelector('#vaccinesNearBy-list');

var vacLoadingGif = '<img class="col-4 d-block mx-auto mt-3 p-0" style="width:200px; height:200px;" src="assets/images/vaccine-loader.gif" alt="Vaccine Loader"></img>';

let districtID = 671;
let stateID = 34;

var vacFinderDate = '';
var vacfilterDose = 'none';
var vacfilterVaccine = 'none';
var vacfilterBlockNow = "none";
var vacfilterAvail = "avail";




function cookietosdID() {

  if(document.cookie.indexOf('state_id=') !== -1) {
    const cookieValue = document.cookie.split('; ');
    districtID = cookieValue.find(row => row.startsWith('district_id=')).split('=')[1];
    stateID = cookieValue.find(row => row.startsWith('state_id=')).split('=')[1];
  }
}




async function fetchData(date, districtID) {
  
  let url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+districtID+'&date='+date+'&ut='+Date.now();
  
  const response = await fetch(url);
    
    if(response.status === 200) {
      //console.log(response.status);
      return response.json();  
    }
    else {
      return 0;
    }
  

}


function initCheck() {
  var urlString = window.location.href;
  var urlObj = new URL(urlString);
  var date = urlObj.searchParams.get("date");
  var sessionid = urlObj.searchParams.get("sid");
  var pin = urlObj.searchParams.get("pin");
  
  
  if(date == null || sessionid == null) {
    
    cookietosdID();
    
    vacFinder();
    
  }
  else {

    var distId = urlObj.searchParams.get("distId");
    var statId = urlObj.searchParams.get("statId");

    if(!isNaN(distId)) {
      document.cookie = "state_id="+statId+"; expires=Wed, 05 Sep 2023 23:00:00 UTC; path=/";
      document.cookie = "district_id="+distId+"; expires=Wed, 05 Sep 2023 23:00:00 UTC; path=/";

      districtID = distId;
      stateID = statId;     
    }

    vactrackerBtn.classList.remove("d-none");

    vacTracker(date, sessionid, pin);
  
  }
}


window.onload = initCheck();

/*function exitConfirmation() {
  return 'Close Vaccine Tracker..?';
}
window.onbeforeunload = exitConfirmation;
*/

  



/*
if (window.history && history.pushState) {
  addEventListener('load', function() {
      history.pushState(null, null, null); // creates new history entry with same URL
      addEventListener('popstate', function() {
          var stayOnPage = confirm("Would you like to save this draft?");
          if (!stayOnPage) {
              history.back() 
          } else {
              history.pushState(null, null, null);
          }
      });    
  });
}*/