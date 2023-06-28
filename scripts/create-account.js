'use-strict';
import core from "../components/core/core.js";
import utilities from "../components/utilities/utilities.js";

(function(){
    core.config_core();
    core.manage_state(
        '/pages/setup.html',
        '/index.html',
        '/pages/create-account.html'
    )    

    let root = document.querySelector('#root');

    let  lsdb = localStorage;
    let auth = firebase.auth(),
        fsdb = firebase.firestore();

    on_signup();

    function on_signup(){
        const _regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let preloader = `
            <span class="preload">
                <img src="../src/assets/spinner-2.svg" alt="">
            </span>`, 
        btn_prev_el = `
            <span>next</span>
            <img src="../src/icons/arrow-right.svg" alt="">
        `;
        
        let lg_btn = document.querySelector('._login-btn'),
            sn_m = document.getElementById('sn-email'),
            sn_pwd = document.getElementById('sn-pwd'), 
            sn_c_pwd = document.getElementById('sn-c-pwd'), 
            sn_next_btn = document.getElementById('next-btn'), 
            sn_error_el = document.querySelector('#error-el');

    
        sn_next_btn.addEventListener('click', () => {
            validate();
        });
        lg_btn.addEventListener('click', (e)=> {
            e.preventDefault();
            location.href = '../pages/login.html'
        });

        on_key_enter();

        function validate() {
            let is_valid = false;

            utilities.simple_error(
                sn_m.value == '' ? 'Email is required!' :
                sn_pwd.value == '' ? 'Password is required!' : sn_pwd.value !== sn_c_pwd.value ? 'Passwords do not match!' :
                !sn_m.value.match(_regx) ? 'Invalid email address' : 'Creating account, please wait ...',
                sn_error_el
            );

            is_valid = sn_m.value === '' ? false : sn_pwd.value == '' ? false : 
            sn_pwd.value == '' || sn_c_pwd.value !== sn_pwd.value ? false : !sn_m.value.match(_regx) ? false : true;

            utilities.log(is_valid);

            if(is_valid){
                sn_next_btn.innerHTML = preloader;
                sn_error_el.classList.add('hide');
                
                setTimeout(()=> {
                    sn_next_btn.innerHTML = btn_prev_el;
                    save_phase(sn_m, sn_pwd, sn_c_pwd)
                    .then(() => {
                        captcha();
                    });
                }, 500)
            }

            async function save_phase(_e, _p1, _p2) {
                lsdb.setItem('phs_1', _e.value);
                lsdb.setItem('phs_2', _p1.value);
                lsdb.setItem('phs_3', _p2.value);
            }
            function captcha() {
                let captcha_view = `
                    <div class="cap-sec" id="cap_sec">
                        <div class="wrapper" id="cap-sec-wrapper">
                            <div class="cred-cont middle-ware" id="middle-ware">
                                <div class="wrapper">
                                    <div class="title-con">
                                        <span class="title">Beep Boop!</span>
                                        <span class="hr"></span>
                                        <span class="text">Let's quickly verify that you're not a robot. This will only take a moment.</span>
                                    </div>
                                    <div class="captcha-cont">
                                        <div class="cap-wrapper">
                                            <div class="captcha"><s class="cap-h"></s></div>
                                            <span class="refresh cap-rf">
                                                <img src="../src/icons/refresh.svg" alt="">
                                            </span>
                                        </div>
                                        <input type="text"  autofocus name="captchainput" id="cap-input" class="cap-input cap-in" required="" placeholder="Enter the captcha">
                                    </div>
                                    <button class="button verify-btn cap-v-btn">Verify</button>
                                </div>
                                <span class="error-msg hide cap-err-msg fade-in" style="width:100%">
                                    <span class="msg err-msg cap-err-msg-h" id="msg">
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                `
                root.insertAdjacentHTML('beforeend', captcha_view);
        
                let captcha_h = document.querySelector('.cap-h'), 
                    captcha_refresh = document.querySelector('.cap-rf'), 
                    captcha_input = document.querySelector('.cap-in'),
                    _capWrapper = document.querySelector('.middle-ware'), 
                    captcha_error = document.querySelector('.cap-err-msg'), 
                    verify_btn = document.querySelector('.cap-v-btn'),
                    captcha_cont = document.querySelector('.cap-sec');
        
                captcha_input.focus();
                captcha_input.value = '';

                utilities.createCaptcha(captcha_h);
        
                const events = {
                    esc: (el) => {
                        document.onkeydown = function(evt) {
                            evt = evt || window.event;
                            let isEscape = false;
                            if ("key" in evt) {
                                isEscape = (evt.key === "Escape" || evt.key === "Esc");
                            } else {
                                isEscape = (evt.keyCode === 27);
                            }
                            if (isEscape) {
                                if(el != null){
                                    el.remove();
                                }
                            }
                        };
                    },
                    outClick: (el, id) => {
                        document.addEventListener("mouseup", function(event) {
                            let obj = document.getElementById(id);
                            if(obj != null){
                                if (!obj.contains(event.target)) {
                                    if(el != null){
                                        el.remove();
                                    }
                                }
                            }
                        });
                    }
                }
        
                captcha_refresh.addEventListener('click', () => {
                    setTimeout(() => {
                        utilities.createCaptcha(captcha_h);
                    }, 300);
                });
                verify_btn.addEventListener('click', () => {
                    utilities.validateCaptcha(captcha_input, captcha_error, on_success, captcha_h);
                });
                captcha_input.addEventListener('keyup', (evt) => {
                    if (evt.key === 'Enter' || evt.keyCode === 13) {
                        utilities.validateCaptcha(captcha_input, captcha_error, on_success, captcha_h);
                    }
                });


                function on_success() {
                    verify_btn.innerHTML = ` <span class="preload">
                        <img src="../src/assets/spinner-2.svg" alt="">
                    </span>`;

                    verify_btn.innerText = 'SUCCESS!';

                    if(captcha_cont != null){
                        captcha_cont.remove();
                    }

                    $('#spinnerx').addClass('show');
                    create_user();
                }
                function create_user() {
                    preload();

                    const m = lsdb.getItem('phs_1'), 
                        pwd = lsdb.getItem('phs_2');

                    const id = utilities.genID().toString();
        
                    auth
                    .createUserWithEmailAndPassword(m, pwd)
                    .then((cred) => {
                        let uid = cred.user.uid,
                            status = cred.user.isAnonymous;
                            let user_type = status === false ? 'user' : 'anonymous'

                        save_state(id, uid, user_type);
                    }).catch((error) => {
                        unload();
                        $('#spinnerx').removeClass('show');
                        if(captcha_cont != null){
                            captcha_cont.remove();
                        }
                        utilities.simple_error(error.message, sn_error_el);
                    });
                }
                function save_state(user_id, uid, type){
                    let default_color = utilities.genColor();

                    fsdb.collection('client')
                    .doc('meta')
                    .collection(user_id)
                    .doc('meta')
                    .set(
                        {
                            id: user_id,
                            uid: uid,
                            state: 'setup',
                            user_type: type,
                            user_id: utilities.genUserId(),
                            default_color: default_color,
                        }
                    ).then(() => {
                        fsdb.collection('client')
                        .doc('meta_index')
                        .collection(uid)
                        .doc('meta_index')
                        .set(
                            {
                                uid: uid,
                                id: user_id
                            }
                        ).then(() => {
                            lsdb.setItem('default_color', default_color);
                            setTimeout(() => {
                                location.reload();
                            }, 100)
                        });
                    }).catch(() => {
                        setTimeout(() => {
                            location.reload();
                        }, 100)
                    })
                }
                function preload(){
                    verify_btn.innerHTML = preloader;
                    captcha_refresh.disabled = true;
                    captcha_input.disabled = true;
                    verify_btn.disabled = true;
                    verify_btn.style.cursor = 'not-allowed';
                    captcha_refresh.style.cursor = 'not-allowed';
                    captcha_input.style.cursor = 'not-allowed';
                }
                function unload(){
                    verify_btn.innerHTML = 'Verify';
                    captcha_refresh.disabled = false;
                    captcha_input.disabled = false;
                    verify_btn.disabled = false;
                    verify_btn.style.cursor = 'pointer';
                    captcha_refresh.style.cursor = 'pointer';
                    captcha_input.style.cursor = 'text';
                    captcha_input.value = '';
                    utilities.createCaptcha(captcha_h);
                }
            }
        }
        function on_key_enter() {
            sn_m.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    sn_pwd.focus();
                }
            });
            sn_pwd.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    sn_c_pwd.focus();
                }
            });
            sn_c_pwd.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    validate();
                }
            });
        }        
    }
}())