import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { isLoggedInUser } from "../api/utils.js";
import { isLoggedInLawyer } from "../api/utils.js";
import { checkIsAdmin } from "../api/utils.js";

Vue.use(VueRouter);

const routes = [
  // HOME
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      allowAnon: true,
    },
  },
  // CONTACTO
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/Contact.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // MORE INFO
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // MORE INFO
  {
    path: "/more-info",
    name: "Info",
    component: () => import("../views/Info.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // PPRIVACY
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/Privacy.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // RUTAS DE ADMIN
  // Listado de usuarios dados de baja y reactivar
  {
    path: "/list-deleted-users",
    name: "ListDeletedUsers",
    component: () => import("../views/ListDeletedUsers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
  },
  // Listado de usuarios activos y darlos de baja
  {
    path: "/list-activated-users",
    name: "ListActivatedUsers",
    component: () => import("../views/ListActivatedUsers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
  },
  // Listado de abogados dados de baja
  {
    path: "/list-deleted-lawyers",
    name: "ListDeletedLawyers",
    component: () => import("../views/ListDeletedLawyers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
  },
  // Listado de usuarios activos y darlos de baja
  {
    path: "/list-activated-lawyers",
    name: "ListActivatedLawyers",
    component: () => import("../views/ListActivatedLawyers.vue"),
    meta: {
      allowAnon: false,
      onlyAdmin: true,
    },
  },
  // RUTAS DE USUARIO
  // Nuevo usuario
  {
    path: "/new-user",
    name: "NewUser",
    component: () => import("../views/NewUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Validación de cuenta de usuario
  {
    path: "/users/validation/:registrationCode",
    name: "ValidationUser",
    component: () => import("../views/ValidationUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Resetear contraseña de usuario
  {
    path: "/users/reset-password/:recoverCode",
    name: "ResetPasswordUser",
    component: () => import("../views/ResetPasswordUser.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Ver Perfil de usuario, editarlo y borrarlo
  {
    path: "/profile-user/",
    name: "GetUser",
    component: () => import("../views/GetUser.vue"),
    meta: {
      allowAnon: false,
      onlyUserOrAdmin: true,
    },
  },
  // Abrir proceso nuevo
  {
    path: "/new-process/:id/:lawFirm",
    name: "NewProcess",
    component: () => import("../views/NewProcess.vue"),
    meta: {
      allowAnon: false,
      onlyUserOrAdmin: true,
    },
  },
  // Ver processos de usuario
  {
    path: "/processes-user/",
    name: "ListProcessesUser",
    component: () => import("../views/ListProcessesUser.vue"),
    meta: {
      allowAnon: false,
      onlyUserOrAdmin: true,
    },
  },
  // Ver un presupuesto determinado
  {
    path: "/budget-user/",
    name: "GetBudgetUser",
    component: () => import("../views/GetBudgetUser.vue"),
    meta: {
      allowAnon: false,
      onlyUserOrAdmin: true,
    },
  },
  // Ver un abogado determinado
  {
    path: "/lawyer/:id",
    name: "GetLawyer",
    component: () => import("../views/GetLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Ver listado de puntuaciones de un abogado
  {
    path: "/lawyers/:id/ratings",
    name: "ListRating",
    component: () => import("../views/ListRating.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // RUTAS DE ABOGADO
  // Nuevo abogado
  {
    path: "/new-lawyer",
    name: "NewLawyer",
    component: () => import("../views/NewLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Validación de cuenta de abogado
  {
    path: "/lawyers/validation/:registrationCode",
    name: "ValidationLawyer",
    component: () => import("../views/ValidationLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Resetear contraseña de abogado
  {
    path: "/lawyers/reset-password/:recoverCode",
    name: "ResetPasswordLawyer",
    component: () => import("../views/ResetPasswordLawyer.vue"),
    meta: {
      allowAnon: true,
    },
  },
  // Editar abogado
  {
    path: "/profile-lawyer/",
    name: "EditLawyer",
    component: () => import("../views/EditLawyer.vue"),
    meta: {
      allowAnon: false,
      onlyLawyerOrAdmin: true,
    },
  },
  // Ver processos de abogado
  {
    path: "/processes-lawyer/",
    name: "ListProcessesLawyer",
    component: () => import("../views/ListProcessesLawyer.vue"),
    meta: {
      allowAnon: false,
      onlyLawyerOrAdmin: true,
    },
  },
  // Ver un presupuesto determinado
  {
    path: "/budget-lawyer/",
    name: "GetBudgetLawyer",
    component: () => import("../views/GetBudgetLawyer.vue"),
    meta: {
      allowAnon: false,
      onlyLawyerOrAdmin: true,
    },
  },
  // Añadir un presupuesto nuevo
  {
    path: "/new-budget/:id",
    name: "NewBudget",
    component: () => import("../views/NewBudget.vue"),
    meta: {
      allowAnon: false,
      onlyLawyerOrAdmin: true,
    },
  },
  // ERROR
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
    meta: {
      allowAnon: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

// SOLO DEJA ENTRAR SI ESTÁ LOGUEADO
router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnon && !isLoggedInUser() && !isLoggedInLawyer()) {
    next({
      name: "NewUser",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// SOLO DEJA ENTRAR SI ES ADMIN
router.beforeEach((to, from, next) => {
  if (to.meta.onlyAdmin === true && !checkIsAdmin()) {
    next({
      name: "Home",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// SOLO DEJA ENTRAR SI ES ABOGADO O ADMIN
router.beforeEach((to, from, next) => {
  if (
    to.meta.onlyLawyerOrAdmin === true &&
    isLoggedInUser() &&
    !checkIsAdmin()
  ) {
    next({
      name: "Home",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// SOLO DEJA ENTRAR SI ES USUARIO O ADMIN
router.beforeEach((to, from, next) => {
  if (
    to.meta.onlyUserOrAdmin === true &&
    isLoggedInLawyer() &&
    !checkIsAdmin()
  ) {
    next({
      name: "Home",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
