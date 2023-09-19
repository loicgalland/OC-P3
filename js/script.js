import {
  generateWorks,
  generateModal,
  generateCategoriesModal,
  generateFilters,
} from "./generation.js";

// GÉNÉRATION DE LA PAGE A L'OUVERTURE
//Récupération des travaux sur l'API
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return response.json();
}
const works = await fetchWorks()
//Récupération des catégories sur l'API
const responseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await responseCategories.json();
//Récupération du container de la gallery
const galleryContainer = document.querySelector(".gallery");
//Appel de la fonction GenerateCards au chargement de la page avec l'array Works
generateWorks(works, galleryContainer);
//Récupération du bouton edition et du container de la modal
const modal = document.querySelector(".modal-container");
const modalGallery = document.querySelector(".modal-gallery");
const modalBody = document.querySelector(".modal-body");
const modalDelete = document.querySelector(".modal-delete");
const modalAdd = document.querySelector(".modal-add");
const messageSuccess = document.querySelector(".message-success");

//Appel de la fonction GenerateModal au chargement de la page
generateModal(works, modalGallery, modalBody);
//Appel de la fonction GenerateCategoriesModal pour créer les options du select du form
const selectCategory = document.getElementById("category");
generateCategoriesModal(selectCategory, categories);

//FONCTIONS FILTRES
//Appel de la fonction GenerateFilters sur l'array Categories
generateFilters(categories);
//Création d'une fonction qui ajoute la class active sur un élément et qui l'enlève sur un autre
function changeActive(firstEl, secondEl) {
  firstEl.classList.remove("active");
  secondEl.classList.add("active");
}
//Récupération des filtres crées et du filtre All
const filtersButtons = document.querySelectorAll(".btn-inactive");
const filterAll = document.getElementById("0");
//Filtrer tous les projets
filterAll.addEventListener("click", () => {
  document.querySelector(".gallery").innerHTML = "";
  const buttonActive = document.querySelector(".active");
  changeActive(buttonActive, filterAll);
  generateWorks(works, galleryContainer);
});

//Filtrer les projets par catégories
filtersButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let elementArray = [];
    works.forEach((work) => {
      let searchTermId = work.categoryId;
      if (searchTermId == button.id) {
        elementArray.push(work);
      }
    });
    document.querySelector(".gallery").innerHTML = "";
    const buttonActive = document.querySelector(".active");
    changeActive(buttonActive, button);
    generateWorks(elementArray, galleryContainer);
  });
});
//Function qui supprimer les filtres
function deleteFilters() {
  const buttonsContainer = document.querySelector(".filters");
  buttonsContainer.innerHTML = "";
}

// LOGIN
//TOKEN (RÉCUPÉRATION ET SUPPRESSION)
//Récupérationd de tous les éléments qui doivent être visible quand la session est ouvert
const topBar = document.querySelector(".bar-top");
const logInLink = document.querySelector(".login-link");
const logOutLink = document.querySelector(".logout-link");
const editContainer = document.querySelector(".edit-container");
//Récupération du token pour identification
const token = sessionStorage.getItem("token");
//Changement du display des éléments visible pour l'administrateur si token est présent
if (token) {
  topBar.style.display = "flex";
  logInLink.style.display = "none";
  logOutLink.style.display = "block";
  editContainer.style.display = "flex";
  deleteFilters();
}
//Supression du session storage onClick sur logOutLink
logOutLink.addEventListener("click", () => {
  sessionStorage.clear();
});

