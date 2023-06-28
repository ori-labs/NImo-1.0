"use-strict";
import core from "../components/core/core.js";
import utilities from "../components/utilities/utilities.js";

(function () {
    core.config_core();
    core.manage_state(
        '/pages/setup#user',
        '/',
        '/pages/create-account/#index?type=new',
        'setup',
        set_color_id
    )

    let lsdb = localStorage;
    const fsdb = firebase.firestore();

    const preloader = `
        <span class="preload">
            <img src="../../src/assets/spinner-2.svg" alt="">
        </span>
        `;

    let color_picker_input = document.getElementById('color-picker-input'),
        banner_cont = document.querySelector("._banner_"),
        pfp = document.querySelector("._pfp_"),
        pfp_pic_input = document.querySelector("#_pfp-file_"),
        submit_btn_cont = document.querySelector("#setup-fin-btn-cont"),
        submit_btn = document.querySelector('#btn-finish'),
        skip_btn_cont = document.querySelector("#setup-skin-btn-cont"),
        skip_btn = document.getElementById('btn-skip'),
        username_input = document.querySelector("#set-user-name"),
        id_card = document.querySelector("#_id_"),
        bio_input = document.querySelector("#_set-about"),
        error_cont = document.querySelector("._set-Err"),
        len_counter = document.querySelector(".tl");

    on_pick_image();

    color_picker_input.addEventListener('change', function(e){
        utilities.log(this.value);
        banner_cont.style.backgroundColor = `${this.value}`;
        lsdb.setItem('selected_color', this.value);
    })
    bio_input.addEventListener("keyup", () => {
        let maxLen = 200;
        let val = bio_input.value;
        let chars = val.length;
        if (chars > maxLen) {
            bio_input.value = val.substring(0, maxLen);
        }
        len_counter.innerText = `${bio_input.value.length}/120`;
    });
    username_input.addEventListener('input', function(e){
        e.preventDefault();
        const inputValue = username_input.value;
        const isValid = utilities.restrictSpaceCharacter(inputValue);
        
        if (!isValid) {
            let replace_val = inputValue.replace(/[^\w]/g, "");
            username_input.value = replace_val;
        }
    })
    skip_btn.addEventListener("click", () => {
        let is_valid = false;

        utilities.simple_error(username_input.value == '' ? 'You need to provide username to continue!' : 'Finalizing setup ...', error_cont);
        is_valid = username_input.value == '' ? false : true;

        utilities.log(is_valid);

        if(is_valid){
            error_cont.classList.add('hide');
            utilities.alert(
                "You can always customise your profile later, confirm to proceed to the finalize setup.",
                "alert",
                () => {
                    const pf_pic = "default",
                        pf_bdrop = lsdb.getItem('selected_color') || lsdb.getItem('default_color'),
                        banner_cval = lsdb.getItem('selected_color') || lsdb.getItem('default_color'),
                        user_name_input = username_input.value,
                        bio_input_value = "",
                        user_id = lsdb.getItem("id");

                    skip_btn_cont.innerHTML = preloader;
                    skip_btn_cont.style.cursor = 'not-allowed';
                    submit_btn_cont.innerHTML = preloader;
                    submit_btn_cont.style.cursor = 'not-allowed';

                    finalize_setup(
                        pf_pic, banner_cval,
                        user_name_input, bio_input_value,
                        user_id, pf_bdrop
                    );
                }
            );
        }
    });
    submit_btn.addEventListener("click", () => {
        validate();
    });

    function set_color_id() {
        let selected_image = lsdb.getItem("selected_image"),
            defaultColor = lsdb.getItem("default_color"),
            user_id = lsdb.getItem("id");

        banner_cont.style.backgroundColor = defaultColor;
        color_picker_input.value = `${defaultColor}`;
        id_card.innerText = `@${user_id}`;
        pfp.style.backgroundColor = defaultColor;
        pfp.style.backgroundImage = `url(${selected_image || "../../src/imgs/avatar.png"})`;
    }
    function on_pick_image() {
        const cropper_container = document.querySelector("[data-cropper]"),
            cropper_wrapper = document.querySelector("[data-c-wrapper]"),
            cropper_close_btn = document.querySelector("[data-cropper-close-btn]"),
            cropper_save_btn = document.querySelector("[data-cropper-save-btn]");

        pfp_pic_input.addEventListener("change", () => {
            cropper_container.style.display = "flex";
            fetch_image();
        });

        let image_cropper = new Croppie(cropper_wrapper, {
            viewport: { width: 250, height: 250, type: "circle" },
            showZoomer: false,
            enableOrientation: true,
        });
        function fetch_image() {
            const image_file = pfp_pic_input.files[0];

            if (image_file) {
                const file_reader = new FileReader();
                file_reader.readAsDataURL(image_file);
                file_reader.addEventListener("load", function () {
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
        
        function crop_image(src) {
            image_cropper.bind({
                url: src,
                orientation: 0,
            });

            cropper_close_btn.addEventListener("click", () => {
                cropper_container.style.display = "none";
            });
            cropper_save_btn.addEventListener("click", () => {
                image_cropper.result("blob").then(function (blob) {
                    let reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = () => {
                        let tobase64 = reader.result;
                        lsdb.setItem("selected_image", tobase64);
                        set_color_id();
                        cropper_container.style.display = "none";
                    };
                });
            });
        }
    }
    function validate() {
        let is_valid = false;
        
        utilities.simple_error(username_input.value == '' ? 'Username is required to continue!' :  'Finalizing setup ...', error_cont);
        
        is_valid = username_input.value == '' ? false : true;

        utilities.log(is_valid);
        if(is_valid){
            error_cont.classList.add('hide');
            
            skip_btn_cont.innerHTML = preloader;
            skip_btn_cont.style.cursor = 'not-allowed';
            submit_btn_cont.innerHTML = preloader;
            submit_btn_cont.style.cursor = 'not-allowed';

            const pf_pic = lsdb.getItem("selected_image") || "default",
            pf_bdrop = lsdb.getItem('selected_color') || lsdb.getItem("default_color"),
            banner_cval = lsdb.getItem('selected_color') || lsdb.getItem("default_color"),
            username_input_value = username_input.value,
            bio_input_value = bio_input.value || "",
            user_id = lsdb.getItem("id");

            finalize_setup(
                pf_pic, banner_cval,
                username_input_value, bio_input_value,
                user_id, pf_bdrop,
            );
        }
    }
    function finalize_setup(pfp, banner, uname, about, id, pfpD) {
        document.querySelector(".layer").classList.remove("hide");

        fsdb
        .collection("client").doc('meta')
        .collection(id).doc("meta_data").set({
            user: uname,
            about: about,
            id: id,
            bannerColor: banner,
            userProfileAvatar: pfp,
            userProfileBackDrop: pfpD,
        })
        .then(() => {
            fsdb.collection("client").doc('meta').collection(id)
            .doc("meta").update({
                state: "user",
            })
            .then(() => {
                lsdb.clear();
                setTimeout(() => {
                    location.reload();
                }, 100);
            });
        })
        .catch(() => {
            utilities.simple_error("Opps! Something went wrong, mind trying again later?", error_cont);
            submit_btn_cont.innerHTML = ` <span id="btn-finish">Finish</span>`;
            skip_btn_cont.innerHTML = `<span class="btn-skip" id="btn-skip">Skip setup</span>`;
            submit_btn_cont.disabled = false;
            skip_btn_cont.disabled = false;
            skip_btn_cont.style.cursor = "pointer";
            submit_btn_cont.style.cursor = "pointer";
            document.querySelector(".layer").classList.add("hide");
        });
    }
})();
