async function getPaswordProtectedUUIDFromMacro(macro) {
    const {host, hostname, href, origin, pathname, port, protocol, search} = window.location

    const request = await fetch(`http://${hostname}:${port}/getUUIDs${search}`, {headers:{macro:macro}});
    const content = JSON.parse(await request.text());

    return content
}

async function addoption(parrent, childType, content) {
    let child = document.createElement(childType);
    child.value = content;
    child.innerHTML = content;
    parrent.appendChild(child);
}



async function load(){
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location

    const request = await fetch(`http://${hostname}:${port}/getMacros`);
    const content = JSON.parse(await request.text());
    
    const dropdown1 = document.getElementById('macros-add');
    const dropdown2 = document.getElementById('macros-remove');
    
    for (const macro of content.Macros) {
        await addoption(dropdown1, 'option', macro);
        await addoption(dropdown2, 'option', macro);
    }
    loadUUIDs()
}

async function loadUUIDs(){
    const selected = document.getElementById('macro-selector-remove').value;
    const content = await getPaswordProtectedUUIDFromMacro(selected);
    
    const uuidDropdown = document.getElementById('uuid-selector-dropdown');
    const nameDropdown = document.getElementById('ign-selector-dropdown');
    uuidDropdown.innerHTML = '';
    nameDropdown.innerHTML = '';

    for (const [uuid, name] of Object.entries(content.uuid)) {
        await addoption(uuidDropdown, 'option', uuid);
        await addoption(nameDropdown, 'option', name);
    }
}

async function nameSwap(){
    const selected = document.getElementById('macro-selector-remove').value;
    const content = await getPaswordProtectedUUIDFromMacro(selected);
    const nameDropdown = document.getElementById('ign-selector');

    const value = Object.keys(content.uuid).find(key => content.uuid[key] === nameDropdown.value);
    document.getElementById('uuid-remove').value = value;
}

async function uuidSwap(){
    const selected = document.getElementById('macro-selector-remove').value;
    const content = await getPaswordProtectedUUIDFromMacro(selected);
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
    loadUUIDs()
}