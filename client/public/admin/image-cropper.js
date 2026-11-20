(function () {
  const h = window.h;
  const handledInputs = new WeakSet();
  const aspectRatios = {
    original: null,
    square: 1,
    landscape: 16 / 9,
    classic: 4 / 3,
    portrait: 3 / 4,
  };

  function isImageFile(file) {
    return (
      file.type.startsWith("image/") ||
      /\.(avif|bmp|gif|heic|heif|ico|jfif|jpe?g|png|svg|tiff?|webp)$/i.test(
        file.name
      )
    );
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("This image could not be opened for cropping."));
      };
      image.src = objectUrl;
    });
  }

  function createCropDialog(image, file) {
    return new Promise(resolve => {
      const overlay = document.createElement("div");
      overlay.setAttribute("role", "presentation");
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        display: "grid",
        placeItems: "center",
        padding: "16px",
        background: "rgba(0, 0, 0, .72)",
        fontFamily: "system-ui, sans-serif",
      });

      const dialog = document.createElement("section");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "image-crop-title");
      Object.assign(dialog.style, {
        boxSizing: "border-box",
        width: "min(960px, 100%)",
        maxHeight: "100%",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "10px",
        background: "#fff",
        color: "#171717",
        boxShadow: "0 20px 60px rgba(0, 0, 0, .4)",
      });

      const title = document.createElement("h2");
      title.id = "image-crop-title";
      title.textContent = "Crop image";
      Object.assign(title.style, { margin: "0 0 6px", fontSize: "20px" });

      const instructions = document.createElement("p");
      instructions.textContent =
        "Drag the image to reposition it. The shaded area will be cropped.";
      Object.assign(instructions.style, {
        margin: "0 0 16px",
        color: "#525252",
        fontSize: "14px",
      });

      const stage = document.createElement("div");
      Object.assign(stage.style, {
        position: "relative",
        width: "100%",
        height: "min(52vh, 560px)",
        minHeight: "260px",
        overflow: "hidden",
        background: "#171717",
        touchAction: "none",
        userSelect: "none",
        cursor: "grab",
      });

      const preview = image;
      preview.alt = "";
      preview.draggable = false;
      Object.assign(preview.style, {
        position: "absolute",
        maxWidth: "none",
        maxHeight: "none",
        pointerEvents: "none",
      });

      const frame = document.createElement("div");
      frame.setAttribute("aria-hidden", "true");
      Object.assign(frame.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxSizing: "border-box",
        border: "2px solid #fff",
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, .62)",
        pointerEvents: "none",
      });

      stage.append(preview, frame);

      const controls = document.createElement("div");
      Object.assign(controls.style, {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "12px 20px",
        marginTop: "16px",
      });

      const aspectLabel = document.createElement("label");
      aspectLabel.textContent = "Crop shape ";
      aspectLabel.style.fontSize = "14px";

      const aspectSelect = document.createElement("select");
      aspectSelect.setAttribute("aria-label", "Crop shape");
      Object.assign(aspectSelect.style, {
        marginLeft: "6px",
        padding: "6px 8px",
        border: "1px solid #a3a3a3",
        borderRadius: "4px",
        background: "#fff",
        color: "#171717",
      });
      [
        ["original", "Original"],
        ["square", "Square"],
        ["landscape", "Landscape (16:9)"],
        ["classic", "Classic (4:3)"],
        ["portrait", "Portrait (3:4)"],
      ].forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        aspectSelect.append(option);
      });
      aspectLabel.append(aspectSelect);

      const zoomLabel = document.createElement("label");
      zoomLabel.textContent = "Zoom";
      zoomLabel.style.fontSize = "14px";

      const zoomInput = document.createElement("input");
      zoomInput.type = "range";
      zoomInput.min = "1";
      zoomInput.max = "4";
      zoomInput.step = "0.01";
      zoomInput.value = "1";
      zoomInput.setAttribute("aria-label", "Zoom image");
      zoomInput.style.width = "min(220px, 45vw)";
      zoomLabel.append(zoomInput);

      controls.append(aspectLabel, zoomLabel);

      const error = document.createElement("p");
      error.setAttribute("role", "alert");
      Object.assign(error.style, {
        display: "none",
        margin: "12px 0 0",
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
      saveButton.textContent = "Save crop";
      saveButton.style.background = "#1d4ed8";

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
          cursor: "pointer",
        });
      });

      actions.append(cancelButton, saveButton);
      dialog.append(title, instructions, stage, controls, error, actions);
      overlay.append(dialog);
      document.body.append(overlay);

      let ratio = image.naturalWidth / image.naturalHeight;
      let zoom = 1;
      let offsetX = 0;
      let offsetY = 0;
      let stageWidth = 0;
      let stageHeight = 0;
      let frameWidth = 0;
      let frameHeight = 0;
      let baseScale = 1;
      let dragging = false;
      let dragX = 0;
      let dragY = 0;
      let settled = false;
      const previousFocus = document.activeElement;
      const resizeObserver = new ResizeObserver(render);

      function settle(value) {
        if (settled) return;
        settled = true;
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        overlay.remove();
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
        resolve(value);
      }

      function render() {
        stageWidth = stage.clientWidth;
        stageHeight = stage.clientHeight;
        if (!stageWidth || !stageHeight) return;

        const frameScale = Math.min(stageWidth / ratio, stageHeight);
        frameWidth = frameScale * ratio;
        frameHeight = frameScale;
        baseScale = Math.max(
          frameWidth / image.naturalWidth,
          frameHeight / image.naturalHeight
        );
        frame.style.width = `${frameWidth}px`;
        frame.style.height = `${frameHeight}px`;

        const imageWidth = image.naturalWidth * baseScale * zoom;
        const imageHeight = image.naturalHeight * baseScale * zoom;
        const maxOffsetX = Math.max(0, (imageWidth - frameWidth) / 2);
        const maxOffsetY = Math.max(0, (imageHeight - frameHeight) / 2);
        offsetX = Math.min(maxOffsetX, Math.max(-maxOffsetX, offsetX));
        offsetY = Math.min(maxOffsetY, Math.max(-maxOffsetY, offsetY));
        preview.style.width = `${imageWidth}px`;
        preview.style.height = `${imageHeight}px`;
        preview.style.left = `${(stageWidth - imageWidth) / 2 + offsetX}px`;
        preview.style.top = `${(stageHeight - imageHeight) / 2 + offsetY}px`;
      }

      function onPointerMove(event) {
        if (!dragging) return;
        offsetX += event.clientX - dragX;
        offsetY += event.clientY - dragY;
        dragX = event.clientX;
        dragY = event.clientY;
        render();
      }

      function onPointerUp() {
        dragging = false;
        stage.style.cursor = "grab";
      }

      stage.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        dragging = true;
        dragX = event.clientX;
        dragY = event.clientY;
        stage.style.cursor = "grabbing";
        event.preventDefault();
      });
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      aspectSelect.addEventListener("change", () => {
        ratio =
          aspectRatios[aspectSelect.value] ||
          image.naturalWidth / image.naturalHeight;
        offsetX = 0;
        offsetY = 0;
        zoom = 1;
        zoomInput.value = "1";
        render();
      });
      zoomInput.addEventListener("input", () => {
        zoom = Number(zoomInput.value);
        render();
      });
      cancelButton.addEventListener("click", () => settle(null));
      overlay.addEventListener("keydown", event => {
        if (event.key === "Escape") settle(null);
        if (event.key === "Tab") {
          const focusable = Array.from(
            dialog.querySelectorAll("button:not([disabled]), input, select")
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });

      saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
        error.style.display = "none";
        try {
          const scale = baseScale * zoom;
          const sourceX =
            ((stageWidth - frameWidth) / 2 -
              ((stageWidth - image.naturalWidth * scale) / 2 + offsetX)) /
            scale;
          const sourceY =
            ((stageHeight - frameHeight) / 2 -
              ((stageHeight - image.naturalHeight * scale) / 2 + offsetY)) /
            scale;
          const sourceWidth = frameWidth / scale;
          const sourceHeight = frameHeight / scale;
          const outputScale = Math.min(
            1,
            4096 / Math.max(sourceWidth, sourceHeight)
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(sourceWidth * outputScale));
          canvas.height = Math.max(1, Math.round(sourceHeight * outputScale));
          const context = canvas.getContext("2d");
          if (!context)
            throw new Error("The browser could not create the cropped image.");
          context.drawImage(
            image,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const outputType = ["image/jpeg", "image/png", "image/webp"].includes(
            file.type
          )
            ? file.type
            : "image/png";
          const blob = await new Promise((resolveBlob, rejectBlob) => {
            canvas.toBlob(
              result => {
                if (result) resolveBlob(result);
                else
                  rejectBlob(
                    new Error("The browser could not save the cropped image.")
                  );
              },
              outputType,
              0.92
            );
          });
          const extensionByType = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
          };
          const extension = extensionByType[blob.type] || ".png";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          settle(
            new File([blob], `${baseName}${extension}`, {
              type: blob.type,
              lastModified: Date.now(),
            })
          );
        } catch (cropError) {
          console.error("Image crop failed:", cropError);
          error.textContent =
            cropError instanceof Error
              ? cropError.message
              : "The image could not be cropped. Please try again.";
          error.style.display = "block";
          saveButton.disabled = false;
          saveButton.textContent = "Save crop";
        }
      });

      resizeObserver.observe(stage);
      render();
      cancelButton.focus();
    });
  }

  async function cropSelectedImages(input) {
    const files = Array.from(input.files || []);
    const replacements = [];
    for (const file of files) {
      if (!isImageFile(file)) {
        replacements.push(file);
        continue;
      }
      const image = await loadImage(file);
      const cropped = await createCropDialog(image, file);
      if (!cropped) {
        input.value = "";
        return;
      }
      replacements.push(cropped);
    }

    const transfer = new DataTransfer();
    replacements.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
    handledInputs.add(input);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function getPublicMediaPath(filePath, props) {
    if (/^(https?:)?\/\//i.test(filePath)) return filePath;

    const fileName = filePath.split("/").pop();
    if (!fileName)
      throw new Error("The cropped image upload returned no file path.");

    const publicFolder =
      props.field.get("public_folder") ||
      (props.config && props.config.get("public_folder")) ||
      "";
    const normalizedFolder = publicFolder.replace(/\/+$/, "");
    return normalizedFolder ? `${normalizedFolder}/${fileName}` : fileName;
  }

  function getEditedFileName(file) {
    const dot = file.name.lastIndexOf(".");
    const baseName = dot > 0 ? file.name.slice(0, dot) : file.name;
    const extension = dot > 0 ? file.name.slice(dot) : "";
    return `${baseName}-cropped-${Date.now()}${extension}`;
  }

  const imageWidget = window.CMS.getWidget("image");
  if (!imageWidget || !imageWidget.control) {
    throw new Error("The Decap CMS image widget could not be loaded.");
  }
  const BuiltInImageControl = imageWidget.control;

  const EditableImageControl = window.createClass({
    getInitialState() {
      return { busy: false, error: "" };
    },

    async handleEditPicture() {
      if (this.state.busy) return;
      this.setState({ busy: true, error: "" });

      try {
        const asset = this.props.getAsset(this.props.value, this.props.field);
        const imageUrl = String(asset || "");
        if (!imageUrl)
          throw new Error("The existing image could not be loaded.");

        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(
            `The existing image could not be loaded (${response.status}).`
          );
        }

        const blob = await response.blob();
        const fileName =
          String(this.props.value).split("/").pop() || "cms-image.png";
        const imageFile = new File([blob], fileName, {
          type: blob.type || "image/png",
          lastModified: Date.now(),
        });
        const image = await loadImage(imageFile);
        const croppedFile = await createCropDialog(image, imageFile);
        if (!croppedFile) return;

        const uploadFile = new File(
          [croppedFile],
          getEditedFileName(croppedFile),
          { type: croppedFile.type, lastModified: Date.now() }
        );
        const result = await this.props.onPersistMedia(uploadFile, {
          field: this.props.field,
          privateUpload: this.props.field.get("private"),
        });
        const mediaFile = result?.payload?.file || result?.payload;
        if (!mediaFile?.path) {
          throw new Error(
            "The cropped image could not be uploaded to the CMS."
          );
        }

        this.props.onChange(getPublicMediaPath(mediaFile.path, this.props));
      } catch (error) {
        console.error("Editing an existing CMS image failed:", error);
        this.setState({
          error:
            error instanceof Error
              ? error.message
              : "The image could not be edited. Please try again.",
        });
      } finally {
        this.setState({ busy: false });
      }
    },

    render() {
      return h(
        "div",
        null,
        h(BuiltInImageControl, this.props),
        typeof this.props.value === "string" && this.props.value
          ? h(
              "div",
              { style: { marginTop: "8px" } },
              h(
                "button",
                {
                  type: "button",
                  disabled: this.state.busy,
                  onClick: this.handleEditPicture,
                  style: {
                    padding: "8px 12px",
                    border: "1px solid #737373",
                    borderRadius: "5px",
                    background: "#fff",
                    color: "#171717",
                    font: "inherit",
                    cursor: this.state.busy ? "wait" : "pointer",
                  },
                },
                this.state.busy ? "Editing picture..." : "Edit picture"
              ),
              this.state.error
                ? h(
                    "p",
                    {
                      role: "alert",
                      style: { color: "#b91c1c", fontSize: "13px" },
                    },
                    this.state.error
                  )
                : null
            )
          : null
      );
    },
  });

  window.CMS.registerWidget(
    "image",
    EditableImageControl,
    imageWidget.preview,
    imageWidget.schema
  );

  document.addEventListener(
    "change",
    event => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "file") return;
      if (handledInputs.has(input)) {
        handledInputs.delete(input);
        return;
      }

      const files = Array.from(input.files || []);
      files
        .filter(
          file =>
            file.type.startsWith("video/") ||
            /\.(avi|m4v|mkv|mov|mp4|mpeg|mpg|ogv|webm)$/i.test(file.name)
        )
        .forEach(file => {
          window.dispatchEvent(
            new CustomEvent("cms:video-upload-selected", {
              detail: { file },
            })
          );
        });

      if (!files.some(isImageFile)) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      cropSelectedImages(input).catch(error => {
        console.error(
          "Image upload was not continued because cropping failed:",
          error
        );
        input.value = "";
        window.alert(
          error instanceof Error
            ? error.message
            : "The image could not be cropped. Please select it again."
        );
      });
    },
    true
  );
})();
