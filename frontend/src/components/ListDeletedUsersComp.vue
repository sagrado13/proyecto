<template>
  <div>
    <input
      type="search"
      v-model="search"
      placeholder="Buscar por teléfono, login o email"
      size="25"
    />
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
          {{ user.name }} {{ user.surname }}
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
        <p :class="{ hide: user.registration_code === null }">
          <span>Código de registro:</span>
          {{ user.registration_code }}
        </p>
        <p :class="{ hide: user.low_reason === null }">
          <span>Motivo de la baja:</span>
          {{ user.low_reason }}
        </p>
        <p>
          <span>Fecha de registro:</span>
          {{ format(new Date(user.creation_date), "dd/MM/yyyy") }}
        </p>
        <p>
          <span>Fecha de última conexión:</span>
          {{ format(new Date(user.update_date), "dd/MM/yyyy HH:mm") }}h
        </p>
        <button @click="sendIdUser(index)">Reactivar</button>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListDeletedUsersComp",
  props: {
    users: Array,
  },
  data() {
    return {
      format,
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
          user.phone_number_user
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
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
    sendIdUser(index) {
      let idUser = this.users[index].id;
      this.$emit("id", idUser);
    },
  },
};
</script>

<style scoped>
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
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
  border: 1px solid white;
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
  padding: 0.3rem;
  margin-top: 1rem;
  box-shadow: 5px 5px 30px white inset;
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
    width: 280px;
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

  button {
    font-size: 0.9rem;
    align-self: center;
    word-break: normal;
  }
}
</style>