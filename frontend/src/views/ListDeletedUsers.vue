<template>
  <div id="listDeleted">
    <!-- Declaramos vue-headful -->
    <vue-headful title="Usuarios dados de baja" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- TOTAL ABOGADOS DADOS DE BAJA -->
    <div id="info">
      <p id="quantity">
        <img src="../assets/home/totalUser.png" alt="Total abogados" />
        {{ totalUsers }}
      </p>
      <p id="info">Usuarios dados de baja</p>
    </div>

    <!-- ORDENACIÓN -->
    <div @click="listDeletedUsers">
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
    </div>

    <!-- LISTADO DE USUARIOS DADOS DE BAJA -->
    <listdeleteduserscomp @data="reactivateUser" :users="users" />
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// Importamos el componente ListDeletedUsersComp
import listdeleteduserscomp from "@/components/ListDeletedUsersComp.vue";
export default {
  name: "ListDeletedUsers",
  components: {
    listdeleteduserscomp,
  },
  data() {
    return {
      users: [],
      totalUsers: "",
      order: "",
      direction: "",
    };
  },
  methods: {
    // FUNCIÓN PARA LISTAR LOS USUARIOS DADOS DE BAJA
    async listDeletedUsers() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.get(
          process.env.VUE_APP_BACK_URL + "list-deleted-users",
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
    // FUNCIÓN PARA REACTIVAR LA CUENTA DE UN USUARIO
    async reactivateUser(dataUser) {
      const result = await Swal.fire({
        title: `Estas seguro de que quieres reactivar la cuenta de ${dataUser.name +
          " " +
          dataUser.surname}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.get(
            process.env.VUE_APP_BACK_URL + "reactivate-user/" + dataUser.id
          );
          Swal.fire({
            title: `${response.data.message}`,
            icon: "success",
            confirmButtonText: "OK",
          });
          this.listDeletedUsers();
        } catch (error) {
          console.log(error.response);
          Swal.fire({
            icon: "error",
            title: `${error.response.data.message}`,
          });
        }
      } else {
        Swal.fire({
          title: "Reactivación cancelada",
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
    this.listDeletedUsers();
  },
};
</script>

<style scoped>
div#listDeleted {
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
}

@media (min-width: 700px) {
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
}
</style>
