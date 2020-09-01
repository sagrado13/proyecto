<template>
  <div>
    <!-- Declaramos vue-headful -->
    <vue-headful title="Ver y editar perfil" />

    <!-- BOTÓN DE VOLVER ATRÁS -->
    <button v-if="!showEditPassword && !showLowLawyer" id="back" @click="goBack()">
      <img src="../assets/deshacer.svg" />
    </button>

    <!-- DATOS DEL ABOGADO DONDE LOS PUEDE CONSULTAR Y MODIFICAR -->
    <div id="update" v-if="!showEditPassword && !showLowLawyer">
      <p :class="{ hide: voteAverage === null }">
        <star-rating
          :rating="Number(voteAverage)"
          :increment="0.1"
          :read-only="true"
          :fixed-points="1"
          :star-size="20"
          :inline="true"
        ></star-rating>
        <router-link
          class="link"
          :to="{ name: 'ListRating', params: { id: idLawyer } }"
        >( {{ totalRatings }} votos )</router-link>
      </p>
      <p>Estos son tus datos {{ lawFirm }}, puedes actualizarlos si deseas.</p>
      <img
        :class="{ hide: picture !== null }"
        src="../assets/profile.jpeg"
        alt="Foto de perfil por defecto"
      />
      <img :class="{ hide: picture === null }" :src="picture" alt="Avatar de abogado" />
      <button id="deletePicture" @click="deletePicture">Eliminar imagen</button>
      <legend>Nombre bufete*</legend>
      <input type="text" placeholder="Nombre bufete" v-model="lawFirm" />
      <legend>Dirección</legend>
      <input type="text" placeholder="Calle" v-model="street" />
      <legend>Código postal*</legend>
      <input type="text" placeholder="Código postal" v-model="zip" />
      <legend>Localidad*</legend>
      <select v-model="city" name="city">
        <option value></option>
        <option v-for="province in provinces" :key="province.id" :value="province">{{ province }}</option>
      </select>
      <legend>Teléfono*</legend>
      <input type="tel" placeholder="Número de teléfono" v-model="phoneNumber" />
      <legend>Usuario*</legend>
      <input type="text" placeholder="Usuario" v-model="login" />
      <legend>Urgencia tratando los casos*</legend>
      <select v-model="urgency" name="urgency">
        <option value>Urgencia tratando los casos</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>
      <legend>Descripción</legend>
      <input type="text" placeholder="Descripción" v-model="description" />
      <input id="upload" type="file" @change="processFile" ref="fileInput" />
      <button @click="$refs.fileInput.click()">Cargar imagen</button>
      <progress max="100" :value.prop="uploadProgress"></progress>
      <button id="updateButton" @click="updateLawyer">Actualiza tu perfil</button>

      <!-- LISTADO DE ESPECIALIDADES AÑADIDAS EN SU PERFIL, CON LA OPCIÓN DE BORRARLAS -->
      <editlawyercomp @delete="deleteSpeciality" :specialities="specialities" />

      <!-- SELECT PARA AÑADIR ESPECIALIDADES -->
      <legend>Añade una especialidad</legend>
      <select v-model="speciality" name="speciality">
        <option value>Selecciona una especialidad</option>
        <option value="Derecho Civil">Derecho Civil</option>
        <option value="Derecho Penal">Derecho Penal</option>
        <option value="Derecho Comercial">Derecho Comercial</option>
        <option value="Derecho Laboral">Derecho Laboral</option>
        <option value="Derecho Tributario">Derecho Tributario</option>
        <option value="Derecho Constitucional">Derecho Constitucional</option>
        <option value="Derecho Administrativo">Derecho Administrativo</option>
        <option value="Derecho Intelectual">Derecho Intelectual</option>
        <option value="Derecho Ambiental">Derecho Ambiental</option>
      </select>
      <button @click="addNewSpeciality">Añadir</button>
    </div>

    <!-- BOTONES PARA CAMBIAR EMAIL O CONTRASEÑA Y DARSE DE BAJA-->
    <div id="editPassword" v-if="!showEditPassword && !showLowLawyer">
      <button @click="showEditPassword = !showEditPassword">Cambiar email o contraseña</button>
      <button id="delete" @click="showLowLawyer = !showLowLawyer">Date de baja</button>
    </div>

    <!-- CAMBIO DE EMAIL Y CONTRASEÑA -->
    <div v-if="showEditPassword" id="changePassword">
      <p>Cambia tu email o contraseña</p>
      <legend>Email*</legend>
      <input type="email" placeholder="Email" v-model="email" />
      <legend>Contraseña vieja*</legend>
      <input type="password" placeholder="Contraseña antigua" v-model="oldPassword" />
      <legend>Contraseña nueva*</legend>
      <input
        :class="{ error: showMsg === true }"
        type="password"
        v-model="newPassword"
        placeholder="Contraseña nueva"
      />
      <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
      <legend>Repetir contraseña nueva*</legend>
      <input
        :class="{ error: showMsg === true }"
        type="password"
        v-model="newPassword1"
        placeholder="Repite la contraseña nueva"
      />
      <small class="errorMsg" v-if="showMsg">*No coincide la contraseña*</small>
      <div>
        <button @click="updateLawyerPassword()">Actualizar</button>
        <button @click="showEditPassword = !showEditPassword">Cancelar</button>
      </div>
    </div>

    <!-- FORMULARIO PARA DARSE DE BAJA -->
    <div id="deleteLawyer" v-if="showLowLawyer">
      <p>Borrar cuenta</p>
      <textarea
        v-model="lowReason"
        placeholder="Motivo por el que nos abandonas"
        name="lowReason"
        cols="30"
        rows="10"
      ></textarea>
      <button @click="showLowLawyer = !showLowLawyer">Cancelar</button>
      <button id="delete" @click="deleteLawyer()">Date de baja</button>
    </div>
  </div>
