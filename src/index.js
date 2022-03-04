let addToy = false;
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch('http://localhost:3000/toys').then(resp => resp.json()).then(data => {
  data.forEach(toy => toyCard(toy))
})

const toyCollection = document.getElementById('toy-collection')

// Make Toy Cards
function toyCard (toy) {
  const card = document.querySelector('.card');
  const btn = document.createElement('button');
  const p = document.createElement('p');
  const img = document.createElement('img');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  h2.textContent = toy.name;
  img.src = toy.image;
  img.className = 'toy-avatar'
  div.value = parseInt(toy.likes)
  p.textContent = `${div.value} likes!`
  btn.className = 'like-btn'
  btn.id = `toy_${toy.id}`
  btn.textContent = 'Like ❤️'
  btn.addEventListener('click', (e) => {
    const currentId = e.target.id.slice(4)
    let currentLikes = parseInt(div.value)
    // div.value += 1
    currentLikes += 1
    e.target.parentNode.querySelector('p').textContent = `${currentLikes} likes!`
    likeButton(currentId, currentLikes)
  })
  div.className = 'card'
  div.append(h2, img, p, btn)
  toyCollection.appendChild(div)
}

// Add Toy Form

const toyForm = document.querySelector('.add-toy-form')
toyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const addToyInput = toyForm['0'].value
  const addToyUrl = toyForm['1'].value
  addNewToy(addToyInput, addToyUrl)
})

// Add Toys & Add to JSON
function addNewToy (toyName, toyImage) {
  const newToy = {
    id: '',
    name: toyName,
    image: toyImage,
    likes: '0'
  };
  console.log(newToy)
  postToy(newToy)
}

function postToy (toyObj) {
fetch('http://localhost:3000/toys',{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify(toyObj)
}).then(resp => resp.json()).then(data => {
  console.log(data)
  toyCard(data)
})}

// Like Button
function likeButton (id, newLike) {
  fetch(`http://localhost:3000/toys/${id}`,{
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify({likes: newLike})
}).then(resp => resp.json()).then(data => {
  console.log(data)
  const targetToy = document.getElementById(`toy_${data.id}`);
  targetToy.parentNode.value = data.likes
})}