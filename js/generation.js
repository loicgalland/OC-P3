//Création de la fonction qui génère les cards projets
export async function generateWorks(array, container) {
    array.forEach((element) => {
      //Création des différents éléments
      const projectCard = document.createElement("figure");
      projectCard.setAttribute('id', `fig-${element.id}`)
      const imgProject = document.createElement("img");
      imgProject.src = element.imageUrl;
      imgProject.alt = element.title;   
      const legendImgProject = document.createElement("figcaption");
      legendImgProject.innerText = element.title;
      //Intégration projectCard dans galleryContainer
      container.appendChild(projectCard);
      //Intégration imgproject + legendImgProject dans projectCard
      projectCard.appendChild(imgProject);
      projectCard.appendChild(legendImgProject);
    });
  }
//Création de la fonction qui génère la modal
export async function generateModal(array, galleryModal, containerModal) {
    //Constitution du body de la modal
    galleryModal.innerHTML = ""
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
      deleteIcon.setAttribute("id", element.id);
      containerImg.setAttribute("id", `container-img-${element.id}`)
      //Génération des éléments dans body
      containerModal.appendChild(containerImg);
      containerImg.appendChild(img);
      containerImg.appendChild(deleteIcon);
    });
  }
//Création de la fonction qui génère les catégories dans la modalAdd
export async function generateCategoriesModal(selectCategory, categories) {
  categories.forEach(category => {
    const option = document.createElement("option")
    option.setAttribute('value', category.id)
    option.innerText = category.name
    selectCategory.appendChild(option)
  });

}
//Création de la fonction qui crée tous les filtres
export async function generateFilters(categories){
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
  categories.forEach(category => {
    const buttons = document.createElement("button");
      buttons.innerHTML = category.name;
      buttons.setAttribute("id", category.id);
      buttons.classList.add("btn-inactive");
      buttons.classList.add("btn-filter");
      buttonsContainer.appendChild(buttons);
  })
}