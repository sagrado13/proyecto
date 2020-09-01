<template>
  <div>
    <!-- DATOS DE UN PRESUPUESTO DETERMNINADO DEL ABOGADO -->
    <p>
      <span>Detalles del proceso nº {{ budget.id_process }}:</span>
      {{ budget.message_process }}
    </p>
    <p>
      <span>Cliente:</span>
      {{ budget.name }} {{ budget.surname }}
    </p>
    <p>
      <span>Teléfono:</span>
      {{ budget.phone_number_user }}
    </p>
    <p>
      <span>Email:</span>
      {{ budget.email_user }}
    </p>
    <p>
      <span>Estado:</span>
      {{ budget.status_budget }}
    </p>
    <p>
      <span>Mensaje:</span>
      {{ budget.message_budget }}
    </p>
    <p>
      <span>Precio:</span>
      {{ budget.price }}€
    </p>
    <p :class="{ hide: budget.rating === null }">
      <star-rating :rating="Number(budget.rating)" :read-only="true" :star-size="20" :inline="true"></star-rating>
    </p>
    <p :class="{ hide: budget.opinion === null }">
      <span>Opinión:</span>
      {{ budget.opinion }}
    </p>
    <p>
      <span>Fecha de creación:</span>
      {{ formatDate(budget.creation_date) }}h
    </p>
    <p>
      <span>Última actualización:</span>
      Hace
      {{ formatDistanceDate(budget.update_date) }}
    </p>
  </div>
</template>

<script>
// Importamos date-fns
import { format, formatDistanceToNow } from "date-fns";
import es from "date-fns/locale/es";

export default {
  name: "GetBudgetLawyerComp",
  props: {
    budget: Object,
  },
  methods: {
    //FUNCIÓN PARA FORMATEAR FECHA
    formatDate(date) {
      return format(new Date(date), "dd/MM/yyyy HH:mm");
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
span {
  font-weight: bold;
  text-decoration: underline;
  display: flex;
  flex-direction: column;
}
p {
  margin-top: 0.5rem;
}

@media (min-width: 700px) {
  span {
    display: inline-block;
  }
  p {
    margin-top: 0.7rem;
  }
}
</style>
