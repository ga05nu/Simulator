var num_processes = 0;
var num_resources = 0;

function createProcess() {
    const processesContainer = document.getElementsByClassName("processes")[0];
    
    // Generate circle
    const circle = document.createElement("div");
    circle.className = "circle";
    circle.innerText = "P" + (num_processes + 1);
    processesContainer.appendChild(circle);
    num_processes++;
}

function createResource() {
    const resourcesContainer = document.getElementsByClassName("resources")[0];
    
    // Generate rectangle
    const rect = document.createElement("div");
    rect.className = "rect";
    const rectContainer = document.createElement("div");
    rectContainer.className = "resource-container";

    // Generate dots
    const dot_row = document.createElement("div");
    dot_row.className = "dot-row";

    const num_instances = document.getElementById("num_res").value || 1;
    for(i = 0; i < num_instances; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = "black";

        dot_row.appendChild(dot);
    }

    rectContainer.appendChild(dot_row);
    rectContainer.appendChild(document.createTextNode("R" + (num_resources + 1)));
    rect.appendChild(rectContainer);
    resourcesContainer.appendChild(rect);
    num_resources++;
}