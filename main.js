async function process() {
    let r = await fetch("/data.json");
    let data = await r.json();
    
    let mappedData = data.map(item => {
        return item['Насколько курс был полезен?'];
    })

    let uniqueValues = [...new Set(mappedData)]

    let select = document.querySelector("#selectPoleznost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })

    //----------------------

    mappedData = data.map(item => {
        return item['Насколько доволен форматом обучения?'];
    })

    uniqueValues = [...new Set(mappedData)]

    select = document.querySelector("#selectDovolnost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })

    //----------------------------

    mappedData = data.map(item => {
        return item['Отметь, в какой мере ты удовлетворен курсом?'];
    })

    uniqueValues = [...new Set(mappedData)]

    select = document.querySelector("#selectUdovletvoronost");

    uniqueValues.forEach(item => {
        let option = document.createElement("option"); 

        option.value = item; 
        option.text = item;

        select.add(option) 
    })
}

async function processFilter() {
    let r = await fetch("/data.json");
    let data = await r.json();
    console.log(data);

    let filteredData = data.filter(item => item["Насколько курс был полезен?"] == "Полезный")
    console.log(filteredData);
}

async function onSelectChanged(coolSelect) {
    let selectPoleznost = document.querySelector(coolSelect)
    console.log(selectPoleznost.value)
    updating()
}

async function updating() {
    let r = await fetch("/data.json");
    let data = await r.json();
    let container = document.querySelector("#elements-container > tbody");

    let selectPoleznost = document.querySelector("#selectPoleznost");
    let selectDovolnost = document.querySelector("#selectDovolnost");
    let selectUdovletvoronost = document.querySelector("#selectUdovletvoronost");

    let filteredData = data.filter(item => {
        return (selectPoleznost.value == 'не важно' || item['Насколько курс был полезен?'] == selectPoleznost.value) &&
               (selectDovolnost.value == 'не важно' || item['Насколько доволен форматом обучения?'] == selectDovolnost.value) &&
               (selectUdovletvoronost.value == 'не важно' || item['Отметь, в какой мере ты удовлетворен курсом?'] == selectUdovletvoronost.value)
    });

    container.replaceChildren();

    let poleznost = filteredData.map(item => item['Насколько курс был полезен?']);
    console.log("Значения в столбике полезность:")
    console.log(poleznost)

    let poleznostCounters = {} // заводим пустой словарик
    poleznost.forEach(item => { // с помощью forEach, обходим элементы списка
        // poleznostCounters[item] | 0 -- это хитрая фиговина 
        // которая вернет значение poleznostCounters[item] если ключ item есть в словарике poleznostCounters
        // и 0 если ключа item нет в словарике poleznostCounters
        // ну а "+1" это чтобы увеличивать предыдущее значение ключа на 1, когда встречаем очередное значение
        // то есть когда встретим первый раз то положится значение  1
        poleznostCounters[item] = (poleznostCounters[item] | 0) + 1
    })
    let poleznostStatsNode = document.querySelector("#poleznostStats .stats")
    poleznostStatsNode.innerText = JSON.stringify(poleznostCounters);

    filteredData.forEach(item => {
        container.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${item['ID']}</td>
            <td>${item['Насколько курс был полезен?']}</td>
            <td>${item['Насколько доволен форматом обучения?']}</td>
            <td>${item['Отметь, в какой мере ты удовлетворен курсом?']}</td>
        </tr>
        `);
    });
}

process()
processFilter()
fillListPoleznost()
fillListDovolnost()
fillListUdovletvoronost()