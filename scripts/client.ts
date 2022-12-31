let editing = false;

function loadList() {
    const req = new XMLHttpRequest();
    req.open('GET', 'get');
    req.send();
    req.onload = () => {
        if(req.status == 200) {
            document.getElementById('table_items').innerHTML = req.response;
        } else {
            console.log("loadList error");
        }
    };
}

function newEntry(name: string) {
    const js = {
        "name": name
    };
    const req = new XMLHttpRequest();
    req.open('POST', '/new');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify(js));
    req.onload = () => {
        if(req.status === 200) {
            loadList();
        } else {
            console.log("new entry: " + req.status);
        }
    };
}

function save() {
    const req = new XMLHttpRequest();
    req.open('GET', 'save');
    req.send();
    req.onload = () => {
        if(req.status === 200) {
            loadList();
        } else {
            console.log("save: " + req.status);
        }
    };
}

function show_button(event) {
    event.preventDefault();
    if(!editing) {
        if(event.target.parentElement.tagName === 'TR') {
            const index = event.target.parentElement.rowIndex;
            if(index !== 0) {
                editing = true;
                document.getElementById("button_holder" + index).innerHTML = buttons;
                document.getElementById("table_element" + index + "0").contentEditable = 'true';
                document.getElementById("table_element" + index + "1").contentEditable = 'true';
                document.getElementById("table_element" + index + "2").contentEditable = 'true';
                document.getElementById("table_element" + index + "3").contentEditable = 'true';
                event.target.focus();
            }
        }
    }
}

function updateBackDelete(event) {
    if(editing) {
        if (event.target.id === 'back') {
            editing = false;
            const index = event.target.parentElement.parentElement.rowIndex;
            document.getElementById("button_holder" + index).innerHTML = "";
            document.getElementById("table_element" + index + "0").contentEditable = 'false';
            document.getElementById("table_element" + index + "1").contentEditable = 'false';
            document.getElementById("table_element" + index + "2").contentEditable = 'false';
            document.getElementById("table_element" + index + "3").contentEditable = 'false';
            loadList();
        } else if (event.target.id === 'update') {
            editing = false;
            const index = event.target.parentElement.parentElement.rowIndex;
            const request = new XMLHttpRequest();
            const js = {
                "id": (index - 1),
                "wer": document.getElementById("table_element" + index + "0").innerHTML,
                "was": document.getElementById("table_element" + index + "1").innerHTML,
                "wo": document.getElementById("table_element" + index + "2").innerHTML,
                "wann": document.getElementById("table_element" + index + "3").innerHTML
            };
            request.open('POST', 'update');
            request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            request.send(JSON.stringify(js));
            request.onload = () => {
                if(request.status === 200) {
                    loadList();
                } else {
                    console.log("update: " + request.status);
                }
            }
        } else if (event.target.id === 'delete') {
            editing = false;
            const request = new XMLHttpRequest();
            request.open('POST', 'remove');
            request.send(JSON.stringify({"id": event.target.parentElement.parentElement.rowIndex}));
            request.onload = () => {
                if(request.status === 200) {
                    loadList();
                } else {
                    console.log("delete: " + request.status);
                }
            }
        }
    }
}

const buttons = '<button type="button" class="editable" id="update">U</button>' +
    '<button type="button" class="editable" id="back">B</button>' +
    '<button type="button" class="editable" id="delete">X</button>';

document.addEventListener('DOMContentLoaded', () => {
    loadList();
    document.getElementById("new").addEventListener('click', (event) => {
        if(!editing) {
            const user_input = document.getElementById("user") as HTMLInputElement;
            newEntry(user_input.value);
        }
    });

    document.getElementById("save").addEventListener('click', (event) => {
        if(!editing) {
            save();
        }
    });

    document.getElementById("table_items").addEventListener('click', (event) => {
        show_button(event);
        updateBackDelete(event);
    });
})