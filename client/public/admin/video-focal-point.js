(function () {
  const h = window.h;

  function createFocalPointDialog(file, onSave) {
    const videoUrl = URL.createObjectURL(file);

    return new Promise(resolve => {
      const state = { point: null, dimensions: null, finished: false };
      const overlay = document.createElement("div");
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "100000",
        display: "grid",
        placeItems: "center",
        padding: "16px",
        background: "rgba(0, 0, 0, .72)",
        fontFamily: "system-ui, sans-serif",
      });

      const dialog = document.createElement("section");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "video-focal-point-title");
      Object.assign(dialog.style, {
        boxSizing: "border-box",
        width: "min(850px, 100%)",
        maxHeight: "100%",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#fff",
        color: "#171717",
        boxShadow: "0 20px 60px rgba(0, 0, 0, .4)",
      });

      const title = document.createElement("h2");
      title.id = "video-focal-point-title";
      title.textContent = "Choose the video focal point";
      Object.assign(title.style, { margin: "0 0 6px", fontSize: "20px" });

      const instructions = document.createElement("p");
      instructions.textContent =
        "Play or pause the video, then click the subject you want to keep centered as the hero resizes.";
      Object.assign(instructions.style, {
        margin: "0 0 16px",
        color: "#525252",
        fontSize: "14px",
      });

      const stage = document.createElement("div");
      Object.assign(stage.style, {
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        background: "#171717",
        cursor: "crosshair",
      });

      const video = document.createElement("video");
      video.src = videoUrl;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      Object.assign(video.style, {
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      });

      const marker = document.createElement("div");
      marker.setAttribute("aria-hidden", "true");
      Object.assign(marker.style, {
        position: "absolute",
        display: "none",
        width: "24px",
        height: "24px",
        border: "2px solid #fff",
        borderRadius: "50%",
        boxShadow: "0 0 0 2px #1d4ed8",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      });

      stage.append(video, marker);

      const selectedPoint = document.createElement("p");
      selectedPoint.setAttribute("aria-live", "polite");
      Object.assign(selectedPoint.style, {
        minHeight: "20px",
        margin: "10px 0 0",
        color: "#525252",
        fontSize: "14px",
      });
      selectedPoint.textContent = "Click the video to choose a focal point.";

      const error = document.createElement("p");
      error.setAttribute("role", "alert");
      Object.assign(error.style, {
        display: "none",
        margin: "10px 0 0",
        color: "#b91c1c",
        fontSize: "14px",
      });

      const actions = document.createElement("div");
      Object.assign(actions.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        marginTop: "18px",
      });

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Cancel";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.textContent = "Use focal point";
      saveButton.disabled = true;

      [cancelButton, saveButton].forEach(button => {
        Object.assign(button.style, {
          minHeight: "40px",
          padding: "8px 16px",
          border: "0",
          borderRadius: "5px",
          background: button === saveButton ? "#1d4ed8" : "#e5e5e5",
          color: button === saveButton ? "#fff" : "#171717",
          font: "inherit",
          fontWeight: "600",
          cursor: button.disabled ? "not-allowed" : "pointer",
        });
      });

      actions.append(cancelButton, saveButton);
      dialog.append(title, instructions, stage, selectedPoint, error, actions);
      overlay.append(dialog);
      document.body.append(overlay);

      const previousFocus = document.activeElement;

      function close(point) {
        if (state.finished) return;
        state.finished = true;
        video.pause();
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(videoUrl);
        overlay.remove();
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
        if (point) onSave(point);
        resolve(point);
      }

      function getRenderedVideoBounds() {
        if (!state.dimensions) return null;
        const bounds = stage.getBoundingClientRect();
        const scale = Math.min(
          bounds.width / state.dimensions.width,
          bounds.height / state.dimensions.height
        );
        const width = state.dimensions.width * scale;
        const height = state.dimensions.height * scale;
        return {
          left: bounds.left + (bounds.width - width) / 2,
          top: bounds.top + (bounds.height - height) / 2,
          width,
          height,
        };
      }

      video.addEventListener("loadedmetadata", () => {
        state.dimensions = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
      });
      video.addEventListener("error", () => {
        error.textContent =
          "The video could not be previewed. Try uploading an MP4 video.";
        error.style.display = "block";
      });
      stage.addEventListener("click", event => {
        if (!state.dimensions) {
          error.textContent =
            "Wait for the video to load before choosing a point.";
          error.style.display = "block";
          return;
        }
        if (event.target === video && event.offsetY > video.clientHeight - 42) {
          return;
        }
        const bounds = getRenderedVideoBounds();
        if (!bounds) return;
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) return;

        state.point = { x, y };
        const stageBounds = stage.getBoundingClientRect();
        marker.style.display = "block";
        marker.style.left = `${bounds.left - stageBounds.left + x * bounds.width}px`;
        marker.style.top = `${bounds.top - stageBounds.top + y * bounds.height}px`;
        selectedPoint.textContent = `Focal point: ${Math.round(x * 100)}% across, ${Math.round(y * 100)}% down`;
        error.style.display = "none";
        saveButton.disabled = false;
        saveButton.style.cursor = "pointer";
      });
      saveButton.addEventListener("click", () => {
        if (state.point) close(state.point);
      });
      cancelButton.addEventListener("click", () => close(null));
      overlay.addEventListener("keydown", event => {
        if (event.key === "Escape") close(null);
      });

      cancelButton.focus();
    });
  }

  const VideoFocalPointControl = window.createClass({
    getInitialState() {
      return { busy: false, error: "", videoFile: null };
    },

    componentDidMount() {
      window.addEventListener(
        "cms:video-upload-selected",
        this.handleVideoSelected
      );
    },

    componentWillUnmount() {
      window.removeEventListener(
        "cms:video-upload-selected",
        this.handleVideoSelected
      );
    },

    async handleVideoSelected(event) {
      const file = event.detail && event.detail.file;
      if (!(file instanceof File) || this.state.busy) return;

      this.setState({ videoFile: file, error: "" });
      await this.openFocalPointDialog(file);
    },

    async openFocalPointDialog(file) {
      if (this.state.busy) return;
      this.setState({ busy: true, error: "" });
      try {
        await createFocalPointDialog(file, point => {
          const value = `${(point.x * 100).toFixed(1)}% ${(point.y * 100).toFixed(1)}%`;
          this.props.onChange(value);
        });
      } catch (error) {
        console.error("Video focal point selection failed:", error);
        this.setState({
          error:
            error instanceof Error
              ? error.message
              : "The video focal point could not be saved.",
        });
      } finally {
        this.setState({ busy: false });
      }
    },

    render() {
      const value = this.props.value || "center";
      return h(
        "div",
        { className: this.props.classNameWrapper },
        h(
          "p",
          { style: { margin: "0 0 8px", fontSize: "14px" } },
          this.state.busy
            ? "Choose a point in the video preview."
            : `Current focal position: ${value}`
        ),
        h(
          "button",
          {
            type: "button",
            disabled: this.state.busy || !this.state.videoFile,
            onClick: () => this.openFocalPointDialog(this.state.videoFile),
            style: {
              padding: "8px 12px",
              border: "1px solid #737373",
              borderRadius: "5px",
              background: this.state.videoFile ? "#fff" : "#f5f5f5",
              color: "#171717",
              font: "inherit",
              cursor:
                this.state.videoFile && !this.state.busy
                  ? "pointer"
                  : "not-allowed",
            },
          },
          "Choose focal point"
        ),
        h(
          "p",
          {
            style: {
              margin: "0",
              color: "#525252",
              fontSize: "13px",
            },
          },
          this.state.videoFile
            ? "The point is saved as a position in the video frame; it will not track a moving subject."
            : "Upload a video above to choose a point to keep centered in the hero."
        ),
        this.state.error
          ? h(
              "p",
              { role: "alert", style: { color: "#b91c1c", fontSize: "13px" } },
              this.state.error
            )
          : null
      );
    },
  });

  window.CMS.registerWidget("video-focal-point", VideoFocalPointControl);
})();
