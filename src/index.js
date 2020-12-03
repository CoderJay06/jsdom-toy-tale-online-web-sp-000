let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    renderToys();
    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
            postToy();
        } else {
            toyFormContainer.style.display = "none";
        }
    });
});

function renderToys() {
    let destUrl = "http://localhost:3000/toys";
    const submitBtn = document.querySelector(".submit");
    const toyForm = document.querySelector(".add-toy-form");
    // Make a 'GET' request to fetch all the toy objects
    fetch(destUrl)
        .then(response => response.json())
        .then(json => addToys(json));
}

function postToy() {
    let destUrl = "http://localhost:3000/toys";
    const submitBtn = document.querySelector(".submit");
    const toyForm = document.querySelector(".add-toy-form");

    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        let nameInput = toyForm[0].value;
        let imgInput = toyForm[1].value;

        let toyData = {
            name: `${nameInput}`,
            image: `${imgInput}`,
            likes: 0
        };
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(toyData)
        };
        fetch(destUrl, configObj)
            .then(function(response) {
                return response.json();
            })
            .then(function(toyObj) {
                // Add new toy object
                addToys(toyObj);
            })
            .catch(function(error) {
                console.log(error.message);
            });
    });
}

function addToys(json) {
    const toyCollection = document.querySelector("#toy-collection");
    json.forEach(toy => {
        const card = document.createElement("div");
        addToyInfo(card, toy);
        toyCollection.appendChild(card);
    })
    // // When user clicks on like button add likes to toy
}

function addToyInfo(card, toy) {
    card.className = "card";
    card.dataset.id = toy.id;
    card.innerHTML = `<h2>${toy.name}</h2>`;
    card.innerHTML += `<img src="${toy.image}" class="toy-avatar">`;
    card.innerHTML += `<p>${toy.likes} Likes </p>`;
    card.innerHTML += `<button class="like-btn" onClick="addLikes(event)">Like <3</button>`;
}

function addLikes(event) {
        event.preventDefault();
        const toyId = event.target.parentElement.dataset.id;
        let numLikes = Number(event.target.parentElement.children[2].innerText.split(" ")[0]);
        numLikes += 1;
        event.target.parentElement.children[2].innerHTML = `${numLikes} Likes`;
        const likeData = {"Likes": numLikes};
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(likeData)
        }
        // debugger;
        fetch(`http://localhost:3000/toys/${toyId}`, configObj)
            .then(response => response.json())
            .then(toyObj => {
                toyObj.likes++;
                // debugger;
            });
}