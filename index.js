'use strict';


const housesLink = document.getElementById('house-lists');
const personsLink = document.getElementById('persons-list');
const drawHouse = document.querySelector('.drawHouse');
const backgroundContainer = document.querySelector('.background-image-container');

let selectedPerson;
let selectedPerson_numberOfQuotes;



const Data = async function () {
  try {
    const res = await fetch(`https://api.gameofthronesquotes.xyz/v1/houses`);
    // console.log(res);

    if (!res.ok) {
      throw new Error('Problem getting the corrosponding house data 😎')
    }
    const data = await res.json()
    return data;
  }

  catch (err) {
    console.error(`${err.message}`);
  }
}

const Characters = async function () {
  try {
    const res = await fetch(`https://api.gameofthronesquotes.xyz/v1/characters`);
    // console.log(res);

    if (!res.ok) {
      throw new Error('Problem getting the corrosponding house data 😎')
    }
    const data = await res.json()
    console.log(data);
    return data;
  }

  catch (err) {
    console.error(`${err.message}`);
  }
}

const RandomQuotes = async function () {
  try {
    const res = await fetch(`https://api.gameofthronesquotes.xyz/v1/random/5`);
    // console.log(res);

    if (!res.ok) {
      throw new Error('Problem getting the corrosponding house data 😎')
    }
    const data = await res.json()
    console.log(data);
    return data;
  }

  catch (err) {
    console.error(`${err.message}`);
  }
}

const RandomPersonQuotes = async function (name, number) {
  try {
    const res = await fetch(`https://api.gameofthronesquotes.xyz/v1/author/${name}/${number}`);
    // console.log(res);

    if (!res.ok) {
      throw new Error('Problem getting the corrosponding house data 😎')
    }
    const data = await res.json()
    console.log(data);
    return data;
  }

  catch (err) {
    console.error(`${err.message}`);
  }
}

CreateDropdownSearch();

async function CreateDropdownSearch() {

  const data = await Data()

  console.log(data);

  //create elements for names
  for (const [keys, values] of Object.entries(data)) {

    let currentHouse
    for (const [keys1, values1] of Object.entries(values)) {

      if (keys1 === 'name') {
        const anchorElement = document.createElement('a');
        anchorElement.href = '#';
        anchorElement.classList.add('housename');
        anchorElement.textContent = values1;
        housesLink.appendChild(anchorElement);

        currentHouse = values1;
      }

      if (keys1 === 'members') {
        values1.forEach((element) => {
          const anchorElement = document.createElement('a');

          anchorElement.href = '#';

          anchorElement.classList.add('personName');

          Object.keys(element).includes('name') ? anchorElement.textContent = element['name'] + " : " + currentHouse : undefined

          personsLink.appendChild(anchorElement);
        })

      }

    }
  }
}


function HousesSearchBar() {
  const houses = document.querySelectorAll('.housename')
  const input = document.getElementById("HouseSearch");
  const filter = input.value.toUpperCase();

  houses.forEach((name) => {

    const nameFiltered = name.textContent.toUpperCase();

    if (nameFiltered.includes(filter)) {

      name.style.display = "block";

    } else if (filter === "") {

      name.style.display = "block";

    }
    else {

      name.style.display = "none";

    }
  })
}

function PersonSearchBar() {

  const persons = document.querySelectorAll(".personName")
  const input = document.getElementById("PersonSearch");
  const filter = input.value.toUpperCase();

  persons.forEach((name) => {
    const nameFiltered = name.textContent.toUpperCase();
    if (nameFiltered.includes(filter)) {

      name.style.display = "block";

    } else if (filter === "") {

      name.style.display = "block";

    }
    else {

      name.style.display = "none";

    }
  })



}

housesLink.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const nameOftheHouse = e.target.textContent

    clickOnEachHouse(nameOftheHouse)
    console.log('clicked');
    // console.log(nameOftheHouse);
  }

});


personsLink.addEventListener('click', function (e) {

  e.preventDefault();

  const nameOfPerson = e.target.textContent

  clickOnEachPerson(nameOfPerson)
  console.log('clicked');
});

