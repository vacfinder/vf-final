function vacAlerts() {

    vacalertBtn.classList.add("active");
    vacfinderBtn.classList.remove("active");
    vactrackerBtn.classList.remove("active");
  
    vaccinesNearByTitle.innerHTML = '';
    vaccinesNearByList.innerHTML = '';
    
    vaccineBody.innerHTML = `
      <div class="px-0 pb-5 text-center">
        <div class="d-flex justify-content-center align-items-center mb-4 flex-wrap gap-2">
          <img class="" style="max-width:100px; max-height:100px;" src="/assets/images/vaccine-alerts-maharajganj.jpg" alt="Vaccine Alerts Maharajganj">
          <div class="mb-2 text-start">
            <h1 class="fs-4 mb-2">Vaccine Alerts Maharajganj</h1>
            <a href="https://telegram.me/vaccine_alerts_maharajganj" class="text-decoration-none" title="Vaccine Alerts Maharajganj">@vaccine_alerts_maharajganj</a>
          </div>  
        </div>
        <div class="px-2 mx-auto lh-base">
          <p class="lead mb-4">Covid-19 Vaccine Slot availability tracker and notifier for Maharajganj. <br>Get instant notifications for new vaccine slot openings in Maharajganj and stay ahead at booking your vaccines. </p>
          
          <p class="lead mb-4"> Share with people around you to spread awareness and get them vaccinated. </p>
          
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="https://telegram.me/vaccine_alerts_maharajganj" target="_blank" type="button" class="btn btn-primary btn-lg px-4 gap-3 fs-4" title="Join Vaccine Alerts Maharajganj">Join Channel</a>
            <button type="button" class="btn btn-outline-secondary btn-lg px-4" onclick="initCheck()">Close</button>
          </div>
        </div>
      </div>
    `;
  }