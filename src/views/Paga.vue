<template>
  <d-container fluid class="main-content-container px-4">
    <div class="pa3">
      <h1 class="dib">Día de paga</h1>
      <d-input-group
        size="sm"
        class="date-range justify-content-left w-auto-ns inline-flex ml4"
      >
        <d-datepicker placeholder="Fecha inicio" v-model="init_date" typeable />
        <d-datepicker placeholder="Fecha fin" v-model="end_date" typeable />
        <d-input-group-text slot="append" class="btn-search">
          <div @click="obtainAttendance(false)">
            <font-awesome-icon icon="search" />
            Buscar
          </div>
        </d-input-group-text>
      </d-input-group>
    </div>
    <div class="row col-12 tc" v-show="loading">
      <EllipsisLoader color="#58b368" class="m-auto" />
    </div>
    <div class="row" v-if="!loading">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-bottom">
            <h3>Total {{ getTotal | currency }}</h3>
          </div>
          <div class="row">
            <div
              class="col-6 col-md-4 tc"
              v-for="(moneda, index) in getCambio"
              :key="moneda.id"
            >
              <div class="card pa3 ma3 img-max-height">
                <img v-if="index == 0" src="images/bill500.jpg" alt />
                <img v-if="index == 1" src="images/bill200.jpg" alt />
                <img v-if="index == 2" src="images/bill100.jpeg" alt />
                <img v-if="index == 3" src="images/bill50.jpg" alt />
                <img v-if="index == 4" src="images/bill20.jpeg" alt />
                <img v-if="index == 5" src="images/bill10.jpg" alt />
                <img v-if="index == 6" src="images/bill5.jpg" alt />
                <h4>${{ nombreMoneda(index) }}</h4>
                <h5 class="b">{{ moneda }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt4" v-if="!loading">
      <div class="col">
        <div class="card card-small mb-4">
          <div class="card-header border-bottom">
            <h6 class="m-0">Desglose</h6>
          </div>
          <div class="card-body p-0 pb-3 text-center">
            <table class="table mb-0 table-responsive">
              <thead class="bg-light">
                <tr>
                  <th scope="col" class="border-0" width="100">#</th>
                  <th scope="col" class="border-0">Nombre</th>
                  <th
                    scope="col"
                    class="border-0 tl"
                    v-for="date in dates"
                    :key="date.id"
                  >
                    {{ date.letra }}
                  </th>
                  <th scope="col" class="border-0 tl">Total</th>
                  <th scope="col" class="border-0 tl">$500</th>
                  <th scope="col" class="border-0 tl">$200</th>
                  <th scope="col" class="border-0 tl">$100</th>
                  <th scope="col" class="border-0 tl">$50</th>
                  <th scope="col" class="border-0 tl">$20</th>
                  <th scope="col" class="border-0 tl">$10</th>
                  <th scope="col" class="border-0 tl">$5</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(attendance, index) in getPayday"
                  :key="attendance.id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ attendance.worker.nombre }}</td>
                  <td v-for="date in dates" :key="date.id" class="relative">
                    <div v-for="payday in attendance.payday" :key="payday.id">
                      <div
                        v-if="payday.date == date.dia"
                        class="status-tbl"
                        :class="[
                          payday.status == '1' ? 'bg-success' : 'bg-danger'
                        ]"
                      >
                        <font-awesome-icon
                          v-if="payday.status == '0'"
                          icon="times-circle"
                          size="lg"
                        />
                        <font-awesome-icon
                          v-else
                          icon="check-circle"
                          size="lg"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="b tl">
                    {{ round5(attendance.total.toFixed(2)) | currency }}
                  </td>
                  <td
                    v-for="moneda in attendance.cambio"
                    :key="moneda.id"
                  >
                    {{ moneda }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </d-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
let storeModule = "attendance";
moment.locale("es");

export default {
  name: "Payday",
  data() {
    return {
      init_date: new Date(Date.now()).toLocaleString().slice(0, 10),
      end_date: new Date(Date.now()).toLocaleString().slice(0, 10),
      dates: [],
      loading: false
    };
  },
  methods: {
    obtainAttendance(first) {
      this.loading = true;
      if (first) {
        this.init_date = moment(this.init_date)
          .startOf("week")
          .format("l");
      } else {
        this.init_date = moment(this.init_date).format("l");
      }
      const data = {
        init_date: this.init_date,
        end_date: moment(this.end_date).format("l")
      };
      this.init_date = this.init_date
        .split(/\//)
        .reverse()
        .join("/");
      this.enumerateDaysBetweenDates(this.init_date, this.end_date);
      this.$store.dispatch(`${storeModule}/getPayday`, data).then(() => {
        this.loading = false;
      });
    },
    enumerateDaysBetweenDates(startDate, endDate) {
      this.dates = [];
      var dateminus = moment(startDate)
        .startOf("day")
        .subtract(1, "days");
      var lastDate = moment(endDate).startOf("day");
      while (dateminus.add(1, "days").diff(lastDate) <= 0) {
        this.dates.push({
          letra: dateminus.clone().format("dddd"),
          dia: dateminus.clone().format("YYYY-MM-DD")
        });
      }
    },
    nombreMoneda(index) {
      const monedas = [500, 200, 100, 50, 20, 10, 5];
      return monedas[index];
    },
    round5(x) {
      return Math.round(x / 5) * 5;
    }
  },
  computed: {
    ...mapGetters(storeModule, ["getAttendance", "getPayday", "getCambio", "getTotal"]),
  },
  mounted() {
    this.obtainAttendance(true);
  }
};
</script>

<style lang="scss" scoped>
.status-tbl {
  width: 100%;
  height: 100%;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-search {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #3c5170;
    color: white;
  }
  > svg {
    width: 40px;
    height: 29px;
    padding: 7px;
  }
}
.img-max-height {
  > img {
    max-height: 15vh;
    width: auto;
    height: auto;
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>
