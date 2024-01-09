console.log("afdfsdfdsf");

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

  // Iterate through the songs array and create elements for each song
  songs.forEach((songURL) => {
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
  });

  // For demonstration, play the first audio in the array
  if (songs.length > 0) {
    let audio = new Audio(songs[0]);
    audio.play();
  }
}

// Call the main function
main();
