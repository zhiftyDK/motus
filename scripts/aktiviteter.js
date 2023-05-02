const aktiviteterModalBody = document.getElementById("aktiviteterModalBody");
function openAktivitetModal(description) {
    setTimeout(() => {
        aktiviteterModalBody.innerText = description;
    }, 500);
}