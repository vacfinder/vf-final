
function vacFinderByDate(event, date = vacFinderDate, filterDose = vacfilterDose, filterVaccine = vacfilterVaccine, filterBlock = vacfilterBlockNow, filterAvail = vacfilterAvail) {

    vaccinesNearByList.innerHTML = vacLoadingGif;
    
    vacFinderDate = date;

    var tdate = new Date(date);
    const [dd, mm, yyyy] = [tdate.getDate(), tdate.getMonth()+1, tdate.getFullYear()];
    var date = dd+'-'+mm+'-'+yyyy;
  
    var vaccineDate = tdate.toLocaleString('en', { month: 'short', day: '2-digit' });
    
    var vacAvailCheck = [];

    if(typeof event !== 'undefined') {

      if(event.target.id == "vacfinder-btn") {
        vacfilterDose = "none";
        vacfilterVaccine = "none";
        vacfilterBlockNow = "none";
        vacfilterAvail = "avail";
      }


      else if(event.target.id == "vacAll" || event.target.id == "vacAvail") {

          let districtDropdown = document.getElementById('district-dropdown');
          let stateDropdown = document.getElementById('state-dropdown');
          const vacdistId = districtDropdown.options[districtDropdown.selectedIndex].value;
          const vacstateId = stateDropdown.options[stateDropdown.selectedIndex].value;
          
          if(!isNaN(vacdistId)) {
            
            document.cookie = "state_id="+vacstateId+"; expires=Wed, 05 Sep 2023 23:00:00 UTC; path=/";
            document.cookie = "district_id="+vacdistId+"; expires=Wed, 05 Sep 2023 23:00:00 UTC; path=/";
  
            districtID = vacdistId;
            stateID = vacstateId
          }

          //console.log(document.cookie);
        
          vacfilterBlockNow = "none"; //resets block filter

          vacfilterAvail = filterAvail;
          event.target.classList.add("active");

          if(vacfilterAvail == "avail") {
            document.querySelector('#vacAll').classList.remove("active");
          }
          else if(vacfilterAvail == "all") {
            document.querySelector('#vacAvail').classList.remove("active");
          }
      }



      else if(event.target.id == filterBlock.replace(/\W+/g, '-').toLowerCase()) {
        if(vacfilterBlockNow != filterBlock) {
          vacfilterBlockNow = filterBlock;
        }
        else {
          vacfilterBlockNow = "none";
        }
      }
      
      
      else if(event.target.id == "dose1-btn" || event.target.id == "dose2-btn") {
        if(vacfilterDose != filterDose) {
          vacfilterDose = filterDose;
          event.target.classList.add("active");

          if(vacfilterDose == "dose1") {
            document.querySelector('#dose2-btn').classList.remove("active");
          }
          else if(vacfilterDose == "dose2") {
            document.querySelector('#dose1-btn').classList.remove("active");
          }
        }
        else {
          vacfilterDose = "none";
          event.target.classList.remove("active");
        }
      }

    
      else if(event.target.id == "covishield-btn" || event.target.id == "covaxin-btn") {
        if(vacfilterVaccine != filterVaccine) {
          vacfilterVaccine = filterVaccine;
          event.target.classList.add("active");
          if(vacfilterVaccine == "covishield") {
            document.querySelector('#covaxin-btn').classList.remove("active");
          }
          else if(vacfilterVaccine == "covaxin"){
            document.querySelector('#covishield-btn').classList.remove("active");
          }
        }
        else {
          vacfilterVaccine = "none";
          event.target.classList.remove("active");
        }
      }
    }  

    
    let vacBlocks = [];
    let blockFilter = document.querySelector('#blockFilters');
    
    fetchData(date, districtID).then(data => {
      
      blockFilter.innerHTML = '';
      vaccinesNearByList.innerHTML = '';
  
      if ( data != 0 && data.sessions.length !== 0) {
        
        if(vacfilterAvail == "avail") {
        var vacsessions = data.sessions.filter(session => session.available_capacity > 0);
        }
        else if(vacfilterAvail == "all") {
          var vacsessions = data.sessions.filter(session => session.available_capacity >= 0);
        }  
        
        if ( typeof event === 'undefined') {
          (async () => {
            var vaccineKeys = [];
            for (var i=0; i < data.sessions.length; i++) {
              vaccineKeys[i] = data.sessions[i].vaccine;
            }
            vaccineKeys = vaccineKeys.filter(function (x, i, a) { return a.indexOf(x) === i; });
            let otherVaccines = vaccineKeys.filter(x => !['COVISHIELD', 'COVAXIN'].includes(x));
            if (otherVaccines.length) {
              let vacfilterBtn = document.getElementById('vacFilter');
              for (var i=0; i < otherVaccines.length; i++) {
                let btn = document.createElement("button");
                btn.classList.add('vacfilter-btn', 'btn', 'btn-light', 'border-secondary', 'btn-sm');
                btn.setAttribute('id', otherVaccines[i]+'-btn');
                btn.setAttribute('onclick', 'vacFinderByDate(event, undefined, undefined, '+otherVaccines[i]+', undefined, undefined)');
                btn.innerHTML = otherVaccines[i][0].toUpperCase() + otherVaccines[i].slice(1).toLowerCase();
                vacfilterBtn.append(btn);
              }
            }  
          })();
        }

        (async () => {
          for (var i=0; i < vacsessions.length; i++) {
            vacBlocks[i] = vacsessions[i].block_name;
          }
          vacBlocks = vacBlocks.filter(function (x, i, a) { return a.indexOf(x) === i; });
          
          for (var i=0; i < vacBlocks.length; i++) {
            blockFilter.innerHTML += `<a href="#" id="${vacBlocks[i].replace(/\W+/g, '-').toLowerCase()}" class="blockfilter-btn" onclick="vacFinderByDate(event, undefined, undefined, undefined, '${vacBlocks[i]}', undefined);">${vacBlocks[i].split(" ")[0]}</a>`;
          }
          
          if( vacfilterBlockNow != "none") {
            let cvacFilter = document.querySelector('#'+vacfilterBlockNow.replace(/\W+/g, '-').toLowerCase()) || 0;
            if(cvacFilter) {
              cvacFilter.classList.add("active");
            }
          }
        })();
        
        
        if(vacfilterBlockNow != "none"){
          vacsessions = vacsessions.filter(session => session.block_name == vacfilterBlockNow);
        }

        if(vacfilterDose == "dose1"){
          vacsessions = vacsessions.filter(session => session.available_capacity_dose1 > 0);
        }

        if(vacfilterDose == "dose2"){
          vacsessions = vacsessions.filter(session => session.available_capacity_dose2 > 0);
          
        }

        if(vacfilterVaccine == "covishield"){
          vacsessions = vacsessions.filter(session => session.vaccine == "COVISHIELD");         
        }

        if(vacfilterVaccine == "covaxin"){
          vacsessions = vacsessions.filter(session => session.vaccine == "COVAXIN");         
        }
        

        for (var i=0; i < vacsessions.length; i++) {
          
          var div = document.createElement("div");
          div.classList.add('col-md-6', 'col-lg-4');          
          div.innerHTML = `
          <div class="card mx-auto mb-4 border-primary bg-light">
                
            <div id="cardBody-${vacsessions[i].session_id}" class="card-body fs-5 row text-center align-items-center mx-auto px-1">
            
              <div class="lead d-flex justify-content-start flex-wrap">  
                <h5 id="center-name" class="card-title fs-4 mb-2 me-3 text-start fw-normal">${vacsessions[i].name}</h5>
                <p id="block-name" class="card-text fs-5 mb-0">[${vacsessions[i].block_name}, ${vacsessions[i].pincode}]</p>
              </div>    
              
              <div class="col-8">      
                
                <div class="doses row mb-3 mt-4 text-center">
                  <div class="col-4 border-end border-primary p-0">
                    <div class="fs-6 mb-3">DOSE 1</div>
                    <div class="fs-5 fw-bold">${vacsessions[i].available_capacity_dose1}</div>
                  </div>
                  <div class="col-4 border-end border-primary p-0">
                    <div class="fs-6 mb-3">DOSE 2</div>
                    <div class="fs-5 fw-bold">${vacsessions[i].available_capacity_dose2}</div>
                  </div>
                  <div class="col-4 p-0">
                    <div class="fs-6 mb-3">COST</div>
                    <div class="fs-5 fw-bold">${vacsessions[i].fee_type}</div>
                  </div>
                  
                </div>
              </div>
              <div class="col-4 text-center border-start border-primary p-0">
                <h5 class="card-title fs-3 mb-3 fw-bold">${vacsessions[i].available_capacity}</h5>
                <p class="card-text fs-7 mb-3 fw-bold">${vacsessions[i].vaccine}</p>
                <h5 class="card-title fs-4 mb-1">${vaccineDate}</h5>
              </div>  
            
              <div class="col-8">
                <a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-outline-success btn-sm fs-6 mt-3 w-100 px-0">Book on CoWin</a>
              </div>
              <div class="col-4">  
                <button id="vacrefresh-btn" type="button" class="btn btn-outline-danger btn-sm fs-6 mt-3 w-100 px-0" onclick="vacRefresh('${vacsessions[i].date}', '${vacsessions[i].session_id}')">Refresh</button>
              </div>
            </div>
          </div>`;
        
          vaccinesNearByList.appendChild(div);

          vacAvailCheck.push(vacsessions[i].session_id);

        } 

  
        if(vacAvailCheck.length === 0) {
          vaccinesNearByList.innerHTML = `
            <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
              Currently, No vaccines available for your query.
            </div>`;
        }
      }

      else if (data != 0 && data.sessions.length === 0) {
        vaccinesNearByList.innerHTML = `
            <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
              Currently, No vaccines available for your query.
            </div>`;
      }

      else {
        vaccinesNearByList.innerHTML = `
          <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
            Something Went Wrong! Please try again later.
          </div>`;
      }
  
    });
  }
  
  
