function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
    
}

function loadCatagories() {
  // fetch the data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    // convert promise to json
    .then((response) => response.json())
    // send data to display
    .then((data) => displayCatagories(data.categories));
}

function loadVideos(s="") {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${s}`)
    .then((response) => response.json())
    .then((data) => {
        removeActiveClass();
        document.getElementById("btn-all").classList.add("active")
        displayVideos(data.videos)
    });
}

function loadVideoDetails(videoId){
    // console.log(videoId);
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    fetch(url)
    .then((response) => response.json())
    .then((data) => displayVideoDetails(data.video));
    
}

function loadCatagoryVideos(id){
    
    const url =`
    https://openapi.programming-hero.com/api/phero-tube/category/${id}
    `
    console.log(url);
    
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        removeActiveClass();
        const clickedButton = document.getElementById(`btn-${id}`);
        clickedButton.classList.add("active")
        
        displayVideos(data.category)
    });
    
}

function displayCatagories(catagories) {
  // get the container
  const categoryContainer = document.getElementById("catagory-container");
  // loop operation
  for (let cat of catagories) {
    // console.log(cat);
    // create element
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
        <button id="btn-${cat.category_id}" onclick="loadCatagoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
        `;
    // append the element
    categoryContainer.appendChild(categoryDiv);
  }
}

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");

  videoContainer.innerHTML ="";

  if(videos.length ===0){
    videoContainer.innerHTML=`
        <div class="col-span-full flex flex-col justify-center items-center text-center">
            <img src="Assets/Icon.png" alt="">
            <h1 class="text-2xl font-bold">Oops!! Sorry, There is no content here</h1>
        </div>
    `
    return;
  }
  videos.forEach((video) => {
    // console.log(video);

    // element create
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
        <div class="card bg-base-100">
            <figure class="relative">
                <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" alt="Shoes" />
                <span class="absolute bottom-2 right-2 text-white bg-black px-2 rounded text-sm">3hrs 56 min ago</span>
            </figure>
            <div class="flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                          <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro flex flex-col gap-2">
                    <h2 class="text-sm font-semibold">${video.title}</h2>
                    <p class="text-sm text-gray-400 flex gap-1">${video.authors[0].profile_name} ${video.authors[0].verified == true ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png" alt="">` :``}</p>
                    <p class="text-sm text-gray-400">${video.others.views} views</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Show details</button>
        </div>
        `;
    // append the element
    videoContainer.appendChild(videoCard);
  });
};

const displayVideoDetails = (video) => {
  console.log(video);
  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
    <div class="card bg-base-100 image-full object-cover shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="thumbnail" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title} </h2>
    <p>${video.description}</p>
    <p>Authors: ${video.authors[0].profile_name}</p>
    
  </div>
</div>
  `
}

document.getElementById("search-input").addEventListener("keyup", function(event){
  const searchValue = event.target.value;
  loadVideos(searchValue)
})

loadCatagories();
loadVideos();
