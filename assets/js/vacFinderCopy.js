function vacFinderByDate(date) {

    vaccinesNearByList.innerHTML = vacLoadingGif;
    
    var tdate = new Date(date);
    const [dd, mm, yyyy] = [tdate.getDate(), tdate.getMonth()+1, tdate.getFullYear()];
    var date = dd+'-'+mm+'-'+yyyy;
  
    var vaccineDate = tdate.toLocaleString('en', { month: 'short', day: '2-digit' });
    
    var vacAvailCheck = [];
  
    fetchData(date).then(data => {
      
      vaccinesNearByList.innerHTML = '';
  
      if ( data != 0) {
  
        for (var i=0; i < data.sessions.length; i++) {
  
          if(data.sessions[i].available_capacity > 0) {
            
            var div = document.createElement("div");
            div.classList.add('col-md-6', 'col-lg-4');
  
            div.innerHTML = `
            <div class="card bg-light border-primary mx-auto mb-4">
                  
              <div id="cardBody-${data.sessions[i].session_id}" class="card-body fs-5 row text-center align-items-center">
              
                <div class="lead d-flex justify-content-start flex-wrap">  
                  <h5 id="center-name" class="card-title fs-4 mb-2 me-3 text-start">${data.sessions[i].name}</h5>
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
                  <button id="vacrefresh-btn" type="button" class="btn btn-outline-danger btn-sm fs-4 mt-3 w-100 p-0" onclick="vacRefresh('${data.sessions[i].date}', '${data.sessions[i].session_id}')">Refresh</button>
                </div>
              </div>
            </div>`;
          
            vaccinesNearByList.appendChild(div);
  
            vacAvailCheck.push(data.sessions[i].session_id);
  
          }        
        }
  
        if(vacAvailCheck.length === 0) {
          vaccinesNearByList.innerHTML = `
            <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
              Currently, No Vaccination Center found with available vaccine in Maharajganj for selected day.
            </div>`;
        }
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
  
    vaccineBody.innerHTML = '<div class="display-4 text-center mb-3">Vaccine Finder</div>';
    vaccinesNearByTitle.innerHTML = `
      <div class="d-flex justify-content-evenly gap-sm-2 flex-sm-wrap mb-3">
        <button id="today-btn" class="vacfinderbydate-btn fs-5 btn btn-outline-primary btn-sm" onclick="vacFinderByDate('${new Date()}')">Today</button>
        <button id="tomorrow-btn" class="vacfinderbydate-btn fs-5 btn btn-outline-primary btn-sm" onclick="vacFinderByDate('${new Date(Date.now()+86400000)}')">Tomorrow</button>
        <button class="vacfinderbydate-btn fs-5 btn btn-outline-primary btn-sm" onclick="vacFinderByDate('${new Date(Date.now()+2*86400000)}')">${new Date(Date.now()+2*86400000).toLocaleString('en', { month: 'short', day: '2-digit' })}</button>
        <button class="vacfinderbydate-btn fs-5 btn btn-outline-primary btn-sm" onclick="vacFinderByDate('${new Date(Date.now()+3*86400000)}')">${new Date(Date.now()+3*86400000).toLocaleString('en', { month: 'short', day: '2-digit' })}</button>
      </div>
      <div class="d-flex justify-content-evenly gap-sm-2 flex-sm-wrap mb-3">
        <button id="dose1-btn" class="vacfilter-btn fs-5 btn btn-outline-secondary btn-sm">Dose1</button>
        <button id="dose2-btn" class="vacfilter-btn fs-5 btn btn-outline-secondary btn-sm">Dose2</button>
        <button id="covishield-btn" class="vacfilter-btn fs-5 btn btn-outline-secondary btn-sm">Covishield</button>
        <button id="covaxin-btn" class="vacfilter-btn fs-5 btn btn-outline-secondary btn-sm">Covaxin</button>
      </div>`;
    
    var todayBtn = document.querySelector('#today-btn');
    var tomorrowBtn = document.querySelector('#tomorrow-btn');
  
    new Date().getHours() < 18 ? todayBtn.classList.add("active") : tomorrowBtn.classList.add("active");
    
    document.querySelectorAll('.vacfinderbydate-btn').forEach(item => {
      item.addEventListener('click', event => {
        document.querySelector('.vacfinderbydate-btn.active').classList.remove("active");
        event.target.classList.add("active");     
      })
    });
    
    new Date().getHours() < 18 ? vacFinderByDate(new Date()) : vacFinderByDate(new Date(Date.now()+86400000));
       
  }