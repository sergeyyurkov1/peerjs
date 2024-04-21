<template>
  <!-- collapse -->
  <v-app-bar
    id="app-bar"
    style="background-color: #14213dbf; position: absolute; top: 0; left: 0"
  >
    <v-btn @click.prevent="this.$router.replace({ path: '/' })" icon>
      <v-icon color="white">mdi-keyboard-backspace</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn :disabled="sharing" @click.prevent="toggleVideo" icon>
      <v-icon :color="sharing ? 'grey' : 'white'">{{
        streamVideo ? "mdi-video-off" : "mdi-video"
      }}</v-icon>
    </v-btn>
    <v-btn :disabled="sharing" @click.prevent="toggleAudio" icon>
      <v-icon :color="sharing ? 'grey' : 'white'">{{
        streamAudio ? "mdi-microphone-off" : "mdi-microphone"
      }}</v-icon>
    </v-btn>
    <v-btn
      v-if="!isMobile"
      :disabled="sharing"
      @click.prevent="shareDesktop"
      icon
    >
      <!-- mdi-cast-off -->
      <v-icon :color="sharing ? 'grey' : 'white'">mdi-cast</v-icon>
    </v-btn>
  </v-app-bar>
  <div id="container" style="width: 100%">
    <!-- muted controls -->
    <div id="videos">
      <div id="self-video" class="video-container" :data-username="peerID">
        <video
          :poster="require('@/assets/01.svg')"
          style="width: 100%"
          :id="peerID"
          :srcObject="stream"
          @click.prevent="toggleHeader"
          playsinline
          autoplay
          ref="v1Ref"
        ></video>
        <!-- <div class="controls"></div> -->
      </div>

      <div id="peer-videos">
        <template v-for="([key, val], i) of Object.entries(peers)" :key="i">
          <div class="video-container" :data-username="key">
            <video
              :poster="require('@/assets/01.svg')"
              style="width: 160px; height: 90px"
              @click.prevent="swapElements($event)"
              :id="key"
              :srcObject="val"
              playsinline
              autoplay
            ></video>
            <!-- <div class="controls"></div> -->
          </div>
        </template>
      </div>
    </div>
    <div id="chat">
      <ul id="messages">
        <template v-for="(message, i) in messages" :key="i">
          <li :class="message.userName !== this.userName ? 'left' : 'right'">
            <!-- { weekday: 'long', day: 'numeric' } -->
            <template v-if="typeof message.message === 'string'">
              <p>{{ message.message }}</p>
            </template>
            <template v-else>
              <img
                @click="goFullscreen"
                class="img"
                :src="getSrc(message.message.file)"
              />
            </template>
            <span
              >{{ message.userName }} @
              {{
                new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}</span
            >
          </li>
        </template>
      </ul>
      <div id="message-input" style="border-radius: 0">
        <div
          contenteditable
          id="textarea"
          @input="onInput"
          @keyup.ctrl.enter="sendMessage"
          autofocus
          ref="contenteditable"
        ></div>
        <button
          id="send-button"
          :disabled="!message"
          @click.prevent="sendMessage"
        >
          <v-icon>mdi-send</v-icon>
        </button>
        <button id="send-file-button" @click.prevent="sendFile">
          <v-icon>mdi-attachment</v-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Peer } from "peerjs";

function scrollIntoView() {
  try {
    document
      .querySelector("li:last-of-type")
      .scrollIntoView({ behavior: "smooth", block: "end" });
  } catch (error) {}
}

