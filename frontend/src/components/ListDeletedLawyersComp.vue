<template>
  <div>
    <!-- FILTRO PARA BUSCAR POR BUFETE, TELÉFONO, LOGIN O EMAIL -->
    <input
      type="search"
      v-model="search"
      placeholder="Buscar por bufete, teléfono, login o email"
      size="35"
    />

    <!-- DATOS DE LOS ABOAGOS DADOS DE BAJA -->
    <ul>
      <li v-for="(lawyer, index) in filtered" :key="lawyer.id">
        <img
          :class="{ hide: lawyer.picture_lawyer !== null }"
          src="../assets/profile.jpeg"
          alt="Foto de perfil por defecto"
        />
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
          <span>Localidad:</span>
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
          {{ formatDate(lawyer.update_date) }}
        </p>
        <p>
          <span>Última conexión:</span>
          Hace
          {{ formatDistanceDate(lawyer.update_date) }}
        </p>

        <!-- BOTÓN PARA REACTIVAR LA CUENTA DEL ABOGADO SELECCIONADO -->
        <button @click="sendIdLawyer(index)">Reactivar</button>
      </li>
    </ul>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "ListDeletedLawyersComp",
  props: {
    lawyers: Array,
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
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              this.search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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
      let dataLawyer = this.filtered[index];
      this.$emit("data", dataLawyer);
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
  width: 230px;
}
img {
  border-radius: 50%;
  width: 100px;
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
  box-shadow: 5px 5px 30px yellowgreen inset;
}

@media (min-width: 700px) {
  input {
    font-size: 0.9rem;
    width: 280px;
  }
  img {
    width: 125px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  ul li {
    width: 180px;
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
  input {
    font-size: 1rem;
    width: 320px;
  }
  ul {
    display: unset;
  }
  ul li {
    font-size: 1rem;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  img {
    width: 150px;
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
    margin-left: 0.5rem;
    font-size: 0.9rem;
    align-self: center;
    min-width: 90px;
  }
}
</style>