</template>

<script>
// Importamos axios
import axios from "axios";
// Importamos sweetalert2
import Swal from "sweetalert2";
// IMPORTAMOS FUNCIONES
import { getIdToken } from "../api/utils";
import { checkIsAdmin } from "../api/utils.js";
// Importamos el componente EditLawyerComp
import editlawyercomp from "@/components/EditLawyerComp.vue";
export default {
  name: "EditLawyer",
  components: {
    editlawyercomp,
  },
  data() {
    return {
      idLawyer: "",
      lawFirm: "",
      street: "",
      zip: "",
      city: "",
      phoneNumber: "",
      login: "",
      urgency: "",
      description: "",
      picture: "",
      avatar: null,
      uploadProgress: 0,
      voteAverage: "",
      totalRatings: "",
      specialities: [],
      speciality: "",
      email: "",
      oldPassword: "",
      newPassword: "",
      newPassword1: "",
      showEditPassword: false,
      showMsg: false,
      lowReason: "",
      showLowLawyer: false,
      provinces: [
        "A Coruña",
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Ávila",
        "Badajoz",
        "Barcelona",
        "Burgos",
        "Cáceres",
        "Cádiz",
        "Cantabria",
        "Castellón",
        "Ciudad Real",
        "Córdoba",
        "Cuenca",
        "Gerona",
        "Granada",
        "Guadalajara",
        "Guipúzcoa",
        "Huelva",
        "Huesca",
        "Islas Baleares",
        "Jaén",
        "Las Palmas",
        "La Rioja",
        "León",
        "Lérida",
        "Lugo",
        "Madrid",
        "Málaga",
        "Murcia",
        "Navarra",
        "Orense",
        "Palencia",
        "Pontevedra",
        "Salamanca",
        "Santa Cruz de Tenerife",
        "Segovia",
        "Sevilla",
        "Soria",
        "Tarragona",
        "Teruel",
        "Toledo",
        "Valencia",
        "Valladolid",
        "Vizcaya",
        "Zamora",
        "Zaragoza",
      ],
    };
  },
  methods: {
    // FUNCIÓN PARA OBTENER DATOS ABOGADO
    async getLawyer(idLawyer) {
      try {
        // SI ES EL ADMIN PUEDE ACCEDER A LOS DATOS DE LOS USUARIOS Y MODIFICARLOS
        if (this.$route.params.id > 0 && checkIsAdmin() === true) {
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = token;
          this.idLawyer = this.$route.params.id;
        } else {
          // SI ES EL PROPIO ABOGADO
          let token = localStorage.getItem("AUTH_TOKEN_KEY");
          axios.defaults.headers.common["Authorization"] = `${token}`;
          this.idLawyer = getIdToken(token);
        }
        const response = await axios.get(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/data"
        );
        this.lawFirm = response.data.data.responseData.lawFirm;
        this.street = response.data.data.responseData.street;
        this.zip = response.data.data.responseData.zip;
        this.city = response.data.data.responseData.city;
        this.phoneNumber = response.data.data.responseData.phoneNumber;
        this.login = response.data.data.responseData.login;
        this.picture = response.data.data.responseData.picture;
        this.urgency = response.data.data.responseData.urgency;
        this.description = response.data.data.responseData.description;
        this.voteAverage = response.data.data.responseData.voteAverage;
        this.totalRatings = response.data.data.responseData.totalRatings;
        this.specialities = response.data.data.specialities;
        localStorage.setItem("PICTURE_LAWYER", this.picture);
        this.$emit("showPictureLawyer");
        if (this.picture !== null) {
          this.picture = process.env.VUE_APP_STATIC_LAWYERS + this.picture;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA PROCESAR LA IMAGEN
    processFile(event) {
      this.avatar = event.target.files[0];
    },
    // FUNCIÓN PARA ACTUALIZAR PERFIL DE ABOGADO
    async updateLawyer() {
      try {
        let fd = new FormData();
        fd.append("lawFirm", this.lawFirm);
        fd.append("street", this.street);
        fd.append("zip", this.zip);
        fd.append("city", this.city);
        fd.append("phoneNumber", this.phoneNumber.replace(/[\-\  \.\ ]/g, ""));
        fd.append("login", this.login);
        fd.append("urgency", this.urgency);
        if (this.description !== null) {
          fd.append("description", this.description);
        }
        if (this.avatar !== null) {
          fd.append("avatar", this.avatar);
        }
        const response = await axios.put(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/edit",
          fd,
          {
            onUploadProgress: (uploadEvent) => {
              this.uploadProgress = Math.round(
                (uploadEvent.loaded / uploadEvent.total) * 100
              );
            },
          }
        );
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
        });
        this.getLawyer((this.$route.params.id = this.idLawyer));
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA BORRAR IMAGEN DE ABOGADO
    async deletePicture() {
      try {
        const response = await axios.put(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/delete-picture"
        );
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
        });
        this.getLawyer((this.$route.params.id = this.idLawyer));
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA CAMBIAR EMAIL Y CONTRASEÑA
    async updateLawyerPassword() {
      if (this.newPassword !== this.newPassword1) {
        return (this.showMsg = true);
      }
      try {
        const response = await axios.post(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/email-password",
          {
            email: this.email,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );
        this.$emit("logout");
        Swal.fire({
          icon: "success",
          title: `${response.data.message}`,
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
    // FUNCIÓN PARA DAR DE BAJA UN ABOGADO
    async deleteLawyer() {
      const result = await Swal.fire({
        title: "Estas seguro de que quieres darte de baja",
        text:
          "Una vez dado de baja puedes hablar con el admin para recuperar la cuenta",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, estoy seguro!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      });
      if (result.value) {
        try {
          const response = await axios.put(
            "http://localhost:3000/lawyers/" + this.idLawyer + "/delete",
            {
              lowReason: this.lowReason,
            }
          );
          Swal.fire({
            icon: "success",
            title: "Te has dado de baja correctamente",
            confirmButtonText: "OK",
          });
          this.$emit("logout");
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
    // FUNCIÓN PARA AÑADIR NUEVA ESPECIALIDAD
    async addNewSpeciality() {
      try {
        const response = await axios.post(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/specialities",
          {
            speciality: this.speciality,
          }
        );
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
          confirmButtonText: "OK",
        });
        this.getLawyer((this.$route.params.id = this.idLawyer));
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
        });
      }
    },
    // FUNCIÓN PARA BORRAR ESPECIALIDAD DE ABOGADO
    async deleteSpeciality(idSpeciality) {
      try {
        const response = await axios.delete(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/specialities/" +
            idSpeciality
        );
        Swal.fire({
          title: "Especialidad borrada correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.getLawyer((this.$route.params.id = this.idLawyer));
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA VOLVER PARA ATRÁS
    goBack() {
      window.history.back();
    },
  },
  created() {
    this.getLawyer();
  },
};
</script>

<style scoped>
p {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.error {
  background-color: rgba(255, 0, 0, 0.336);
}
.error:hover {
  background-color: white;
}
.link {
  color: goldenrod;
}
.link:visited {
  color: goldenrod;
}
img {
  border-radius: 50%;
  width: 100px;
  margin-top: 1rem;
}
div#update {
  background-color: var(--background);
  border-radius: 10px;
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border-radius: 10px;
}
input#upload {
  display: none;
}
legend {
  margin-top: 1rem;
  font-size: 0.7rem;
}
button {
  outline: none;
  margin-top: 0.5rem;
  font-size: 0.5rem;
  border-radius: 20px;
  box-shadow: 5px 5px 30px var(--button) inset;
}
button#back,
button#back img {
  box-shadow: none;
  margin-top: 0;
}
select {
  outline: none;
  font-size: 0.7rem;
  width: 150px;
  background-color: var(--bright);
  border-radius: 10px;
  color: var(--dark);
  border-width: 0 0 2px;
  border-color: yellowgreen;
  padding: 0.1rem;
}
button#deletePicture {
  all: unset;
  cursor: pointer;
  font-size: 0.5rem;
  margin: 0.5rem;
  color: red;
}
button#updateButton {
  font-size: 0.6rem;
}
div#editPassword {
  margin-bottom: 2.5rem;
}
div#changePassword {
  background-color: var(--background);
  width: 70%;
  margin: 3% auto;
  padding: 1rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
div#changePassword button {
  margin: 1rem;
}
div#changePassword input {
  width: 80%;
}
div#deleteLawyer p {
  margin-bottom: 1rem;
}
div#deleteLawyer {
  background-color: var(--background);
  padding: 1rem;
  margin: 1rem;
  border-radius: 20px;
}
textarea {
  outline: none;
  font-size: 0.8rem;
  width: 90%;
}
div#deleteLawyer button {
  margin: 1rem;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
}

@media (min-width: 700px) {
  img {
    width: 200px;
  }
  input {
    padding: 0.2rem;
    font-size: 1rem;
    width: 40%;
  }
  legend {
    font-size: 1rem;
  }
  select {
    padding: 0.2rem;
    font-size: 1rem;
    width: 40%;
  }
  button {
    font-size: 0.8rem;
  }
  button#deletePicture {
    margin-top: 0.8rem;
    font-size: 0.7rem;
  }
  button#updateButton {
    margin-top: 1.2rem;
    font-size: 1rem;
  }
  div#editPassword {
    display: flex;
    justify-content: space-between;
  }
  div#changePassword {
    width: 50%;
  }
  div#deleteLawyer {
    width: 70%;
    margin: 3% auto;
  }
  div#deleteLawyer textarea {
    height: 250px;
  }
}

@media (min-width: 1000px) {
  div#update {
    width: 40%;
    margin: 0 auto;
  }
  p {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
  }
  button {
    font-size: 1rem;
  }
  button#updateButton {
    font-size: 1.15rem;
  }
  div#editPassword {
    justify-content: space-evenly;
  }
  div#changePassword {
    margin-top: 5rem;
    width: 30%;
  }
  div#deleteLawyer {
    width: 50%;
  }
  div#deleteLawyer textarea {
    margin-bottom: 2rem;
    font-size: 1rem;
  }
}
</style>
