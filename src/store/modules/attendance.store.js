import attendanceApi from "@/api/attendance.api";

const state = {
  attendance: [],
  payday: []
};
const getters = {
  getAttendance: state => state.attendance,
  getPayday: state => state.payday
};
const mutations = {
  SET_ATTENDANCE(state, attendance) {
    state.attendance = attendance;
  },
  SET_PAYDAY(state, attendance) {
    state.payday = attendance;
  }
};
const actions = {
  get({ commit }, data) {
    attendanceApi.get(
      data,
      result => {
        commit("SET_ATTENDANCE", result.data);
      },
      error => {
        return error;
      }
    );
  },
  getPayday({ commit }, data) {
    return attendanceApi.getPayday(
      data,
      result => {
        var attendance = [];
        let workers = [];
        result.data.forEach(att => {
          if (!workers.includes(att.worker_id)) {
            var info = {
              worker_id: att.worker_id,
              worker: att.worker,
              role: att.worker.role,
              total: att.status ? parseFloat(att.worker.role.cantidad) : 0,
              payday: [
                {
                  status: att.status,
                  date: att.attendance_day
                }
              ]
            };
            attendance.push(info);
            workers.push(att.worker_id);
          } else {
            attendance.forEach(attend => {
              if (attend.worker_id == att.worker_id) {
                if (att.status) {
                  attend.total = parseFloat(att.worker.role.cantidad) + parseFloat(attend.total);
                }
                attend.payday.push({
                  status: att.status,
                  date: att.attendance_day
                });
              }
            });
          }
        });
        commit("SET_PAYDAY", attendance);
        return true;
      },
      error => {
        return error;
      }
    );
  },
  post({ commit }, data) {
    attendanceApi.post(
      data,
      () => {
        commit("SET_ATTENDANCE", data);
      },
      error => {
        return error;
      }
    );
  }
};

export default {
  namespaced: true,
  state: {
    ...state
  },
  getters: {
    ...getters
  },
  mutations,
  actions
};
