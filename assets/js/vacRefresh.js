function vacRefresh(date, sessionid) {
  
    var vacrefreshcardBody = document.querySelector('#cardBody-'+sessionid);
    vacrefreshcardBody.innerHTML = vacLoadingGif;
    
    var vacrefreshAvailCheck =[];
    
    fetchData(date, districtID).then(data => {
  
      if ( data != 0 && data.sessions.length !== 0) {
  
        var dateParts = date.split("-");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        var vaccineDate = dateObject.toLocaleString('en', { month: 'short', day: '2-digit' });
  
        for (var i=0; i < data.sessions.length; i++) {
          
          if(data.sessions[i].session_id == sessionid) {
              
            vacrefreshcardBody.innerHTML = `
                <div class="lead d-flex justify-content-start flex-wrap">  
                  <h5 id="center-name" class="card-title fs-4 mb-2 me-3 text-start fw-normal">${data.sessions[i].name}</h5>
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
                  <a href="https://selfregistration.cowin.gov.in/" target="_blank" class="btn btn-outline-success btn-sm fs-6 mt-3 w-100 px-0">Book on CoWin</a>
                </div>
                <div class="col-4">  
                <button id="vacrefresh-btn" type="button" class="btn btn-outline-danger btn-sm fs-6 mt-3 w-100 px-0" onclick="vacRefresh('${data.sessions[i].date}', '${data.sessions[i].session_id}')">Refresh</button>
                </div>`;
  
            vacrefreshAvailCheck.push(data.sessions[i].session_id);
  
          }
  
              
        }
        
        if(vacrefreshAvailCheck.length === 0) {
          vacrefreshcardBody.innerHTML = `
            <div class="lead fs-4 text-center pt-0 pb-3 lh-base">
              This Vaccination Session is not active any more.
            </div>`;        
        }
      
      }

      else if (data != 0 && data.sessions.length === 0) {
        vacrefreshcardBody.innerHTML = `
            <div class="lead fs-4 text-center pt-0 pb-3 lh-base">
              This Vaccination Session is not active any more.
            </div>`;
      }
      else {
        vacrefreshcardBody.innerHTML = `
        <div class="lead fs-4 text-center pt-0 pb-3 lh-base">
          Something Went Wrong! Please try again later.
        </div>`;  
      }  
    });
  }