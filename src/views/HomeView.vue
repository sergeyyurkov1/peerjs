<template>
  <div id="container">

    <!-- <v-img class="hero" height="200" src="@/assets/00.png"></v-img> -->

    <div id="hero">
      <h1>
        <p class="typewrite" data-period="2000"
          data-type='[ "Peer-to-peer conference and chat", "点对点会议和聊天", "Пиринговая конференция и чат" ]'>
          <span class="wrap"></span>
        </p>
      </h1>
    </div>

    <!-- variant="outlined" -->
    <v-card id="card">

      <v-card-text>
        <v-row style="gap: 1rem" justify="center">

          <v-form style="width: 100%">

            <v-text-field variant="underlined" v-model.trim="userName" label="Name" required>
            </v-text-field>

            <v-text-field variant="underlined" v-model.trim="roomID" label="Room" required
              append-icon="mdi-cog-clockwise" @click:append="generateUUID">
            </v-text-field>

          </v-form>

          <v-btn :disabled="!userName || !roomID" color="black"
            @click.prevent="this.$router.replace({ path: '/call', query: { userName, roomID } })">
            Join or Create
          </v-btn>

        </v-row>

      </v-card-text>
    </v-card>

    <p id="footer">(c) 2022 <a href="#">Sergey Yurkov</a></p>

  </div>
</template>

<script>
export default {
  name: "HomeView",

  mounted() {
    var TxtType = function (el, toRotate, period) {
      this.toRotate = toRotate;
      this.el = el;
      this.loopNum = 0;
      this.period = parseInt(period, 10) || 2000;
      this.txt = '';
      this.tick();
      this.isDeleting = false;
    };

    TxtType.prototype.tick = function () {
      var i = this.loopNum % this.toRotate.length;
      var fullTxt = this.toRotate[i];

      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

      var that = this;
      var delta = 200 - Math.random() * 100;

      if (this.isDeleting) { delta /= 2; }

      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }

      setTimeout(function () {
        that.tick();
      }, delta);
    };

    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }

    var css = document.createElement("style");
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff }";
    document.body.appendChild(css);
  },

  methods: {
    generateUUID: function () {
      this.roomID = self.crypto.randomUUID().split("-", 1)[0];
    }

  },

  data() {
    return {
      userName: "",
      roomID: "",
    }
  }
}
</script>

<style scoped>
html,
body {
  height: var(--app-height);

  overflow: hidden;
}

#card {
  background-color: white;

  padding: 22px;

  align-self: center;

  height: fit-content;
}

#hero>h1 {
  color: white;
  text-decoration: underline;
}

#footer {
  font-family: "Roboto Mono", monospace;
  font-size: small;

  align-self: center;
  text-align: center;
}

#footer>a {
  color: black;
}

@media screen and (orientation: portrait) {
  #footer {
    grid-row: 3;
    grid-column: 2 / span 4;
  }

  #container {
    display: grid;
    height: var(--app-height);

    background: linear-gradient(#14213D 0 40%, #E5E5E5 40% 100%);

    grid-template-rows: 40% 50% 10%;
    grid-template-columns: repeat(6, 1fr);
  }

  #card {
    grid-row: 2;
    grid-column: 2 / span 4;
  }

  #hero {
    /* Important */
    width: 100%;

    grid-row: 1 / span 1;
    grid-column: 2 / span 4;

    align-self: center;
  }
}

@media screen and (orientation: landscape) {
  #footer {
    grid-row: 6;
    grid-column: 2 / span 3;

    color: white;
  }

  #footer>a {
    color: white;
  }

  #container {
    display: grid;
    height: var(--app-height);

    background: linear-gradient(to right, #14213D 0 50%, #E5E5E5 50% 100%);

    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  #card {
    grid-column: 7 / span 3;
    grid-row: 2 / span 4;
  }

  #hero {
    grid-column: 2 / span 3;

    grid-row: 3 / span 2;

    /* Important */
    width: 100%;
  }

}
</style>