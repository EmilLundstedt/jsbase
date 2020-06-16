import "../css/main.css";
import firebase from "firebase";

const incidents = [];
var userEmail = null;

const addIncidentButton = document.getElementById("add_incident_btn");
const submitIncidentButton = document.getElementById("submit_incident_btn");
const removeIncidentButton = document.getElementById("remove_incident_btn");
const incidentBox = document.getElementById("submitform");
const container = document.getElementById("container");

const boxtitle = document.getElementById("message-title");
const boxdesc = document.getElementById("messagebox");
const boxrating = document.getElementById("importance");

const incidentList = document.getElementById("incident-list");

const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const btnLogout = document.getElementById("btnLogout");

const passwordField = document.getElementById("loggedOut");
const infoField = document.getElementById("loggedIn");
const cross = document.getElementById("crosscontainer");

//firebase
var firebaseConfig = {
    apiKey: "AIzaSyB2LTvAv7HkOqhkZUyx-216sL-iJcFoeRw",
    authDomain: "balumboo.firebaseapp.com",
    databaseURL: "https://balumboo.firebaseio.com",
    projectId: "balumboo",
    storageBucket: "balumboo.appspot.com",
    messagingSenderId: "85270903773",
    appId: "1:85270903773:web:700d23307ff10127be5434",
    measurementId: "G-FTN7QJ8DSL",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

/// login event
btnLogin.addEventListener("click", (e) => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch((e) => console.log(e.message));
});

/// sign up event
btnLogin.addEventListener("click", (e) => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch((e) => console.log(e.message));
});

// listener
firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        console.log(firebaseUser);
        passwordField.classList.add("invisible");
        infoField.classList.remove("invisible");
        userEmail = firebaseUser.email;
    } else {
        console.log("not logged in");
        infoField.classList.add("invisible");
        passwordField.remove("invisible");
    }
});

const db = firebase.firestore();

const updateUI = () => {
    while (incidentList.firstChild) {
        incidentList.removeChild(incidentList.firstChild);
    }

    db.collection("users")
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                renderIncident(doc);
            });
        });
};

updateUI();

cross.addEventListener("click", () => {
    addIncidentHandler();
});
addIncidentButton.addEventListener("click", () => {
    addIncidentHandler();
});

const addIncidentHandler = () => {
    incidentBox.classList.toggle("visible");
    addIncidentButton.classList.toggle("visible");
    submitIncidentButton.classList.toggle("visible");
};

const clearInputs = () => {
    boxtitle.value = "";
    boxdesc.value = "";
    boxrating.value = 1;
};

submitIncidentButton.addEventListener("click", () => {
    const title = boxtitle.value;
    const description = boxdesc.value;
    const rating = boxrating.value;

    if (title.trim() === "" || description.trim() === "") {
        alert("Please fill in the empty fields.");
        return;
    }

    const newIncident = {
        titlename: title,
        desc: description,
        ratingvalue: rating,
        dates: Date().slice(7, -38),
        user: userEmail,
    };
    console.log(newIncident);
    incidents.push(newIncident);

    db.collection("users").add({
        newIncident,
    });
    addIncidentHandler();
    clearInputs();
    updateUI();
});

const renderIncident = (incidentObj) => {
    const newIncident = document.createElement("li");
    let cross = document.createElement("div");
    let title = document.createElement("h1");
    let username = document.createElement("h2");
    let desc = document.createElement("span");
    let rating = document.createElement("p");
    let incidentHeader = document.createElement("div");

    let datetime = document.createElement("p");
    newIncident.setAttribute("data-id", incidentObj.id);

    datetime.textContent = incidentObj.data().newIncident.dates;
    cross.textContent = "x";
    title.textContent = incidentObj.data().newIncident.titlename;
    username.textContent = incidentObj.data().newIncident.user;
    desc.textContent = incidentObj.data().newIncident.desc;
    rating.textContent = incidentObj.data().newIncident.ratingvalue + " / 5";

    incidentHeader.classList.add("crossclasscontainer");
    cross.classList.add("crossclass");

    incidentHeader.appendChild(cross);

    newIncident.appendChild(incidentHeader);

    newIncident.appendChild(title);
    newIncident.appendChild(desc);
    newIncident.appendChild(rating);
    newIncident.appendChild(datetime);
    newIncident.appendChild(username);

    switch (incidentObj.data().newIncident.ratingvalue) {
        case "1":
            newIncident.classList.add("danger1");
            break;
        case "2":
            newIncident.classList.add("danger2");
            break;
        case "3":
            newIncident.classList.add("danger3");
            break;
        case "4":
            newIncident.classList.add("danger4");
            break;
        case "5":
            newIncident.classList.add("danger5");
            break;
    }

    incidentHeader.addEventListener("click", () => {
        let id = newIncident.getAttribute("data-id");

        db.collection("users").doc(id).delete();

        updateUI();
    });

    newIncident.addEventListener("click", () => {
        newIncident.querySelector("span").classList.toggle("visible");
    });
    incidentList.append(newIncident);
};
