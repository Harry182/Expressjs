//Valida correo electrónico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//Valida nombre minimo 3 caracteres
function isValidName(name) {
  return typeof name === "string" && name.length >= 3;
}

//validacion de no repetición y que sea numérico
function isUniqueId(id, users) {
  const isUnique = users.some((user) => user.id === id);
  return isUnique;
}

function isValidId(id, users) {
  //  const isNumeric = !isNaN(id);
  const idRegex = /^[0-9]+$/;
  return typeof id === "number" && idRegex.test(id);
}

function validateUser(user, users) {
  const errors = [];
  //const { name, email, id } = user;
  if (!isValidName(user.name)) {
    errors.push("El nombre debe tener al menos 3 caracteres");
    /*return {
      isValid: false,
      error: "El nombre debe tener al menos 3 caracteres",
    };*/
  }
  if (!isValidEmail(user.email)) {
    //return { isValid: false, error: "El correo electrónico no es válido." };
    errors.push("El correo electrónico no es válido");
  }
  if (!isValidId(user.id)) {
    //return { isValid: false, error: "El ID debe ser numérico y único." };
    errors.push("El ID debe ser un número positivo");
  }

  return { isValid: errors.length === 0, errors: errors };
}

module.exports = {
  isValidEmail,
  isValidName,
  isUniqueId,
  isValidId,
  validateUser,
};
