let vozidla = JSON.parse(localStorage.getItem("vozidla")) || [];

function ulozit() {
    localStorage.setItem("vozidla", JSON.stringify(vozidla));
}

function pridatVozidlo() {
    const vozidlo = {
        id: Date.now(),
        majitel: document.getElementById("majitel").value,
        znacka: document.getElementById("znackaAuto").value,
        model: document.getElementById("modelAuto").value,
        spz: document.getElementById("spzAuto").value,
        barva: document.getElementById("barvaAuto").value,
        nakupy: []
    };
    if(!vozidlo.majitel || !vozidlo.znacka || !vozidlo.model) {
        alert("Vyplň alespoň majitele, značku a model!");
        return;
    }
    vozidla.push(vozidlo);
    ulozit();
    vykreslitVozidla();
    document.getElementById("majitel").value = "";
    document.getElementById("znackaAuto").value = "";
    document.getElementById("modelAuto").value = "";
    document.getElementById("spzAuto").value = "";
    document.getElementById("barvaAuto").value = "";
}

function pridatNakup(id) {
    const text = prompt("Popis nákupu / služby:");
    if(!text) return;
    const auto = vozidla.find(a => a.id === id);
    auto.nakupy.push({datum: new Date().toLocaleDateString(), popis: text});
    ulozit();
    vykreslitVozidla();
}

function zobrazDetail(id) {
    const auto = vozidla.find(a => a.id === id);
    let nakupyHtml = auto.nakupy.map(n => `${n.datum} – ${n.popis}`).join("\n");
    alert(`Majitel: ${auto.majitel}\nZnačka: ${auto.znacka}\nModel: ${auto.model}\nSPZ: ${auto.spz}\nBarva: ${auto.barva}\nNákupy:\n${nakupyHtml}`);
}

function vykreslitVozidla() {
    if(!document.getElementById("seznamVozidel")) return;
    const seznam = document.getElementById("seznamVozidel");
    seznam.innerHTML = "";
    vozidla.forEach(auto => {
        seznam.innerHTML += `
        <div class="auto">
            <strong>${auto.majitel} – ${auto.znacka} ${auto.model}</strong><br>
            <button onclick="zobrazDetail(${auto.id})">Detaily vozidla</button>
            <button onclick="pridatNakup(${auto.id})">Přidat nákup / službu</button>
        </div>`;
    });
}

// Spuštění vykreslení při načtení stránky
document.addEventListener("DOMContentLoaded", vykreslitVozidla);
