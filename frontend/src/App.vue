<template>
  <div id="app">
    <div class="background">
      <img class="header" src="./assets/header.png" alt="Título de página" />
      <div id="nav">
        <router-link :to="{ name: 'Home' }">Inicio</router-link>|
        <router-link :to="{ name: 'About' }">About</router-link>
      </div>
      <!-- LOGIN DE USUARIO -->
      <div id="loginUser" v-show="seeLoginUser">
        <legend>Login de usuario:</legend>
        <input v-model="emailOrLogin" type="text" name="emailOrLogin" placeholder="Email o usuario" />
        <input v-model="password" type="password" name="password" placeholder="Contraseña" />
        <div>
          <button @click="loginUser()">Login</button>
          <button @click="seeLoginUser = !seeLoginUser">Cancelar</button>
        </div>
      </div>
      <!-- LOGIN DE ABOGADO -->
      <div id="loginLawyer" v-show="seeLoginLawyer">
        <legend>Login de abogado:</legend>
        <input v-model="emailOrLogin" type="text" name="emailOrLogin" placeholder="Email o usuario" />
        <input v-model="password" type="password" name="password" placeholder="Contraseña" />
        <div>
          <button @click="loginLawyer()">Login</button>
          <button @click="seeLoginLawyer = !seeLoginLawyer" s>Cancelar</button>
        </div>
      </div>
      <!-- REGISTRO LOGIN Y BOTÓN PARA RECUPERAR CONTRASEÑA -->
      <div id="registerUser" v-show="!seeWelcomeLawyer">
        <div v-show="!seeWelcomeUser">
          <div v-show="!seeLoginUser">
            <p>¿Aún no eres usuario registrado?</p>
            <button>
              <router-link :to="{ name: 'NewUser' }">Regístrate</router-link>
            </button>
            <button @click="showLoginUser()">Haz login</button>
            <button @click="showModalUser()">Recuperar contraseña</button>
          </div>
        </div>
      </div>
      <div id="registerLawyer" v-show="!seeWelcomeUser">
        <div v-show="!seeWelcomeLawyer">
          <div v-show="!seeLoginLawyer">
            <p>¿Aún no eres abogado registrado?</p>
            <button>
              <router-link :to="{ name: 'NewLawyer' }">Regístrate</router-link>
            </button>
            <button @click="showLoginLawyer()">Haz login</button>
            <button @click="showModalLawyer()">Recuperar contraseña</button>
          </div>
        </div>
      </div>

      <!-- MENÚ USUARIO -->
      <div class="userControl" v-show="seeWelcomeUser">
        <img
          :class="{ hide: pictureUser !== null, pictureLogin: pictureUser === null }"
          src="./assets/profile.jpeg"
          alt="Foto de perfil por defecto"
        />
        <img
          :class="{ hide: pictureUser === null, pictureLogin: pictureUser !== null}"
          :src="pictureUser"
          alt="Foto de usuario"
        />
        <h5>Bienvenido {{ name }}</h5>
        <button>
          <router-link :to="{ name: 'GetUser' }">Ver Perfil</router-link>
        </button>
        <button>
          <router-link :to="{ name: 'ListProcessesUser' }">Ver procesos</router-link>
        </button>
        <button @click="logout()">Logout</button>
        <button>
          <router-link
            :class="{ hide: rol !== 'admin'}"
            :to="{ name: 'ListDeletedUsers' }"
          >Ver usuarios de baja</router-link>
        </button>
        <button>
          <router-link
            :class="{ hide: rol !== 'admin'}"
            :to="{ name: 'ListDeletedLawyers' }"
          >Ver abogados de baja</router-link>
        </button>
        <p>Última conexión: {{ getFormat() }}h</p>
      </div>
      <!-- MENÚ ABOGADO -->
      <div class="lawyerControl" v-show="seeWelcomeLawyer">
        <img
          v-show="seeWelcomeLawyer"
          :class="{ hide: pictureLawyer === null, pictureLogin: pictureLawyer !== null}"
          :src="pictureLawyer"
          alt="Foto de abogado"
        />
        <h5 v-show="seeWelcomeLawyer">Bienvenido {{ lawFirm }}</h5>
        <button>
          <router-link :to="{ name: 'EditLawyer' }">Ver Perfil</router-link>
        </button>
        <button>
          <router-link :to="{ name: 'ListProcessesLawyer' }">Ver procesos</router-link>
        </button>
        <button @click="logout()">Logout</button>
        <p v-show="seeWelcomeLawyer">Última conexión: {{ getFormat() }}</p>
      </div>
      <!-- MODAL PARA RECUPERAR CONTRASEÑA USUARIO -->
      <div id="recoverUser">
        <div v-show="seeModalUser" class="modal">
          <div class="modalBox">
            <legend>Recupera tu contraseña:</legend>
            <input type="email" v-model="emailUser" placeholder="Email" />
            <br />
            <button @click="recoverPasswordUser()">Recuperar contraseña</button>
            <button id="cancel" @click="seeModalUser = !seeModalUser">Cancelar</button>
          </div>
        </div>
      </div>
      <!-- MODAL PARA RECUPERAR CONTRASEÑA ABOGADO-->
      <div id="recoverLawyer">
        <div v-show="seeModalLawyer" class="modal">
          <div class="modalBox">
            <legend>Recupera tu contraseña:</legend>
            <input type="email" v-model="emailLawyer" placeholder="Email" />
            <br />
            <button @click="recoverPasswordLawyer()">Recuperar contraseña</button>
            <button id="cancel" @click="seeModalLawyer = !seeModalLawyer">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <router-view />
    <footercustom />
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos date-fns
import { format } from "date-fns";
// IMPORTAMOS FUNCIONES
import { getName } from "./api/utils";
import { getPictureUser } from "./api/utils";
import { getLawFirm } from "./api/utils";
import { getPictureLawyer } from "./api/utils";
import { isLoggedInUser } from "./api/utils";
import { isLoggedInLawyer } from "./api/utils";
import { getIsAdmin } from "./api/utils";
import { getIdToken } from "./api/utils";
// Importamos componente FooterCustom
import footercustom from "./components/FooterCutom";

