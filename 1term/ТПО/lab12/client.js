const userTable = document.getElementById("userTable");
const createForm = document.getElementById("createForm");

async function fetchUsers() {
  const response = await fetch("http://localhost:3000/users");
  const users = await response.json();
  displayUsers(users);
  return users;
}

async function fetchGetUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

async function fetchCreateNewUser(nameInput, emailInput) {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nameInput, email: emailInput }),
  });

  return await response.json();
}

async function fetchEditUser(id, nameInput, emailInput) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nameInput, email: emailInput }),
  });
  return await response.json();
}

async function fetchDeleteUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}

function displayUsers(users) {
  const tableBody = userTable.querySelector("tbody");
  tableBody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button class="edit-btn" data-id="${user.id}">Edit</button>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
          </td>
        `;
    tableBody.appendChild(row);
  });

  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", editUser);
  });

  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", deleteUser);
  });
}

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");

  const newUser = await fetchCreateNewUser(nameInput.value, emailInput.value);

  displayUsers([newUser]);

  nameInput.value = "";
  emailInput.value = "";
});

fetchUsers();

async function editUser(event) {
  const userId = event.target.dataset.id;

  const user = await fetchGetUser(userId);

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <h2>Edit User</h2>
          <form id="editForm">
            <label for="nameInput">Name:</label>
            <input type="text" id="nameInput" value="${user.name}" required>
            <label for="emailInput">Email:</label>
            <input type="email" id="emailInput" value="${user.email}" required>
            <button type="submit">Save</button>
          </form>
        </div>
      `;
  document.body.appendChild(modal);

  // Обработчик закрытия модального окна
  const closeButton = modal.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  // Обработчик отправки формы редактирования
  const editForm = modal.querySelector("#editForm");
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = modal.querySelector("#nameInput");
    const emailInput = modal.querySelector("#emailInput");

    const updatedUser = await fetchEditUser(userId, nameInput.value, emailInput.value);
    
    displayUsers([updatedUser]);
    modal.remove();
  });
}

async function deleteUser(event) {
  const userId = event.target.dataset.id;

  await fetchDeleteUser(userId);

  fetchUsers();
}
