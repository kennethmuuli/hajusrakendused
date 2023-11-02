//TO-DO:
//Bug when creating new tasks and clicking their checkboxes (PutTask), before refresh, should reload page after task creation to pull to update to current task list
//Bug when creating new tasks and deleting them (sendDelete), before refresh, should reload page after task creation to pull to update to current task list
//Error (doesn't seem to affect functionality), @error SyntaxError: Unexpected end of JSON input at main.js:119:32

//Kasutajaandmete krüptimiseks
//bcrypt.generateString(32)

//Current task list
var tasks = [
    // Algne task struktuur
    // {
    //     id: 1,
    //     name: 'Task 1',
    //     completed: false
    // },
];

let lastTaskId = 2;
let taskList;
let addTask;
let loginButton;
let logoutButton;

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', async () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    loginButton = document.querySelector('#login-submit');
    logoutButton = document.querySelector('#logout-submit');
    usernameInput = document.querySelector('#username');
    passwordInput = document.querySelector('#password');

    loginButton.addEventListener('click', (event) => {
        //Keela vormi sumbit nupu default action, mis muidu lehte värskendab
        event.preventDefault();
        console.log('login clicked');
        login(usernameInput.value, passwordInput.value);
    });

    logoutButton.addEventListener('click', (event) => {
        //Keela vormi sumbit nupu default action, mis muidu lehte värskendab
        event.preventDefault();
        console.log('logout clicked');
        localStorage.clear();
    });

    await loadInExistingTasks();

    tasks.forEach(renderTask);

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', async () => {
        const task =  await createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
        const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
        taskList.appendChild(taskRow); // Lisame taski lehele
    });
});

/* Järgmise reaga vaadata hetkel olemasolevat tokenit, kui pole sisse logitud siis null, kui oled sisse logitud siis kuvab token konsooli*/
console.log(localStorage.getItem('token'));


async function login(username, password) {
    console.log('this')
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "username": username,
    "password": password
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    await fetch("https://demo2.z-bit.ee/users/get-token", requestOptions)
    .then(response => response.json())
    .then(result => {
        localStorage.setItem('token', result.access_token);
    })
    .catch(error => console.log('error', error));

}

async function loadInExistingTasks(){
    await sendAPIRequest('read', 'tasks', null, null, null, true).then(result => { 
            for (let i = 0; i < result.length; i++) {
                const task = {
                    id: result[i].id,
                    name: result[i].title,
                    completed: result[i].marked_as_done
                };
                tasks.push(task);
            }
        });
}

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTask() {
    lastTaskId++;
    const task = {
        // id: lastTaskId,
        name: 'Task ' + lastTaskId,
        completed: false
    };
    sendAPIRequest('create', 'tasks', null, task.name);
    return task;
}

/**
 * See funktsioon teeb fetchiga API requesti. Ootab operatsiooni: 'create', 'read', 'update', 'delete' | URLi pathi, kuhu request saata, ntks: 'tasks' | vahepealsed parameetrid vajaduspõhiselt, kui ei taha kasutada siis null | returnFetchResponseResult = true, kui soovid reponsega midagi edasi teha.
 */
function sendAPIRequest(operation, requestPath, taskId, taskTitle, taskIsCompleted, returnFetchResponseResult){

    let URL = `https://demo2.z-bit.ee`;

    //Vastavalt ette antule liidan URLile õige id ja path VÕI ainult pathi
    if (requestPath != null && taskId != null) {

        URL = [URL, requestPath, taskId].join('/');
        console.log(URL)
    }
    else if (requestPath != null && taskId == null) {
        URL = [URL, requestPath].join('/');
        console.log(URL)
    }

    const result = fetch(URL, createRequestOptions(operation, taskTitle, taskIsCompleted))
    .then(response => response.json())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));

    if (returnFetchResponseResult) {
        return result;
    }
}

/* Seatud headerite testimiseks */
// let head = createRequestOptions('update');
// console.log(JSON.stringify(Object.fromEntries(head)));

/**
 * See funktsioon voimaldab seada API call vajalikud headerid
 */
function createRequestOptions(operation, title, isCompleted) {
    var myHeaders = new Headers();

    //Sea autoriseerimise token
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);
    console.log(`Bearer ${localStorage.getItem('token')}`)

    switch (operation) {
        case 'create':
            //postAddTask
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=5da41a833673c3919987a659d739ffde0edbdf5257f6be6a9b6f30ee2941840da%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22ogjhMznfN0jwByY3KccgrCayIt7OWYrh%22%3B%7D");
            
            var callBody = JSON.stringify({
                "title": title,
                "desc": ""
                });
            
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: callBody,
            redirect: 'follow' //constant (for this app)
            };

            return requestOptions;
        case 'read':
            //requestExisiting
            // myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=21ebf6d3baf06082b9abf9907660ad9ca55ac75d3ad171c6e0fe9b2e2f52fd7ca%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22_XMkFH8zEX8duOiZiFG7CzY2lWfbX2Ck%22%3B%7D");

            var callBody;

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                body: callBody,
                redirect: 'follow' //constant (for this app)
                };

            return requestOptions;
        case 'update':
            //putTask
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=ef7f43f484f5a507a05686f7fb12df9341609ecbfe09f753a56245af072f83f5a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22S8XGwkj1cu81xdCtqtlOfhNAjJvsNsSL%22%3B%7D");
            
            var callBody = JSON.stringify({
                "title": title,
                "marked_as_done": isCompleted
                });
            
            var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: callBody,
            redirect: 'follow'
            };

            return requestOptions;
        case 'delete':
            //sendDelete
            // myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=cd19049caf986fd25720c7f8db310e7213f5b17f47d4512ae2ff58b0fa07a5ada%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22o25mKeUWULcKHsKNxDh-4_eOFhAR2gxS%22%3B%7D");
            
            var raw;

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            return requestOptions;
        default:
            console.log("ERROR! No matching headers to set found!")
            break;
        
    }
}


function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Täidame vormi väljad andmetega
    const name = taskRow.querySelector("[name='name']");
    // name.innerText = task.name;
    name.value = task.name;
    name.addEventListener('blur', () => {
        // console.log('input clicked')
        let clickAway;
        //Hetkel läheb click away event kõigi külge. Võiks lisada input väljale alles peale selle klikkimist, et vältida absurdselt paljusid päringuid
        // clickAway = document.body.addEventListener('mouseup', function clickOff() {
        //     console.log('clicked away from task input');
            sendAPIRequest('update', 'tasks', task.id, name.value);
            //Eemaldan eventlisteneri registreeritutest, muidu antud koodiga muudkui lisab neid iga input clickiga juurde
            // clickAway = document.body.removeEventListener('mouseup', clickOff);

            // 'blur'
        // }); 
    });

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => {
        //!bool to reverse boolean's current value, whatever it may be
        sendAPIRequest('update', 'tasks', task.id, name.value, !task.completed);
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', async () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
        await sendAPIRequest('delete', 'tasks', task.id);
    });

    // Valmistame checkboxi ette vajutamiseks
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}


function createAntCheckbox() {
    const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
    checkbox.removeAttribute('data-template');
    hydrateAntCheckboxes(checkbox);
    return checkbox;
}

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }
        
        // Kui checkboxi või label'i peale vajutatakse siis muudetakse checkboxi olekut
        wrapper.addEventListener('click', () => {
            input.checked = !input.checked;
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}