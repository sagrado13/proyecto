<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Contacto" />
    <!-- BOTÓN  DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>
    <p v-if="showMsg">*Son obligatorios todos los campos*</p>
    <!-- FORMULARIO PARA CONTACTAR CON EL ADMIN -->
    <div id="contact">
      <label for>Nombre*</label>
      <input v-model="name" type="text" placeholder="Nombre" />
      <label for>Apellidos*</label>
      <input v-model="surname" type="text" placeholder="Apellidos" />
      <label for>Teléfono*</label>
      <input v-model="phoneNumber" type="tel" placeholder="Teléfono" />
      <label for>Email*</label>
      <input v-model="email" type="email" placeholder="Email" />
      <label for>Escribe tu mensaje*</label>
      <textarea v-model="message" name id cols="30" rows="10" placeholder="Escribe tu mensaje"></textarea>
      <button id="send" @click="sendContact">Enviar</button>
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
export default {
  name: "Contact",
  data() {
    return {
      name: "",
      surname: "",
      phoneNumber: "",
      email: "",
      message: "",
      showMsg: false,
    };
  },
  methods: {
    // FUNCIÓN PARA ENVIAR FORMULARIO
    async sendContact() {
      if (
        !this.name ||
        !this.surname ||
        !this.phoneNumber ||
        !this.email ||
        !this.message
      ) {
        return (this.showMsg = true);
      }
      try {
        const response = await axios.post("http://localhost:3000/contact", {
          name: this.name,
          surname: this.surname,
          phoneNumber: this.phoneNumber.replace(/[\-\.\  ]/g, ""),
          emailUser: this.email,
          message: this.message,
        });
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
        });
        this.name = "";
        this.surname = "";
        this.phoneNumber = "";
        this.email = "";
        this.message = "";
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
p {
  color: red;
  margin-top: 1rem;
  font-size: 0.8rem;
}
div#contact {
  background-color: var(--background);
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin: 1% auto;
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
textarea {
  outline: 0;
  font-size: 0.8rem;
  width: 100%;
}
button#send {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
  width: 80px;
  margin-top: 1rem;
}

@media (min-width: 700px) {
  div#contact {
    width: 70%;
  }
  p {
    font-size: 0.9rem;
  }
  label {
    font-size: 0.9rem;
  }
  input {
    padding: 0.2rem;
    font-size: 0.9rem;
  }
  textarea {
    font-size: 0.9rem;
    width: 80%;
    height: 250px;
  }
  button#send {
    font-size: 0.8rem;
  }
}

@media (min-width: 1000px) {
  div#contact {
    width: 50%;
  }
  p {
    font-size: 1rem;
  }
  label {
    font-size: 1rem;
  }
  input {
    font-size: 1rem;
    width: 30%;
  }
  textarea {
    font-size: 1rem;
    width: 70%;
    height: 325px;
  }
  button#send {
    font-size: 1rem;
    width: 100px;
  }
}
</style>
