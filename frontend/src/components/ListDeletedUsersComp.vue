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
        <hr />
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
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
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
ul li {
  list-style: none;
}
</style>