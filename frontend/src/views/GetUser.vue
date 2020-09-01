<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Ver y editar perfil" />
    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button v-if="!showLowUser && !showEditPassword" id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <!--  VER Y EDITAR PERFIL -->
    <div id="update" v-if="!showLowUser && !showEditPassword">
      <img
        :class="{ hide: picture !== null }"
        src="../assets/profile.jpeg"
        alt="Foto de perfil por defecto"
      />
      <img :class="{ hide: picture === null }" :src="picture" alt="Avatar de usuario" />
      <button id="deletePicture" @click="deletePicture">Eliminar imagen</button>
      <p>Estos son tus datos {{ name }}, puedes actualizarlos si deseas.</p>
      <legend>Nombre*</legend>
      <input type="text" placeholder="Nombre" v-model="name" />
      <legend>Apellidos*</legend>
      <input type="text" placeholder="Apellidos" v-model="surname" />
      <legend>Ciudad*</legend>
      <input type="text" placeholder="Ciudad" v-model="city" />
      <legend>Teléfono*</legend>
      <input type="tel" placeholder="Número de teléfono" v-model="phoneNumber" />
      <legend>Usuario*</legend>
      <input type="text" placeholder="Usuario" v-model="login" />
      <input id="upload" type="file" @change="processFile" ref="fileInput" />
      <button @click="$refs.fileInput.click()">Cargar imagen</button>
      <progress max="100" :value.prop="uploadProgress"></progress>
      <button id="updateButton" @click="updateUser">Actualiza tu perfil</button>
    </div>

    <!-- BOTONES PARA CAMBIAR EMAIL Y CONTRASEÑA O DARSE DE BAJA -->
    <div id="editPassword" v-if="!showEditPassword && !showLowUser">
      <button @click="showEditPassword = !showEditPassword">Cambiar email o contraseña</button>
      <button id="delete" @click="showLowUser = !showLowUser">Date de baja</button>
    </div>

    <!-- CAMBIAR EMAIL Y CONTRASEÑA -->
    <div v-if="showEditPassword" id="changePassword">
      <p>Cambia tu email o contraseña</p>
      <legend>Email*</legend>
      <input type="email" placeholder="Email" v-model="email" />
      <legend>Contraseña antigua*</legend>
      <input type="password" placeholder="Contraseña antigua" v-model="oldPassword" />
      <legend>Contraseña nueva*</legend>
      <input
        :class="{ error: showMsg === true }"
        type="password"
        v-model="newPassword"
        placeholder="Contraseña nueva"
      />
      <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
      <legend>Repetir contraseña nueva*</legend>
      <input
        :class="{ error: showMsg === true }"
        type="password"
        v-model="newPassword1"
        placeholder="Repite la contraseña nueva"
      />
      <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
      <div>
        <button @click="updateUserPassword()">Actualizar</button>
        <button @click="showEditPassword = !showEditPassword">Cancelar</button>
      </div>
    </div>

    <!-- DAR DE BAJA -->
    <div id="deleteUser" v-if="showLowUser">
      <p>Elimina tu cuenta</p>
      <textarea
        v-model="lowReason"
        name="lowReason"
        id
        cols="30"
        rows="10"
        placeholder="Motivo por el que nos abandonas"
      ></textarea>
      <button @click="showLowUser = !showLowUser">Cancelar</button>
      <button id="delete" @click="deleteUser()">Date de baja</button>
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { checkIsAdmin } from "../api/utils.js";
export default {
  name: "GetUser",
  data() {
    return {
      idUser: "",
      user: [],
      name: "",
      surname: "",
      city: "",
      phoneNumber: "",
      login: "",
      picture: "",
      avatar: null,
      uploadProgress: 0,
      email: "",
      oldPassword: "",
      newPassword: "",
      newPassword1: "",
      showEditPassword: false,
      showMsg: false,
      lowReason: "",
      showLowUser: false,
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS USUARIO
    async getUser() {
      try {
        // SI ES EL ADMIN PUEDE ACCEDER A LOS DATOS DE LOS USUARIOS Y MODIFICARLOS
        if (this.$route.params.id > 0 && checkIsAdmin() === true) {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = token;
          this.idUser = this.$route.params.id;
        } else {
          // SI ES EL PROPIO USUARIO
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = token;
          this.idUser = getIdToken(token);
        }
        const response = await axios.get(
          "http://localhost:3000/users/" + this.idUser + "/data"
        );
        this.idUser = response.data.data.id;
        this.user = response.data.data;
        this.name = response.data.data.name;
        this.surname = response.data.data.surname;
        this.city = response.data.data.city;
        this.phoneNumber = response.data.data.phoneNumber;
        this.login = response.data.data.login;
        this.picture = response.data.data.picture;
        localStorage.setItem("PICTURE_USER", this.picture);
        this.$emit("showPictureUser");
        if (this.picture !== null) {
          this.picture = process.env.VUE_APP_STATIC_USERS + this.picture;
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA PROCESAR LA IMAGEN
    processFile(event) {
      this.avatar = event.target.files[0];
    },
    // FUNCIÓN PARA ACTUALIZAR DATOS USUARIO
    async updateUser() {
      try {
        let fd = new FormData();
        fd.append("name", this.name);
        fd.append("surname", this.surname);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber.replace(/[\-\.\  ]/g, ""));
        fd.append("login", this.login);
        if (this.avatar !== null) {
          fd.append("avatar", this.avatar);
        }
        const response = await axios.put(
          "http://localhost:3000/users/" + this.idUser + "/edit",
          fd,
          {
            onUploadProgress: (uploadEvent) => {
              this.uploadProgress = Math.round(
                (uploadEvent.loaded / uploadEvent.total) * 100
              );
            },
          }
        );
        this.getUser();
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA BORRAR IMAGEN DE USUARIO
    async deletePicture() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres borrar la imagen",
        text: "Una vez eliminada no se podrá recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            "http://localhost:3000/users/" + this.idUser + "/delete-picture"
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.message}`,
            confirmButtonText: "OK",
          });
          this.getUser();
        } catch (error) {
          console.log(error);
        }
      } else {
        Swal.fire({
          title: "Borrado de imagen cancelado",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA CAMBIAR EMAIL O CONTRASEÑA DE USUARIO
    async updateUserPassword() {
      if (this.newPassword !== this.newPassword1) {
        return (this.showMsg = true);
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/users/" + `${this.idUser}` + "/email-password",
          {
            email: this.email,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
          confirmButtonText: "OK",
        });
        this.$emit("logout");
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA DAR DE BAJA UN USUARIO
    async deleteUser() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres darte de baja",
        text:
          "Una vez dado de baja puedes hablar con el admin para recuperar la cuenta",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            "http://localhost:3000/users/" + `${this.idUser}` + "/delete",
            {
              lowReason: this.lowReason,
            }
          );
          console.log(response);
          Swal.fire({
            title: "Usuario borrado correctamente",
            icon: "success",
          });
          this.$emit("logout");
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Baja cancelada",
          icon: "error",
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style scoped>
.error {
  background-color: rgba(255, 0, 0, 0.336);
}
.error:hover {
  background-color: white;
}
img {
  border-radius: 50%;
  width: 100px;
  margin-top: 1rem;
}
div#update {
  background-color: var(--background);
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10%;
}
p {
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: yellowgreen;
  border-radius: 10px;
  font-size: 0.7rem;
  text-align: center;
  background: var(--bright);
  color: var(--dark);
  padding: 0.1rem;
}
input#upload {
  display: none;
}
legend {
  font-size: 0.7rem;
  margin-top: 1rem;
}
button {
  outline: none;
  margin-top: 0.5rem;
  font-size: 0.5rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#back,
button#back img {
  box-shadow: none;
  margin-top: 0;
}
button#deletePicture {
  all: unset;
  cursor: pointer;
  font-size: 0.5rem;
  margin: 0.5rem;
  color: red;
}
button#updateButton {
  font-size: 0.6rem;
}
div#editPassword {
  margin-bottom: 2rem;
}
div#changePassword {
  background-color: var(--background);
  width: 70%;
  margin: 3% auto;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

div#changePassword button {
  margin: 1rem;
}
div#changePassword input {
  width: 80%;
}
div#deleteUser {
  background-color: var(--background);
  padding: 1rem;
  margin: 1rem;
  border-radius: 20px;
}
textarea {
  outline: none;
  font-size: 0.8rem;
  width: 90%;
}
div#deleteUser button {
  margin: 1rem;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
}

@media (min-width: 700px) {
  img {
    width: 200px;
  }
  p {
    font-size: 1rem;
    margin-bottom: 0.9rem;
  }
  input {
    padding: 0.2rem;
    font-size: 1rem;
    width: 40%;
  }
  legend {
    font-size: 1rem;
  }
  button {
    font-size: 0.8rem;
  }
  button#deletePicture {
    margin-top: 0.8rem;
    font-size: 0.7rem;
  }
  button#updateButton {
    margin-top: 1.2rem;
    font-size: 1rem;
  }
  div#editPassword {
    display: flex;
    justify-content: space-between;
  }
  div#changePassword {
    width: 50%;
  }
  div#deleteUser {
    width: 70%;
    margin: 3% auto;
  }
  div#deleteUser textarea {
    height: 250px;
  }
}

@media (min-width: 1000px) {
  div#update {
    width: 40%;
    margin: 0 auto;
  }
  p {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
  }
  button {
    font-size: 0.9rem;
  }
  button#updateButton {
    font-size: 1.15rem;
  }
  div#editPassword {
    justify-content: space-evenly;
  }
  div#changePassword {
    margin-top: 5rem;
    width: 30%;
  }
  div#deleteUser {
    width: 50%;
  }

  div#deleteUser textarea {
    margin-bottom: 2rem;
    font-size: 1rem;
  }
}
</style>
