console.log("Hello, world!");
let currentSong = new Audio();
let play = document.getElementById("play");
let pause = false;
let songs;

// Function to fetch songs from the server
/// Function to fetch songs from the server
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  //
  // Parse the response to extract song names
  // Assuming the response is in HTML format, you can use DOMParser to extract song names
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
/// Function to convert seconds to mm:ss format

const secondsToMinutesseconds = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};
//
// Function to play music
const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  if (play) {
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesseconds(
    currentSong.currentTime
  )}/${secondsToMinutesseconds(currentSong.duration)}`;
};
// Function to pause music

async function main() {
  songs = await getSongs();

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="music.svg" alt="" />
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Arjit Singh</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="" />
        </div>
      </li>`;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  // add event listener to play button
  if (play) {
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "pause.svg";
      } else {
        currentSong.pause();
        play.src = "play.svg";
      }
    });
  }
  // add event listener to time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesseconds(
      currentSong.currentTime
    )}/${secondsToMinutesseconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  // add event listener in seek bar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100; // Update current time
  });

  // add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  // add an event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // add an eventlistener to previous and next

  const previous = document.querySelector(".previous");
  const next = document.querySelector(".next");

  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 > 0) {
      playMusic(songs[index - 1]);
    }
  });


  // add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1 )< songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add an event to volume 
  document.querySelector(".renge").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to ", e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value) / 100;
  });
  








  // Handle card play buttons
  const cardPlayButtons = document.querySelectorAll(".Play");
  cardPlayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("card play button clicked.");

      // Add clicked class
      button.classList.add("clicked");

      // Remove clicked class after a short delay
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 300); // Adjust delay as needed

      // Add logic here to play the corresponding song.
      // For now, just play the first song to test.
      playMusic(songs[0]);
    });
  });

  // ... (Your other JavaScript code)

  /// serach baar
  // Assuming 'songs' is defined elsewhere in your code, containing song names.
  // Example: let songs = ["Song 1", "Song 2", "Another Song", "Different Tune"];

  // Create search container
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.id = "searchInput";
  searchInput.type = "text";
  searchInput.placeholder = "Search...";

  // Create search results list
  const searchResults = document.createElement("ul");
  searchResults.id = "searchResults";

  // Append input and results to container
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchResults);

  // Insert search container into the library section
  const library = document.querySelector(".library");
  library.insertBefore(searchContainer, library.firstChild);

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredSongs = songs.filter((song) =>
      song.toLowerCase().includes(searchTerm)
    );

    displayResults(filteredSongs);
  });

  function displayResults(songs) {
    searchResults.innerHTML = "";

    if (songs.length === 0) {
      searchResults.innerHTML = "<li>No results found</li>";
      return;
    }

    songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = song;
      li.addEventListener("click", () => {
        searchInput.value = song;
        searchResults.innerHTML = "";
      });
      searchResults.appendChild(li);
    });
  }
}

main();
