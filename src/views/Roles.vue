<template>
  <d-container fluid class="main-content-container px-4">
    <div class="pa3">
      <h1 id="titleRoles">
        Roles
        <button
          v-if="!toggleRol"
          class="btn btn-primary fr"
          id="addRolBtn"
          @click="toggleAddRol"
        >
          <font-awesome-icon icon="plus" />Agregar nuevo
        </button>
        <button
          v-if="toggleRol"
          class="btn btn-danger fr"
          @click="toggleAddRol"
        >
          <font-awesome-icon icon="times" />Cancelar
        </button>
      </h1>
    </div>
    <div class="row col-12 tc" v-show="loading">
      <EllipsisLoader color="#58b368" class="m-auto" />
    </div>
    <div class="row" v-if="!loading">
      <div class="col-12 col-md-4 mb4" v-if="toggleRol">
        <div class="card h-100">
          <div class="border-bottom card-header">
            <label for="nombre">Nombre</label>
            <input id="nombre" class="form-control" type="text" v-model="nombre" />
          </div>
          <div class="list-group list-group-flush">
            <div class="p3 list-group-item">
              <div class="row">
                <div class="col">
                  <div class="form-row">
                    <div class="form-group col-12">
                      <label for="price">Paga</label>
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">$</div>
                        </div>
                        <input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="$300"
                          class="form-control"
                          v-model="cantidad"
                        />
                      </div>
                    </div>
                    <div class="form-group col-12">
                      <label for="tipo">Tipo</label>
                      <div class="input-group">
                        <select
                          v-model="tipo_id"
                          id="tipo"
                          class="form-control"
                        >
                          <option :value="null" disabled>
                            Selecciona uno...
                          </option>
                          <option
                            :value="type.id"
                            v-for="type in getTypes"
                            v-bind:key="type.id"
                          >
                            {{ type.nombre }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <button class="btn btn-success col-12" id="createRoleBtn" @click="addRol">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 tc" v-if="getRoles.length == 0 && !toggleRol">
        <div class="card pt5 pb5 row col-12">
          <img src="@/assets/empty_state.svg" alt="" />
          <h3 class="pa3">Aún no se ha creado ningun rol...</h3>
          <button class="btn btn-primary col-4 offset-4" @click="toggleAddRol">
            Crear mi primer rol
          </button>
        </div>
      </div>
      <div
        class="col-12 col-md-4 mb4"
        v-for="(rol, index) in getRoles"
        :key="rol.id"
      >
        <div class="card h-100">
          <div class="border-bottom card-header">
            <h6 class="mb0 dib">{{ rol.nombre }}</h6>
            <div
              class="icon-container delete fr"
              @click="deleteRole(rol, index)"
            >
              <font-awesome-icon icon="trash"></font-awesome-icon>
            </div>
            <div class="icon-container edit fr" @click="toggleEditRole(rol.id)">
              <font-awesome-icon icon="marker"></font-awesome-icon>
            </div>
          </div>
          <div class="list-group list-group-flush">
            <div class="p3 list-group-item">
              <div class="row">
                <div class="col">
                  <div class="form-row">
                    <div class="form-group col-12">
                      <label for="price">Paga</label>
                      <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text">$</div>
                        </div>
                        <input
                          id="price"
                          type="text"
                          placeholder="$300"
                          class="form-control"
                          v-model="rol.cantidad"
                          :disabled="toggleEdit === rol.id ? false : true"
                        />
                      </div>
                    </div>
                    <div class="form-group col-12">
                      <label for="tipo">Tipo</label>
                      <div class="input-group">
                        <select
                          v-model="rol.tipo_id"
                          id="tipo"
                          class="form-control"
                          :disabled="toggleEdit === rol.id ? false : true"
                        >
                          <option
                            :value="type.id"
                            v-for="type in getTypes"
                            v-bind:key="type.id"
                          >
                            {{ type.nombre }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div
                      class="form-group col-12 tr"
                      v-if="toggleEdit === rol.id"
                    >
                      <button
                        @click="editRole(rol, index)"
                        class="btn btn-success"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </d-container>
</template>

<script>
import { mapGetters } from "vuex";
let storeModule = "roles";
let storeModuleSession = "session";

export default {
  name: "Roles",
  data() {
    return {
      toggleEdit: null,
      toggleRol: false,
      nombre: "",
      cantidad: 0,
      tipo_id: null,
      loading: false
    };
  },
  methods: {
    toggleAddRol() {
      this.toggleRol = !this.toggleRol;
    },
    obtainRoles() {
      this.loading = true;
      this.$store.dispatch(`${storeModule}/get`).then(() => {
        this.loading = false;
      });
    },
    obtainTypes() {
      this.$store.dispatch(`${storeModule}/getTypes`);
    },
    addRol() {
      const data = {
        nombre: this.nombre,
        cantidad: this.cantidad,
        tipo_id: this.tipo_id
      };
      this.$store.dispatch(`${storeModule}/post`, data).then(() => {
        this.nombre = "";
        this.cantidad = 0;
        this.tipo_id = null;
        this.toggleRol = false;
        this.$toasted.show("El rol ha sido creado", {
          type: "success",
          icon: "thumbs-up",
          action: {
            text: "Okay",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        });
      });
    },
    toggleEditRole(id) {
      if (this.toggleEdit == id) {
        this.toggleEdit = null;
      } else {
        this.toggleEdit = id;
      }
    },
    editRole(role, index) {
      const data = {
        role: role,
        index: index
      };
      this.$store.dispatch(`${storeModule}/update`, data).then(() => {
        this.$toasted.show("El rol ha sido actualizado", {
          type: "success",
          icon: "thumbs-up",
          action: {
            text: "Okay",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        });
        this.toggleEdit = null;
      });
    },
    deleteRole(rol, index) {
      const data = {
        role: rol,
        index: index
      };
      this.$store.dispatch(`${storeModule}/delete`, data).then(() => {
        this.$toasted.show("El rol ha sido eliminado", {
          type: "success",
          icon: "thumbs-up",
          action: {
            text: "Okay",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        });
      });
    }
  },
  computed: {
    ...mapGetters(storeModule, ["getRoles", "getTypes"]),
    ...mapGetters(storeModuleSession, ["getUser"])
  },
  mounted() {
    this.obtainRoles();
    this.obtainTypes();
  }
};
</script>
