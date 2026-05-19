const STORAGE_KEY = "bu_users";
const SESSION_KEY = "bu_session";

const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export function nickExists(nick) {
    return getUsers().some(u => u.nick.toLowerCase() === nick.toLowerCase());
}

export function register(nick, password) {
    if (nickExists(nick)) throw new Error("Ese nick ya está en uso");
    const users = getUsers();
    users.push({ nick, password });
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, nick);
    return nick;
}

export function login(nick, password) {
    const users = getUsers();
    const user = users.find(u => u.nick.toLowerCase() === nick.toLowerCase());
    if (!user) throw new Error("Nick no encontrado");
    if (user.password !== password) throw new Error("Contraseña incorrecta");
    localStorage.setItem(SESSION_KEY, nick);
    return user.nick;
}

export function getSession() {
    return localStorage.getItem(SESSION_KEY);
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