//DÉCLARATION FONCTIONS POUR AJOUT ET SUPPRESSION D'UN PROJET
//Récupération du bouton edition et du container de la modal
const editButton = document.querySelector(".edit-btn");
//création de la fonction pour supprimer un projet
async function deleteItem(element) {
  //element.addEventListener("click", async (e) => {
  //e.preventDefault();
  const userConfirm = confirm("Voulez-vous vraiment supprimer le projet ?");
  if (userConfirm) {
    const reponse = await fetch(
      `http://localhost:5678/api/works/${element.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (reponse.ok) {
      modalBody.removeChild(element.parentNode);
      const idImageDelete = `fig-${element.id}`;
      const galleryImgToDelete = document.getElementById(idImageDelete);
      galleryContainer.removeChild(galleryImgToDelete);
    } else {
      console.log("Une erreur est survenue");
    }
  }
  //});
}
//Création de la fonction pour ajouter un projet
async function AddProject(title, categoryImg, newImg) {
  const inputImg = document.getElementById("imgInput");
  const inputTitle = document.getElementById("imgInput");
  const formData = new FormData();
  formData.append("image", newImg);
  formData.append("title", title);
  formData.append("category", categoryImg);
  if (inputImg.files[0] == "" || inputTitle.value == "") {
    alert("Vous devez renseigner tous les champs");
  } else {
    const reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (reponse.ok) {
      messageSuccess.innerHTML = "Le projet a été ajouté avec succès";

      const work = await fetchWorks();
      galleryContainer.innerHTML = "";
      generateWorks(work, galleryContainer);
      modalGallery.innerHTML = "";
      generateModal(work, modalGallery, modalBody);
    } else {
      alert("Un probleme est survenu");
    }
  }
}
//DÉCLARATION DE LA FONCTION POUR LA PREVISU
//Création de la fonction qui affiche une prévisu de l'image
function seePict(containerForm) {
  document.querySelector(".img-selected").innerHTML = "";
  let imgSrc = document.getElementById("imgInput").value;
  imgSrc = imgSrc.slice(11, imgSrc.length);
  const container = document.querySelector(".img-selected");
  const img = document.createElement("img");
  img.setAttribute("src", `./assets/images/${imgSrc}`);
  img.classList.add("previsu");
  container.appendChild(img);
  containerForm.style.display = "none";
}

//APPARITION ET DISPARITION DE LA MODAL
//Génération de la modal au clic sur le button modifier
editButton.addEventListener("click", () => {
  modal.style.display = "flex";
});
//Fonction qui ferme la modal
function closeModal() {
  modal.style.display = "none";
  modalAdd.style.display = "none";
  modalDelete.style.display = "flex";
  document.getElementById("title").value = "";
}
//Fermer la modal au clic sur la croix et remise du display flex sur modalDelete
const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", () => {
  closeModal();
});
//Fermer la modal quand echap est enclanché et remise du display flex sur modalDelete
document.addEventListener("keydown", function (event) {
  // Vérifiez si la touche enfoncée est la touche "Esc"
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
});
//Fermer modal quand clic en dehors et remise du display flex sur modalDelete
document.body.addEventListener("click", function (e) {
  // Vérifiez si le clic a eu lieu en dehors de la modal
  if (e.target === modal) {
    closeModal();
  }
});
const addBtn = document.querySelector(".btn-add-picture");
const containerForm = document.querySelector(".input-file");
//Changer de modal pour modalAdd
addBtn.addEventListener("click", () => {
  modalAdd.style.display = "flex";
  modalDelete.style.display = "none";
  //Display flex sur le form et suppression du contenu de la div prévisualisation
  containerForm.style.display = "flex";
  document.querySelector(".img-selected").innerHTML = "";
});
//Retour sur la modalDelete
const previousBtn = document.querySelector(".close-previous");
previousBtn.addEventListener("click", () => {
  modalAdd.style.display = "none";
  modalDelete.style.display = "flex";
  messageSuccess.innerHTML = "";
  document.getElementById("title").value = "";
});
//Fermeture de toutes les modals
const closeAddbtn = document.querySelector(".close-add-btn");
closeAddbtn.addEventListener("click", () => {
  closeModal()
});

// PRÉVISU DE L'IMAGE ADD
//Appel de la fonction prévisu de l'img et activation du bouton submit
const inputImage = document.getElementById("imgInput");
inputImage.addEventListener("change", () => {
  seePict(containerForm);
  const inputSubmit = document
    .querySelector(".submit-add-form")
    .classList.add("submit-active");
});

//APPEL DES FONCTIONS AJOUT ET SUPPRESSION PROJET AU CLIC SUR BTN``
//Ajout du projet
const formImg = document.getElementById("form-add-picture");
formImg.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const categoryImg = document.getElementById("category").value;
  const newImg = document.getElementById("imgInput").files[0];
  AddProject(title, categoryImg, newImg);
});

//Appel de la fonction delete au clic sur tous les btn delete du modalBody
modalBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal-trash-btn")) {
    event.preventDefault();
    deleteItem(event.target);
  }
});