export default {
  name: "App",
  components: {
    footercustom,
  },
  data() {
    return {
      format,
      emailOrLogin: "",
      password: "",
      pictureUser: "",
      pictureLawyer: "",
      updateDate: "",
      seeLoginUser: false,
      seeLoginLawyer: false,
      idLawyer: "",
      seeWelcomeUser: false,
      name: "",
      seeWelcomeLawyer: false,
      lawFirm: "",
      emailUser: "",
      seeModalUser: false,
      seeModalLawyer: false,
      emailLawyer: "",
      rol: "",
    };
  },
  methods: {
    // FUNCIÓN PARA HACER LOGIN EL USUARIO
    async loginUser() {
      try {
        if (!this.emailOrLogin || !this.password) {
          throw new Error(`Te faltan datos`);
        }
        const response = await axios.post("http://localhost:3000/users/login", {
          emailOrLogin: this.emailOrLogin,
          password: this.password,
        });
        let token = response.data.data.token;
        let role = response.data.data.user[0].role;
        let name = response.data.data.user[0].name;
        let updateDate = response.data.data.user[0].update_date;
        let picture = response.data.data.user[0].picture_user;
        axios.defaults.headers.common["Authorization"] = token;
        localStorage.setItem("AUTH_TOKEN_KEY", token);
        localStorage.setItem("ROLE", role);
        localStorage.setItem("NAME", name);
        localStorage.setItem("UPDATE_DATE", updateDate);
        localStorage.setItem("PICTURE_USER", picture);
        location.reload();
      } catch (error) {
        console.log(error);
        if (error.message === `Te faltan datos`) {
          Swal.fire({
            icon: "error",
            title: `${error.message}`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    },
    // FUNCIÓN PARA HACER LOGIN EL ABOGADO
    async loginLawyer() {
      try {
        if (!this.emailOrLogin || !this.password) {
          throw new Error(`Te faltan datos`);
        }
        const response = await axios.post(
          "http://localhost:3000/lawyers/login",
          {
            emailOrLogin: this.emailOrLogin,
            password: this.password,
          }
        );
        let token = response.data.data.token;
        let lawFirm = response.data.data.lawyer[0].law_firm;
        let updateDate = response.data.data.lawyer[0].update_date;
        let picture = response.data.data.lawyer[0].picture_lawyer;
        axios.defaults.headers.common["Authorization"] = token;
        localStorage.setItem("AUTH_TOKEN_KEY", token);
        localStorage.setItem("LAWFIRM", lawFirm);
        localStorage.setItem("UPDATE_DATE", updateDate);
        localStorage.setItem("PICTURE_LAWYER", picture);
        location.reload();
      } catch (error) {
        console.log(error);
        if (error.message === `Te faltan datos`) {
          Swal.fire({
            icon: "error",
            title: `${error.message}`,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      }
    },
    // FUNCIÓN PARA HACER EL LOGOUT DE USUARIO
    logout() {
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("AUTH_TOKEN_KEY");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("NAME");
      localStorage.removeItem("LAWFIRM");
      localStorage.removeItem("PICTURE_USER");
      localStorage.removeItem("PICTURE_LAWYER");
      localStorage.removeItem("UPDATE_DATE");
      this.$router.push("/");
      location.reload();
    },
    // FUNCIÓN PARA MOSTAR EL FORMULARIO PARA HACER LOGIN USUARIO
    showLoginUser() {
      this.seeLoginUser = true;
      this.seeModalUser = false;
      this.seeLoginLawyer = false;
      this.seeModalLawyer = false;
    },
    // FUNCIÓN PARA MOSTAR EL FORMULARIO PARA HACER LOGIN ABOGADO
    showLoginLawyer() {
      this.seeLoginLawyer = true;
      this.seeModalUser = false;
      this.seeLoginUser = false;
      this.seeModalLawyer = false;
    },
    // FUNCIÓN PARA MOSTRAR COSAS DEL MENÚ SI ESTÁS LOGUEADO EL USUARIO Y ES EL ADMIN O NO
    getLoginUser() {
      this.seeWelcomeUser = isLoggedInUser();
      this.rol = getIsAdmin();
    },
    // FUNCIÓN PARA MOSTRAR COSAS DEL MENÚ SI ESTÁS LOGUEADO
    getLoginLawyer() {
      this.seeWelcomeLawyer = isLoggedInLawyer();
    },
    // FUNCIÓN PARA OBTENER EL NOMBRE DE USUARIO
    setUserNameAndPicture() {
      this.name = getName();
      if (getPictureUser() === null || getPictureUser() === "null") {
        this.pictureUser = null;
      } else {
        this.pictureUser = process.env.VUE_APP_STATIC_USERS + getPictureUser();
      }
    },
    // FUNCIÓN PARA OBTENER EL NOMBRE DE ABOGADO
    setLawyerLawFirmAndPicture() {
      this.lawFirm = getLawFirm();
      if (getPictureLawyer() === null || getPictureLawyer() === "null") {
        this.pictureLawyer = null;
      } else {
        this.pictureLawyer =
          process.env.VUE_APP_STATIC_LAWYERS + getPictureLawyer();
      }
    },
    // FUNCIÓN DE RECUPERAR EN LOCALSTORAGE LA ÚLTIMA CONEXIÓN DE USUARIO Y FORMATEARLA
    getFormat() {
      return this.format(
        new Date(localStorage.getItem("UPDATE_DATE")),
        "dd/MM/yyyy HH:mm"
      );
    },
    // FUNCIÓN PARA MOSTAR MODAL PARA RESETEAR CONTRASEÑA DE USUARIO
    showModalUser() {
      this.seeModalUser = true;
      this.seeModalLawyer = false;
      this.seeLoginUser = false;
      this.seeLoginLawyer = false;
    },
    // FUNCIÓN PARA MOSTAR MODAL PARA RESETEAR CONTRASEÑA DE USUARIO
    showModalLawyer() {
      this.seeModalLawyer = true;
      this.seeModalUser = false;
      this.seeLoginLawyer = false;
      this.seeLoginUser = false;
    },
    // FUNCIÓN PARA RECUPERAR CONTRASEÑA DE USUARIO
    async recoverPasswordUser() {
      let self = this;
      try {
        const response = await axios.post(
          "http://localhost:3000/users/recover-password",
          {
            email: self.emailUser,
          }
        );
        console.log(response);
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        this.emailUser = "";
        this.seeModalUser = false;
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA RECUPERAR CONTRASEÑA DE ABOGADO
    async recoverPasswordLawyer() {
      try {
        const response = await axios.post(
          "http://localhost:3000/lawyers/recover-password",
          {
            email: this.emailLawyer,
          }
        );
        console.log(response);
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        this.seeModalLawyer = false;
        this.emailLawyer = "";
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
  created() {
    this.setUserNameAndPicture();
    this.getLoginUser();
    this.getLoginLawyer();
    this.setLawyerLawFirmAndPicture();
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap");

* {
  margin: 0;
  padding: 0;
}
html {
  --dark: rgb(65, 64, 64);
  --bright: white;
  --gray: lightgray;
  --font: Merriweather, sans-serif;
  min-height: 100%;
  position: relative;
}
body {
  background-color: rgb(65, 64, 64);
}

#app {
  font-family: var(--font);
  text-align: center;
  color: var(--bright);
}
#nav {
  padding: 0.5rem;
}
#nav a {
  font-weight: bold;
  color: var(--bright);
}
#nav a.router-link-exact-active {
  color: rgb(248, 226, 171);
}
div.background {
  background-image: url(./assets/background.png);
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: 0.2rem;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    "imgHeader   imgHeader    imgHeader    imgHeader"
    "menu    menu     menu     menu"
    "registerUser    registerUser     registerLawyer     registerLawyer"
    "recoverUser    recoverUser     recoverLawyer     recoverLawyer"
    "userControl    userControl     userControl     userControl";
}
img.header {
  max-width: 100%;
  grid-area: imgHeader;
}
div#nav {
  grid-area: menu;
}
div#registerUser,
div#loginUser {
  grid-area: registerUser;
  align-self: center;
}
div.userControl,
div.lawyerControl {
  grid-area: userControl;
}
div#recoverUser {
  grid-area: recoverUser;
}
div#registerLawyer,
div#loginLawyer {
  grid-area: registerLawyer;
  align-self: center;
}
div#recoverLawyer {
  grid-area: recoverLawyer;
}
div#registerUser p,
div#registerLawyer p {
  font-size: 0.7rem;
}
div#registerUser button,
div#registerLawyer button {
  outline: none;
  font-size: 0.6rem;
  margin: 0.1rem;
  padding: 0.2rem;
  background-color: var(--gray);
}
div#loginUser legend,
div#loginLawyer legend {
  font-size: 0.7rem;
}
div#loginUser input,
div#loginLawyer input {
  outline: none;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  padding: 0.1rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: var(--bright);
}
div#loginUser button,
div#loginLawyer button {
  outline: none;
  font-size: 0.6rem;
  margin: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.2rem;
  background-color: var(--gray);
}
div#recoverUser legend,
div#recoverLawyer legend {
  margin-top: 0.5rem;
  font-size: 0.7rem;
}
div#recoverUser input,
div#recoverLawyer input {
  outline: none;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  padding: 0.1rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
}
div#recoverUser button,
div#recoverLawyer button {
  outline: none;
  font-size: 0.6rem;
  margin: 0.1rem;
  margin-bottom: 0.3rem;
  margin-top: 0.3rem;
  padding: 0.1rem;
  background-color: var(--gray);
}
div.userControl button,
div.lawyerControl button {
  border: none;
  outline: none;
  font-size: 0.6rem;
  margin: 0.1rem;
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  background-color: var(--gray);
}
div.userControl p,
div.lawyerControl p {
  margin: 0.2rem;
  font-size: 0.5rem;
}
button a {
  text-decoration: none;
  color: black;
}
textarea[placeholder] {
  text-align: center;
}
.hide {
  display: none;
}
.pictureLogin {
  border-radius: 50%;
  width: 35px;
}

