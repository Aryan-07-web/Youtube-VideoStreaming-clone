// for the dark mode feature in youtube
let darkMode = 0;
function switchMode(){
  darkMode = (darkMode+1)%2;  // for switching between 0 and 1
  if(darkMode){
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';
  }else{
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
  }
}
let currentPage = 1; // Start at page 1
const limit = 8; // Number of videos to load per page
// Initial load
fetchVideos(currentPage).then(renderVideos);


// assumption is that the (no. of videos in videos.JSON % limit = 0)
// Function to fetch videos
async function fetchVideos(page) {
    // Fetch JSON data from the file
    const response = await fetch('./videos.JSON');
    const allVideos = await response.json();

    // Paginate the data
    const startIndex = (page - 1) * limit;
    const videos = allVideos.slice(startIndex, startIndex + limit);
    return videos;
}

// Function to render videos
function renderVideos(videos) {
  const container = document.getElementById('video-container');
  videos.forEach(video => {
    const video_container = document.createElement('div'); // for each video
    video_container.classList.add('video-container');
    const iframe = document.createElement('iframe'); 
    const video_info = document.createElement('div'); // for each video
    video_info.classList.add('video-info');
    const video_title = document.createElement('h5'); // for each video
    video_title.classList.add('video-info-element');
    const video_id = document.createElement('p'); // for each video
    video_id.classList.add('video-info-element');
    // like and subscribe button
    const like_btn = document.createElement('button');
    like_btn.classList.add('like-btn-class');

    const subscribe_btn = document.createElement('button');
    subscribe_btn.classList.add('subscribe-btn-class');

    video_title.innerText = video.title;
    video_id.innerText = video.id;
    iframe.src = video.url;
    iframe.title = video.title;
    iframe.width = "320";
    iframe.height = "230";
    iframe.allow = "autoplay; encrypted-media";
    iframe.style.margin = "10px"; 
    iframe.style.borderRadius = "10px"; 

    iframe.addEventListener('click', () => {
      // add to history videos
      HistoryVideos.push({
        url: iframe.src,
      });
    });
    video_container.appendChild(iframe);
    video_container.appendChild(video_info); // setting the 2nd div as the child of the first
    // add the required elements to the video_info div  
    video_info.appendChild(video_title);
    video_info.appendChild(video_id);
    video_info.appendChild(like_btn);
    video_info.appendChild(subscribe_btn);

    container.appendChild(video_container);
  });
}

// Handle infinite scrolling
document.addEventListener('click', async () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        // Fetch and render next page
        const videos = await fetchVideos(++currentPage);
        
        if (videos.length > 0) {
            console.log("Loading videos");
            renderVideos(videos);
        } 
        else {
            console.log("All videos have been loaded");
        }
    }
    console.log("not triggered");
});



// user button functionality
// first we will create an object to store the users who have signed in with their email as key and password,name as value associated with it
let SignedIn = false;
let userEmail = '';
let userPassword = '';
let UserData = JSON.parse(localStorage.getItem('UserData') || '{}'); // Fixed initialization

function SignedInOrNot() {
  userEmail = prompt("Enter your email: ");
  userPassword = prompt("Enter your password: ");
  let userName = userEmail.split('@')[0]; // to extract the username

  if (UserData[userEmail]) {
    // Check if the entered password matches
    if (UserData[userEmail][0] === userPassword) {
      alert(`Welcome back, ${UserData[userEmail][1]}!`);
      SignedIn = true;
    } 
    else {
      alert("Incorrect password. Please try again.");
    }
  } 
  else {
    // If user not found, sign them up
    let shouldSignUp = confirm("User not found. Do you want to sign up?");
    if (shouldSignUp) {
      SignIn(userEmail, userPassword, userName);
    }
  }
}

function SignIn(userEmail, userPassword, userName) {
  UserData[userEmail] = [userPassword, userName];
  localStorage.setItem('UserData', JSON.stringify(UserData));
  alert("You have successfully signed up and signed in!");
  SignedIn = true;
}

function findImage(firstLetter){
  let image_link = '';
  if(firstLetter === 'a' || firstLetter === 'A'){
    image_link = 'Assets/a.png';
  }
  else if(firstLetter === 'b' || firstLetter === 'B'){
    image_link = 'Assets/b.png';
  }
  else if(firstLetter === 'c' || firstLetter === 'C'){
    image_link = 'Assets/c.png';
  }
  else{
    image_link = 'Assets/d.png';
  }
  return image_link;
}

