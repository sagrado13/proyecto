<template>
  <div>
    <input
      type="search"
      v-model="search"
      placeholder="Buscar por bufete, teléfono, login o email"
      size="35"
    />
    <ul>
      <!-- :class="{ profile: lawyer.picture_lawyer === null}" -->
      <!-- :class="{ hide: lawyer.picture_lawyer === null }" -->
      <li v-for="(lawyer, index) in filtered" :key="lawyer.id">
        <img
          :class="{ hide: lawyer.picture_lawyer === null }"
          :src="getPictureLawyers(lawyer.picture_lawyer)"
          alt="Foto del abogado"
        />
        <p>
          <span>Abogado:</span>
          {{ lawyer.law_firm }}
        </p>
        <p>
          <span>Dirección:</span>
          {{ lawyer.street }} {{ lawyer.zip }}
        </p>
        <p>
          <span>Ciudad:</span>
          {{ lawyer.city_lawyer }}
        </p>
        <p :class="{ hide: lawyer.phone_number_lawyer === null }">
          <span>Teléfono:</span>
          {{ lawyer.phone_number_lawyer }}
        </p>
        <p>
          <span>Login:</span>
          {{ lawyer.login_lawyer }}
        </p>
        <p>
          <span>Email:</span>
          {{ lawyer.email_lawyer }}
        </p>
        <p :class="{ hide: lawyer.low_reason === null }">
          <span>Motivo de la baja:</span>
          {{ lawyer.low_reason }}
        </p>
        <p :class="{ hide: lawyer.registration_code === null }">
          <span>Código de registro:</span>
          {{ lawyer.registration_code }}
        </p>
        <p>
          <span>Fecha de registro:</span>
          {{ format(new Date(lawyer.update_date), "dd/MM/yyyy") }}
        </p>
        <p>
          <span>Fecha de la última conexión:</span>
          {{ format(new Date(lawyer.update_date), "dd/MM/yyyy HH:mm") }}h
        </p>
        <button @click="sendIdLawyer(index)">Reactivar</button>
        <hr />
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format } from "date-fns";
export default {
  name: "ListDeletedLawyersComp",
  props: {
    lawyers: Array,
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
        return this.lawyers;
      }
      return this.lawyers.filter(
        (lawyer) =>
          lawyer.law_firm
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.login_lawyer
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.phone_number_lawyer
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            ) ||
          lawyer.email_lawyer
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
    // FUNCIÓN PARA OBTENER LA IMAGEN
    getPictureLawyers(picture) {
      if (picture !== null) {
        return process.env.VUE_APP_STATIC_LAWYERS + picture;
      }
    },
    // FUNCIÓN PARA ENVIAR EL ID DEL ABOGADO SELECCIONADO
    sendIdLawyer(index) {
      let idLawyer = this.lawyers[index].id;
      this.$emit("id", idLawyer);
    },
  },
};
</script>

<style scoped>
ul li {
  list-style: none;
}
img {
  border-radius: 50%;
}
</style>
