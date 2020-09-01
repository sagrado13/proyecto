<template>
  <div>
    <!-- FILTRO PARA BUSCAR POR NOMBRE, TELÉFONO, LOGIN O EMAIL -->
    <input
      type="search"
      v-model="search"
      placeholder="Buscar por nombre, teléfono, login o email"
      size="25"
    />

    <!-- DATOS DE LOS USUARIOS ACTIVOS -->
    <ul>
      <li v-for="(user, index) in filtered" :key="user.id">
        <img
          :class="{ hide: user.picture_user !== null }"
          src="../assets/profile.jpeg"
          alt="Foto de perfil por defecto"
        />

        <img
          :class="{ hide: user.picture_user === null }"
          :src="getPictureUsers(user.picture_user)"
          alt="Foto de usuario"
        />
        <p>
          <span>Nombre y Apelidos:</span>
          <router-link
            class="link"
            :to="{ name: 'GetUser', params: { id: user.id } }"
          >{{ user.name }} {{ user.surname }}</router-link>
        </p>
        <p>
          <span>Ciudad:</span>
          {{ user.city_user }}
        </p>
        <p :class="{ hide: user.phone_number_user === null }">
          <span>Teléfono:</span>
          {{ user.phone_number_user }}
        </p>
        <p>
          <span>Login:</span>
          {{ user.login_user }}
        </p>
        <p>
          <span>Email:</span>
          {{ user.email_user }}
        </p>
        <p>
          <span>Fecha de registro:</span>
          {{ formatDate(user.creation_date) }}
        </p>
        <p>
          <span>Última conexión:</span>
          Hace
          {{ formatDistanceDate(user.update_date) }}
        </p>

        <!-- BOTONES PARA DAR DE BAJA -->
        <div id="button">
          <button @click="sendDataUser(index)">Dar de baja</button>
          <button>
            <router-link :to="{ name: 'ListProcessesUser', params: { id: user.id } }">Ver procesos</router-link>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "ListDeletedUsersComp",
  props: {
    users: Array,
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    /* FILTRO POR TELÉFONO, LOGIN Y EMAIL. CAMBIA CUALQUIER MAYÚSCULA A MINÚSCULA,
    Y ELIMINA CUALQUIER SIGNO DIACRÍTICO */
    filtered() {
      if (!this.search) {
        return this.users;
      }
      return this.users.filter(
        (user) =>
          user.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          user.email_user
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          user.login_user
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          user.phone_number_user.includes(this.search)
      );
    },
  },
  methods: {
    // FUNCIÓN PARA OBTENER FOTO DE USUARIO
    getPictureUsers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_USERS + picture;
      }
    },
    // FUNCIÓN PARA ENVIAR ID DEL USUARIO SELECCIONADO
    sendDataUser(index) {
      let dataUser = this.users[index];
      this.$emit("data", dataUser);
    },
    //FUNCIÓN PARA FORMATEAR FECHA
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy");
    },
    //FUNCIÓN PARA CALCULAR EL TIEMPO DESDE LA FECHA
    formatDistanceDate(date) {
      return formatDistanceToNow(new Date(date), {
        includeSeconds: true,
        locale: es,
      });
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  font-weight: bold;
  color: goldenrod;
}
.link:visited {
  color: goldenrod;
}
input {
  outline: 0;
  border-width: 0 0 2px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  text-align: center;
  background: var(--bright);
  color: var(--dark);
  padding: 0.1rem;
  margin: 1rem;
}
img {
  border-radius: 50%;
  width: 35%;
}
ul {
  margin-bottom: 2rem;
}
ul li {
  list-style: none;
  margin: 1rem;
  padding: 1rem;
  background-color: var(--button);
  border-radius: 30px;
}
ul li p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
ul li p span {
  font-weight: bold;
  text-decoration: underline;
  display: block;
}
button {
  outline: none;
  font-size: 0.7rem;
  border-radius: 20px;
  margin: 0.5rem;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button:first-of-type {
  box-shadow: 5px 5px 30px red inset;
}

@media (min-width: 700px) {
  input {
    font-size: 0.9rem;
    width: 250px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    max-width: 190px;
  }
  ul li p {
    margin-top: 0.6rem;
    font-size: 0.9rem;
    word-break: break-word;
  }
  button {
    font-size: 0.8rem;
  }
}

@media (min-width: 1000px) {
  ul {
    display: unset;
  }
  ul li {
    font-size: 1rem;
    max-width: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  input {
    font-size: 1rem;
    width: 320px;
  }
  img {
    width: 8%;
  }
  ul li span {
    word-break: normal;
  }
  ul li p {
    font-size: 1rem;
    margin-left: 0.5rem;
    align-self: center;
  }
  div#button {
    display: flex;
    flex-direction: column;
  }
  button {
    font-size: 0.9rem;
    align-self: center;
    min-width: 130px;
  }
}
</style>
