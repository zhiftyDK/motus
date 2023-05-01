const klasseSelect = document.getElementById("klasseSelect");

if(localStorage.getItem("klasser")) {
    let klasser = localStorage.getItem("klasser");
    klasser = klasser.replaceAll("<tr>", "||").replaceAll("</tr>", "||").split("||").filter(n => {return n != ''});
    klasser.forEach(klasse => {
        const klasseNavn = klasse.split("klasse=")[1].split('"')[0];
        const option = document.createElement("option");
        option.innerText = klasseNavn;
        klasseSelect.appendChild(option);
    });
}

const urlParams = new URLSearchParams(window.location.search);
if(!urlParams.get("klasse")) {
    const klasseSelectOption = klasseSelect.getElementsByTagName("option");
    if(klasseSelectOption.length >= 1) {
        window.open("./skema.html?klasse=" + klasseSelectOption[0].value, "_self");
    } else {
        document.body.innerHTML = `<h1>Du skal først oprette en klasse, for at se skemaet!</h1>`;
        window.open("./klasse.html", "_self");
    }
} else {
    const klasseNavn = urlParams.get("klasse");
    const klasseSelectOption = klasseSelect.getElementsByTagName("option");
    for (let i = 0; i < klasseSelectOption.length; i++) {
        const option = klasseSelectOption[i];
        if(klasseNavn == option.innerText) {
            option.selected = true;
            loadSkema(option.innerText);
        }
    }
}

function loadSkema(klasseNavn) {
    document.getElementById("skemaDiv").style.display = "block";
    const skema = localStorage.getItem("klasse_" + klasseNavn);
}

klasseSelect.addEventListener("change", () => {
    window.open("./skema.html?klasse=" + klasseSelect.value, "_self");
});

let modulIndex = 5;
const skemaEditModuler = document.getElementById("skemaEditModuler");
function addRow() {
    modulIndex++;
    const modul = document.createElement("tr");
    modul.innerHTML = `
        <th scope="row" class="d-flex"><input class="form-control" style="width: 4rem;" placeholder="fra" id="${modulIndex}modultidfra"><span style="width: 0.5rem;"></span>-<span style="width: 0.5rem;"></span><input class="form-control" style="width: 4rem;" placeholder="til" id="${modulIndex}modultidtil"></th>
        <td><input class="form-control" style="width: 10rem;" placeholder="${modulIndex}. modul" id="${modulIndex}modulmandag"></td>
        <td><input class="form-control" style="width: 10rem;" placeholder="${modulIndex}. modul" id="${modulIndex}modultirsdag"></td>
        <td><input class="form-control" style="width: 10rem;" placeholder="${modulIndex}. modul" id="${modulIndex}modulonsdag"></td>
        <td><input class="form-control" style="width: 10rem;" placeholder="${modulIndex}. modul" id="${modulIndex}modultorsdag"></td>
        <td><input class="form-control" style="width: 10rem;" placeholder="${modulIndex}. modul" id="${modulIndex}modulfredag"></td>
    `;
    skemaEditModuler.append(modul);
}

function removeRow() {
    modulIndex--;
    const moduler = skemaEditModuler.getElementsByTagName("tr")
    moduler[moduler.length - 1].remove();
}