@media (min-width: 700px) {
  #nav {
    font-size: 1.5rem;
  }
  div#registerUser p,
  div#registerLawyer p {
    font-size: 0.85rem;
  }
  div#registerUser button,
  div#registerLawyer button {
    font-size: 0.75rem;
  }
  div#loginUser legend,
  div#loginLawyer legend {
    font-size: 0.9rem;
  }
  div#loginUser input,
  div#loginLawyer input {
    font-size: 0.9rem;
    margin: 0.3rem;
  }
  div#loginUser button,
  div#loginLawyer button {
    font-size: 0.75rem;
    margin: 0.5rem;
  }
  div#recoverUser legend,
  div#recoverLawyer legend {
    font-size: 0.9rem;
  }
  div#recoverUser input,
  div#recoverLawyer input {
    font-size: 0.9rem;
  }
  div#recoverUser button,
  div#recoverLawyer button {
    font-size: 0.75rem;
    margin: 0.3rem;
  }
  h5 {
    font-size: 1rem;
  }
  img.pictureLogin {
    width: 50px;
  }
  div.userControl button,
  div.lawyerControl button {
    font-size: 0.8rem;
    margin: 0.3rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }
  div.userControl p,
  div.lawyerControl p {
    font-size: 0.65rem;
  }
}

