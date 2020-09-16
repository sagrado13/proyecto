<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Nuevo presupuesto" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- FORMULARIO PARA AÑADIR NUEVO PRESUPUESTO -->
    <h4>Nuevos presupuesto para proceso Nº{{ idProcess }}</h4>
    <legend>Mensaje para su cliente*</legend>
    <textarea
      v-model="message"
      name="message"
      placeholder="Mensaje para el cliente"
      cols="45"
      rows="20"
      required
    ></textarea>
    <legend>Precio*</legend>
    <input type="text" placeholder="Precio" v-model="price" />
    <button id="create" @click="addNewBudget()">Crear presupuesto</button>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
export default {
  name: "NewBudget",
  data() {
    return {
      idProcess: "",
      message: "",
      price: "",
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER ID DE PROCESO DE LA RUTA Y PONERLA EN EL TÍTULO
    getIdProcess() {
      this.idProcess = this.$route.params.id;
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
    // FUNCIÓN PARA CREAR UN NUEVO PRESUPUESTO
    async addNewBudget() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.post(
          process.env.VUE_APP_BACK_URL +
            "lawyers/" +
            getIdToken(token) +
            "/processes/" +
            this.idProcess +
            "/budgets",
          {
            message: this.message,
            price: this.price,
          }
        );
        window.history.back();
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
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
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.getIdProcess();
  },
};
</script>

<style scoped>
div {
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button#back {
  align-self: flex-start;
}
h4 {
  margin: 1rem;
  text-decoration: underline;
}
legend {
  font-size: 0.8rem;
}
textarea {
  outline: none;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
input {
  outline: none;
  width: 30%;
  text-align: center;
  font-size: 0.9rem;
  background: var(--dark);
  color: var(--bright);
  border-width: 0 0 2px;
  border-color: yellowgreen;
  border-radius: 10px;
}
button#create {
  outline: none;
  border-radius: 20px;
  margin: 0.5rem;
  box-shadow: 5px 5px 30px var(--button) inset;
}

@media (min-width: 700px) {
  h4 {
    font-size: 1.15rem;
  }
  legend {
    font-size: 0.9rem;
  }
  textarea {
    font-size: 0.9rem;
    width: 80%;
  }
  input {
    width: auto;
    font-size: 0.9rem;
    padding: 0.2rem;
  }
  button#create {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1000px) {
  h4 {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }
  legend {
    font-size: 1rem;
  }
  textarea {
    font-size: 1.1rem;
    width: 50%;
    height: 450px;
  }
  input {
    font-size: 1rem;
  }
  button#create {
    font-size: 1rem;
  }
}
</style>
