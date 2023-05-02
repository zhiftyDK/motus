const aktiviteterModalBody = document.getElementById("aktiviteterModalBody");
function openAktivitetModal(description) {
    setTimeout(() => {
        aktiviteterModalBody.innerText = description;
    }, 500);
}

document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", event => {
        document.querySelectorAll(".card").forEach(card => {
            if(!card.querySelector(".card-text").innerHTML.toLowerCase().includes(event.target.value.toLowerCase()) && event.target.checked){
                card.style.display = "none";
            } else {
                card.style.display = "flex";
            }
        });
    });
});
