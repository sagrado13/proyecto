import jwt from "jwt-decode";

// FUNCIÓN PARA RECUPERAR EL TOKEN DESDE LE LOCALSTORAGE
export function getAuthToken() {
  return localStorage.getItem("AUTH_TOKEN_KEY");
}

// FUNCIÓN PARA CONSEGUIR LA FECHA DE CADUCIDAD DEL TOKEN
export function tokenExpiration(encodedToken) {
  let token = jwt(encodedToken);
  if (!token.exp) {
    return null;
  }
  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

//FUNCIÓN PARA SACAR ID TOKEN
export function getIdToken(encodedToken) {
  let token = jwt(encodedToken);
  if (token.id) {
    return token.id;
  } else {
    return null;
  }
}

// FUNCIÓN QUE COMPRUEBA SI EL TOKEN ESTÁ CADUCADO O NO
export function isExpired(token) {
  let expirationDate = tokenExpiration(token);
  return expirationDate < new Date();
}

// FUNCIÓN QUE COMPRUEBA SI EL USUARIO ESTÁ LOGUEADA Y SU TOKEN ES VÁLIDO
export function isLoggedInUser() {
  let authToken = getAuthToken();
  return !!authToken && !isExpired(authToken) && !!getName();
}

// FUNCIÓN QUE COMPRUEBA SI EL ABOGADO ESTÁ LOGUEADA Y SU TOKEN ES VÁLIDO
export function isLoggedInLawyer() {
  let authToken = getAuthToken();
  return !!authToken && !isExpired(authToken) && !!getLawFirm();
}

// FUNCIÓN PARA RECUPERAR EL ROL DE LOCALSTORAGE
export function getIsAdmin() {
  return localStorage.getItem("ROLE");
}

// FUNCIÓN PARA SABER SI ES ADMIN O NO
export function checkIsAdmin() {
  let role = null;
  let admin = getIsAdmin();
  if (admin === "admin") {
    role = true;
  } else {
    role = false;
  }
  return role;
}

// FUNCIÓN DE RECUPERAR EL NOMBRE DE USUARIO EN LOCALSTORAGE
export function getName() {
  return localStorage.getItem("NAME");
}
// FUNCIÓN PARA RECUPERAR IMAGEN DE USUARIO DE LOCALSTORAGE
export function getPictureUser() {
  return localStorage.getItem("PICTURE_USER");
}

// FUNCIÓN DE RECUPERAR EL NOMBRE DE ABOGADO EN LOCALSTORAGE
export function getLawFirm() {
  return localStorage.getItem("LAWFIRM");
}

// FUNCIÓN PARA RECUPERAR IMAGEN DE ABOGADO DE LOCALSTORAGE
export function getPictureLawyer() {
  return localStorage.getItem("PICTURE_LAWYER");
}
