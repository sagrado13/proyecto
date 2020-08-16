<template>
  <div>
    <h1>Nuevo proceso</h1>
    <textarea v-model="message" name="message" placeholder="Descripción detallada del caso"></textarea>
    <br />
    <button id="send" @click="addNewProcess()">📨 Enviar</button>
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
  name: "NewProcess",
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addNewProcess() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          "http://localhost:3000/users/" +
            getIdToken(token) +
            "/processes/lawyers/" +
            this.$route.params.id,
          {
            message: this.message,
          }
        );
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
        });
        this.$route.push(window.history.back());
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin: 1.5rem;
}
textarea {
  outline: none;
  width: 80%;
  height: 200px;
}
button#send {
  outline: none;
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-size: 0.7rem;
  border-radius: 20px;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
}

@media (min-width: 700px) {
  textarea {
    height: 400px;
    font-size: 1.2rem;
  }
  button#send {
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  textarea {
    width: 60%;
    font-size: 1.3rem;
  }
  button#send {
    font-size: 1rem;
  }
}
</style>
