console.log("afdfsdfdsf");

let currentAudio = null; // Variable to store the currently playing audio
let currentSongIndex = 0; // Variable to store the index of the currently playing song
let isPlaying = false; // Variable to store the current playing state
let isShuffle = false; // Variable to store the shuffle state
let isRepeat = false; // Variable to store the repeat state

// IDs for HTML elements
const timerId = "timer";
const trackNameId = "trackName";

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
  let timer = document.getElementById("timer");
  let seeker = document.getElementById("seeker");
  let skipButton = document.getElementById("skip");
  let prevButton = document.getElementById("prev");
  let pauseButton = document.getElementById("pause");
  let shuffleButton = document.getElementById("shuffle");
  let repeatButton = document.getElementById("repeat");

  // Function to toggle the color of the shuffle button
  function toggleShuffleColor() {
    shuffleButton.classList.toggle("text-green-500", isShuffle);
    shuffleButton.classList.toggle("text-white", !isShuffle);
  }

  // Function to toggle the color of the repeat button
  function toggleRepeatColor() {
    repeatButton.classList.toggle("text-green-500", isRepeat);
    repeatButton.classList.toggle("text-white", !isRepeat);
  }

  // Function to toggle the color of the pause button
  function togglePauseColor() {
    pauseButton.classList.toggle("text-green-500", isPlaying);
    pauseButton.classList.toggle("text-white", !isPlaying);
  }

  // Function to update the track name, timer, and seeker
  function updateTrackInfo(trackName, currentTime, totalTime) {
    document.getElementById(trackNameId).textContent = trackName;
    timer.textContent = `${currentTime} ${totalTime}`;
    seeker.max = Math.floor(currentAudio.duration); // Set the max value for the seeker
  }

  // Iterate through the songs array and create elements for each song
  songs.forEach((songURL, index) => {
    // Extract the filename from the URL
    let fileName = decodeURIComponent(songURL.split("/").pop());

    // Clean up the filename by replacing '%20' with spaces
    fileName = fileName.replace(/%20/g, " ");

    // Create the song div
    let songDiv = document.createElement("div");
    songDiv.className =
      "song flex items-center justify-start gap-4 bg-[#121212] p-4 rounded-md";

    let musicIcon = document.createElement("i");
    musicIcon.className = "ri-music-2-fill text-3xl";
    songDiv.appendChild(musicIcon);

    // Create the div for the song name and duration
    let songInfoDiv = document.createElement("div");

    // Create the h2 element for the song name
    let h2 = document.createElement("h2");
    h2.textContent = fileName;
    songInfoDiv.appendChild(h2);

    // Create the div for the song duration
    let durationDiv = document.createElement("div");
    durationDiv.id = `duration-${index}`; // Assign a unique ID for each duration div
    songInfoDiv.appendChild(durationDiv);

    // Append the song info div to the song div
    songDiv.appendChild(songInfoDiv);

    // Append the song div to the songs container
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
      currentSongIndex = getNextSongIndex();
      playSong(currentSongIndex);
    }
  });

  // Previous button functionality
  prevButton.addEventListener("click", () => {
    if (currentAudio) {
      currentAudio.pause();
      currentSongIndex = getPrevSongIndex();
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
      togglePauseColor(); // Toggle pause button color
    }
  });

  // Shuffle button functionality
  shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;
    toggleShuffleColor(); // Toggle shuffle button color
    if (isShuffle) {
      shuffleSongs();
    }
  });

  // Repeat button functionality
  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    toggleRepeatColor(); // Toggle repeat button color
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

    // If repeat is on, set the 'ended' event listener to replay the same song
    if (isRepeat) {
      currentAudio.addEventListener("ended", () => {
        playSong(currentSongIndex);
      });
    }

    // If shuffle is on, shuffle the songs
    if (isShuffle) {
      shuffleSongs();
    }

    // Toggle the colors of the buttons
    toggleShuffleColor();
    toggleRepeatColor();
    togglePauseColor();

    // Update track information with total duration
    updateTrackInfo(
      getTrackNameFromURL(songs[index]),
      "0:00",
      getFormattedDuration(currentAudio.duration)
    );

    // Add an event listener to update the duration and seeker as the audio progresses
    currentAudio.addEventListener("timeupdate", () => {
      const currentTime = getFormattedDuration(currentAudio.currentTime);
      const totalTime = getFormattedDuration(currentAudio.duration);

      timer.innerHTML = `<h4>${currentTime}</h4>  <h4>${totalTime}</h4>`;

      // Update the seeker value
      seeker.value = Math.floor(currentAudio.currentTime);
      
    });
  }

  function getNextSongIndex() {
    if (isShuffle) {
      return getRandomIndex();
    } else {
      return (currentSongIndex + 1) % songs.length;
    }
  }

  function getPrevSongIndex() {
    if (isShuffle) {
      return getRandomIndex();
    } else {
      return (currentSongIndex - 1 + songs.length) % songs.length;
    }
  }

  function getRandomIndex() {
    return Math.floor(Math.random() * songs.length);
  }

  function shuffleSongs() {
    if (isShuffle) {
      currentSongIndex = getRandomIndex();
    }
  }

  function getFormattedDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function getTrackNameFromURL(url) {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split("/");
    return parts[parts.length - 1].replace(/%20/g, " ");
  }
}

// Call the main function
main();