@media (min-width: 1000px) {
  img.header {
    margin: 0 auto;
  }
  #nav {
    font-size: 1.6rem;
  }
  div#registerUser p,
  div#registerLawyer p {
    font-size: 1rem;
  }
  div#registerUser button,
  div#registerLawyer button {
    font-size: 0.9rem;
  }
  div#loginUser legend,
  div#loginLawyer legend {
    font-size: 1rem;
  }
  div#loginUser input,
  div#loginLawyer input {
    font-size: 1rem;
  }
  div#loginUser button,
  div#loginLawyer button {
    font-size: 0.9rem;
  }
  div#recoverUser legend,
  div#recoverLawyer legend {
    font-size: 1rem;
  }
  div#recoverUser input,
  div#recoverLawyer input {
    font-size: 1rem;
  }
  div#recoverUser button,
  div#recoverLawyer button {
    font-size: 0.9rem;
    margin-top: 0.6rem;
  }
  h5 {
    font-size: 1.2rem;
  }
  img.pictureLogin {
    width: 60px;
    margin-top: 1rem;
  }
  div.userControl button,
  div.lawyerControl button {
    font-size: 1rem;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }
  div.userControl p,
  div.lawyerControl p {
    font-size: 0.8rem;
  }
}

@media (min-width: 1350px) {
  div.background {
    grid-template-columns: 15% 35% 35% 15%;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "registerUser   imgHeader    imgHeader    registerLawyer"
      "registerUser    menu     menu     registerLawyer"
      "recoverUser    recoverUser     recoverLawyer     recoverLawyer";
  }
  div.userControl {
    grid-area: registerUser;
  }
  div.lawyerControl {
    grid-area: registerLawyer;
  }
}
</style>
