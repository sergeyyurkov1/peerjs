class MediaDevices {
  constructor() {}

  async getUserMedia() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 160 * 2, height: 90 * 2 },
        audio: { echoCancellation: false },
      });
    } catch (error) {
      throw new Error(error);
    }

    return stream;
  }
}
