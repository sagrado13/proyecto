<template>
  <div id="listActivated">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Usuarios activos" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- ORDENACIÓN -->
    <div @click="listActivatedUsers" v-if="!showLowUser">
      <!-- TOTAL ABOGADOS DADOS DE BAJA -->
      <div id="info">
        <p id="quantity">
          <img src="../assets/home/totalUser.png" alt="Total abogados" />
          {{ totalUsers }}
        </p>
        <p id="info">Usuarios activos</p>
      </div>

      <legend>Ordenar</legend>
      <select v-model="order" name="order">
        <option value>Nombre</option>
        <option value="email">Email</option>
        <option value="city">Ciudad</option>
        <option value="login">Login</option>
        <option value="updateDate">Última conexión</option>
      </select>
      <select v-model="direction" name="direction">
        <option value>Ascendente</option>
        <option value="desc">Descendente</option>
      </select>

      <!-- LISTADO DE USUARIOS ACTIVOS -->
      <listactivateduserscomp @data="showLowUsers" :users="users" />
    </div>

    <!-- FORMULARIO PARA DAR DE BAJA -->
    <div id="deleteUser" v-if="showLowUser">
      <p>Dar de baja a {{ lowUser }}</p>
      <textarea
        v-model="lowReason"
        name="lowReason"
        cols="30"
        rows="10"
        placeholder="Motivo por el que das de baja a este usuario"
      ></textarea>
      <button @click="showLowUser = !showLowUser">Cancelar</button>
      <button id="delete" @click="deleteUser">Dar de baja</button>
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// importamos el componente ListActivatedUsersComp
import listactivateduserscomp from "@/components/ListActivatedUsersComp.vue";
export default {
  name: "ListActivatedUsers",
  components: {
    listactivateduserscomp,
  },
  data() {
    return {
      users: [],
      totalUsers: "",
      order: "",
      direction: "",
      lowReason: "",
      showLowUser: false,
      lowUser: "",
      idUser: "",
    };
  },
  methods: {
    // FUNCIÓN PARA LISTAR LOS USUARIOS ACTIVOS
    async listActivatedUsers() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "list-activated-users",
          {
            params: {
              order: this.order,
              direction: this.direction,
            },
          }
        );
        this.users = response.data.users;
        this.totalUsers = response.data.data[0].total_users;
      } catch (error) {
        console.log(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
        window.history.back();
      }
    },
    // FUNCIÓN PARA MOSTRAR FORMULARIO PARA DAR DE BAJA
    showLowUsers(dataUser) {
      this.showLowUser = true;
      this.lowUser = dataUser.name + " " + dataUser.surname;
      this.idUser = dataUser.id;
    },
    // FUNCIÓN PARA DAR DE BAJA UN USUARIO
    async deleteUser() {
      const result = await Swal.fire({
        title: `Estas seguro de que quieres dar de baja a ${this.lowUser}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            process.env.VUE_APP_BACK_URL +
              "users/" +
              `${this.idUser}` +
              "/delete",
            {
              lowReason: this.lowReason,
            }
          );
          this.showLowUser = false;
          Swal.fire({
            title: "Usuario borrado correctamente",
            icon: "success",
          });
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
  // HOOK
  created() {
    this.listActivatedUsers();
  },
};
</script>

<style scoped>
div#listActivated {
  margin-bottom: 5rem;
}
div#info {
  margin-bottom: 1rem;
  font-weight: bold;
}
div#info img {
  margin-right: 0.2rem;
  width: 40px;
}
p#info {
  font-size: 0.7rem;
}
p#quantity {
  display: flex;
  align-items: center;
  justify-content: center;
}
select {
  background-color: var(--bright);
  color: var(--dark);
  font-size: 0.7rem;
}
div#deleteUser {
  display: inline-block;
  background-color: var(--background);
  border-radius: 30px;
  margin: 1rem;
  padding: 1rem;
}
div#deleteUser p {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
textarea {
  outline: none;
  font-size: 0.8rem;
  width: 90%;
}
button {
  outline: none;
  margin: 1rem;
  font-size: 0.5rem;
  border-radius: 20px;
  min-width: 55px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
}
button#back {
  margin: 0;
  box-shadow: none;
  min-width: 0;
}
button#back img {
  width: 15px;
}

@media (min-width: 700px) {
  div#info img {
    width: 50px;
  }
  p#quantity {
    font-size: 1.2rem;
  }
  p#info {
    font-size: 0.8rem;
  }
  select {
    font-size: 0.9rem;
  }
  button {
    font-size: 0.8rem;
    min-width: 90px;
  }
  textarea {
    min-width: 300px;
    font-size: 0.9rem;
  }
  button#back img {
    width: 20px;
  }
}

@media (min-width: 1000px) {
  div#info img {
    width: 60px;
  }
  p#info {
    font-size: 1rem;
  }
  p#quantity {
    font-size: 1.5rem;
  }
  select {
    font-size: 1rem;
  }
  div#deleteUser p {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  button {
    font-size: 0.9rem;
    min-width: 100px;
  }
  textarea {
    min-width: 450px;
    height: 350px;
    font-size: 1rem;
  }
  button#back img {
    width: 30px;
  }
}
</style>
