import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

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
const contactInput = document.getElementById("contact");
const submitBtn = document.getElementById("submit");

const myRequestsList = document.getElementById("myRequests");
const requestsList = document.getElementById("requests");

// -------------------
// Submit new request
// -------------------
submitBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const need = needInput.value.trim();
  const location = locationInput.value;
  const contact = contactInput.value.trim();
  localStorage.setItem("userName", name);

  if (!name || !need || !location) {
    alert("Fill in ALL information!");
    return;
  }

  const requestData = {
    name,
    location,
    need,
    contact: contact || "Not provided",
  };

  push(ref(db, "requests/"), requestData);

  alert("Request submitted successfully!");
  nameInput.value = "";
  needInput.value = "";
  locationInput.value = "";
  contactInput.value = "";

  loadMyRequests(name);
});

// -------------------
// Load user's own requests
// -------------------
function loadMyRequests(name) {
  const requestsRef = ref(db, "requests/");
  onValue(requestsRef, (snapshot) => {
    const requests = [];
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.name === name) {
        requests.push(data);
      }
    });

    // Now rebuild list all at once
    myRequestsList.innerHTML = "";
    requests.forEach((data) => {
      const li = document.createElement("li");
      li.textContent = `${data.name} (${data.location}): ${data.need} | Contact: ${data.contact}`;
      myRequestsList.appendChild(li);
    });
  });
}

// -------------------
// Load requests for volunteers
// -------------------
function loadRequestsForVolunteers() {
  onValue(ref(db, "requests/"), (snapshot) => {
    requestsList.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const li = document.createElement("li");
      li.textContent = `${data.name} (${data.location}): ${data.need} | Contact: ${data.contact}`;
      requestsList.appendChild(li);
    });
  });
}

const savedName = localStorage.getItem("userName");
if (savedName) {
  loadMyRequests(savedName);
}

// Initialize data
loadRequestsForVolunteers();