async function clickOnEachHouse(nameOftheHouse) {
  let button = document.querySelector('button')
  button.style.display = "none";

  clearData()

  const anchorElement = document.createElement('p');
  anchorElement.textContent = nameOftheHouse;
  anchorElement.classList.add('title');
  drawHouse.appendChild(anchorElement);

  const data = await Data();

  for (const [keys, values] of Object.entries(data)) {
    if (values.name === nameOftheHouse) {
      // Found the desired house
      console.log(`Members of ${nameOftheHouse}:`);
      values.members.forEach(member => {

        const anchorElement = document.createElement('li');
        anchorElement.textContent = member.name;
        anchorElement.classList.add('info');

        anchorElement.addEventListener('click', function () {
          // Your code to be executed when the li element is clicked
          clickOnEachPerson(anchorElement.textContent);
        });

        anchorElement.addEventListener('mouseenter', function () {
          // Change the cursor to a pointer when the mouse enters
          anchorElement.style.cursor = 'pointer';
        });

        drawHouse.appendChild(anchorElement);
        console.log(member.name);
      });

    }
  }
}

async function clickOnEachPerson(nameOfPerson) {

  let button = document.querySelector('button')
  button.style.display = "block";
  button.onclick = updatePersonQuotes
  clearData();

  const data = await Characters();

  for (const [key, value] of Object.entries(data)) {
    if (nameOfPerson.includes(value.name)) {

      const name = document.createElement('li');
      name.textContent = value.name;
      name.href = '#';
      name.classList.add('title');
      drawHouse.appendChild(name);

      selectedPerson = value.slug

      const house = document.createElement('li');
      house.textContent = value.house.name;
      house.href = '#';
      house.classList.add('title');
      drawHouse.appendChild(house);

      house.addEventListener('click', function () {
        // Your code to be executed when the li element is clicked
        clickOnEachHouse(house.textContent);
      });

      house.addEventListener('mouseenter', function () {
        // Change the cursor to a pointer when the mouse enters
        house.style.cursor = 'pointer';
      });

      const quotes = value.quotes

      selectedPerson_numberOfQuotes = quotes.length

      quotes.forEach(x => {
        const quote = document.createElement('li');
        quote.textContent = x;
        quote.href = '#';
        quote.classList.add('info');
        drawHouse.appendChild(quote);
      })
    }
  }
}

async function QuotesClicked() {

  let button = document.querySelector('button')
  button.style.display = "block";
  button.onclick = updateGeneralQuotes

  clearData()

  const quotes = await RandomQuotes()

  console.log(quotes);

  quotes.map(x => {

    const name = document.createElement('h1');
    name.textContent = x.character.name;
    name.classList.add('PersonDetail');
    drawHouse.appendChild(name);

    const quote = document.createElement('li');
    quote.textContent = x.sentence;
    quote.classList.add('PersonDetail');
    drawHouse.appendChild(quote);

    name.addEventListener('click', function () {
      // Your code to be executed when the li element is clicked
      clickOnEachPerson(name.textContent);
    });

    name.addEventListener('mouseenter', function () {
      // Change the cursor to a pointer when the mouse enters
      name.style.cursor = 'pointer';
    });

  })

}
async function updatePersonQuotes() {

  if (selectedPerson === undefined) return

  console.log(selectedPerson);
  const quotes = await RandomPersonQuotes(selectedPerson, selectedPerson_numberOfQuotes)

  Array.from(Array.from(drawHouse.children).filter(x => x.classList.contains('info'))).forEach(child => {
    if (child.tagName.toLowerCase() !== 'button') {
      child.remove();
    }
  });

  quotes.forEach(x => {
    const quote = document.createElement('li');
    quote.textContent = x.sentence;
    quote.classList.add('info');
    drawHouse.appendChild(quote);
  })

}
async function updateGeneralQuotes() {

  clearData()
  QuotesClicked()

}
function clearData() {

  // Remove all children except buttons
  Array.from(drawHouse.children).forEach(child => {
    if (child.tagName.toLowerCase() !== 'button') {
      child.remove();
    }
  });
}

// adjusting the height of the background image
function updateHeight() {
  const viewportHeight = window.innerHeight;
  backgroundContainer.style.minHeight = viewportHeight + 'px';
}

window.addEventListener('scroll', updateHeight);
window.addEventListener('resize', updateHeight);