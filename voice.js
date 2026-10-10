const RamsesVoice = {
  stream: null,
  mediaRecorder: null,
  audioChunks: [],
  isRecording: false,
  animationId: null,

  async startRecording(canvas) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Microphone not supported in this browser.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      if (canvas) {
        this.startWaveAnimation(canvas);
      }

      return true;
    } catch (error) {
      console.error('Voice input error:', error);
      return false;
    }
  },

  stopRecording() {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.isRecording = false;

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  startWaveAnimation(canvas) {
    const context = canvas.getContext('2d');
    const draw = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#090d18';
      context.fillRect(0, 0, width, height);

      const centerY = height / 2;
      const bars = 32;

      for (let i = 0; i < bars; i++) {
        const x = (i / bars) * width + 8;
        const h = 16 + Math.abs(Math.sin((Date.now() / 350) + i)) * (height / 2 - 20);
        context.fillStyle = i % 2 === 0 ? '#d4af37' : '#5aa9ff';
        context.fillRect(x, centerY - h / 2, 8, h);
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }
};

window.RamsesVoice = RamsesVoice;
