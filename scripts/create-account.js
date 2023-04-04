'use-strict';
import config from "../components/lib/sanMoji/js/config.js";
import utilities from "../components/utilities/utilities.js";

(function(){
    console.log('%cSESSION: Create account', 'color: #d34b43');
    firebase.initializeApp({
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck
    })
    
    let root = document.querySelector('#root');

    let  lsDB = localStorage,
        _opSec = document.getElementById('_opSec');
    let auth = firebase.auth(),
        _fsDb = firebase.firestore();

    const _prld = `
        <span class="preload">
            <img src="../src/assets/spinner-2.svg" alt="">
        </span>`, 
    _prevEl = `
        <span>next</span>
        <img src="../src/icons/arrow-right.svg" alt="">
    `;

    let _loginBtn = document.querySelector('._login-btn'),
        __snM = document.getElementById('sn-email'),
        __snPwd = document.getElementById('sn-pwd'), 
        __snCPwd = document.getElementById('sn-c-pwd'), 
        __nextBtn = document.getElementById('next-btn'), 
        errorEl = document.querySelector('#error-el');

    const _regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    __nextBtn.addEventListener('click', () => {
        validateInput();
    });
    function validateInput() {
        if (__snM.value === '') {
            __snM.classList.add('invalid');
            __snM.focus();
            err('Email field is required!', errorEl);
            setTimeout(() => {
                __snM.classList.remove('invalid');
            }, 1000);
        }
        else if (__snPwd.value != '' && __snCPwd.value != '') {
            if (__snPwd.value != __snCPwd.value) {
                err('Passwords do not match!', errorEl);
                __snPwd.classList.add('invalid');
                __snCPwd.classList.add('invalid');
                __snPwd.focus();
                setTimeout(() => {
                    __snPwd.classList.remove('invalid');
                    __snCPwd.classList.remove('invalid');
                }, 1000);
            } else {
                if (__snM.value.match(_regx)) {
                    __nextBtn.innerHTML = _prld;
                    __snM.disabled = true;
                    __snPwd.disabled = true;
                    __snCPwd.disabled = true;
                    __nextBtn.disabled = true;
                    __snM.style.cursor = 'not-allowed';
                    __snPwd.style.cursor = 'not-allowed';
                    __snCPwd.style.cursor = 'not-allowed';
                    __nextBtn.style.cursor = 'not-allowed';
                    setTimeout(() => {
                        __nextBtn.innerHTML = _prevEl;
                        __snM.disabled = false;
                        __snPwd.disabled = false;
                        __snCPwd.disabled = false;
                        __nextBtn.disabled = false;
                        __snM.style.cursor = 'text';
                        __snPwd.style.cursor = 'text';
                        __snCPwd.style.cursor = 'text';
                        __nextBtn.style.cursor = 'pointer';
                        _savePhs1(
                            __snM.value,
                            __snPwd.value,
                            __snCPwd.value
                        ).then(() => {
                            _verify();
                        });
                    }, 500);
                    return true;
                } else {
                    __snM.classList.add('invalid');
                    __snM.focus();
                    err('Email not valid!', errorEl);
                    setTimeout(() => {
                        __snM.classList.remove('invalid');
                    }, 1000);
                    return false;
                }
            }
        } else {
            __snPwd.classList.add('invalid');
            __snCPwd.classList.add('invalid');
            __snPwd.focus();
            err('You need to set a password!', errorEl);
            setTimeout(() => {
                __snPwd.classList.remove('invalid');
                __snCPwd.classList.remove('invalid');
            }, 1000);
        }
        async function _savePhs1(_e, _p1, _p2) {
            lsDB.setItem('VBS_1', _e);
            lsDB.setItem('VBS_2', _p1);
            lsDB.setItem('VBS_3', _p2);
        }
    }
    function onkeyEnter() {
        __snM.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                __snPwd.focus();
            }
        });
        __snPwd.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                __snCPwd.focus();
            }
        });
        __snCPwd.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                validateInput();
            }
        });
    }
    function _verify() {
        let captcha = `
            <div class="cap-sec" id="cap_sec">
                <div class="wrapper" id="cap-sec-wrapper">
                    <div class="cred-cont middle-ware" id="middle-ware">
                        <div class="wrapper">
                            <div class="title-con">
                                <span class="title">Hold up!</span>
                                <span class="hr"></span>
                                <span class="text">Let verify whether you are not robot, this won’t take long.</span>
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
                            <span class="error-msg hide cap-err-msg">
                                <span class="msg err-msg cap-err-msg-h" id="msg">
                                </span>
                            </span>
                            <button class="button verify-btn cap-v-btn">Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        root.insertAdjacentHTML('beforeend', captcha);

        let _capH = document.querySelector('.cap-h'), 
            _capRf = document.querySelector('.cap-rf'), 
            _capin = document.querySelector('.cap-in'),
            _capWrapper = document.querySelector('.middle-ware'), 
            _capErrMsg = document.querySelector('.cap-err-msg'), 
            _capVBtn = document.querySelector('.cap-v-btn'),
            // _capPrldSec = document.querySelector('._preload_sec'),
            __capSec = document.querySelector('.cap-sec');

        _capin.focus();
        _capin.value = '';
        utilities.createCaptcha(_capH);

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

        events.esc(__capSec);
        events.outClick(__capSec, 'cap-sec-wrapper');
        _rfCap();
        _vlCap();

        function _rfCap() {
            _capRf
                .addEventListener('click', () => {
                    setTimeout(() => {
                        utilities.createCaptcha(_capH);
                    }, 300);
                });
        }
        function _vlCap() {
            _capVBtn.addEventListener('click', () => {
                utilities.validateCaptcha(_capin, _capErrMsg, _ac, _capH);
            });
            _capin.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    utilities.validateCaptcha(_capin, _capErrMsg, _ac, _capH);
                }
            });
            function _ac() {
                _capVBtn.innerHTML = ` <span class="preload">
                    <img src="../src/assets/spinner-2.svg" alt="">
                </span>`
                _capVBtn.innerText = 'SUCCESS!';
                if(__capSec != null){
                    __capSec.remove();
                }
                $('#spinnerx').addClass('show');
                _unload();
                _cusr();
            }
        }
        function _cusr() {
            _preload();
            const _m = lsDB.getItem('VBS_1'), 
                _psw = lsDB.getItem('VBS_2');
            const _id = utilities.genID().toString();
            console.log(_id);

            auth
            .createUserWithEmailAndPassword(_m, _psw)
            .then((_cred_) => {
                let _uid = _cred_.user.uid,
                    status = _cred_.user.isAnonymous;
                    let _type = status === false ? 'user' : 'anonymous'
                console.log(_uid, _type);
                save_usr(_id, _uid, _type);
            }).catch((error) => {
                _unload();
                console.log(error);
                $('#spinnerx').removeClass('show');
                if(__capSec != null){
                    __capSec.remove();
                }
                const __errcode__ = error.code;
                err(error.message, errorEl);
            });
        }
        function save_usr(id, uid, type){
            let default_color = utilities.genColor();
            _fsDb.collection('client')
            .doc('meta')
            .collection(id)
            .doc('meta')
            .set(
                {
                    id: id,
                    uid: uid,
                    state: 'setup',
                    user_type: type,
                    user_id: utilities.genUserId(),
                    default_color: default_color,
                }
            ).then(() => {
                console.log('user saved..');
                _fsDb.collection('client')
                .doc('meta_index')
                .collection(uid)
                .doc('meta_index')
                .set(
                    {
                        uid: uid,
                        id: id
                    }
                ).then(() => {
                    // lsDB.clear();
                    lsDB.setItem('default_color', default_color);
                    console.log('saved index...')
                    setTimeout(() => {
                        location.reload();
                    }, 100)
                }).catch(error => {
                    console.log(error);
                })
            }).catch((err) => {
                console.log(err)
                // lsDB.clear();
                setTimeout(() => {
                    location.reload();
                }, 100)
            })
        }
        function _preload(){
            _capVBtn.innerHTML = _prld;
            _capRf.disabled = true;
            _capin.disabled = true;
            _capVBtn.disabled = true;
            _capVBtn.style.cursor = 'not-allowed';
            _capRf.style.cursor = 'not-allowed';
            _capin.style.cursor = 'not-allowed';
        }
        function _unload(){
            _capVBtn.innerHTML = 'Verify';
            _capRf.disabled = false;
            _capin.disabled = false;
            _capVBtn.disabled = false;
            _capVBtn.style.cursor = 'pointer';
            _capRf.style.cursor = 'pointer';
            _capin.style.cursor = 'text';
            _capin.value = '';
            utilities.createCaptcha(_capH);
        }
    }
    onkeyEnter();
    _loginBtn.addEventListener('click', (e)=> {
        e.preventDefault();
        location.href = '../pages/login.html'
    });

    function err(msg, el){
        el.classList.remove('hide');
        el.classList.add('show');
        el.querySelector('.msg').innerText = msg;

        setTimeout(() => {
            el.classList.remove('show');
            el.classList.add('hide');
        }, 5000);
    };

    (function(){
        auth.onAuthStateChanged( async __usr__ => {
            if(__usr__){
                console.log('Logged in as', __usr__.uid);
                
                const meta_data = await getMeta(__usr__.uid);
                console.log('meta', __usr__.uid, meta_data);
                lsDB.setItem('deamon', meta_data[1]);
                const state = meta_data[0];

                if(state != 'null'){
                    console.log('user registered with ', state);
                    if (state === "setup") {
                        console.log("rewinding setup ..");
                        location.href = '/pages/setup.html';
                    } else if (state === "cancel") {
                        location.href = "/pages/login.html";
                    } else if (state === "user") {
                        location.href = "/index.html";
                    }
                }
            }else{
                $('#progress').removeClass('load');
                $('#progress').addClass('loaded');
                setTimeout(() => {
                    hide_preloader();
                }, 2000)
                console.log('not registered yet as a user');
            }
        })
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

        function hide_preloader(){
            $('#spinnerx').removeClass('load');
            if($('#spinnerx').length > 0){
                $('#spinnerx').removeClass('show');
            }
        }
    }())
}())