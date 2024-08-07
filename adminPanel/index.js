async function load(){
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location

    const request = await fetch(`http://${hostname}:${port}/getMacros`);
    const content = JSON.parse(await request.text());
    
    const dorpdown = document.getElementById("macros");
    for (const macro of content.Macros){
        let macroTab = document.createElement('option');
        macroTab.value = macro;
        macroTab.innerHTML = macro;
        
        dorpdown.appendChild(macroTab);
    }
}

async function addUser(){
    const macro = document.getElementById("macro-selector");
    const uuid = document.getElementById("uuid");
    const {
        host, hostname, href, origin, pathname, port, protocol, search
    } = window.location
    
    const request = await fetch(`http://${hostname}:${port}/writeToJSON${search}`, {
        headers:{
            "macro":macro.value,
            "uuid":uuid.value
        }
    });

    console.log(`${JSON.parse(await request.text()).reason}`)

    // uuid.value = '';
}