import { changeDisplay } from "./display.js";
//Récupération des travaux sur l'API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();
//Récupération du container de la gallery
const galleryContainer = document.querySelector(".gallery");
//Création de la fonction qui génère les cards projets
async function generateCards(array) {
  array.forEach((element) => {
    //Création des différents éléments
    const projectCard = document.createElement("figure");
    const imgProject = document.createElement("img");
    imgProject.src = element.imageUrl;
    imgProject.alt = element.title;
    const legendImgProject = document.createElement("figcaption");
    legendImgProject.innerText = `${element.title}`;
    //Intégration projectCard dans galleryContainer
    galleryContainer.appendChild(projectCard);
    //Intégration imgproject + legendImgProject dans projectCard
    projectCard.appendChild(imgProject);
    projectCard.appendChild(legendImgProject);
  });
}
//Cr'éation de la fonction qui génère les boutons
async function generateButtons() {
  //Récupération du container buttons
  const buttonsContainer = document.querySelector(".filters");
  //Créations du buttons "Tous"
  const buttonAll = document.createElement("button");
  buttonAll.innerText = "Tous";
  //Ajout du style
  buttonAll.classList.add("btn-filter");
  buttonAll.classList.add("active");
  //Ajout id
  buttonAll.setAttribute("id", "0");
  buttonsContainer.appendChild(buttonAll);
  //Création d'un tableau avec les différentes catégories
  const categoriesArray = ["Objets", "Appartements", "Hôtels & Restaurants"];
  //Création des boutons
  for (let i = 0; i < categoriesArray.length; i++) {
    const buttons = document.createElement("button");
    buttons.innerHTML = categoriesArray[i];
    buttons.setAttribute("id", i + 1);
    buttons.classList.add("btn-inactive");
    buttons.classList.add("btn-filter");
    buttonsContainer.appendChild(buttons);
  }
}
//appel des fonctions generateCards et generateButtons au premier chargement de la page
generateCards(works);
generateButtons();
//récupération de tous les boutons
const filtersButtons = document.querySelectorAll(".btn-inactive");
//Création d'une fonction qui ajoute la class active sur un élément et qui l'enlève sur un autre
function changeActive(firstEl, secondEl) {
  firstEl.classList.remove("active");
  secondEl.classList.add("active");
}
//fonction filtres Tous
const buttonAll = document.getElementById("0");
buttonAll.addEventListener("click", () => {
  document.querySelector(".gallery").innerHTML = "";
  const buttonActive = document.querySelector(".active");
  changeActive(buttonActive, buttonAll);
  generateCards(works);
});
//mise en place des filtres
filtersButtons.forEach((element) => {
  element.addEventListener("click", () => {
    let elementArray = [];
    works.forEach((work) => {
      let searchTerm = work.categoryId;
      if (searchTerm == element.id) {
        elementArray.push(work);
      }
    });
    document.querySelector(".gallery").innerHTML = "";
    const buttonActive = document.querySelector(".active");
    changeActive(buttonActive, element);
    generateCards(elementArray);
  });
});
//récupérationd de tous les éléments qui doivent être visible quand la session est ouvert
const topBar = document.querySelector(".bar-top");
const logInLink = document.querySelector(".login-link");
const logOutLink = document.querySelector(".logout-link");
const editContainer = document.querySelector(".edit-container");
//Récupération du token pour identification
const token = sessionStorage.getItem("token");
//function qui supprimer les filtres
function deleteFilters() {
  const buttonsContainer = document.querySelector(".filters");
  buttonsContainer.innerHTML = "";
}
//Changement du display des éléments visible pour l'administrateur si token est présent
if (token) {
  changeDisplay(topBar, "flex");
  changeDisplay(logInLink, "none");
  changeDisplay(logOutLink, "block");
  changeDisplay(editContainer, "flex");
  deleteFilters();
}
//Supression du session storage onClick sur logOutLink
logOutLink.addEventListener("click", () => {
  sessionStorage.clear();
});
//Récupération du bouton edition et du container de la modal
const editButton = document.querySelector(".edit-btn");
const modal = document.querySelector(".modal-container");
const modalBody = document.querySelector(".modal-body");
const modalDelete = document.querySelector(".modal-delete");
const modalAdd = document.querySelector(".modal-add");
//Création dee la fonction qui génère la modal
async function generateModal(array) {
  //Constitution du body de la modal
  array.forEach((element) => {
    //création du container -
    const containerImg = document.createElement("div");
    containerImg.classList.add("modal-container-img");
    //création de l'img
    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.alr = element.title;
    img.classList.add("modal-img");
    //création du btn delete
    const deleteIcon = document.createElement("button");
    deleteIcon.innerHTML = `<i class="fa-solid fa-trash-can fa-xs"></i>`;
    deleteIcon.classList.add("modal-trash-btn");
    deleteIcon.setAttribute("id", `${element.id}`);
    //Génération des éléments dans body
    modalBody.appendChild(containerImg);
    containerImg.appendChild(img);
    containerImg.appendChild(deleteIcon);
  });
}
//création de la fonction pour supprimer un projet
async function deleteItem(element) {
  element.addEventListener("click", () => {
    const userConfirm = confirm("Voulez-vous vraiment supprimer le projet ?");
    if (userConfirm) {
        fetch(`http://localhost:5678/api/works/${element.id}`, {
        method: "DELETE",
        headers: {
          //"Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) {
          console.log("Projet supprimé");
          document.location.href = "index.html";
        } else {
          console.log("Une erreur est survenue");
        }
      });
    }
  });
}


