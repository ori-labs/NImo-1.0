"use-strict";
import config from "../components/lib/sanMoji/js/config.js";
import AlloyCrop from "../components/lib/sanMoji/js/cropper/alloycrop.js";
// import cropper from "../components/lib/sanMoji/js/cropper/cropper.js";
import utilities from "../components/utilities/utilities.js";

(function () {
    console.log("%cSESSION: Account setup", "color: #d34b43");
    firebase.initializeApp({
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck,
    });

    let lsDB = localStorage,
        _opSec = document.getElementById("_opSec");

    let auth = firebase.auth(),
        _fsDb = firebase.firestore();

    const _prld = `
        <span class="preload">
            <img src="../src/assets/spinner-2.svg" alt="">
        </span>
        `;

    let _colrPicker_ = document.querySelector("._color-picker_"),
        _banner_ = document.querySelector("._banner_"),
        _pfp_ = document.querySelector("._pfp_"),
        _pfpPicker = document.querySelector("._pfp_picker_"),
        _pfpFile = document.querySelector("#_pfp-file_"),
        _setFnBtn = document.querySelector("#setup-fin-btn"),
        _setup_skip_btn = document.querySelector(".setup-skin-btn"),
        _usrName = document.querySelector("#set-user-name"),
        _idCard = document.querySelector("#_id_"),
        _about = document.querySelector("#_set-about"),
        _errH = document.querySelector("._set-Err"),
        _tl = document.querySelector(".tl");

    _about.addEventListener("keyup", () => {
        let maxLen = 200;
        let val = _about.value;
        let chars = val.length;
        if (chars > maxLen) {
            _about.value = val.substring(0, maxLen);
        }
        _tl.innerText = `${_about.value.length}/120`;
    });
    _setup_skip_btn.addEventListener("click", () => {
        if (_usrName.value == "") {
            err("You need to provide a username!", _errH);
            _usrName.classList.add("invalid");
            _usrName.focus();
            setTimeout(() => {
                _usrName.classList.remove("invalid");
            }, 1000);
        } else {
            utilities.alert(
                "You can always customise your profile later, confirm to proceed to the next step.",
                "alert",
                () => {
                    let uid = lsDB.getItem("deamon");

                    const _pfImage = "default",
                        _pfBdropColor = lsDB.getItem('default_color'),
                        _bannerCVal = lsDB.getItem('default_color'),
                        _usrName_ = _usrName.value,
                        _about_ = "",
                        _id_ = lsDB.getItem("id");

                    finalizeSetup(
                        _pfImage,
                        _bannerCVal,
                        _usrName_,
                        _about_,
                        _id_,
                        _pfBdropColor,
                        _setup_skip_btn
                    );
                }
            );
        }
    });

    function setIdColor() {
        let selected_image = lsDB.getItem("selected_image"),
            defaultColor = lsDB.getItem("default_color"),
            user_id = lsDB.getItem("id");

        _banner_.style.backgroundColor = defaultColor;
        _idCard.innerText = `@${user_id}`;
        _pfp_.style.backgroundColor = defaultColor;
        _pfp_.style.backgroundImage = `url(${selected_image || "../src/imgs/avatar.png"
            })`;
    }
    function _cp() {
        const parentCustom = _colrPicker_,
            popupCustom = new Picker({
                parent: parentCustom,
                popup: "right",
                color: lsDB.getItem("default_color"),
                editorFormat: "hex",
                onDone: function (color) {
                    _banner_.style.backgroundColor = color.rgbaString;
                    _pfp_.style.backgroundColor = color.rgbaString;
                },
            });
    }
    function _pi() {
        _pfpFile.addEventListener("change", () => {
            fetch_image();
        });

        function fetch_image() {
            const image_file = _pfpFile.files[0];

            if (image_file) {
                const _fReader = new FileReader();
                _fReader.readAsDataURL(image_file);
                _fReader.addEventListener("load", function () {
                    if (image_file.size > 5120000) {
                        utilities.alert(
                            "Uhm, only images less than 5mbs can be uploaded. please consider selecting smaller file.",
                            "info",
                            console.log("kaaiii")
                        );
                    }
                    crop_image(this.result);
                });
            }
        }
        const cropper_container = document.querySelector("[data-cropper]"),
            cropper_wrapper = document.querySelector("[data-c-wrapper]"),
            cropper_close_btn = document.querySelector("[data-cropper-close-btn]"),
            cropper_save_btn = document.querySelector("[data-cropper-save-btn]");
        function crop_image(src) {
            cropper_container.style.display = "flex";

            var vanilla = new Croppie(cropper_wrapper, {
                viewport: { width: 250, height: 250, type: "circle" },
                showZoomer: false,
                enableOrientation: true,
            });
            vanilla.bind({
                url: src,
                orientation: 0,
            });

            cropper_close_btn.addEventListener("click", () => {
                cropper_container.style.display = "none";
                setTimeout(() => {
                    location.reload();
                }, 100);
            });
            cropper_save_btn.addEventListener("click", () => {
                vanilla.result("blob").then(function (blob) {
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        let tobase64 = reader.result;
                        lsDB.setItem("selected_image", tobase64);

                        setTimeout(() => {
                            location.reload();
                        }, 100);
                    };
                });
            });
        }
    }
    function _gImgData() {
        const files = _pfpFile.files[0];
        let _prog = document.getElementById("_prog");

        console.log("FileName", files);
        const uploadTask = _fstrg
            .ref(`client/${_stds_}`)
            .child(files.name)
            .put(files);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // _prog.style = 'flex';
                _prog.classList.remove("hide");
                _prog.classList.add("show");
                let pfpfp = document.getElementById("pfp-picker"),
                    bnp = document.getElementById("banner-picker"),
                    sfnbtn = document.getElementById("setup-fin-btn"),
                    sbcbtn = document.getElementById("setup-bc-btn");

                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                let _height_ = (Math.floor(progress) * 70) / 100;
                let _cheight = Math.floor(70 - (Math.floor(progress) * 70) / 100);
                console.log(70 - (Math.floor(progress) * 70) / 100);
                // document.querySelector('.progress').style.height = `${Math.floor((progress * 70)/100)}px`;
                _prog.style.height = `${_cheight}px`;
                // if(progress == 100){
                //     _prog.style.display = 'none';
                //     console.log('***DONE***');
                // }
            },
            (error) => {
                // Handle unsuccessful uploads
                worker._sn._Err(
                    "Couldn't upload the image, please try again later!",
                    _errH
                );
                console.log("error:-", error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    _fsDb
                        .collection("client")
                        .doc(_stds_)
                        .collection(_stds_)
                        .doc("udata")
                        .set({
                            userProfileAvatar: downloadURL.toString(),
                        })
                        .then(() => {
                            // console.log("Document successfully written!");
                            lsDB.setItem("_pfp", downloadURL.toString());
                        })
                        .catch((error) => {
                            worker._sn._Err(
                                "Something went wrong, please try again later!",
                                _errH
                            );
                            console.error("Error writing document: ", error);
                        });
                });
            }
        );
        if (files) {
            const _fReader = new FileReader();
            _fReader.readAsDataURL(files);
            _fReader.addEventListener("load", function () {
                _pfp_.style.backgroundImage = `url('${this.result}')`;
                _pfp_.style.backgroundSize = "cover";
                _pfp_.style.backgroundPosition = "center";
            });
        }
    }
    function _finishSetup() {
        _usrName.addEventListener("keyup", (evt) => {
            if (evt.key === "Enter" || evt.keyCode === 13) {
                _validData();
            }
        });
        _setFnBtn.addEventListener("click", () => {
            _validData();
        });
        function _validData() {
            if (_usrName.value == "") {
                err("Username is required!", _errH);
                _usrName.classList.add("invalid");
                _usrName.focus();
                setTimeout(() => {
                    _usrName.classList.remove("invalid");
                }, 1000);
            } else {
                const _pfImage = lsDB.getItem("selected_image") || "default",
                    _pfBdropColor =
                        _pfp_.style.backgroundColor || lsDB.getItem("default_color"),
                    _bannerCVal =
                        _banner_.style.backgroundColor || lsDB.getItem("default_color"),
                    _usrName_ = _usrName.value,
                    _about_ = _about.value || "",
                    _id_ = lsDB.getItem("id");

                finalizeSetup(
                    _pfImage,
                    _bannerCVal,
                    _usrName_,
                    _about_,
                    _id_,
                    _pfBdropColor,
                    _setFnBtn
                );
            }
        }
    }
    function finalizeSetup(pfp, banner, uname, about, id, pfpD, el) {
        el.innerHTML = _prld;
        _setFnBtn.disabled = true;
        _setup_skip_btn.disabled = true;
        _setup_skip_btn.style.opacity = ".6";
        _setup_skip_btn.style.cursor = "not-allowed";
        _setFnBtn.style.cursor = "not-allowed";
        document.querySelector(".layer").classList.add("show");
        document.querySelector(".layer").classList.remove("hide");

        let _uid_ = lsDB.getItem("id");

        // console.log(pfp, banner, uname, about, _uid_, id, pfpD);
        _fsDb
            .collection("client")
            .doc('meta')
            .collection(id)
            .doc("meta_data")
            .set({
                user: uname,
                about: about,
                id: id,
                bannerColor: banner,
                userProfileAvatar: pfp,
                userProfileBackDrop: pfpD,
            })
            .then(() => {
                _fsDb
                    .collection("client")
                    .doc('meta')
                    .collection(id)
                    .doc("meta")
                    .update({
                        state: "user",
                    })
                    .then(() => {
                        lsDB.clear();
                        setTimeout(() => {
                            console.log("local storage cleared..");
                            location.reload();
                        }, 100);
                    })
                    .catch((error) => {
                        err("Opps something went wrong, mind trying again later!", _errH);
                        console.log(error);
                        _setFnBtn.innerHTML = `<span>Finish</span>`;
                        _setup_skip_btn.innerHTML = `<span>Skip setup</span>`;
                        _setFnBtn.disabled = false;
                        _setup_skip_btn.disabled = false;
                        _setup_skip_btn.style.cursor = "pointer";
                        _setFnBtn.style.cursor = "pointer";
                        document.querySelector(".layer").classList.add("hide");
                        document.querySelector(".layer").classList.remove("show");
                    });
            })
            .catch((error) => {
                err("Opps something went wrong, mind trying again later!", _errH);
                console.log(error);
                _setFnBtn.innerHTML = `<span>Finish</span>`;
                _setup_skip_btn.innerHTML = `<span>Skip setup</span>`;
                _setFnBtn.disabled = false;
                _setup_skip_btn.disabled = false;
                _setup_skip_btn.style.cursor = "pointer";
                _setFnBtn.style.cursor = "pointer";
                document.querySelector(".layer").classList.add("hide");
                document.querySelector(".layer").classList.remove("show");
            });
    }
    _cp();
    _pi();
    _finishSetup();

    function err(msg, el) {
        el.classList.remove("hide");
        el.classList.add("show");
        el.querySelector(".msg").innerText = msg;

        setTimeout(() => {
            el.classList.remove("show");
            el.classList.add("hide");
        }, 5000);
    }

    (function () {
        auth.onAuthStateChanged(async (__usr__) => {
            if (__usr__) {
                console.log("Logged in as", __usr__.uid);

                const meta_data = await getMeta(__usr__.uid);
                console.log("meta", __usr__.uid, meta_data);
                lsDB.setItem("id", meta_data[1]);
                lsDB.setItem("default_color", meta_data[2]);

                console.log(meta_data);
                const state = meta_data[0];

                if (state != "null") {
                    setIdColor();
                    console.log("user registered with ", state);
                    if (state === "setup") {
                        console.log("rewinding setup ..");
                        $("#progress").removeClass("load");
                        $("#progress").addClass("loaded");
                        setTimeout(() => {
                            hide_preloader();
                        }, 2000);
                    } else if (state === "cancel") {
                        location.href = "/pages/login.html";
                    } else if (state === "user") {
                        location.href = "/index.html";
                    }
                } else {
                    console.log("user not registered yet");
                }
            } else {
                console.log("not registered yet as a user");
                location.href = '/pages/login.html';
            }
        });

        async function getMeta(_usr_) {
            console.log(_usr_);
            let _state_ = [];

            await _fsDb
                .collection("client")
                .doc("meta_index")
                .collection(_usr_)
                .doc("meta_index")
                .get()
                .then(async (_doc_) => {
                    if (_doc_.exists) {
                        const id = _doc_.data().id;
                        await _fsDb
                            .collection("client")
                            .doc("meta")
                            .collection(id)
                            .doc("meta")
                            .get()
                            .then((meta) => {
                                if (meta.exists) {
                                    _state_.push(meta.data().state);
                                    _state_.push(meta.data().id);
                                    _state_.push(meta.data().default_color);
                                } else {
                                    _state_ = "null";
                                    console.log("meta was not found");
                                    hide_preloader();
                                }
                                return _state_;
                            });
                    } else {
                        _state_ = "null";
                        console.log("doc doesnt exist, sending you to login page");
                        hide_preloader();
                    }
                    return _state_;
                })
                .catch((err) => {
                    console.log(
                        "%cSomething went wrong!, retrying in 5 sec",
                        utilities.consoleColor
                    );
                    hide_preloader();
                    $("#spinnerx").addClass("show");
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                });
            return _state_;
        }
    })();
    function hide_preloader() {
        $("#spinnerx").removeClass("load");
        if ($("#spinnerx").length > 0) {
            $("#spinnerx").removeClass("show");
        }
    }
})();