export default {
  name: "CallView",

  props: ["userName", "roomID"],

  setup(props) {
    const v1Ref = ref(null);
    const contenteditable = ref(null);

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      var options = {
        host: "peerjs-server-ksmq.onrender.com",
        port: 80,
        path: "/app",
        debug: 3,
      };
    } else {
      var options = {
        host: "peerjs-server-ksmq.onrender.com",
        path: "/app",
        debug: 1,
      };
    }

    const peer = new Peer(options);

    const userName = props.userName;
    const roomID = props.roomID;

    return {
      userName,
      roomID,
      v1Ref,
      contenteditable,
      peer,
    };
  },

  computed: {
    isMobile: function () {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    goFullscreen: function (event) {
      const e = event.target;
      // console.log(e.offsetHeight)

      e.classList.toggle("fullscreen");
    },

    getSrc: function (file) {
      if (file instanceof ArrayBuffer) {
        var src = window.URL.createObjectURL(new Blob([new Uint8Array(file)]));
      } else if (file instanceof Blob) {
        var src = window.URL.createObjectURL(file);
      }
      return src;
    },

    onInput(event) {
      this.message = event.target.innerText.trim();
    },

    toggleHeader: function () {
      var header = document.querySelector("header");

      header.classList.toggle("hidden");
    },

    restoreStream: function () {
      var video = document.querySelector("#self-video>video:first-of-type");
      video.srcObject = this.stream;
      video.id = this.peerID;
    },

    swapElements: function (event) {
      var element1 = event.currentTarget;

      var srcObject1 = element1.srcObject;
      var id1 = element1.id;
      var username1 = element1.parentNode.dataset.username;
      var classList1 = element1.parentNode.classList;
      var classes1 = Array.from(classList1.values());

      var srcObject2 = this.v1Ref.srcObject;
      var id2 = this.v1Ref.id;
      var username2 = this.v1Ref.parentNode.dataset.username;
      var classList2 = this.v1Ref.parentNode.classList;
      var classes2 = Array.from(classList2.values());

      this.v1Ref.srcObject = srcObject1;
      this.v1Ref.id = id1;
      this.v1Ref.parentNode.dataset.username = username1;

      this.v1Ref.parentNode.classList.remove(...classes2);
      this.v1Ref.parentNode.classList.add(...classes1);

      element1.srcObject = srcObject2;
      element1.id = id2;
      element1.parentNode.dataset.username = username2;

      element1.parentNode.classList.remove(...classes1);
      element1.parentNode.classList.add(...classes2);
    },

    toggleAudio: function () {
      this.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      this.streamAudio = !this.streamAudio;
    },

    shareDesktop: function () {
      const that = this;

      that.sharing = true;

      navigator.mediaDevices
        .getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: false,
        })
        .then(gotMedia)
        .catch((error) => {
          console.error(error);
        });

      function gotMedia(stream) {
        let desktopVideoTrack = stream.getVideoTracks()[0];

        that.oldVideoTrack = that.stream.getVideoTracks()[0];

        desktopVideoTrack.onended = function () {
          that.sharing = false;

          that.stream.removeTrack(that.stream.getVideoTracks()[0]);
          that.stream.addTrack(that.oldVideoTrack);

          for (const call of that.calls) {
            let sender = call.peerConnection.getSenders()[1];
            sender.replaceTrack(that.oldVideoTrack);
          }
        };

        that.stream.removeTrack(that.stream.getVideoTracks()[0]);
        that.stream.addTrack(desktopVideoTrack);

        for (const call of that.calls) {
          let sender = call.peerConnection.getSenders()[1];
          sender.replaceTrack(desktopVideoTrack);
        }
      }
    },

    toggleVideo: function () {
      this.stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      this.streamVideo = !this.streamVideo;

      if (this.streamVideo === false) {
        let e = document.querySelectorAll(
          `[data-username='${this.peerID}']`
        )[0];
        console.log(e);
        e.classList.add("no-video");
      } else {
        let e = document.querySelectorAll(
          `[data-username='${this.peerID}']`
        )[0];
        e.classList.remove("no-video");
      }

      this.conns.forEach((conn) => {
        conn.send({
          videoToggle: { state: this.streamVideo, peerID: this.peerID },
        });
      });
    },

    sendFile: function () {
      var input = document.createElement("input");
      input.type = "file";

      input.onchange = (e) => {
        var file = e.target.files[0];

        var blob = new Blob(e.target.files, { type: file.type });

        var message = {
          file: blob,
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
        };

        this.messages.push({
          timestamp: Date.now(),
          message: message,
          userName: this.userName,
          roomID: this.roomID,
        });

        this.conns.forEach((conn) => {
          conn.send({ messages: this.messages });
        });
      };

      input.click();
    },

    sendMessage: function () {
      this.messages.push({
        timestamp: Date.now(),
        message: this.message,
        userName: this.userName,
        roomID: this.roomID,
      });

      this.message = "";
      this.contenteditable.innerText = "";

      this.conns.forEach((conn) => {
        conn.send({ messages: this.messages });
      });
    },
  },

  data() {
    return {
      userNames: {},
      conns: [],
      peerID: null,
      data: null,
      stream: null,
      oldVideoTrack: null,
      streamAudio: true,
      streamVideo: true,
      peers: {},
      message: "",
      messages: [],
      calls: [],
      sharing: false,
    };
  },

  watch: {
    peers: {
      handler(val) {
        if (Object.keys(val).length === 0) {
          this.restoreStream();
        }
      },
      deep: true,
    },
    messages: {
      handler(val) {
        setTimeout(scrollIntoView, 1000);
      },
      deep: true,
    },
    stream: {
      handler(val) {},
      deep: true,
    },
  },

  mounted() {
    // window.oncontextmenu = (e) => {
    //   e.preventDefault();
    // }

    const that = this;

    that.peer.on("open", function (peerID) {
      that.peerID = peerID;

      async function joinRoom() {
        await fetch("https://peerjs-server-ksmq.onrender.com/room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomID: that.roomID,
            peerID: that.peerID,
          }),
          // mode: "no-cors",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.status);
            }
          })
          .catch((error) => {
            console.error(error);
          });

        getRoomUsers();
      }

      async function getRoomUsers() {
        console.log("Getting room users...");

        const data = await fetch(
          "https://peerjs-server-ksmq.onrender.com/rooms/" +
            that.roomID +
            "/users",
          {
            method: "GET",
            headers: {
              "user-id": that.peerID,
            },
            // mode: "no-cors",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.error(error);
          });
        that.data = data;

        app();
      }

      function app() {
        navigator.mediaDevices
          .getUserMedia({
            // video: { width: 200, height: 150 },
            video: { width: 160 * 2, height: 90 * 2 },
            audio: { echoCancellation: false },
          })
          .then(gotMedia)
          .catch((error) => {
            console.error(error);
          });

        function gotMedia(stream) {
          // Self
          that.stream = stream;

          // Peers
          that.data.forEach((peerID) => {
            // Call the peers
            const call = that.peer.call(peerID, that.stream);

            that.calls.push(call);

            call.on("stream", function (remoteStream) {
              that.peers[peerID] = remoteStream;
            });

            // Peer data connection
            const conn = that.peer.connect(peerID); // { serialization: "json" }
            that.conns.push(conn);

            conn.on("open", function () {
              console.log("Data connection opened!");
            });

            conn.on("data", function (data) {
              if (data.messages) {
                that.messages = data.messages;
              }
              if (data.userNames) {
                that.userNames = data.userNames;
              }
              if (data.videoToggle) {
                let videoToggle = data.videoToggle;
                if (videoToggle.state === false) {
                  let e = document.querySelectorAll(
                    `[data-username='${videoToggle.peerID}']`
                  )[0];
                  e.classList.add("no-video");
                } else {
                  let e = document.querySelectorAll(
                    `[data-username='${videoToggle.peerID}']`
                  )[0];
                  e.classList.remove("no-video");
                }
              }
            });
          });

          //
          async function listenDisconnect() {
            try {
              // http://localhost:8000
              const response = await fetch(
                "https://peerjs-server-ksmq.onrender.com/disconnected-clients",
                {
                  headers: {
                    "room-id": that.roomID,
                  },
                  // mode: "no-cors",
                }
              );
              var disconnectedClients = await response.json();
            } catch (error) {
              console.error(error);
            }
            disconnectedClients.forEach((client) => {
              try {
                delete that.peers[client];
              } catch (error) {}
            });

            setTimeout(listenDisconnect, 10000);
          }

          setTimeout(listenDisconnect, 10000);
        }
      }

      joinRoom();

      scrollIntoView();
    });

    that.peer.on("call", function (call) {
      that.calls.push(call);

      call.answer(that.stream);

      call.on("stream", function (stream) {
        that.peers[call.peer] = stream;
      });
    });

    that.peer.on("connection", function (conn) {
      that.conns.push(conn);

      conn.on("open", function () {
        conn.send({ messages: that.messages });
      });

      conn.on("data", function (data) {
        console.warn(data.messages);

        if (data.messages) {
          that.messages = data.messages;
        }
        if (data.userNames) {
          that.userNames = data.userNames;
        }
        if (data.videoToggle) {
          let videoToggle = data.videoToggle;
          if (videoToggle.state === false) {
            let e = document.querySelectorAll(
              `[data-username='${videoToggle.peerID}']`
            )[0];
            e.classList.add("no-video");
          } else {
            let e = document.querySelectorAll(
              `[data-username='${videoToggle.peerID}']`
            )[0];
            e.classList.remove("no-video");
          }
        }
      });
    });
  },

  beforeUnmount() {
    this.peer.disconnect();
  },
};
</script>

