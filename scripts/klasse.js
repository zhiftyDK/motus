const klasser = document.getElementById("klasser");
const nameInput = document.getElementById("nameInput");

document.getElementById("addButton").addEventListener("click", () => {
    const klasseHtml = `<td><div class="row"><div class="col-6" style="padding-left: 1.5rem;">${nameInput.value}</div><div class="col-6 text-end"><a href="./skema.html?klasse=${nameInput.value}" style="padding-right: 1.5rem; color: black;"><i class="fa-solid fa-calendar-days"></i></a><a href="javascript:sletKlasse('${nameInput.value}')" style="padding-right: 1rem; color: red;"><i class="fa-solid fa-trash-can"></i></a></div></div></td>`;
    const klasse = document.createElement("tr");
    klasse.innerHTML = klasseHtml;
    klasser.appendChild(klasse);
    if(localStorage.getItem("klasser")) {
        let localStorageKlasser = localStorage.getItem("klasser");
        localStorageKlasser += `<tr>${klasseHtml}</tr>`;
        localStorage.setItem("klasser", localStorageKlasser);
    } else {
        localStorage.setItem("klasser", `<tr>${klasseHtml}</tr>`);
    }
    nameInput.value = "";
});

if(localStorage.getItem("klasser")) {
    klasser.innerHTML = localStorage.getItem("klasser");
}

function sletKlasse(name) {
    let result = '';
    let localSotrageKlasser = localStorage.getItem("klasser");
    localSotrageKlasser = localSotrageKlasser.replaceAll("<tr>", "||").replaceAll("</tr>", "||").split("||").filter(n => {return n != ''});
    localSotrageKlasser.forEach(klasse => {
        if(!klasse.includes(name)) {
            result += `<tr>${klasse}</tr>`;
        }
    });
    localStorage.setItem("klasser", result);
    const klasseTr = klasser.getElementsByTagName("tr");
    for (let i = 0; i < klasseTr.length; i++) {
        const klasse = klasseTr[i];
        if(klasse.innerHTML.includes(name)) {
            klasse.remove();
        }
    }
    if(localStorage.getItem("klasse_" + name)) {
        localStorage.removeItem("klasse_" + name);
    }
}

document.getElementById("openModalButton").addEventListener("click", () => {
    console.log("Focus");
    setTimeout(() => {
        nameInput.focus();
    }, 500);
});