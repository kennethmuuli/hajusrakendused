//TO-DO:
//Bug when creating new tasks and clicking their checkboxes (PutTask), before refresh, should reload page after task creation to pull to update to current task list
//Bug when creating new tasks and deleting them (sendDelete), before refresh, should reload page after task creation to pull to update to current task list
//Error (doesn't seem to affect functionality), @error SyntaxError: Unexpected end of JSON input at main.js:119:32

//Current task list
var tasks = [
    // {
    //     id: 1,
    //     name: 'Task 1',
    //     completed: false
    // },
    // {
    //     id: 2,
    //     name: 'Task 2',
    //     completed: true
    // }
];

let lastTaskId = 2;
let taskList;
let addTask;
let loginButton;

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', async () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    loginButton = document.querySelector('#login-submit');
    usernameInput = document.querySelector('#username');
    passwordInput = document.querySelector('#password');

    loginButton.addEventListener('click', () => {
        console.log('login clicked');
        console.log(usernameInput.value);
        console.log(passwordInput.value);
    });

    await loadInExistingTasks();

    tasks.forEach(renderTask);

    // tasks.forEach(element => {
    //     console.log(element.name);
    // });

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', async () => {
        const task =  await createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
        const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
        taskList.appendChild(taskRow); // Lisame taski lehele
    });
});

async function loadInExistingTasks(){
    await sendAPIRequest('read', 'tasks', null, null, null, true).then(result => { 
            for (let i = 0; i < result.length; i++) {
                const task = {
                    id: result[i].id,
                    name: result[i].title + result[i].id,
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
    // sendTaskCreate(task.name);
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

    //Auth headers w. bearer token, same for all
    myHeaders.append("Authorization", "Bearer lDqWakUjb7u4XfHEJqgwuHS1h3BN3NLC");

    switch (operation) {
        case 'create':
            //postAddTask
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=5da41a833673c3919987a659d739ffde0edbdf5257f6be6a9b6f30ee2941840da%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22ogjhMznfN0jwByY3KccgrCayIt7OWYrh%22%3B%7D");
            
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
            myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=21ebf6d3baf06082b9abf9907660ad9ca55ac75d3ad171c6e0fe9b2e2f52fd7ca%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22_XMkFH8zEX8duOiZiFG7CzY2lWfbX2Ck%22%3B%7D");

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
            myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=ef7f43f484f5a507a05686f7fb12df9341609ecbfe09f753a56245af072f83f5a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22S8XGwkj1cu81xdCtqtlOfhNAjJvsNsSL%22%3B%7D");
            
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
            myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=cd19049caf986fd25720c7f8db310e7213f5b17f47d4512ae2ff58b0fa07a5ada%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22o25mKeUWULcKHsKNxDh-4_eOFhAR2gxS%22%3B%7D");
            
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
    name.innerText = task.name;
    name.body = task.name;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => {
        //!bool to reverse boolean's current value, whatever it may be
        // sendTaskUpdate(task.name, !task.completed, task.id);
        sendAPIRequest('update', 'tasks', task.id, task.name, !task.completed);
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', async () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
        // await sendTaskDelete(task.id);
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