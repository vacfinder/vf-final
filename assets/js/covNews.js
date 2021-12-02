let navHome = document.querySelector('#nav-home-tab-pane');
let navProfile = document.querySelector('#nav-profile-tab-pane');
let navContact = document.querySelector('#nav-contact-tab-pane');

let vacLoadingGif = '<img class="col-4 d-block mx-auto mt-5 p-0" style="width:200px; height:200px;" src="assets/images/vaccine-loader.gif" alt="Vaccine Loader"></img>';

async function fetchData(url) {
    
    const response = await fetch(url);
      
      if(response.status === 200) {
        return response.json();  
      }
      else {
        return 0;
      }
}

function covNews(tabId) {

    let tabPane = document.getElementById(tabId+'-pane');

    switch(tabId) {
      case "nav-home-tab": url = 'https://pipra.today/news_covid_json.php?news_type=inhi';
      //case "nav-home-tab": url = 'https://gnews.io/api/v4/search?token=40e97e6d8bd8dc8d6036068635719942&q=covid&country=in';
        navHome.classList.remove('d-none');
        navProfile.classList.add('d-none');
        navContact.classList.add('d-none');
        break;
      case "nav-profile-tab": url = 'https://pipra.today/news_covid_json.php?news_type=inen';
        navProfile.classList.remove('d-none');
        navHome.classList.add('d-none');
        navContact.classList.add('d-none');
        break;
      default: url = 'https://pipra.today/news_covid_json.php?news_type=int';
        navContact.classList.remove('d-none');
        navHome.classList.add('d-none');
        navProfile.classList.add('d-none');
    }

    if(tabPane.innerHTML !== ""){
      return;
    }

    tabPane.innerHTML = vacLoadingGif;
    fetchData(url).then(data => {
    
        if ( data != 0) {

          if ( data.totalArticles != 0 ) {

            tabPane.innerHTML = '';

            for (var i=0; i < data.articles.length; i++) {
                
                var div = document.createElement("div");
                div.classList.add('col-md-6', 'col-lg-5');          
                div.innerHTML = `
                <div class="card mx-auto mb-4 border-primary bg-light">

                  <div class="card-header p-3 lh-base">
                    <a href="${data.articles[i].url}" class="text-decoration-none" target="_blank"><h5 class="text-primary">${data.articles[i].title}</h5></a>
                    <h6 class="text-secondary small mt-1">${data.articles[i].source.name} &nbsp; ${new Date(data.articles[i].publishedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} &nbsp; </h6>
                  </div>
                    
                  <div class="card-body px-3 mx-auto">

                    <img src="${data.articles[i].urlToImage !== null ? data.articles[i].urlToImage : noThumbnail(data.articles[i].source.name)}" class="img-fluid mx-auto d-block" alt="...">
                    <p class="small text-success lh-base mt-3">
                      ${data.articles[i].description !== null ? data.articles[i].description : "No Description."} <!-- <br> &nbsp; <span style="position:absolute; right:25px;"> -- <a href="${data.articles[i].url}" target="_blank">Read More</a></span> -->                  
                    </p>
                  </div>

                </div>`;
            
                tabPane.appendChild(div);
    
            }
          }


          else if (data.totalResults == 0) {
            tabPane.innerHTML = `
              <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
                No News headlines for today. Come again later. Thankyou!
              </div>`;
          }

          else if (data.status == "error") {
            tabPane.innerHTML = `
              <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
                ${data.code} <br>${data.message}
              </div>`;
          }


        }
        else {
          tabPane.innerHTML = `
            <div class="lead fs-4 text-center border border-danger p-3 lh-base col-11">
              Something Went Wrong! Please try again later.
            </div>`;
        }
    
      });

}

covNews('nav-home-tab');



function noThumbnail(sourceName) {
  switch(sourceName) {
    case "Freerepublic.com":
      return "https://i.ibb.co/YyGxvHW/Free-Republic-logo.jpg";

    default:
      return "https://i.ibb.co/2dChQ9H/nothumb.jpg";
  }
}
