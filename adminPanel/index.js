async function load(){
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location

    const request = await fetch(`http://${hostname}:${port}/getMacros`);
    const content = JSON.parse(await request.text());
    
    const dropdown1 = document.getElementById('macros-add');
    const dropdown2 = document.getElementById('macros-remove');
    
    for (const macro of content.Macros) {
    
        let macroTab1 = document.createElement('option');
        macroTab1.value = macro;
        macroTab1.innerHTML = macro;
        dropdown1.appendChild(macroTab1);
    
        let macroTab2 = document.createElement('option');
        macroTab2.value = macro;
        macroTab2.innerHTML = macro;
        dropdown2.appendChild(macroTab2);
    }
    

    loadUUIDs()
}

async function loadUUIDs(){
    const selected = document.getElementById('macro-selector-remove').value;
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location


    const request = await fetch(`http://${hostname}:${port}/getUUIDs${search}`, {headers:{macro:selected}});
    const content = JSON.parse(await request.text());
    
    const uuidDropdown = document.getElementById('uuid-selector-dropdown');
    const nameDropdown = document.getElementById('ign-selector-dropdown');
    uuidDropdown.innerHTML = '';
    nameDropdown.innerHTML = '';



    for (const [uuid, name] of Object.entries(content.uuid)) {

        console.log(uuid)

        let uuidTab = document.createElement('option');
        uuidTab.value = uuid;
        uuidTab.innerHTML = uuid;
        uuidDropdown.appendChild(uuidTab);

        let nameTab = document.createElement('option');
        nameTab.value = name;
        nameTab.innerHTML = name;
        nameDropdown.appendChild(nameTab);
    }
}

async function nameSwap(){
    const selected = document.getElementById('macro-selector-remove').value;
    const {host, hostname, href, origin, pathname, port, protocol, search} = window.location;

    const request = await fetch(`http://${hostname}:${port}/getUUIDs${search}`, {headers:{macro:selected}});
    const content = JSON.parse(await request.text());

    const nameDropdown = document.getElementById('ign-selector');

    const value = Object.keys(content.uuid).find(key => content.uuid[key] === nameDropdown.value);
    document.getElementById('uuid-remove').value = value;
}

async function uuidSwap(){
    const selected = document.getElementById('macro-selector-remove').value;
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location

    const request = await fetch(`http://${hostname}:${port}/getUUIDs${search}`, {headers:{macro:selected}});
    const content = JSON.parse(await request.text());

    const uuidDropdown = document.getElementById('uuid-remove');

    document.getElementById('ign-selector').value = content.uuid[uuidDropdown.value];
}


async function addUser(){
    const macro = document.getElementById("macro-selector-add");
    const name = document.getElementById("ign-add")
    const uuid = document.getElementById("uuid-add");
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location
    

    const request = await fetch(`http://${hostname}:${port}/writeToJSON${search}`, {
        headers:{
            "macro":macro.value,
            "uuid":uuid.value,
            "name":name.value
        }
    });

    console.log(`${JSON.parse(await request.text()).reason}`)

    name.value = '';
    uuid.value = '';
    loadUUIDs()
}

async function removeUser(){
    const macro = document.getElementById("macro-selector-remove");
    const uuid = document.getElementById("uuid-remove");
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location
    
    const request = await fetch(`http://${hostname}:${port}/removeToJSON${search}`, {
        headers:{
            "macro":macro.value,
            "uuid":uuid.value
        }
    });

    console.log(`${JSON.parse(await request.text()).reason}`)
    uuid.value = '';
    loadUUIDs()
}