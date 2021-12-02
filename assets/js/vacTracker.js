function vacTracker(date, sessionid, pin) {

    vaccineBody.innerHTML = `
      <div class="card bg-light border-danger col-md-10 col-lg-8 mx-auto">
        <h5 class="card-header text-center display-4 p-3">Vaccine Tracker</h5>      
        <div id="vactrackercardBody" class="card-body fs-5 row text-center align-items-center mx-auto px-1"></div>
      </div>`;
    
    vactrackerBtn.classList.add("active");
    vacfinderBtn.classList.remove("active");
    vacalertBtn.classList.remove("active");
  
    vaccinesNearByTitle.innerHTML = 'Vaccines Nearby';
    vaccinesNearByList.innerHTML = '';
    
    var nearbyvacAvailCheck = [];
  
  
  
    var vactrackercardBody = document.querySelector('#vactrackercardBody');
    vactrackercardBody.innerHTML = vacLoadingGif;
    
    var vactrackerAvailCheck =[];
    
    fetchData(date, districtID).then(data => {
  
      if ( data != 0 ) {
  
        var dateParts = date.split("-");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        var vaccineDate = dateObject.toLocaleString('en', { month: 'short', day: '2-digit' });
  
        for (var i=0; i < data.sessions.length; i++) {
          
          if(data.sessions[i].session_id == sessionid) {
              
            vactrackercardBody.innerHTML = `
                <div class="lead d-flex justify-content-start flex-wrap">  
                  <h5 id="center-name" class="card-title fs-4 mb-2 ms-md-4 me-3 text-start fw-normal">${data.sessions[i].name}</h5>
                  <p id="block-name" class="card-text fs-5 mb-0">[${data.sessions[i].block_name}, ${data.sessions[i].pincode}]</p>
                </div>    
                
                <div class="col-8">      
                  
                  <div class="doses row mb-3 mt-4 text-center">
                    <div class="col-4 border-end border-primary p-0">
                      <div class="fs-6 mb-3">DOSE 1</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].available_capacity_dose1}</div>
                    </div>
                    <div class="col-4 border-end border-primary p-0">
                      <div class="fs-6 mb-3">DOSE 2</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].available_capacity_dose2}</div>
                    </div>
                    <div class="col-4 p-0">
                      <div class="fs-6 mb-3">COST</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].fee_type}</div>
                    </div>
                    
                  </div>
                </div>
                <div class="col-4 text-center border-start border-primary p-0">
                  <h5 class="card-title fs-3 mb-3 fw-bold">${data.sessions[i].available_capacity}</h5>
                  <p class="card-text fs-7 mb-3 fw-bold">${data.sessions[i].vaccine}</p>
                  <h5 class="card-title fs-4 mb-1">${vaccineDate}</h5>
                </div>  
                <div class="col-8">
                  <a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-outline-success btn-sm fs-4 mt-3 w-100 p-0">Book on CoWin</a>
                </div>
                <div class="col-4">  
                  <button id="vactracker-refresh-btn" type="button" class="btn btn-outline-danger btn-sm fs-4 mt-3 w-100 p-0" onclick="initCheck()">Refresh</button>
                </div>`;  
  
            vactrackerAvailCheck.push(data.sessions[i].session_id);
  
          }
  
          if(data.sessions[i].pincode == pin && data.sessions[i].available_capacity > 0 && data.sessions[i].session_id != sessionid) {
            
            var div = document.createElement("div");
            div.classList.add('col-md-6', 'col-lg-4');
            
            div.innerHTML = `
            <div class="card bg-light border-primary mx-auto mb-4">
                  
              <div id="cardBody" class="card-body fs-5 row text-center align-items-center">
              
                <div class="lead d-flex justify-content-start flex-wrap">  
                  <h5 id="center" class="card-title fs-4 mb-2 me-3 text-start fw-normal">${data.sessions[i].name}</h5>
                  <p id="block" class="card-text fs-5 mb-0">[${data.sessions[i].block_name}, ${data.sessions[i].pincode}]</p>
                </div>    
                
                <div class="col-8">      
                  <div class="doses row mb-3 mt-4 text-center">
                    <div class="col-4 border-end border-primary p-0">
                      <div class="fs-6 mb-3">DOSE 1</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].available_capacity_dose1}</div>
                    </div>
                    <div class="col-4 border-end border-primary p-0">
                      <div class="fs-6 mb-3">DOSE 2</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].available_capacity_dose2}</div>
                    </div>
                    <div class="col-4 p-0">
                      <div class="fs-6 mb-3">COST</div>
                      <div class="fs-5 fw-bold">${data.sessions[i].fee_type}</div>
                    </div>
                  </div>
                </div>
  
                <div class="col-4 text-center border-start border-primary p-0">
                  <h5 class="card-title fs-3 mb-3 fw-bold">${data.sessions[i].available_capacity}</h5>
                  <p class="card-text fs-7 mb-3 fw-bold">${data.sessions[i].vaccine}</p>
                  <h5 class="card-title fs-4 mb-1">${vaccineDate}</h5>
                </div>  
              
                <a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-outline-success mt-3 fs-4 col-10 mx-auto px-2 btn-sm">Book on CoWin</a>
              </div>
            </div>`;
            
            vaccinesNearByList.appendChild(div);
  
            nearbyvacAvailCheck.push(data.sessions[i].session_id);
  
          }    
        }
        
        if(vactrackerAvailCheck.length === 0) {
          vactrackercardBody.innerHTML = `
            <div class="lead fs-4 text-center pt-0 pb-3 lh-base">
              This Vaccination Session is not active any more.
            </div>`;        
        }
  
        if(nearbyvacAvailCheck.length === 0) {
          vaccinesNearByList.innerHTML = `
            <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
              Currently, there are no vaccination centers nearby, with Vaccines available.
            </div>`;
        }
      
      }
      else {
        vactrackercardBody.innerHTML = `
        <div class="lead fs-4 text-center pt-0 pb-3 lh-base">
          Something Went Wrong! Please try again later.
        </div>`;
  
        vaccinesNearByList.innerHTML = `
        <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
          Something Went Wrong! Please try again later.
        </div>`;  
      }  
    });    
  }