<style>
.fullscreen {
  position: absolute;
  transform: translate(-50%, -50%);
  top: calc(var(--app-height) / 2);
  left: 50%;
  z-index: 1010;
}

.img {
  width: 100px;
  aspect-ratio: auto;
  border-radius: 5px;
}

#chat {
  height: 100%;

  align-self: start;

  background-color: #e5e5e5;

  /* Internal grid */
  /* --------- */
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 50px;
}

#message-input {
  height: auto;

  grid-row: 2;
  grid-column: 1;

  position: relative;
}

#textarea {
  outline: none;

  margin-left: 25px;
  margin-bottom: 5px;

  padding-left: 50px;
  padding-right: 50px;

  background-color: white;

  width: calc(100% - 50px);
  height: 45px;

  border: 1px solid #da532c;
  border-radius: 5px;

  overflow-wrap: break-word;
  overflow-x: hidden;
  white-space: pre-wrap;

  padding-top: 13px;
  padding-bottom: 13px;
  line-height: 17px;
}

#send-file-button {
  position: absolute;
  top: 0;
  left: 0;

  width: 50px;
  height: 45px;

  color: #da532c;

  margin-left: 26px;
  margin-bottom: 5px;
}

#send-button {
  position: absolute;
  top: 0;
  right: 0;

  width: 50px;
  height: 45px;

  color: #da532c;

  margin-right: 26px;
  margin-bottom: 5px;
}

