<template>
  <div>
    <div v-show="!showLowLawyer">
      <div id="update" v-show="!showEditPassword">
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
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <legend>Descripción*</legend>
        <input type="text" placeholder="Descripción" v-model="description" />
        <input id="upload" type="file" @change="processFile" ref="fileInput" />
        <button @click="$refs.fileInput.click()">Cargar imagen</button>
        <progress max="100" :value.prop="uploadProgress"></progress>
        <button id="updateButton" @click="updateLawyer">Actualiza tu perfil</button>
        <editlawyercomp v-on:delete="deleteSpeciality" :specialities="specialities" />
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
        <button @click="addNewSpeciality()">Añadir</button>
      </div>
    </div>

    <div id="editPassword" v-show="!showEditPassword">
      <div v-show="!showLowLawyer">
        <button @click="showEditPassword = !showEditPassword">Cambiar email o contraseña</button>
        <button id="delete" @click="showLowLawyer = !showLowLawyer">Date de baja</button>
      </div>
    </div>

    <div v-show="showEditPassword">
      <div id="changePassword">
        <p>Cambia tu email o contraseña</p>
        <legend>Email*</legend>
        <input type="email" placeholder="Email" v-model="email" />
        <legend>Contraseña vieja*</legend>
        <input type="password" placeholder="Contraseña antigua" v-model="oldPassword" />
        <legend>Contraseña nueva*</legend>
        <input type="password" placeholder="Contraseña nueva" v-model="newPassword" />
      </div>
      <button @click="updateLawyerPassword()">Actualizar</button>
      <button @click="showEditPassword = !showEditPassword">Cancelar</button>
    </div>
    <div id="deleteUser" v-show="showLowLawyer">
      <p>Borrar cuenta</p>
      <textarea
        v-model="lowReason"
        placeholder="Motivo por el que nos abandonas"
        name="lowReason"
        cols="30"
        rows="10"
      ></textarea>
      <br />
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
      showEditPassword: false,
      lowReason: "",
      showLowLawyer: false,
      provinces: [
        "A Coruña",
        "Álava",
        "Albacete",
        "Alicante",
        "Almería",
        "Asturias",
        "Avila",
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
    // FUNCIÓN PARA HACER EL LOGOUT DE ABOGADO
    logout() {
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("AUTH_TOKEN_KEY");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("NAME");
      localStorage.removeItem("LAWFIRM");
      localStorage.removeItem("UPDATE_DATE");
      localStorage.removeItem("PICTURE");
      this.$router.push("/");
      location.reload();
    },
    // FUNCIÓN PARA OBTENER DATOS ABOGADO
    async getLawyer() {
      try {
        let token = localStorage.getItem("AUTH_TOKEN_KEY");
        axios.defaults.headers.common["Authorization"] = `${token}`;
        const response = await axios.get(
          "http://localhost:3000/lawyers/" + getIdToken(token) + "/data"
        );
        this.idLawyer = response.data.data.responseData.id;
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
        fd.append("phoneNumber", this.phoneNumber);
        fd.append("login", this.login);
        fd.append("description", this.description);
        fd.append("urgency", this.urgency);
        fd.append("avatar", this.avatar);
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
        location.reload();
        Swal.fire({
          title: `${response.data.message}`,
          icon: "success",
        });
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
          icon: "success",
          title: `${response.data.message}`,
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error);
      }
    },
    // FUNCIÓN PARA CAMBIAR EMAIL Y CONTRASEÑA
    async updateLawyerPassword() {
      try {
        const response = await axios.post(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/email-password",
          {
            email: this.email,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
          }
        );
        this.logout();
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
      try {
        const response = await axios.put(
          "http://localhost:3000/lawyers/" + this.idLawyer + "/delete",
          {
            lowReason: this.lowReason,
          }
        );
        console.log(response);
        Swal.fire({
          title: "Abogado borrado correctamente",
          icon: "success",
        });
        this.logout();
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: `${error.response.data.message}`,
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
        location.reload();
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
    // FUNCIÓN PARA BORRAR ESPECIALIDAD DE ABOGADO
    async deleteSpeciality(idSpeciality) {
      try {
        const response = await axios.delete(
          "http://localhost:3000/lawyers/" +
            this.idLawyer +
            "/specialities/" +
            idSpeciality
        );
        location.reload();
        Swal.fire({
          title: "Especialidad borrada correctamente",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.log(error);
      }
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
.link {
  text-decoration: none;
  color: goldenrod;
}
.link:visited {
  color: goldenrod;
}
img {
  border-radius: 50%;
  width: 35%;
  margin-top: 1rem;
}
div#update {
  border: 1px solid white;
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
input {
  outline: 0;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  font-size: 0.7rem;
  text-align: center;
  background: rgb(22, 22, 22);
  color: white;
  padding: 0.1rem;
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
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 5px 5px 30px white inset;
}
select {
  outline: 0;
  font-size: 0.7rem;
  width: 60%;
  background-color: black;
  color: white;
  border-width: 0 0 1px;
  border-color: yellowgreen;
  padding: 0.1rem;
}
button#deletePicture {
  all: unset;
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
div#changePassword p {
  margin-top: 1rem;
}
div#changePassword legend:nth-child(2) {
  margin-top: 2rem;
}
div#deleteUser p {
  margin-bottom: 1rem;
}
div#deleteUser {
  display: flex;
  flex-direction: column;
  align-items: center;
}
button#delete {
  box-shadow: 5px 5px 30px red inset;
}

@media (min-width: 700px) {
  img {
    width: 25%;
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
    margin-top: 1rem;
    font-size: 0.8rem;
  }
  button#deletePicture {
    font-size: 0.7rem;
  }
  button#updateButton {
    margin-top: 1.2rem;
    font-size: 1rem;
  }
  div#editPassword div {
    display: flex;
    justify-content: space-between;
  }
  div#deleteUser textarea {
    width: 90%;
    height: 250px;
  }
}

@media (min-width: 1000px) {
  div#update {
    width: 50%;
    margin: 1% auto;
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
  div#editPassword div {
    justify-content: space-evenly;
  }
  div#changePassword {
    margin-top: 5rem;
  }
  div#changePassword input {
    width: 20%;
  }
  div#deleteUser textarea {
    width: 50%;
    margin-bottom: 2rem;
  }
}
</style>
