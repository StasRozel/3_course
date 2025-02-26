async function fetchUsersError() {
  const response = await fetch("http://localhost:3000/us/");
  const status = await response.status;
  return status;
}

async function fetchUsers() {
  const response = await fetch("http://localhost:3000/users/");
  const status = await response.status;
  return status;
}

async function fetchNotAuth() {
  const response = await fetch("https://rutracker.net/forum/tracker.php?nm=%D0%94%D0%BE%D0%B2%D0%BE%D0%B4");
  const status = response.status;
  console.log();
}

async function fetchUsersPages() {
  const response = await fetch("http://localhost:3000/users?page=1&limit=100");
  const status = await response.status;
  return status;
}

async function fetchGetUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const status = response.status;
  console.log(status);
  const user = await response.json();
  return status;
}

async function fetchCreateNewUser(nameInput, emailInput) {
  const response = await fetch("http://localhost:3000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nameInput, email: emailInput }),
  });
  const status = response.status;
  console.log(status);
  return status;
}

async function fetchEditUser(id, nameInput, emailInput) {
  const response = await fetch(`http://localhost:3000/users/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nameInput, email: emailInput }),
  });
  const result = response.status;
  console.log(result);
  return result;
}

async function fetchDeleteUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}/`, {
    method: "DELETE",
  });
  const status = response.status;
  return status;
}

describe("User Management API Testing", () => {
  it("should fetch all users", async () => {
    assert.equal(await fetchUsers(), 200);
  });

  it("should fetch users with pagination", async () => {
    assert.equal(await fetchUsersPages(), 200);
  });

  it("should fetch a single user", async () => {
    assert.equal(await fetchGetUser(1), 200);
  });

  it("should create a new user", async () => {
    assert.equal(await fetchCreateNewUser("Stas Rozel", "rozelstas@gmail.com"), 201);
  });

  it("should update an existing user", async () => {
    assert.equal(await fetchEditUser(1, "Stas", "rozelstas@gmail.com"), 201);
  });

  it("should return 404 when deleting a non-existent user", async () => {
    assert.equal(await fetchDeleteUser(Number.MAX_VALUE + 3432), 400);
  });

  it("should return 400 when creating a user with invalid data types", async () => {
    assert.equal(await fetchCreateNewUser("Aboba11", 1), 400);
  });

  it("should return 404 for a non-existent endpoint", async () => {
    assert.equal(await fetchUsersError(), 404);
  });

  it("should return 302 for an unauthorized request", async () => {
    assert.equal(await fetchNotAuth(), 302);
  });
});
