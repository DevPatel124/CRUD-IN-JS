/* CRUD - Create, Read, Update, Delete */
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const employeeModal = document.getElementById('employeeModal');
const closeModalBtn = document.getElementsByClassName('close')[0];
const employeeForm = document.getElementById('employeeForm');
const employeeIdInput = document.getElementById('employeeId');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const skillSelect = document.getElementById('skillSelect');
const maleRadio = document.getElementById('male');
const femaleRadio = document.getElementById('female');
const otherRadio = document.getElementById('other');
const employeesList = document.getElementById('employeesList');
const pagination = document.getElementById('pagination');

addEmployeeBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
employeeForm.addEventListener('submit', saveEmployee);

let currentPage = 1;
const employeesPerPage = 5;

// open the modal
function openModal() {
    employeeForm.reset();
    employeeIdInput.value = '';
    employeeModal.style.display = 'block';
}

// close the modal
function closeModal() {
    employeeModal.style.display = 'none';
}

// save an employee
function saveEmployee(event) {
    event.preventDefault();

    const employeeId = employeeIdInput.value;
    const name = nameInput.value;
    const email = emailInput.value;
    const skill = skillSelect.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    const employee = {
        id: employeeId ? parseInt(employeeId) : generateRandomId(),
        name,
        email,
        skill,
        gender
    };

    let employees = getEmployeesFromLocalStorage();
    const currentEmployeeIndex = employees.findIndex(emp => emp.id === employee.id);

    if (currentEmployeeIndex !== -1) {
        employees[currentEmployeeIndex] = employee;
    }
    else {
        employees.push(employee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    closeModal();
    renderEmployees();
}

// getting employee details from localstorage
function getEmployeesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('employees')) || [];
}

// generate a random ID
function generateRandomId() {
    return Math.floor(Math.random() * 10000);
}

// provide employee details(employees)
function renderEmployees() {
    const employees = getEmployeesFromLocalStorage();
    const startIndex = (currentPage - 1) * employeesPerPage;
    const endIndex = startIndex + employeesPerPage;
    const paginatedEmployees = employees.slice(startIndex, endIndex);

    employeesList.innerHTML = '';

    if (paginatedEmployees.length > 0) {
        var table = document.createElement('table');
        table.setAttribute("class", "content-table");
        table.setAttribute("id", "myTable");
        table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Skill</th>
                <th>Gender</th>
                <th>Actions</th>
            </tr>
        </thead>
      `;

        paginatedEmployees.forEach(employee => {
            // Select the table body element
            const tableBody = document.createElement('tbody');
            tableBody.setAttribute("id", "search-table");

            var row = document.createElement('tr');
            row.innerHTML = `
          <td>${employee.id}</td>
          <td>${employee.name}</td>
          <td>${employee.email}</td>
          <td>${employee.skill}</td>
          <td>${employee.gender}</td>
          <td>
            <button class="btnEdit-popup" onclick="editEmployee(${employee.id})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btnDelete-popup" onclick="deleteEmployee(${employee.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
            table.appendChild(row);
        });

        employeesList.appendChild(table);
    } else {
        employeesList.textContent = 'No employees found.';
    }

    renderPagination(employees.length);
}
// pagination
function renderPagination(totalEmployees) {
    const totalPages = Math.ceil(totalEmployees / employeesPerPage);
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderEmployees();
        });
        pagination.appendChild(pageBtn);
    }
}

// edit employee
function editEmployee(employeeId) {
    const employees = getEmployeesFromLocalStorage();
    const employee = employees.find(emp => emp.id === employeeId);

    if (employee) {
        openModal();
        employeeIdInput.value = employee.id;
        nameInput.value = employee.name;
        emailInput.value = employee.email;
        skillSelect.value = employee.skill;
        if (employee.gender === 'Male') {
            maleRadio.checked = true;
        } else if (employee.gender === 'Female') {
            femaleRadio.checked = true;
        } else if (employee.gender === 'Other') {
            otherRadio.checked = true;
        }
    }
}

// delete employee
function deleteEmployee(employeeId) {
    const employees = getEmployeesFromLocalStorage();
    const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
    localStorage.setItem('employees', JSON.stringify(filteredEmployees));
    renderEmployees();
}

renderEmployees();

function mySearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}