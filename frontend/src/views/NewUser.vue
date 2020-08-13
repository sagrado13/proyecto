<template>
  <div>
    <h3>Regístrate para ser usuario</h3>
    <div id="register">
      <p>{{msg}}</p>
      <legend>Nombre*</legend>
      <input type="text" required v-model="name" placeholder="Nombre" />
      <legend>Apellidos*</legend>
      <input type="text" required v-model="surname" placeholder="Apellidos" />
      <legend>Ciudad*</legend>
      <input type="text" required v-model="city" placeholder="Ciudad" />
      <legend>Teléfono*</legend>
      <input type="tel" required v-model="phoneNumber" placeholder="Teléfono" />
      <legend>Usuario*</legend>
      <input type="text" required v-model="login" placeholder="Usuario" />
      <legend>Email*</legend>
      <input type="email" required v-model="email" placeholder="Email" />
      <legend>Contraseña*</legend>
      <input type="password" required v-model="password" placeholder="Contraseña" />
      <input id="upload" type="file" @change="processFile" ref="fileInput" />
      <button id="uploadPicture" @click="$refs.fileInput.click()">Cargar imagen</button>
      <progress max="100" :value.prop="uploadProgress"></progress>
    </div>
    <button id="register" @click="addNewUsers">Registrarse</button>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
export default {
  name: "NewUser",
  data() {
    return {
      name: "",
      surname: "",
      city: "",
      phoneNumber: "",
      login: "",
      email: "",
      password: "",
      avatar: null,
      uploadProgress: 0,
      msg: "",
    };
  },
  methods: {
    // FUNCIÓN PARA PROCESAR LA IMAGEN
    processFile(event) {
      this.avatar = event.target.files[0];
    },
    // FUNCIÓN PARA REGISTRAR USUARIO
    async addNewUsers() {
      try {
        let fd = new FormData();
        fd.append("name", this.name);
        fd.append("surname", this.surname);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber);
        fd.append("login", this.login);
        fd.append("email", this.email);
        fd.append("password", this.password);
        fd.append("avatar", this.avatar);
        const response = await axios.post("http://localhost:3000/users", fd, {
          onUploadProgress: (uploadEvent) => {
            this.uploadProgress = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          },
        });
        Swal.fire({
          icon: "success",
          title: "Usuario añadido correctamente",
        });
        this.$route.push("/");
        location.reload();
      } catch (error) {
        this.msg = error.response.data.message;
        console.log(error);
      }
    },
    /*     validatingData() {
      if (
        this.name === "" ||
        this.surname === "" ||
        this.city === "" ||
        this.login === "" ||
        this.email === "" ||
        this.password === ""
      ) {
        this.errorMsg = true;
        this.createUser = false;
        Swal.fire({
          icon: "error",
          title: "Tienes campos vacíos"
        });
      } else {
        this.errorMsg = false;
        this.createUser = true;
        this.addNewUsers();
      }
    } */
  },
};
</script>

<style scoped>
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
div#register {
  display: flex;
  flex-direction: column;
  align-items: center;
}
legend {
  font-size: 0.8rem;
  margin-top: 1rem;
}
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  padding: 0.1rem;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
}
input#upload {
  display: none;
}
button {
  font-size: 0.7rem;
  border-radius: 20px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
}

button#uploadPicture {
  margin-top: 0.5rem;
  font-size: 0.6rem;
}
button#register {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}
</style>