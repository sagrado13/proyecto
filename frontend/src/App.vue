<template>
  <div id="app">
    <div class="background">
      <!-- LOGO Y NOMBRE DE PÁGINA QUE ENLAZA A INICIO -->
      <router-link :to="{ name: 'Home' }">
        <img id="logo" src="./assets/justicieLogo.png" alt />
      </router-link>
      <router-link :to="{ name: 'Home' }" class="linkLogo"
        >LEGAL SHIELD</router-link
      >

      <!-- RUTAS A CONTACTO Y INFO -->
      <div id="nav">
        <router-link :to="{ name: 'Contact' }">Contacto</router-link>
        <router-link :to="{ name: 'About' }">About</router-link>
      </div>

      <!-- LOGIN Y RECUPERAR CONTARSEÑA DE USUARIO -->
      <div id="loginUser" v-if="seeLoginUser">
        <legend>Login de usuario:</legend>
        <input
          v-model="emailOrLogin"
          type="text"
          name="emailOrLogin"
          placeholder="Email o usuario"
        />
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="Contraseña"
        />
        <div>
          <button @click="loginUser()">Login</button>
          <button @click="seeLoginUser = !seeLoginUser">Cancelar</button>
          <button @click="showModalUser()">Recuperar contraseña</button>
        </div>
      </div>

      <!-- LOGIN Y RECUPERAR CONTRASEÑA DE ABOGADO -->
      <div id="loginLawyer" v-if="seeLoginLawyer">
        <legend>Login de abogado:</legend>
        <input
          v-model="emailOrLogin"
          type="text"
          name="emailOrLogin"
          placeholder="Email o usuario"
        />
        <input
          v-model="password"
          type="password"
          name="password"
          placeholder="Contraseña"
        />
        <div>
          <button @click="loginLawyer()">Login</button>
          <button @click="seeLoginLawyer = !seeLoginLawyer">Cancelar</button>
          <button @click="showModalLawyer()">Recuperar contraseña</button>
        </div>
      </div>

      <!-- REGISTRO Y HACER LOGIN DE USUARIO -->
      <div
        id="registerUser"
        v-if="
          !seeWelcomeLawyer &&
            !seeWelcomeUser &&
            !seeLoginUser &&
            !seeModalUser &&
            !seeModalLawyer
        "
      >
        <p>¿Aún no eres usuario registrado?</p>
        <button>
          <router-link :to="{ name: 'NewUser' }">Regístrate</router-link>
        </button>
        <button @click="showLoginUser()">Haz login</button>
      </div>

      <!-- REGISTRO Y HACER LOGIN DE ABOGADO -->
      <div
        id="registerLawyer"
        v-if="
          !seeWelcomeUser &&
            !seeWelcomeLawyer &&
            !seeLoginLawyer &&
            !seeModalLawyer &&
            !seeModalUser
        "
      >
        <p>¿Aún no eres abogado registrado?</p>
        <button>
          <router-link :to="{ name: 'NewLawyer' }">Regístrate</router-link>
        </button>
        <button @click="showLoginLawyer()">Haz login</button>
      </div>

      <!-- MENÚ USUARIO -->
      <div class="userControl" v-if="seeWelcomeUser">
        <div id="profile">
          <button id="menu" @click="show = !show">
            <img src="./assets/menu.png" alt />
            <img
              :class="{
                hide: pictureUser !== null,
                pictureLogin: pictureUser === null,
              }"
              src="./assets/profile.jpeg"
              alt="Foto de perfil por defecto"
            />
            <img
              :class="{
                hide: pictureUser === null,
                pictureLogin: pictureUser !== null,
              }"
              :src="pictureUser"
              alt="Foto de usuario"
            />
          </button>
        </div>
        <div id="menuUser">
          <ul @click="show = !show" v-if="show">
            <h5>Bienvenido {{ name }}</h5>
            <router-link tag="button" :to="{ name: 'GetUser' }"
              >Ver Perfil</router-link
            >
            <router-link tag="button" :to="{ name: 'ListProcessesUser' }"
              >Ver procesos</router-link
            >
            <router-link
              v-if="rol === 'admin'"
              tag="button"
              :to="{ name: 'ListDeletedUsers' }"
              >Usuarios de baja</router-link
            >
            <router-link
              v-if="rol === 'admin'"
              tag="button"
              :to="{ name: 'ListActivatedUsers' }"
              >Usuarios activos</router-link
            >
            <router-link
              v-if="rol === 'admin'"
              tag="button"
              :to="{ name: 'ListDeletedLawyers' }"
              >Abogados de baja</router-link
            >
            <router-link
              v-if="rol === 'admin'"
              tag="button"
              :to="{ name: 'ListActivatedLawyers' }"
              >Abogados activos</router-link
            >
            <button @click="logout()">Logout</button>
            <p>Última conexión: {{ getFormat() }}h.</p>
          </ul>
        </div>
      </div>

      <!-- MENÚ ABOGADO -->
      <div class="lawyerControl" v-if="seeWelcomeLawyer">
        <div id="profile">
          <button id="menu" @click="show = !show">
            <img src="./assets/menu.png" alt />
            <img
              :class="{
                hide: pictureLawyer !== null,
                pictureLogin: pictureLawyer === null,
              }"
              src="./assets/profile.jpeg"
              alt="Foto de perfil por defecto"
            />
            <img
              v-if="seeWelcomeLawyer"
              :class="{
                hide: pictureLawyer === null,
                pictureLogin: pictureLawyer !== null,
              }"
              :src="pictureLawyer"
              alt="Foto de abogado"
            />
          </button>
        </div>
        <div id="menuLawyer">
          <ul @click="show = !show" v-if="show">
            <h5 v-if="seeWelcomeLawyer">Bienvenido {{ lawFirm }}</h5>
            <router-link tag="button" :to="{ name: 'EditLawyer' }"
              >Ver Perfil</router-link
            >
            <router-link tag="button" :to="{ name: 'ListProcessesLawyer' }"
              >Ver procesos</router-link
            >
            <button @click="logout()">Logout</button>
            <p v-if="seeWelcomeLawyer">Última conexión: {{ getFormat() }}h.</p>
          </ul>
        </div>
      </div>

      <!-- MODAL PARA RECUPERAR CONTRASEÑA USUARIO -->
      <div id="recoverUser" v-if="seeModalUser">
        <legend>Recupera tu contraseña:</legend>
        <input type="email" v-model="emailUser" placeholder="Email" />
        <br />
        <button @click="recoverPasswordUser()">Recuperar contraseña</button>
        <button id="cancel" @click="seeModalUser = !seeModalUser">
          Cancelar
        </button>
      </div>

      <!-- MODAL PARA RECUPERAR CONTRASEÑA ABOGADO-->
      <div id="recoverLawyer" v-if="seeModalLawyer">
        <legend>Recupera tu contraseña:</legend>
        <input type="email" v-model="emailLawyer" placeholder="Email" />
        <br />
        <button @click="recoverPasswordLawyer()">Recuperar contraseña</button>
        <button id="cancel" @click="seeModalLawyer = !seeModalLawyer">
          Cancelar
        </button>
      </div>
    </div>

    <router-view
      @logout="logout"
      @showPictureUser="setUserNameAndPicture"
      @showPictureLawyer="setLawyerLawFirmAndPicture"
    />
    <!-- Declaramos componente footer-->
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
      show: false,
    };
  },
  methods: {
    // FUNCIÓN PARA HACER LOGIN EL USUARIO
    async loginUser() {
      try {
        if (!this.emailOrLogin || !this.password) {
          throw new Error(`Te faltan datos`);
        }
        const response = await axios.post(
          process.env.VUE_APP_BACK_URL + "users/login",
          {
            emailOrLogin: this.emailOrLogin,
            password: this.password,
          }
        );
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
        this.getLoginUser();
        this.setUserNameAndPicture();
        this.seeLoginUser = false;
        if (this.$route.name !== "Home") {
          this.$router.push({ name: "Home" });
        }
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
          process.env.VUE_APP_BACK_URL + "lawyers/login",
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
        this.getLoginLawyer();
        this.setLawyerLawFirmAndPicture();
        this.seeLoginLawyer = false;
        if (this.$route.name !== "Home") {
          this.$router.push({ name: "Home" });
        }
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
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("AUTH_TOKEN_KEY");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("NAME");
      localStorage.removeItem("LAWFIRM");
      localStorage.removeItem("PICTURE_USER");
      localStorage.removeItem("PICTURE_LAWYER");
      localStorage.removeItem("UPDATE_DATE");
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
      this.seeWelcomeUser = false;
      this.seeWelcomeLawyer = false;
    },
    // FUNCIÓN PARA MOSTAR EL FORMULARIO PARA HACER LOGIN USUARIO
    showLoginUser() {
      this.emailOrLogin = "";
      this.password = "";
      this.seeLoginUser = true;
      this.seeModalUser = false;
      this.seeLoginLawyer = false;
      this.seeModalLawyer = false;
    },
    // FUNCIÓN PARA MOSTAR EL FORMULARIO PARA HACER LOGIN ABOGADO
    showLoginLawyer() {
      this.emailOrLogin = "";
      this.password = "";
      this.seeLoginLawyer = true;
      this.seeModalUser = false;
      this.seeLoginUser = false;
      this.seeModalLawyer = false;
    },
    // FUNCIÓN PARA MOSTRAR COSAS DEL MENÚ SI ESTÁS LOGUEADO EL USUARIO Y SABER SI ES EL ADMIN O NO
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
      return format(
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
      try {
        const response = await axios.post(
          process.env.VUE_APP_BACK_URL + "users/recover-password",
          {
            email: this.emailUser,
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
          process.env.VUE_APP_BACK_URL + "lawyers/recover-password",
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
    this.getLoginUser();
    this.setUserNameAndPicture();
    this.getLoginLawyer();
    this.setLawyerLawFirmAndPicture();
  },
};
</script>

<style>
@import "css/appStyles.css";
</style>