.video-container {
  position: relative;
}

.video-container::before {
  content: attr(data-username);
  z-index: 1000;
  padding-left: 5px;
  padding-top: 10px;
  padding-right: 5px;
  border-radius: 0 2px 0 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: #e5e5e5;
  font-size: 10px;
  background: linear-gradient(to bottom, rgb(50, 50, 50) 0, transparent 100%);
  position: absolute;
  width: 35%;
  height: 20px;
  left: 0;
  bottom: 0;
}

.no-video::after {
  display: block;
  content: "";
  background-image: url("~@/assets/01.svg");
  background-size: cover;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.hidden {
  visibility: hidden;
}

.v-main {
  padding-top: 0 !important;
}

* {
  margin: 0;
  padding: 0;

  user-select: none;

  font-family: "Roboto";

  box-shadow: none !important;
}

html,
body {
  overflow: hidden;
  height: var(--app-height);
}

ul {
  list-style-type: none;
}

li {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
}

li:first-of-type {
  margin-top: 10px;
}

li > p {
  width: fit-content;
  padding: 10px;
  background-color: lightgreen;
  border-radius: 5px;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

li > span {
  font-size: 75%;
  font-weight: lighter;

  margin-top: 5px;
}

.right {
  margin-left: 20%;
  align-self: flex-end;
  text-align: left;

  align-items: flex-end;
}

.right > span {
  text-align: right !important;
}

.left {
  margin-right: 20%;
  align-self: flex-start;
  text-align: left;

  align-items: flex-start;
}

.left > p {
  background-color: white;
}

#videos > div:first-of-type > video:first-of-type {
  width: 100%;
}

#peer-videos {
  margin-top: 1px;
  gap: 1px;
}

@media screen and (orientation: portrait) {
  .fullscreen {
    height: auto !important;
    width: 90% !important;
  }

  #container {
    height: var(--app-height);

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 55% 45%;
  }

  #chat {
    grid-row: 2;
    grid-column: 1;
  }

  #messages {
    grid-row: 1;
    grid-column: 1;

    /* Internal grid */
    /* --------- */
    display: flex;
    flex-direction: column;

    overflow-y: auto !important;
  }

  #videos {
    height: 100%;

    grid-row: 1;
    grid-column: 1;

    background-color: black;

    /* ??? */
    line-height: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #videos > video {
    width: 100%;

    border: none;
  }

  #peer-videos {
    /* Enables scroll */
    flex-grow: 0;

    display: flex;
    overflow-x: auto;

    /* One line */
    align-items: center;
  }
}

/* --------------------------- */
@media screen and (orientation: landscape) {
  .fullscreen {
    width: auto !important;
    height: calc(var(--app-height) - 10%) !important;
  }

  header {
    width: 65vw !important;
  }

  #container {
    height: var(--app-height);

    display: grid;
    grid-template-columns: 65% 35%;
    grid-template-rows: 1fr;

    /* ??? */
    align-items: center;
  }

  #chat {
    grid-row: 1;
    grid-column: 2;
  }

  #messages {
    height: calc(var(--app-height) - 50px);

    grid-row: 1;
    grid-column: 1;

    display: flex;
    flex-direction: column;
    overflow-y: scroll !important;
  }

  #videos {
    height: var(--app-height);

    grid-row: 1;
    grid-column: 1;

    height: inherit;

    background-color: black;

    line-height: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #videos > video {
    width: 100%;

    border: none;
  }

  #peer-videos {
    flex-grow: 0;

    display: flex;
    overflow-x: auto;
    align-items: center;
  }
}
</style>