function vacFinder() {

    vacfinderBtn.classList.add("active");
    vacalertBtn.classList.remove("active");
    vactrackerBtn.classList.remove("active");
  
    vaccineBody.innerHTML = '<div class="display-4 text-primary text-center mb-3">Vaccine Finder</div>';
    vaccinesNearByTitle.innerHTML = `
    <div class="d-flex justify-content-center  align-items-center mb-4 flex-wrap w-100 gap-3">

      <div id="vacLocation" class="d-flex flex-wrap fs-5 gap-3">  
        <div class="">
          <select id="state-dropdown" name="state" class="form-select bg-transparent" onchange="onselectState()">
            <option selected="true" disabled>Choose State</option>
          </select>
        </div>
        <div class"">
          <select id="district-dropdown" name="district" class="form-select bg-transparent" onchange="onselectDistrict()">
            <option selected="true" disabled>Choose District</option>
          </select>
        </div>          
      </div>
      <div id="vacbyAvail" class="d-flex justify-content-center gap-3 flex-wrap"> 
        <button id="vacAvail" class="btn btn-outline-success fs-6 btn-sm active" onclick="vacFinderByDate(event, undefined, undefined, undefined, undefined, 'avail')">Available Only</button>
        <button id="vacAll" class="btn btn-outline-primary fs-6 btn-sm" onclick="vacFinderByDate(event, undefined, undefined, undefined, undefined, 'all')">Show All</button>
      </div>
    </div>

      <div id="vacbyDate" class="d-flex justify-content-evenly gap-sm-2 flex-sm-wrap mb-3">
        <button id="today-btn" class="vacfinderbydate-btn fs-6 btn btn-outline-primary btn-sm" onclick="vacFinderByDate(event, '${new Date()}', undefined, undefined, undefined, undefined)">Today</button>
        <button id="tomorrow-btn" class="vacfinderbydate-btn fs-6 btn btn-outline-primary btn-sm" onclick="vacFinderByDate(event, '${new Date(Date.now()+86400000)}', undefined, undefined, undefined, undefined)">Tomorrow</button>
        <button class="vacfinderbydate-btn fs-6 btn btn-outline-primary btn-sm" onclick="vacFinderByDate(event, '${new Date(Date.now()+2*86400000)}', undefined, undefined, undefined, undefined)">${new Date(Date.now()+2*86400000).toLocaleString('en', { month: 'short', day: '2-digit' })}</button>
        <button class="vacfinderbydate-btn fs-6 btn btn-outline-primary btn-sm" onclick="vacFinderByDate(event, '${new Date(Date.now()+3*86400000)}', undefined, undefined, undefined, undefined)">${new Date(Date.now()+3*86400000).toLocaleString('en', { month: 'short', day: '2-digit' })}</button>
      </div>
      <div id="vacFilter" class="d-flex justify-content-evenly gap-sm-2 flex-sm-wrap mb-3">
        <button id="dose1-btn" class="vacfilter-btn btn btn-light border-secondary btn-sm" onclick="vacFinderByDate(event, undefined, 'dose1', undefined, undefined, undefined)">Dose1</button>
        <button id="dose2-btn" class="vacfilter-btn btn btn-light border-secondary btn-sm" onclick="vacFinderByDate(event, undefined, 'dose2', undefined, undefined, undefined)">Dose2</button>
        <button id="covishield-btn" class="vacfilter-btn btn btn-light border-secondary btn-sm" onclick="vacFinderByDate(event, undefined, undefined, 'covishield', undefined, undefined)">Covishield</button>
        <button id="covaxin-btn" class="vacfilter-btn btn btn-light border-secondary btn-sm" onclick="vacFinderByDate(event, undefined, undefined, 'covaxin', undefined, undefined)">Covaxin</button>
      </div>
      <div id="blockFilters" class="d-flex justify-content-evenly gap-1 flex-wrap fs-5 mt-2 w-100"></div>
      `;
    
    let stateDropdown = document.getElementById('state-dropdown');
    //stateDropdown.length = 0;
    const statesUrl = '/assets/js/states.json';
    fetch(statesUrl).then(function(response) { response.json().then(function(data) {  
          let option;
          for (let i = 0; i < data.states.length; i++) {
            option = document.createElement('option');
            option.text = data.states[i].state_name;
            option.value = data.states[i].state_id;
            stateDropdown.add(option);
          }

          stateDropdown.value = stateID;
          //onselectState(stateID);  
        });  
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });
    
    onselectState(stateID);

    
    var todayBtn = document.querySelector('#today-btn');
    var tomorrowBtn = document.querySelector('#tomorrow-btn');
    
    new Date().getHours() < 18 ? todayBtn.classList.add("active") : tomorrowBtn.classList.add("active");
    
    document.querySelectorAll('.vacfinderbydate-btn').forEach(item => {
      item.addEventListener('click', event => {
        document.querySelector('.vacfinderbydate-btn.active').classList.remove("active");
        event.target.classList.add("active");     
      })
    });
    
    new Date().getHours() < 18 ? vacFinderByDate(undefined, new Date(), undefined, undefined, undefined, undefined) : vacFinderByDate(undefined, new Date(Date.now()+86400000), undefined, undefined, undefined, undefined);
       
  }



function onselectState(tempStateID = 34) {

  let districtDropdown = document.getElementById('district-dropdown');
  districtDropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Choose District';
  defaultOption.disabled = true;
  districtDropdown.add(defaultOption);
  districtDropdown.selectedIndex = 0;

  if(typeof event !== 'undefined' && event.type === 'change' && event.target.id == 'state-dropdown') {
      tempStateID = event.target.value;
  }

  const districtUrl = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+tempStateID;

    fetch(districtUrl).then(function(response) { response.json().then(function(data) {  
      let option;
      for (let i = 0; i < data.districts.length; i++) {
        option = document.createElement('option');
        option.text = data.districts[i].district_name;
        option.value = data.districts[i].district_id;
        districtDropdown.add(option);
      }
      if(typeof event === 'undefined' || event.type !== 'onchange') {
        districtDropdown.value = districtID;
      }   
        });  
      })  
    .catch(function(err) {  
      console.error('Fetch Error -', err);  
    });
}


function onselectDistrict() {

  document.getElementById('vacAvail').classList.remove("active");
    
}
