import { Peer } from "peerjs";

class PeerService {
  peer;

  constructor(options) {
    this.options = options;

    this.calls = [];
    this.conns = [];
  }

  init() {
    this.peer = new Peer(this.options);

    this.peer.on("open", (peerID) => {
      this.peerID = peerID;
    });
  }

  send(conn, data) {
    conn.send(data);
  }

  connect(peers, stream) {
    // peers = []
    peers.forEach((peerID) => {
      const call = this.peer.call(peerID, stream);

      call.on("stream", (remoteStream) => {
        this.peers[peerID] = remoteStream;
      });

      this.calls.push(call);

      // ---------------------------
      const conn = this.peer.connect(peerID); // { serialization: "json" }

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
          toggleVideo(data.videoToggle)
        }
      });

      this.conns.push(conn);
    });

    this.peer.on("call", function (call) {
      this.calls.push(call);

      call.answer(stream);

      call.on("stream", function (stream) {
        this.peers[call.peer] = stream;
      });
    });

    this.peer.on("connection", function (conn) {
      this.conns.push(conn);

      conn.on("open", function () {
        this.send(conn, { messages: that.messages });
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
          toggleVideo(data.videoToggle);
        }
      });
    });
  }
}

function toggleVideo(videoToggle) {
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

export default PeerService;
