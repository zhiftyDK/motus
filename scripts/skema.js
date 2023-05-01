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
        alert("Du skal først oprætte en klasse, for at se skeamet!");
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
    const skema = localStorage.getItem("klasse_" + klasseNavn);
    if(skema) {
        document.getElementById("skemaDiv").style.display = "block";
        document.getElementById("skemaModuler").innerHTML = skema;
    }
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
    const moduler = skemaEditModuler.getElementsByTagName("tr");
    moduler[moduler.length - 1].remove();
}

document.getElementById("skemaEditSaveButton").addEventListener("click", () => {
    let skemaContent = "";
    const moduler = skemaEditModuler.getElementsByTagName("tr");
    for (let i = 1; i < moduler.length + 1; i++) {
        const modulTidFra = document.getElementById(`${i}modultidfra`);
        const modulTidTil = document.getElementById(`${i}modultidtil`);
        const modulMandag = document.getElementById(`${i}modulmandag`);
        const modulTirsdag = document.getElementById(`${i}modultirsdag`);
        const modulOnsdag = document.getElementById(`${i}modulonsdag`);
        const modulTorsdag = document.getElementById(`${i}modultorsdag`);
        const modulFredag = document.getElementById(`${i}modulfredag`);
        skemaContent += `<tr><th scope="row">${modulTidFra.value}-${modulTidTil.value}</th><td>${modulMandag.value}</td><td>${modulTirsdag.value}</td><td>${modulOnsdag.value}</td><td>${modulTorsdag.value}</td><td>${modulFredag.value}</td></tr>`;
        if(i == moduler.length) {
            localStorage.setItem("klasse_" + urlParams.get("klasse"), skemaContent);
            location.reload();
        }
    }
});

document.getElementById("editSkemaButton").addEventListener("click", () => {
    setTimeout(() => {
        const skema = localStorage.getItem("klasse_" + urlParams.get("klasse"));
        if(skema) {
            const moduler = skema.replaceAll("<tr>", "||").replaceAll("</tr>", "||").split("||").filter(n => {return n != ''});
            if(moduler.length > 5) {
                const diff = moduler.length - 5;
                for (let i = 0; i < diff; i++) {
                    addRow();
                }
            } else if(moduler.length < 5) {
                const diff = 5 - moduler.length;
                for (let i = 0; i < diff; i++) {
                    removeRow();
                }
            }
            moduler.forEach((modul, index) => {
                const modulContentArray = modul.replaceAll("-", "||").replaceAll("<th scope=\"row\">", "||").replaceAll("</th>", "||").replaceAll("<td>", "||").replaceAll("</td>", "||").split("||").filter(n => {return n != ''});
                const modulIndex = index + 1;
                document.getElementById(`${modulIndex}modultidfra`).value = modulContentArray[0];
                document.getElementById(`${modulIndex}modultidtil`).value = modulContentArray[1];
                document.getElementById(`${modulIndex}modulmandag`).value = modulContentArray[2];
                document.getElementById(`${modulIndex}modultirsdag`).value = modulContentArray[3];
                document.getElementById(`${modulIndex}modulonsdag`).value = modulContentArray[4];
                document.getElementById(`${modulIndex}modultorsdag`).value = modulContentArray[5];
                document.getElementById(`${modulIndex}modulfredag`).value = modulContentArray[6];
            });
        }
    }, 500);
});