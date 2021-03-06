import "../css/main.css";
import firebase from "firebase";

var userEmail = null;

// constants
const addIncidentButton = document.getElementById("add_incident_btn");
const submitIncidentButton = document.getElementById("submit_incident_btn");
const incidentBox = document.getElementById("submitform");

const boxtitle = document.getElementById("message-title");
const boxdesc = document.getElementById("messagebox");
const boxrating = document.getElementById("importance");

const incidentList = document.getElementById("incident-list");

const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignin");
const btnLogout = document.getElementById("btnLogout");

const passwordField = document.getElementById("loggedOut");
const infoField = document.getElementById("loggedIn");
const cross = document.getElementById("crosscontainer");
const userInfo = document.getElementById("userInfo");

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
    promise.catch((e) => alert(e.message + " Make sure to register your account first!"));
});

/// sign up event
btnSignup.addEventListener("click", (e) => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch((e) => alert(e.message));
});

const db = firebase.firestore();

const updateUI = () => {
    // code snippet loops and destroys every single child from incidentlist, could be done in a better way.
    while (incidentList.firstChild) {
        incidentList.removeChild(incidentList.firstChild);
    }
    db.collection("users")
        .where("newIncident.user", "==", userEmail)
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                renderIncident(doc);
            });
        });
};
// listener for when account logs out/ logs in.
firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        console.log(firebaseUser.email + " is logged in!");
        passwordField.classList.add("invisible");
        infoField.classList.remove("invisible");
        userEmail = firebaseUser.email;
        userInfo.innerText = "logged in as user " + userEmail;
        updateUI();
    } else {
        passwordField.classList.remove("invisible");
        infoField.classList.add("invisible");

        updateUI();
        // maybe adding method to reset fields. But like the option
        // for testing purposes
    }
});
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

btnLogout.addEventListener("click", (e) => {
    while (incidentList.firstChild) {
        incidentList.removeChild(incidentList.firstChild);
    }
    firebase.auth().signOut();
});

submitIncidentButton.addEventListener("click", () => {
    const title = boxtitle.value;
    const description = boxdesc.value;
    const rating = boxrating.value;
    // error handling empty fields.
    if (title.trim() === "" || description.trim() === "") {
        alert("Please fill in the empty fields.");
        return;
    }
    // how data is built up.
    const newIncident = {
        titlename: title,
        desc: description,
        ratingvalue: rating,
        dates: Date().slice(7, -38),
        user: userEmail,
    };

    db.collection("users").add({
        newIncident,
    });
    addIncidentHandler();
    clearInputs();
    updateUI();
});

// creating the incident card.
const renderIncident = (incidentObj) => {
    const newIncident = document.createElement("li");
    let cross = document.createElement("div");
    let title = document.createElement("h1");
    let username = document.createElement("h2");
    let desc = document.createElement("span");
    let rating = document.createElement("p");
    let incidentHeader = document.createElement("div");
    let block = document.createElement("div");

    let datetime = document.createElement("p");
    newIncident.setAttribute("data-id", incidentObj.id);
    newIncident.classList.add("incident");

    datetime.textContent = "Date: " + incidentObj.data().newIncident.dates;
    cross.textContent = "x";
    title.textContent = incidentObj.data().newIncident.titlename;
    username.textContent = "Created by: " + incidentObj.data().newIncident.user;
    desc.textContent = incidentObj.data().newIncident.desc;

    block.classList.add("block");

    incidentHeader.classList.add("crossclasscontainer");
    cross.classList.add("crossclass");

    incidentHeader.appendChild(cross);

    newIncident.appendChild(incidentHeader);
    newIncident.appendChild(username);
    newIncident.appendChild(title);
    newIncident.appendChild(desc);
    newIncident.appendChild(rating);
    newIncident.appendChild(datetime);
    newIncident.appendChild(block);

    // gives the block a specific color depending on difficultiy set .
    switch (incidentObj.data().newIncident.ratingvalue) {
        case "1":
            block.classList.add("danger1");

            break;
        case "2":
            block.classList.add("danger2");
            break;
        case "3":
            block.classList.add("danger3");
            break;
        case "4":
            block.classList.add("danger4");
            break;
        case "5":
            block.classList.add("danger5");
            break;
    }

    incidentHeader.addEventListener("click", () => {
        let id = newIncident.getAttribute("data-id");
        db.collection("users").doc(id).delete();
        deletepost(updateUI);
    });

    function deletepost(callback) {
        // Doing a duplicate of code, it fixes the error i had with ui running before firebase has updated deletion.
        let id = newIncident.getAttribute("data-id");
        db.collection("users").doc(id).delete();
        updateUI();
    }

    newIncident.addEventListener("click", () => {
        newIncident.querySelector("span").classList.toggle("visible");
    });
    incidentList.append(newIncident);
};
