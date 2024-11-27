spicy = {
  "Leggera":"&#127798",
  "Mild":"&#127798",
  "Media":"&#127798 &#127798",
  "Medium":"&#127798 &#127798",
  "Piccante":"&#127798 &#127798 &#127798",
  "Spicy":"&#127798 &#127798 &#127798"
}

let makeSalsaSelector = (data, proteinSelector) => {
  document.getElementById("salsas").innerHTML = "";
  let salsaSelector = document.createElement("select");
  salsaSelector.id = "salsaSelector";
  let nosalsa = document.createElement("option");
  nosalsa.innerText = (document.getElementById("language").checked ? "No Sauce" : "Niente Salsa")
  nosalsa.value = "-1";
  salsaSelector.appendChild(nosalsa);
  data.proteins[proteinSelector.value].salsas.forEach((salsa, i) => {
    let opt = document.createElement("option");
    opt.innerHTML = `${salsa.name} ${spicy[salsa.spiciness]}`;
    opt.value = i;
    salsaSelector.appendChild(opt);
  });
  let label = document.createElement("label");
  label.setAttribute("for", "salsaSelector");
  label.innerText = (document.getElementById("language").checked ? "Sauce" : "Salsa")
  document.getElementById("salsas").appendChild(label);
  salsaSelector.addEventListener("change", () => {
    makeRecap(data);
  })
  document.getElementById("salsas").appendChild(salsaSelector);
};

let makeToppingSelector = (data, proteinSelector) => {
  document.getElementById("toppings").innerHTML = "";
  data.proteins[proteinSelector.value].toppings.forEach((topping, i) => {
    let div = document.createElement("div");
    let opt = document.createElement("input");
    opt.setAttribute("type", "checkbox");
    opt.id = topping.name;
    opt.value = topping.name;
    opt.name ="toppings"
    let label = document.createElement("label");
    label.innerText = `${topping.quantity} ${(document.getElementById("language").checked ? "of" : "di")} ${topping.name}`;
    label.setAttribute("for", topping.name);
    div.appendChild(opt);
    div.appendChild(label);
    opt.addEventListener("change", () => {
      makeRecap(data);
    })
    document.getElementById("toppings").appendChild(div);
  });
};

let makeRecap = (data) => {
  protein = data.proteins[document.getElementById("proteinSelector").value].name;
  salsa = (document.getElementById("salsaSelector").value == -1 ? -1 : data.proteins[document.getElementById("proteinSelector").value].salsas[document.getElementById("salsaSelector").value].name);
  toppings = document.querySelectorAll('input[type=checkbox][name=toppings]:checked');
  list = ``;
  toppings.forEach(topping => {
    list += `\n- ${topping.value}`
  })
  document.getElementById("recap").innerText = `${(document.getElementById("language").checked ? "Your taco will contain" : "Il tuo taco avrà")}:\n- ${protein}${(salsa==-1?``:`\n- ${salsa}`)}${list}`;
}

let makePage = (url) => {
  document.getElementById("protein").innerHTML = "";
  document.getElementById("salsas").innerHTML = "";
  document.getElementById("toppings").innerHTML = "";
  fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      let proteinSelector = document.createElement("select");
      proteinSelector.id = "proteinSelector";
      let label = document.createElement("label");
      label.setAttribute("for", "proteinSelector");
      label.innerText = (document.getElementById("language").checked ? "Protein" : "Proteine")
      data.proteins.forEach((element, i) => {
        let opt = document.createElement("option");
        opt.innerText = `${element.name} (${element.preparation})`;
        opt.value = i;
        proteinSelector.appendChild(opt);
      });
      document.getElementById("protein").appendChild(label);
      document.getElementById("protein").appendChild(proteinSelector);
      
      makeSalsaSelector(data, proteinSelector);
      makeToppingSelector(data, proteinSelector)
      makeRecap(data);

      proteinSelector.addEventListener("change", () => {
        makeSalsaSelector(data, proteinSelector);
        makeToppingSelector(data, proteinSelector);
        makeRecap(data);
      });
    });
};

window.onload = () => {
  let ita = "https://mocki.io/v1/79f87e5d-b34a-4dba-b64b-32ad4ce919f7";
  let eng = "https://mocki.io/v1/bfb40168-1a2f-4324-aa8a-611ab475ab5a";
  makePage(ita);
  let btn = document.getElementById("language");
  btn.addEventListener("change", () => {
    btn.checked ? makePage(eng) : makePage(ita);
  });
};
