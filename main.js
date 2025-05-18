// ! Ay Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/!*Html den js eleman cekmek */

const addBox = document.querySelector(".add-box");
const popupContainer = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header h1");
const submitBtn = document.querySelector("form button");



//! local storage dan notes key sahip elemanlari al eyer local storage bos ise bunu bos bir dizi olarak kabul et

let notes = JSON.parse(localStorage.getItem("notes")) || [];


let isUpdate = false;
let updateId = null;

/* Event listener */
addBox.addEventListener("click", () => {
/* Adding class to pop up and popup box */
  popupContainer.classList.add("show");
  popup.classList.add("show");

  /* Dont let body scroll */
  document.body.style.overflow = "hidden";
});



/**Closing */
closeBtn.addEventListener("click", () => {
 /* Removing class to close it */
 popupContainer.classList.remove("show");
 popup.classList.remove("show");

 /* Let body scroll up and down after closing the popup */

 document.body.style.overflow = "auto";
});


/*  watch Form sending  */
form.addEventListener("submit", (e) => {
    /* make page not realoaded */
    e.preventDefault();

    /* get the value inside the input and textarea inside the form and delete unwanted spaces */
    const title = e.target[0].value.trim();
    const description = e.target[1].value.trim();

    console.log(title);
    console.log(description);

    /* If title and desc is empty give warning */

    if (!title || !description) {

        /* If title and desc is empty give warning */

        alert(`Please fill in the title and description`);

        /* return the fonksiyon so its stops if its empty */
        return;
    }
     const date = new Date();
    /* Unique id and make history value  */
    const id = date.getTime();
    const day = date.getDate();
    const month = date.getMonth();
    const updateMonth = months[month]; 

    const year = date.getFullYear();

    if (isUpdate) {

      const findIndex = notes.findIndex((note) => note.id === updateId);

      notes[findIndex] = {
        title,
        description,
        id,
        date: `${updateMonth} ${day}, ${year}`,
      };

      // popup eski haline getir
      isUpdate = false;
      updateId = null;

       // update popup title and description
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note"; 

    }

    else{
      /* tarih verisi olustor */
    let noteItem = {

        title,
        description,
        id,
        date:`${updateMonth} ${day}, ${year}`,

    };

    // olusturdugumuz notu notes dizisine ekle
    notes.push(noteItem);
    }

    console.log("id",id);
    console.log("day",day);
    console.log("month",updateMonth);
    console.log("year",year);
    

   

  /* Add the note values to local storage */

  localStorage.setItem("notes",JSON.stringify(notes));

  // clean the form
  e.target.reset(); 

  // close the popup
  popupContainer.classList.remove("show");
  popup.classList.remove("show");

  //notlari render et
    renderNotes(notes);
});

// render the notes 

function renderNotes(notes) {

    // this function will render each value inside the notes array


    //clear the notes 
    document.querySelectorAll(".note").forEach((item) => item.remove());

    notes.forEach((note) => {


        // notes dizisindeki her bir eleman icin bir html olustur
        let noteHTML = `
         <li class="note" data-id="${note.id}">
        <!-- details -->
        <div class="details">
          <h2 class="title">${note.title}</h2>
          <p class="description">${note.description}</p>
        </div>

        <!-- Bottum -->
        <div class="bottom">
          <span id="date">${note.date}</span>
          <div class="settings ">
            <i class='bx  bx-dots-horizontal-rounded'  ></i> 

            <ul class="menu">
              <li class="edit-btn"><i class='bx  bx-edit'  ></i>Edit </li>
              <li class="delete-btn"><i class='bx  bx-trash-alt'  ></i>Delete  </li>
            </ul>
          </div>
        </div>
      </li>`;

      // olusturdugumuz html arayuze ekle

      // if you want to add and elemnt to before or after  an html element you need to use insertAdjacentHTML

      addBox.insertAdjacentHTML("afterend", noteHTML);

    });  


}

//menu kismini goronur kilacak function

function showMenu (eleman){
  // elemanin parenti olan settings classini sec
  eleman.parentElement.classList.add("show");

  //eklenen show classini uc nokta haricinde bir yere tiklandiysa kaldir

  document.addEventListener("click", (e) => {
    //tiklanan eleman 3 nokta degilse veya kapsam disinda
    if(e.target.tagName != `I` || e.target != eleman) {

        // remove the show class from the parent element
        eleman.parentElement.classList.remove("show");
    }
  });
}


//wrapper kismindaki tiklanmalari izle
wrapper.addEventListener("click", (e)=>{

    // the element that is  clicked is it three dots

    if(e.target.classList.contains("bx-dots-horizontal-rounded")){

        // if it is clicked to three dots show the menu add show class
        showMenu(e.target);


    }

    //if it is clicked to dlt

    else if (e.target.classList.contains("delete-btn")){
     
      //silmek icin onay al
      const response = confirm("Are you sure you want to delete?")
     

      

      //onayladiysa sil

      if(response) {
        //delete the note element clicked in local storage and delete the note 

      const note = (e.target.closest(".note"));

      const noteId = parseInt(note.dataset.id);

      notes = notes.filter((note) =>note.id != noteId);

      // local storage update

      localStorage.setItem("notes",JSON.stringify(notes));

      // notlari render et

      renderNotes(notes);
        


      }    
    }

    else if (e.target.classList.contains("edit-btn")){
      // the note element that is clicked go to the parent element
      const note = (e.target.closest(".note"));
      
      console.log(note);

      //get the note id of the element clicked

      const noteId = Number(note.dataset.id);

    const foundedNote =  notes.find((note) => note.id === noteId);

    // open the popup
    popupContainer.classList.add("show");
    popup.classList.add("show");

    // edit the title and description of the popup
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // formu guncelle moduna sokacak degiskenlere atama yap
    isUpdate = true;
    updateId = noteId;

    // update popup title and description
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update ";



    }
});

// render the notes
document.addEventListener("DOMContentLoaded",renderNotes(notes));

