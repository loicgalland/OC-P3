//récupération du submit du form
const form = document.querySelector("form")
//Récupération des values du mail et password
const userMail = document.getElementById("input-user-mail")
const userPassword = document.getElementById("input-user-password")
//Création de la fonction qui récupère le token quand réponse du fetch est ok
async function formSubmission(){
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { 
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userMail.value,
            password: userPassword.value,
        })
    })
    if(reponse.ok == true){
        const response = await reponse.json()
        const token = response.token
        sessionStorage.setItem("token", token)
        window.location.href = "./index.html"
    }else{
        alert("Erreur dans l'identifiant ou le mot de passe")
    }
} 
//Listiner de l'évenement click sur le bouton submit
form.addEventListener("submit", (e) => {
    e.preventDefault()
    formSubmission()
})



