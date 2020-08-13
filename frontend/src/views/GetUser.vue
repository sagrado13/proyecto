<template>
  <div>
    <div v-show="!showEditPassword">
      <div id="update" v-show="!showLowUser">
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
    </div>
    <div id="editPassword" v-show="!showEditPassword">
      <div v-show="!showLowUser">
        <button @click="showEditPassword = !showEditPassword">Cambiar email o contraseña</button>
        <button id="delete" @click="showLowUser = !showLowUser">Date de baja</button>
      </div>
    </div>

    <div v-show="showEditPassword">
      <div id="changePassword">
        <p>Cambia tu email o contraseña</p>
        <legend>Email*</legend>
        <input type="email" placeholder="Email" v-model="email" />
        <legend>Contraseña antigua*</legend>
        <input type="password" placeholder="Contraseña antigua" v-model="oldPassword" />
        <legend>Contraseña nueva*</legend>
        <input type="password" placeholder="Contraseña nueva" v-model="newPassword" />
      </div>
      <button @click="updateUserPassword()">Actualizar</button>
      <button @click="showEditPassword = !showEditPassword">Cancelar</button>
    </div>
    <div id="deleteUser" v-show="showLowUser">
      <p>Borrar cuenta</p>
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
import { isLoggedInUser } from "../api/utils";
import { getIdToken } from "../api/utils";
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
      showEditPassword: false,
      lowReason: "",
      showLowUser: false,
    };
  },
  methods: {
    // FUNCIÓN PARA HACER EL LOGOUT DE USUARIO
    logout() {
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("AUTH_TOKEN_KEY");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("NAME");
      localStorage.removeItem("LAWFIRM");
      localStorage.removeItem("UPDATE_DATE");
      localStorage.removeItem("PICTURE");
      this.$router.push("/");
      location.reload();
    },
    // FUNCIÓN PARA OBTENER DATOS USUARIO
    async getUser() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/users/" + getIdToken(token) + "/data"
        );
        this.idUser = response.data.data.id;
        this.user = response.data.data;
        this.name = response.data.data.name;
        this.surname = response.data.data.surname;
        this.city = response.data.data.city;
        this.phoneNumber = response.data.data.phoneNumber;
        this.login = response.data.data.login;
        if (response.data.data.picture === null) {
          this.picture = null;
        } else {
          this.picture =
            process.env.VUE_APP_STATIC_USERS + response.data.data.picture;
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
        fd.append("phoneNumber", this.phoneNumber);
        fd.append("login", this.login);
        fd.append("avatar", this.avatar);
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
        console.log(response);
        location.reload();
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
      try {
        const response = await axios.put(
          "http://localhost:3000/users/" + this.idUser + "/delete-picture"
        );
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA CAMBIAR EMAIL O CONTRASEÑA DE USUARIO
    async updateUserPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/" + `${this.idUser}` + "/email-password",
          {
            email: this.email,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );
        console.log(response);
        this.logout();
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
          confirmButtonText: "OK",
        });
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
        this.logout();
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
    this.getUser();
  },
};
</script>

<style scoped>
img {
  border-radius: 50%;
  width: 35%;
}
div#update {
  border: 1px solid white;
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
p {
  font-size: 0.9rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  margin-bottom: 1rem;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
}
input#upload {
  display: none;
}
legend {
  font-size: 0.7rem;
}
button {
  outline: none;
  margin-top: 0.5rem;
  font-size: 0.5rem;
  border-radius: 20px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
}
button#deletePicture {
  all: unset;
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
div#changePassword legend:nth-child(2) {
  margin-top: 2rem;
}
div#deleteUser {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
}

@media (min-width: 700px) {
  img {
    width: 25%;
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
    font-size: 0.7rem;
  }
  button#updateButton {
    margin-top: 1.2rem;
    font-size: 1rem;
  }
  div#editPassword div {
    display: flex;
    justify-content: space-between;
  }
  div#deleteUser textarea {
    width: 90%;
    height: 250px;
  }
}
</style>
