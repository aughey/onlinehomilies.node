var app = new Vue({
el: '#app',
  data: {
    sessions: [],
    message: 'Hello Vue!'
  },
  methods: {
    getPage: function(page) {
      var me = this;
      $.getJSON("/sessions", {page: page}).then(function(r) {
        me.sessions = r.sessions;
      });
    }
  }
});

app.getPage(0);
