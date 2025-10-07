// Referencias a formularios y enlaces
const formRegistro = document.getElementById("form-registro");
const formLogin = document.getElementById("form-login");
const irLogin = document.getElementById("ir-login");
const irRegistro = document.getElementById("ir-registro");

// Inputs registro
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");
const reCaptchImg = document.getElementById("img-reCaptcha");
const submitBtn = document.getElementById("submitBtn");

// Inputs login
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

// Estado reCAPTCHA
let recaptchaOk = false;

function marcarInput(input, valido, errorId, msg) {
  const el = document.getElementById(errorId);
  if (valido) {
    el.textContent = "";
    el.style.display = "none";
    input.classList.remove("error-input");
    input.classList.add("success-input");
    return true;
  } else {
    el.textContent = msg;
    el.style.display = "block";
    input.classList.remove("success-input");
    input.classList.add("error-input");
    return false;
  }
}

// Validaciones registro
function validarNombre() { return marcarInput(nombre, nombre.value.trim().length >= 3, "error-nombre", "Ingresá tu nombre completo"); }
function validarEmail() { return marcarInput(email, email.value.includes("@"), "error-email", "Email inválido"); }
function validarPassword() { return marcarInput(password, password.value.length >= 6, "error-password", "Mínimo 6 caracteres"); }
function validarConfirm() { return marcarInput(confirm, password.value === confirm.value, "error-confirm", "No coinciden"); }

// Validaciones login
function validarLoginEmail() { return marcarInput(loginEmail, loginEmail.value.includes("@"), "error-login-email", "Email inválido"); }
function validarLoginPassword() { return marcarInput(loginPassword, loginPassword.value.length >= 6, "error-login-password", "Contraseña muy corta"); }

// Evaluar formulario de registro
function evaluarFormulario() {
  const ok = validarNombre() && validarEmail() && validarPassword() && validarConfirm() && recaptchaOk;
  submitBtn.disabled = !ok;
}

// Registro en vivo
[nombre, email, password, confirm].forEach(inp => {
  inp.addEventListener("input", evaluarFormulario);
});

// reCAPTCHA simulado
reCaptchImg.addEventListener("click", () => {
  recaptchaOk = !recaptchaOk;
  reCaptchImg.src = recaptchaOk ? "images/login/recaptchaGreen.jpg" : "images/login/recaptcha.jpg";
  if (recaptchaOk) {
    document.getElementById("error-recaptcha").style.display = "none";
  }
  evaluarFormulario();
});



function mostrarMensaje(texto, redirigir = null, tiempo = 2000) {
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "none";

  const mensaje = document.getElementById("mensaje-exito-central");
  const textoExito = document.getElementById("texto-exito");
  textoExito.textContent = texto;

  mensaje.classList.remove("oculto");
  mensaje.classList.add("visible");

  if (redirigir) {
    setTimeout(() => {
      window.location.href = redirigir;
    }, tiempo);
  }
}


// Enviar registro
formRegistro.addEventListener("submit", e => {
  e.preventDefault();
  if (!recaptchaOk) {
    const err = document.getElementById("error-recaptcha");
    err.textContent = "Debés marcar reCAPTCHA";
    err.style.display = "block";
    return;
  }
  formRegistro.reset();
  [nombre, email, password, confirm].forEach(i => i.classList.remove("error-input", "success-input"));
  recaptchaOk = false;
  evaluarFormulario();
  mostrarMensaje(`¡Registro exitoso!`, "index.html", 3000);

 
});

// Enviar login
formLogin.addEventListener("submit", e => {
  e.preventDefault();
  let okEmail = validarLoginEmail();
  let okPass = validarLoginPassword();
  if (okEmail && okPass) {
    formLogin.reset();
    [loginEmail, loginPassword].forEach(i => i.classList.remove("error-input", "success-input"));
    
    mostrarMensaje("¡Bienvenido!", "index.html", 3000);

  }

});

// Validación en vivo para login
[loginEmail, loginPassword].forEach(inp => {
  inp.addEventListener("input", () => {
    if (inp === loginEmail) validarLoginEmail();
    if (inp === loginPassword) validarLoginPassword();
  });
});

// Alternar formularios usando enlaces
irLogin.addEventListener("click", e => {
  e.preventDefault();
  formRegistro.classList.add("oculto");
  formLogin.classList.remove("oculto");
});

irRegistro.addEventListener("click", e => {
  e.preventDefault();
  formLogin.classList.add("oculto");
  formRegistro.classList.remove("oculto");
});
