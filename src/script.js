console.log("afdfsdfdsf");

let currentAudio = null; // Variable to store the currently playing audio
let currentSongIndex = 0; // Variable to store the index of the currently playing song
let isPlaying = false; // Variable to store the current playing state

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSongs();
  console.log(songs);

  let songsContainer = document.getElementById("songlists");
  let skipButton = document.getElementById("skip");
  let prevButton = document.getElementById("prev");
  let pauseButton = document.getElementById("pause"); // Add pause button element in HTML

  // Iterate through the songs array and create elements for each song
  songs.forEach((songURL, index) => {
    // Extract the filename from the URL
    let fileName = decodeURIComponent(songURL.split("/").pop());

    // Clean up the filename by replacing '%20' with spaces
    fileName = fileName.replace(/%20/g, ' ');

    // Create the song div
    let songDiv = document.createElement("div");
    songDiv.className = "song flex items-center justify-start gap-4 bg-[#121212] p-4 rounded-md";

    let musicIcon = document.createElement("i");
    musicIcon.className = "ri-music-2-fill text-3xl";
    songDiv.appendChild(musicIcon);

    // Create the div for the song name
    let songNameDiv = document.createElement("div");
    let h2 = document.createElement("h2");
    h2.textContent = fileName;
    songNameDiv.appendChild(h2);

    songDiv.appendChild(songNameDiv);
    songsContainer.appendChild(songDiv);

    // Attach a click event listener to play the respective song
    songDiv.addEventListener("click", () => {
      playSong(index);
    });
  });

  // Skip button functionality
  skipButton.addEventListener("click", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      playSong(currentSongIndex);
    }
  });

  // Previous button functionality
  prevButton.addEventListener("click", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      playSong(currentSongIndex);
    }
  });

  // Pause button functionality
  pauseButton.addEventListener("click", () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
      } else {
        currentAudio.play();
        isPlaying = true;
      }
    }
  });

  function playSong(index) {
    // Stop the currently playing audio if exists
    if (currentAudio) {
      currentAudio.pause();
    }

    // Play the selected audio
    let audio = new Audio(songs[index]);
    audio.play();
    currentAudio = audio;
    currentSongIndex = index;
    isPlaying = true;
  }
}

// Call the main function
main();
