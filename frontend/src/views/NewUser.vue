<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Regístrate usuario" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <h3>Regístrate para ser usuario</h3>

    <!-- FORMULARIO PARA REGISTRAR NUEVO USUARIO -->
    <div id="register">
      <form action>
        <label>Nombre*</label>
        <input type="text" required v-model="name" placeholder="Nombre" />
        <label>Apellidos*</label>
        <input type="text" required v-model="surname" placeholder="Apellidos" />
        <label>Ciudad*</label>
        <input type="text" required v-model="city" placeholder="Ciudad" />
        <label>Teléfono*</label>
        <input type="tel" required v-model="phoneNumber" placeholder="Teléfono" />
        <label>Usuario*</label>
        <input type="text" required v-model="login" placeholder="Usuario" />
        <label>Email*</label>
        <input type="email" required v-model="email" placeholder="Email" />
        <label>Contraseña*</label>
        <input
          :class=" { error: showMsg === true}"
          type="password"
          v-model="password"
          placeholder="Contraseña"
        />
        <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
        <label>Repetir contraseña*</label>
        <input
          :class=" { error: showMsg === true}"
          type="password"
          v-model="password1"
          placeholder="Repite la contraseña"
        />
        <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
        <input id="upload" type="file" @change="processFile" ref="fileInput" />
        <button id="uploadPicture" @click="$refs.fileInput.click()">Cargar imagen</button>
        <progress max="100" :value.prop="uploadProgress"></progress>
      </form>
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
      password1: "",
      avatar: null,
      uploadProgress: 0,
      showMsg: false,
    };
  },
  methods: {
    // FUNCIÓN PARA PROCESAR LA IMAGEN
    processFile(event) {
      this.avatar = event.target.files[0];
    },
    // FUNCIÓN PARA REGISTRAR USUARIO
    async addNewUsers() {
      if (this.password !== this.password1) {
        return (this.showMsg = true);
      }
      try {
        let fd = new FormData();
        fd.append("name", this.name);
        fd.append("surname", this.surname);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber.replace(/[\-\.\  ]/g, ""));
        fd.append("login", this.login);
        fd.append("email", this.email);
        fd.append("password", this.password);
        if (this.avatar !== null) {
          fd.append("avatar", this.avatar);
        }
        const response = await axios.post("http://localhost:3000/users", fd, {
          onUploadProgress: (uploadEvent) => {
            this.uploadProgress = Math.round(
              (uploadEvent.loaded / uploadEvent.total) * 100
            );
          },
        });
        this.$route.push("/");
        Swal.fire({
          icon: "success",
          title: "Usuario añadido correctamente",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
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
h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
div#register {
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 20px;
  width: 70%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: var(--background);
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
label {
  font-size: 0.8rem;
  margin-top: 1rem;
}
input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: yellowgreen;
  border-radius: 10px;
  padding: 0.1rem;
  font-size: 0.7rem;
  text-align: center;
  background: var(--bright);
  color: var(--dark);
}
input#upload {
  display: none;
}
button {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#back {
  box-shadow: none;
}
button#uploadPicture {
  margin-top: 0.5rem;
  font-size: 0.6rem;
}
button#register {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 700px) {
  label {
    font-size: 0.9rem;
  }
  input {
    padding: 0.2rem;
    font-size: 0.9rem;
  }
  button#uploadPicture {
    margin-top: 0.8rem;
    font-size: 0.75rem;
  }
  button#register {
    margin-top: 1rem;
    font-size: 1rem;
  }
}

@media (min-width: 1000px) {
  div#register {
    width: 30%;
  }
  label {
    font-size: 1rem;
  }
  input {
    font-size: 1rem;
    width: 50%;
  }
  button#uploadPicture {
    margin-top: 1.5rem;
    font-size: 0.85rem;
  }
  button#register {
    margin-top: 1.5rem;
    font-size: 1.1rem;
  }
}
</style>
