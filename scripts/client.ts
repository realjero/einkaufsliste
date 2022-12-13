function loadList() {
    const req = new XMLHttpRequest();
    req.open('GET', '/get', true);
    req.send();
    req.onload = () => {
        if(req.status == 200) {
            document.getElementById('table_items').innerHTML = req.response;
        } else {
            console.log("loadList error")
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadList();
})