let vozidla = JSON.parse(localStorage.getItem("vozidla")) || [];

function ulozit() {
    localStorage.setItem("vozidla", JSON.stringify(vozidla));
}

function pridatVozidlo() {
    const vozidlo = {
        id: Date.now(),
        majitel: document.getElementById("majitel").value,
        model: document.getElementById("modelAuto").value,
        spz: document.getElementById("spzAuto").value,
        barva: document.getElementById("barvaAuto").value,
        nakupy: []
    };

    // OPRAVA: Kontrolujeme 'spz', protože 'znacka' v objektu neexistuje
    if(!vozidlo.majitel || !vozidlo.spz || !vozidlo.model) {
        alert("Vyplň alespoň majitele, SPZ a model!");
        return;
    }

    vozidla.push(vozidlo);
    ulozit();
    vykreslitVozidla();

    // Vyčištění polí
    document.getElementById("majitel").value = "";
    document.getElementById("modelAuto").value = "";
    document.getElementById("spzAuto").value = "";
    document.getElementById("barvaAuto").value = "";
}

function pridatNakup(id) {
    const popis = prompt("Popis nákupu / služby (např. Výměna oleje):");
    if (!popis) return; // Pokud uživatel nic nezadá nebo dá Storno, funkce skončí

    const cena = prompt("Zadejte cenu (v Kč):");
    if (cena === null) return; // Pokud dá uživatel Storno

    let datum = prompt("Zadejte datum (nechte prázdné pro dnešní datum):", new Date().toLocaleDateString());
    if (datum === null) return;
    if (datum === "") datum = new Date().toLocaleDateString(); // Pokud nic nevyplní, použije se dnešek

    const auto = vozidla.find(a => a.id === id);
    
    // Uložíme všechny tři údaje do objektu
    auto.nakupy.push({
        popis: popis,
        cena: cena,
        datum: datum
    });

    ulozit();
    vykreslitVozidla();
}

function zobrazDetail(id) {
    const auto = vozidla.find(a => a.id === id);
    let nakupyHtml = auto.nakupy.map(n => `${n.datum} – ${n.popis}`).join("\n");
    alert(`Majitel: ${auto.majitel}\nModel: ${auto.model}\nSPZ: ${auto.spz}\nBarva: ${auto.barva}\nNákupy:\n${nakupyHtml}`);
}

function vykreslitVozidla() {
    if(!document.getElementById("seznamVozidel")) return;
    const seznam = document.getElementById("seznamVozidel");
    seznam.innerHTML = "";
    vozidla.forEach(auto => {
        seznam.innerHTML += `
        <div class="auto">
            <strong>Zákazník: ${auto.majitel}<br>SPZ: ${auto.spz}<br>Model vozidla: ${auto.model}</strong><br>
            <button onclick="zobrazDetail(${auto.id})">Detaily vozidla</button>
            <button onclick="upravitVozidlo(${auto.id})">Upravit</button>
            <button onclick="pridatNakup(${auto.id})">Přidat nákup / službu</button>
            <button onclick="smazatVozidlo(${auto.id})" style="background-color: #ff4d4d; color: white;">Smazat</button>
        </div>`;
    });
}

function upravitVozidlo(id) {
    const auto = vozidla.find(a => a.id === id);
    if (!auto) return;

    // Postupné dotazy na úpravu (předvyplněné aktuálními hodnotami)
    const novyMajitel = prompt("Upravit majitele:", auto.majitel);
    const novyModel = prompt("Upravit model:", auto.model);
    const novaSpz = prompt("Upravit SPZ:", auto.spz);
    const novaBarva = prompt("Upravit barvu:", auto.barva);

    // Pokud uživatel klikne na Storno, prompt vrátí null. 
    // Tady kontrolujeme, zda uživatel něco zadal.
    if (novyMajitel !== null && novyModel !== null && novaSpz !== null) {
        auto.majitel = novyMajitel;
        auto.model = novyModel;
        auto.spz = novaSpz;
        auto.barva = novaBarva;

        ulozit();
        vykreslitVozidla();
        alert("Údaje byly aktualizovány.");
    }
}

function smazatVozidlo(id) {
    // Najdeme vozidlo, abychom mohli v otázce vypsat jeho název/majitele
    const auto = vozidla.find(a => a.id === id);
    
    // Zobrazení potvrzovacího okna
    const potvrzeni = confirm(`Opravdu chcete smazat vozidlo majitele ${auto.majitel} (${auto.model})?`);

    if (potvrzeni) {
        // Vyfiltrujeme pole tak, aby v něm zůstala všechna auta kromě toho se zadaným ID
        vozidla = vozidla.filter(a => a.id !== id);
        
        ulozit(); // Uložíme aktualizované pole do localStorage
        vykreslitVozidla(); // Překreslíme seznam na stránce
    }
}

// Spuštění vykreslení při načtení stránky
document.addEventListener("DOMContentLoaded", vykreslitVozidla);
