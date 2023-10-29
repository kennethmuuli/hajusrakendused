var myRequestHeaders = new Headers();
myRequestHeaders.append("Authorization", "Bearer lDqWakUjb7u4XfHEJqgwuHS1h3BN3NLC");
myRequestHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=21ebf6d3baf06082b9abf9907660ad9ca55ac75d3ad171c6e0fe9b2e2f52fd7ca%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22_XMkFH8zEX8duOiZiFG7CzY2lWfbX2Ck%22%3B%7D");

var callBody;

var requestRequestOptions = {
  method: 'GET',
  headers: myRequestHeaders,
  body: callBody,
  redirect: 'follow'
};

var obj;

async function requestExisting () {
    const result = fetch("https://demo2.z-bit.ee/tasks", requestRequestOptions)
      .then(response => response.json())
      .catch(error => console.log('error', error))
      ;

    return result;
}

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

// kui leht on brauseris laetud siis lisame esimesed taskid lehele
window.addEventListener('load', async () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');

    await loadInExistingTasks();

    tasks.forEach(renderTask);

    tasks.forEach(element => {
        console.log(element.name);
    });

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', () => {
        const task = createTask(); // Teeme kõigepealt lokaalsesse "andmebaasi" uue taski
        const taskRow = createTaskRow(task); // Teeme uue taski HTML elementi mille saaks lehe peale listi lisada
        taskList.appendChild(taskRow); // Lisame taski lehele
    });
});

async function loadInExistingTasks(){
    await requestExisting().then(result => {
        
        for (let i = 0; i < result.length; i++) {
            // const element = array[i];
            
            const task = {
                id: result[i].id,
                name: result[i].title + result[i].id,
                completed: result[i].marked_as_done
            };
            tasks.push(task);
        }
        // console.log(result)
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
    PostAddTask(task.name);
    // tasks.push(task);
    return task;
}

async function PostAddTask(title) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer lDqWakUjb7u4XfHEJqgwuHS1h3BN3NLC");
    myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=5da41a833673c3919987a659d739ffde0edbdf5257f6be6a9b6f30ee2941840da%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22ogjhMznfN0jwByY3KccgrCayIt7OWYrh%22%3B%7D");

    var raw = JSON.stringify({
    "title": title,
    "desc": ""
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("https://demo2.z-bit.ee/tasks", requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function putTask(title, isCompleted, id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer lDqWakUjb7u4XfHEJqgwuHS1h3BN3NLC");
    myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=ef7f43f484f5a507a05686f7fb12df9341609ecbfe09f753a56245af072f83f5a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22S8XGwkj1cu81xdCtqtlOfhNAjJvsNsSL%22%3B%7D");

    var raw = JSON.stringify({
    "title": title,
    "marked_as_done": isCompleted
    });

    var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`https://demo2.z-bit.ee/tasks/${id}`, requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function createTaskRow(task) {
    let taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    // Täidame vormi väljad andmetega
    const name = taskRow.querySelector("[name='name']");
    name.innerText = task.name;

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => {
        putTask(task.name, !task.completed, task.id);
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
        sendDelete(task.id);
    });

    // Valmistame checkboxi ette vajutamiseks
    hydrateAntCheckboxes(taskRow);

    return taskRow;
}

function sendDelete (id) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer lDqWakUjb7u4XfHEJqgwuHS1h3BN3NLC");
    myHeaders.append("Cookie", "PHPSESSID=9smfd1sssgvpgn3soeasd3dukv; _csrf=cd19049caf986fd25720c7f8db310e7213f5b17f47d4512ae2ff58b0fa07a5ada%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22o25mKeUWULcKHsKNxDh-4_eOFhAR2gxS%22%3B%7D");

    var raw = "";

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch(`https://demo2.z-bit.ee/tasks/${id}`, requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
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