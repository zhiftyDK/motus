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
            loadActivity();
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

let result = "";
function removeRow() {
    modulIndex--;
    const moduler = skemaEditModuler.getElementsByTagName("tr");
    result = localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse"));
    if(localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse"))) {
        localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse")).split(",").forEach(coordinate => {
            if(coordinate.substring(0,1) == moduler.length - 1) {
                result = result.replace(coordinate + ",", "");
            }
        });
    }
    moduler[moduler.length - 1].remove();
}

document.getElementById("skemaEditSaveButton").addEventListener("click", () => {
    if(localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse"))) {
        localStorage.setItem("klasseAktivitet_" + urlParams.get("klasse"), result);
    }
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
                const modulContentArray = modul.replaceAll("<td style=\"background-color: lightgreen;\">", "||").replaceAll("<td style=\"\">", "||").replaceAll("-", "||").replaceAll("<th scope=\"row\">", "||").replaceAll("</th>", "||").replaceAll("<td>", "||").replaceAll("</td>", "||").split("||").filter(n => {return n != ''});
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

const moduler = document.getElementById("skemaModuler").getElementsByTagName("td");
for (let i = 0; i < moduler.length; i++) {
    const modul = moduler[i];
    modul.addEventListener("click", event => {
        event.target.style.backgroundColor == "lightgreen" ? event.target.style.backgroundColor = "" : event.target.style.backgroundColor = "lightgreen";
        let selected = "";
        const alleModuler = document.getElementById("skemaModuler").getElementsByTagName("tr");
        for (let i = 0; i < alleModuler.length; i++) {
            const modul = alleModuler[i].getElementsByTagName("td");
            for (let j = 0; j < modul.length; j++) {
                if(modul[j].outerHTML.includes("lightgreen")) {
                    selected += `${i}${j},`;
                }
            }
        }
        localStorage.setItem("klasseAktivitet_" + urlParams.get("klasse"), selected);
        loadActivity();
    });
}

function loadActivity() {
    if(localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse"))) {
        const modulCoordinates = localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse")).split(",").filter(n => {return n != ''});
        modulCoordinates.forEach(coordinate => {
            const alleModuler = document.getElementById("skemaModuler").getElementsByTagName("tr");
            for (let i = 0; i < alleModuler.length; i++) {
                const modul = alleModuler[i].getElementsByTagName("td");
                for (let j = 0; j < modul.length; j++) {
                    if(`${i}${j}` == coordinate) {
                        modul[j].style.backgroundColor = "lightgreen";
                    }
                }
            }
        });
        const maxActivity = document.getElementById("skemaModuler").getElementsByTagName("tr").length * 5;
        const currentActivity = localStorage.getItem("klasseAktivitet_" + urlParams.get("klasse")).split(",").filter(n => {return n != ''}).length;
        const activityPercentage = Math.floor(currentActivity / maxActivity * 100) + "%";
        document.getElementById("aktivitetsCounter").innerText = "Denne uges aktivitetsniveau ligger på: " + activityPercentage;
    } else {
        const skema = localStorage.getItem("klasse_" + urlParams.get("klasse"));
        if(skema) {
            document.getElementById("aktivitetsCounter").innerText = "Denne uges aktivitetsniveau ligger på: 0%";
        }
    }
}