// when the you button is clicked
function ClickedOnYou(){
  if(SignedIn == false){
    alert("You are not signed in. Please sign in first.");
    return;
  }
  // empty current page create new page
  const VideoContainer = document.querySelector('#video-container');
  VideoContainer.innerHTML = '';

  // a user channel info div
  const userChannel = document.createElement('div');
  userChannel.classList.add('user-channel');
  const userImage = document.createElement('img');
  userImage.classList.add('user-image');
  userImage.src = findImage(UserData[userEmail][1][0]);
  const userName = document.createElement('h1');
  userName.classList.add('user-name');
  userName.innerHTML = `${UserData[userEmail][1]}`;
  const userEmailElement = document.createElement('h2');
  userEmailElement.classList.add('user-email');
  userEmailElement.innerText = `You are logged in as ${userEmail}`;
  const accountId = document.createElement('h4');
  accountId.classList.add('account-id');
  accountId.innerText = `Account ID: ${userEmail}`;
  const accountCreateDate = document.createElement('h4');
  accountCreateDate.classList.add('account-date');
  accountCreateDate.innerText = `Recently accessed on : ${new Date().toDateString()}`;
  // set the child elements
  userChannel.appendChild(userImage);
  userChannel.appendChild(userName);
  userChannel.appendChild(userEmailElement);
  userChannel.appendChild(accountId);
  userChannel.appendChild(accountCreateDate);

  // history div
  const userHistory = document.createElement('div');
  userHistory.classList.add('user-history');
  const historyHeading = document.createElement('h2');
  historyHeading.classList.add('history-heading');
  historyHeading.innerText = 'History';
  userHistory.appendChild(historyHeading); 
  // add the watched videos to this tab
  const watchedVideos = findHistory(); // array of watched videos
  console.log(watchedVideos);
  watchedVideos.forEach(watchedVideo => {
    let videoLink = document.createElement('h2');
    videoLink.classList.add('watched-videos-link');
    videoLink.innerText = watchedVideo.url; // add url of that video
    userHistory.appendChild(videoLink); // add 1 by 1
  });

  // playlists div
  const userPLaylists = document.createElement('div');
  userPLaylists.classList.add('user-playlists');
  const playlistHistory = document.createElement('h2');
  playlistHistory.classList.add('playlist-heading');
  playlistHistory.innerText = 'Playlists';
  userPLaylists.appendChild(playlistHistory);

  // liked videos div
  const likedVideos = document.createElement('div');
  likedVideos.classList.add('liked-videos');
  const likedVideosHeading = document.createElement('h2');
  likedVideosHeading.classList.add('liked-videos-heading');
  likedVideosHeading.innerText = 'Liked Videos';
  likedVideos.appendChild(likedVideosHeading);

  VideoContainer.appendChild(userChannel);
  VideoContainer.appendChild(userHistory);
  VideoContainer.appendChild(userPLaylists);
  VideoContainer.appendChild(likedVideos);  
}
let HistoryVideos = []; // an array of all the watched videos

// // set an event listener to the window
// window.addEventListener('click', (event) => {
//   if(event.target.tagName === 'iframe'){
//     // add to history videos
//     HistoryVideos.push({
//       url: event.target.src,
//     });
//   }
// });

function findHistory(){
  return HistoryVideos;
}

// odd -> open
// even -> close
let NoOfTimesNotificationClicked = 0;

function NotificationClicked() {
  NoOfTimesNotificationClicked++;
  const video_container = document.querySelector('#video-container');
  let NotificationSection = document.querySelector('.notification-section');

  if (NoOfTimesNotificationClicked % 2 !== 0) {
    if (!NotificationSection) {
      NotificationSection = document.createElement('div');
      NotificationSection.classList.add('notification-section');
      const NotificationHeading = document.createElement('h2');
      NotificationHeading.innerText = 'Notifications';
      NotificationHeading.classList.add('notification-heading');
      NotificationSection.appendChild(NotificationHeading);
      video_container.insertBefore(NotificationSection, video_container.firstChild);
    }
    NotificationSection.style.display = 'block';
  }
  else {
    if (NotificationSection) {
      NotificationSection.style.display = 'none';
    }
  }
}

// when the home button is clicked
function BackToHome(){
  const VideoContainer = document.querySelector('#video-container');
  VideoContainer.innerHTML = '';
  curr_Page = 1;
  fetchVideos(curr_Page).then(renderVideos);
  console.log("Back to home");
}

NoOfTimesSearchClicked = 0;
function SearchTheContent(){
  NoOfTimesSearchClicked++; // increment the counter
  // take out the value form the search bar
  const SearchValue = document.querySelector('#search-bar').value;
  console.log(SearchValue);
  const  VideoContainer = document.querySelector('#video-container');
  // even -> close
  if(NoOfTimesSearchClicked % 2 == 0){
    VideoContainer.display = 'block';
    console.log(NoOfTimesSearchClicked);
    return;
  }
  else{
    // odd -> open
    VideoContainer.display = 'none';
    console.log(NoOfTimesSearchClicked);
  }
}