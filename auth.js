function getUsers(){
  let users = safeJSON(localStorage.getItem(DB_KEYS.users) || "[]", []);
  if(!Array.isArray(users)) users = [];

  // Usuario inicial de la app
  if(users.length === 0){
    users = [{ user:"Maricela", pass:"pepe", role:"Administrador" }];
    localStorage.setItem(DB_KEYS.users, JSON.stringify(users));
    return users;
  }

  // Actualiza instalaciones antiguas que todavía tengan el usuario inicial anterior.
  const oldDefaultIndex = users.findIndex(u => u.user === "admin" && u.pass === "1234");
  const hasNewDefault = users.some(u => u.user === "Maricela");
  if(oldDefaultIndex >= 0 && !hasNewDefault){
    users[oldDefaultIndex] = { user:"Maricela", pass:"pepe", role: users[oldDefaultIndex].role || "Administrador" };
    localStorage.setItem(DB_KEYS.users, JSON.stringify(users));
  }

  return users;
}

function setUsers(users){
  localStorage.setItem(DB_KEYS.users, JSON.stringify(users));
}

function login(username, password){
  const user = getUsers().find(u => u.user === username && u.pass === password);
  if(!user) return false;
  localStorage.setItem(DB_KEYS.session, JSON.stringify({ user:user.user, role:user.role || "Usuario" }));
  return true;
}

function currentUser(){
  return safeJSON(localStorage.getItem(DB_KEYS.session) || "null", null);
}

function logout(){
  localStorage.removeItem(DB_KEYS.session);
}

function addUser(username, password, role="Usuario"){
  username = String(username || "").trim();
  password = String(password || "").trim();
  if(!username || !password) throw new Error("Escribe usuario y contraseña.");
  const users = getUsers();
  if(users.some(u => u.user === username)) throw new Error("Ese usuario ya existe.");
  users.push({ user:username, pass:password, role });
  setUsers(users);
}

function changePassword(username, oldPass, newPass){
  const users = getUsers();
  const i = users.findIndex(u => u.user === username && u.pass === oldPass);
  if(i < 0) return false;
  if(!newPass || newPass.length < 3) throw new Error("La nueva contraseña debe tener al menos 3 caracteres.");
  users[i].pass = newPass;
  setUsers(users);
  return true;
}