//Création de la fonction pour ajouter un projet
async function AddProject(title, categoryImg, newImg) {
  const inputImg = document.getElementById("imgInput");
  const inputTitle = document.getElementById("imgInput");
  const formData = new FormData();
  formData.append("image", newImg);
  formData.append("title", title);
  formData.append("category", categoryImg);
  if (
    inputImg.files[0] == "" ||
    inputTitle.value == ""
  ) {
    alert("Vous devez renseigner tous les champs");
  } else {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        //"Content-Type" : "multipart/form-data",
      },
      body: formData,
    });
    if (response.ok) {
      console.log("Youpi, votre fichier a été envoyé");
    } else {
      alert("Un probleme est survenu");
    }
  }
}
//Création de la fonction qui affiche une prévisu de l'image
async function seePict(element){
    document.querySelector(".img-selected").innerHTML = ""
    let imgSrc = document.getElementById('imgInput').value;
    imgSrc = imgSrc.slice(11, imgSrc.length)
    const container = document.querySelector(".img-selected")
    const img = document.createElement("img")
    img.setAttribute('src', `./assets/images/${imgSrc}`)
    img.classList.add("previsu")
    container.appendChild(img)    
    changeDisplay(element, "none")
}
//Génération de la modal au clic sur le button modifier
editButton.addEventListener("click", () => {
  changeDisplay(modal, "flex");
  generateModal(works);
  //Récupération des boutons de suppression des photos
  const deleteBtn = document.querySelectorAll(".modal-trash-btn");
  //Appel de la fontion deleteItem au clic sur chaque projet
  deleteBtn.forEach((element) => {
    deleteItem(element);
  });
  //Fermer la modal au clic sur la croix et remise du display flex sur modalDelete
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    changeDisplay(modal, "none");
    modalBody.innerHTML = "";
    changeDisplay(modalAdd, "none");
    changeDisplay(modalDelete, "flex");
  });
  //fermer la modal quand echap est enclanché et remise du display flex sur modalDelete
  document.addEventListener("keydown", function (event) {
    // Vérifiez si la touche enfoncée est la touche "Esc"
    if (event.key === "Escape" || event.key === "Esc") {
      changeDisplay(modal, "none");
      modalBody.innerHTML = "";
      changeDisplay(modalAdd, "none");
      changeDisplay(modalDelete, "flex");
    }
  });
  //fermer modal quand clic en dehors et remise du display flex sur modalDelete
  document.body.addEventListener("click", function (e) {
    // Vérifiez si le clic a eu lieu en dehors de la modal
    if (e.target === modal) {
      changeDisplay(modal, "none");
      modalBody.innerHTML = "";
      changeDisplay(modalAdd, "none");
      changeDisplay(modalDelete, "flex");
    }
  });
  const addBtn = document.querySelector(".btn-add-picture");
  //changer de modal pour modalAdd
  addBtn.addEventListener("click", () => {
    changeDisplay(modalDelete, "none");
    changeDisplay(modalAdd, "flex");
    const containerForm = document.querySelector(".input-file")
    changeDisplay(containerForm, "flex")
    document.querySelector(".img-selected").innerHTML = ""
    //retour sur la modalDelete
    const previousBtn = document.querySelector(".close-previous");
    previousBtn.addEventListener("click", () => {
      changeDisplay(modalAdd, "none");
      changeDisplay(modalDelete, "flex");
    });
    //fermeture de toutes les modals
    const closeAddbtn = document.querySelector(".close-add-btn");
    closeAddbtn.addEventListener("click", () => {
      changeDisplay(modal, "none");
      modalBody.innerHTML = "";
      changeDisplay(modalAdd, "none");
      changeDisplay(modalDelete, "flex");
    });
    //appel de la fonction prévisu de l'img et activation du bouton submit
    const inputImage = document.getElementById("imgInput")

    inputImage.addEventListener("change", () =>{
        seePict(containerForm)
        const inputSubmit = document.querySelector(".submit-add-form").classList.add("submit-active")
    
    })
    //Ajout du projet
    const formImg = document.getElementById("form-add-picture");
    formImg.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const categoryImg = document.getElementById("category").value;
      const newImg = document.getElementById("imgInput").files[0];
      AddProject(title, categoryImg, newImg);
    });
  });
});


