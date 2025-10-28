import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// -------------------
// Firebase config
// -------------------
const firebaseConfig = {
  apiKey: "AIzaSyDBevOdYoCirgpedIlOG6mu2ZUwtzCCYuo",
  authDomain: "flood-services-site.firebaseapp.com",
  databaseURL: "https://flood-services-site-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "flood-services-site",
  storageBucket: "flood-services-site.firebasestorage.app",
  messagingSenderId: "754979790505",
  appId: "1:754979790505:web:3b8de752d172ce554893b8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -------------------
// DOM elements
// -------------------
const nameInput = document.getElementById("name");
const locationInput = document.getElementById("location");
const needInput = document.getElementById("need");
const submitBtn = document.getElementById("submit");
const myRequestsList = document.getElementById("myRequests");
const requestsList = document.getElementById("requests");

// -------------------
// State
// -------------------
let userName = "";

// -------------------
// Submit new request
// -------------------
submitBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const need = needInput.value.trim();
  const location = locationInput.value;

  if (!name || !need || !location) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  userName = name;

  push(ref(db, "requests/"), {
    name,
    location,
    need,
    status: "Awaiting services"
  });

  alert("Request submitted successfully!");
  nameInput.value = "";
  locationInput.value = "";
  needInput.value = "";

  loadMyRequests(userName);
});

// -------------------
// Load affected user's own requests
// -------------------
function loadMyRequests(name) {
  onValue(ref(db, "requests/"), (snapshot) => {
    myRequestsList.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.name === name) {
        const li = document.createElement("li");
        li.textContent = `${data.name} (${data.location}): ${data.need} [${data.status}]`;
        myRequestsList.appendChild(li);
      }
    });
  });
}

// -------------------
// Load requests for volunteers (always visible for now)
// -------------------
onValue(ref(db, "requests/"), (snapshot) => {
  requestsList.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();
    const li = document.createElement("li");
    li.textContent = `${data.name} (${data.location}): ${data.need} [${data.status}]`;

    // volunteer control buttons
    const inProgressBtn = document.createElement("button");
inProgressBtn.textContent = "Mark In Progress";
inProgressBtn.style.margin = "5px";
inProgressBtn.addEventListener("click", () => {
  update(ref(db, "requests/" + child.key), { status: "In Progress" });
});

const completedBtn = document.createElement("button");
completedBtn.textContent = "Mark Completed";
completedBtn.style.margin = "5px";
completedBtn.addEventListener("click", () => {
  update(ref(db, "requests/" + child.key), { status: "Completed" });
});

li.appendChild(inProgressBtn);
li.appendChild(completedBtn);
    requestsList.appendChild(li);
  });
});