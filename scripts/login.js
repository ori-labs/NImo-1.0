'use-strict'
import utilities from "../components/utilities/utilities.js";
import config from "../components/lib/sanMoji/js/config.js";

(function(){
    console.log('%cSESSION: login', 'color: #d34b43');
    firebase.initializeApp({
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck
    })
    
    let  lsDB = localStorage,
        _opSec = document.getElementById('_opSec');
    let auth = firebase.auth(),
        _fsDb = firebase.firestore();

    function login(){
        const _prld = `
            <span class="preload">
                <img src="../src/assets/spinner-2.svg" alt="">
            </span>
        `
        let _createAcBtn = document.querySelector('._create-account'),
            _lgM = document.querySelector('#_lg-email'),
            _lgPwd = document.querySelector('#_lg-pwd'),
            _lgBtn = document.querySelector('#_lg-btn'),
            _lgErr = document.querySelector('#_lg-err'),
            _passResetBtn = document.getElementById('pass-reset-btn');

        (function(){
            _createAcBtn.addEventListener('click', (e)=> {
                e.preventDefault();
                location.href = '../pages/create-account.html'
            });
            _passResetBtn.addEventListener('click', () => {
                location.href = '../pages/password-reset.html'
            });
            _lgBtn.addEventListener('click', () => {
                onlogin();
            });

            _lgM.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    _lgPwd.focus();
                }
            });
            _lgPwd.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    onlogin();
                }
            });
           
        }())

        function onlogin(){
            validate();
        }

        function validate(){
            if(_lgM.value == ''){
                err('Email field is required!', _lgErr);
                _lgM.classList.add('invalid');
                _lgM.classList.add('invalid');
                _lgM.focus();
                setTimeout(() => {
                    _lgM.classList.remove('invalid');
                    _lgM.classList.remove('invalid');
                }, 1000);
            }else if(_lgPwd.value == ''){
                err('Password field is required!', _lgErr);
                _lgPwd.classList.add('invalid');
                _lgPwd.classList.add('invalid');
                _lgPwd.focus();
                setTimeout(() => {
                    _lgPwd.classList.remove('invalid');
                    _lgPwd.classList.remove('invalid');
                }, 1000);
            }else{
                _lgBtn.innerHTML = _prld;
                login(_lgM.value, _lgPwd.value);
            }
        }

        function login(__email__, __pwd__){
            auth.signInWithEmailAndPassword(__email__,__pwd__)
            .then((_cred_) => {
                $('#spinnerx').addClass('show');
                setTimeout(() => {
                    location.reload();
                }, 100)
            }).catch(error => {
                const code = error.code;
                _lgBtn.innerHTML = 'Login'
                err(code == 'auth/user-not-found' ? 'User not found' : code == 'auth/wrong-password' ? 'Wrong email or password' : 'User not found', _lgErr);
            })
        }
    }
    function signup(){
        document.querySelector('._create_account').style.display = 'flex';
        document.querySelector('._login').style.display = 'none';
        document.querySelector('.welcome').style.display = 'flex';
        document.querySelector('.welcome').innerText = 'Create an account';
        document.title = 'Nimo - Create account';
        
        const _prld = `
            <span class="preload">
                <img src="src/assets/spinner-2.svg" alt="">
            </span>
        `, 
        _prevEl = `
            <span>next</span>
            <img src="src/icons/arrow-right.svg" alt="">
        `;

        let _loginBtn = document.querySelector('._login-btn'),
            __snM = document.getElementById('sn-email'),
            __snPwd = document.getElementById('sn-pwd'), 
            __snCPwd = document.getElementById('sn-c-pwd'), 
            __snPhs1Btn = document.getElementById('phs-1-btn'), 
            __snPlcH = document.querySelector('._phs1-err');

        const _regx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        __snPhs1Btn.addEventListener('click', () => {
            validateInput();
        });
        function validateInput() {
            if (__snM.value === '') {
                __snM.classList.add('invalid');
                __snM.focus();
                err('Email field is required!', __snPlcH);
                setTimeout(() => {
                    __snM.classList.remove('invalid');
                }, 1000);
            }
            else if (__snPwd.value != '' && __snCPwd.value != '') {
                if (__snPwd.value != __snCPwd.value) {
                    err('Passwords do not match!', __snPlcH);
                    __snPwd.classList.add('invalid');
                    __snCPwd.classList.add('invalid');
                    __snPwd.focus();
                    setTimeout(() => {
                        __snPwd.classList.remove('invalid');
                        __snCPwd.classList.remove('invalid');
                    }, 1000);
                } else {
                    if (__snM.value.match(_regx)) {
                        __snPhs1Btn.innerHTML = _prld;
                        __snM.disabled = true;
                        __snPwd.disabled = true;
                        __snCPwd.disabled = true;
                        __snPhs1Btn.disabled = true;
                        __snM.style.cursor = 'not-allowed';
                        __snPwd.style.cursor = 'not-allowed';
                        __snCPwd.style.cursor = 'not-allowed';
                        __snPhs1Btn.style.cursor = 'not-allowed';
                        setTimeout(() => {
                            __snPhs1Btn.innerHTML = _prevEl;
                            __snM.disabled = false;
                            __snPwd.disabled = false;
                            __snCPwd.disabled = false;
                            __snPhs1Btn.disabled = false;
                            __snM.style.cursor = 'text';
                            __snPwd.style.cursor = 'text';
                            __snCPwd.style.cursor = 'text';
                            __snPhs1Btn.style.cursor = 'pointer';
                            _savePhs1(
                                __snM.value,
                                __snPwd.value,
                                __snCPwd.value
                            ).then(() => {
                                _verify();
                            });
                        }, 3000);
                        return true;
                    } else {
                        __snM.classList.add('invalid');
                        __snM.focus();
                        err('Email not valid!', __snPlcH);
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
                err('You need to set a password!', __snPlcH);
                setTimeout(() => {
                    __snPwd.classList.remove('invalid');
                    __snCPwd.classList.remove('invalid');
                }, 1000);
            }
            async function _savePhs1(_e, _p1, _p2) {
                _lstrg.setItem('VBS_1', _e);
                _lstrg.setItem('VBS_2', _p1);
                _lstrg.setItem('VBS_3', _p2);
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
            let capsec = `
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
                                            <img src="src/icons/refresh.svg" alt="">
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
            _opSec.insertAdjacentHTML('beforeend', capsec);

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
                            el.style.display = 'none'
                        }
                    };
                },
                outClick: (el, id) => {
                    document.addEventListener("mouseup", function(event) {
                        let obj = document.getElementById(id);
                        if(obj != null){
                            if (!obj.contains(event.target)) {
                                el.style.display = 'none'
                            }
                        }
                    });
                }
            }

            events.esc(__capSec);
            events.outClick('cap-sec-wrapper');
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
                    utilities.validateCaptcha(_capin, _capErrMsg, _ac);
                });
                _capin.addEventListener('keyup', (evt) => {
                    if (evt.key === 'Enter' || evt.keyCode === 13) {
                        utilities.validateCaptcha(_capin, _capErrMsg, _ac);
                    }
                });
                function _ac() {
                    _capVBtn.innerHTML = ` <span class="preload">
                        <img src="src/assets/spinner-2.svg" alt="">
                    </span>`
                    setTimeout(() => {
                        _capVBtn.innerText = 'SUCCESS!';
                        _capin.value = '';
                        _rfCap();
                        setTimeout(() => {
                            $('#spinnerx').addClass('show');
                            _unload();
                            _cusr();
                        }, 700)
                    }, 1300)
                }
            }
            function _cusr() {
                _preload();
                const _m = _lstrg.getItem('VBS_1'), 
                    _psw = _lstrg.getItem('VBS_2');
                    console.log(_m);
                auth.createUserWithEmailAndPassword(_m, _psw)
                    .then((_cred_) => {
                        let _uid = _cred_.user.uid,
                            status = _cred_.user.isAnonymous;
                            let _type = status === false ? 'user' : 'anonymous'
                        console.log(_uid, _type);
                        _svUsr(_uid, _type);
                    }).catch((error) => {
                        _unload();
                        $('#spinnerx').removeClass('show');
                        if(__capSec != null){
                            __capSec.remove();
                        }
                        const __errcode__ = error.code;
                        err(error.message, __snPlcH);
                    });
            }
            function _svUsr(__uid__, type){
                _fsDb.collection('client')
                .doc(__uid__)
                .collection(__uid__)
                .doc('meta')
                .set(
                    {
                        uid: __uid__,
                        state: 'setup'+type
                    }
                ).then(() => {
                    _lstrg.removeItem('VBS_1');
                    _lstrg.removeItem('VBS_2');
                    _lstrg.removeItem('VBS_3');
                    location.reload();
                }).catch((err) => {
                    console.log(err)
                    setTimeout(() => {
                        location.reload();
                    }, 1000)
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
        setTimeout(() => {
            _loginBtn.addEventListener('click', (e)=> {
                e.preventDefault();
                worker._sn._phs0();
            })
        }, 1)
    }
    function err(msg, el){
        el.classList.remove('hide');
        el.classList.add('show');
        el.querySelector('.msg').innerText = msg;

        setTimeout(() => {
            el.classList.remove('show');
            el.classList.add('hide');
        }, 5000);
    }
    login();

    (function(){
        auth.onAuthStateChanged( async __usr__ => {
            if(__usr__){
                console.log('Logged in as', __usr__.uid);

                const meta_data = await getMeta(__usr__.uid);
                const state = meta_data[0];

                if(state != 'null'){
                    console.log('user registered with ', state)
                    switch(state){
                        case 'setup':
                            console.log('rerolling user setup..')
                            location.href = `./pages/setup.html?uid=${__usr__.uid}`;
                        case 'user':
                            lsDB.clear();
                            location.href = './index.html';
                        case 'cancel':
                            console.log('%cState: Canceled', 'color: #44321d')
                        default:
                            console.log('%cState: Default', 'color: #4d221d')
                    }
                }else{
                    console.log('user not registered yet');
                }
            }else{
                console.log('not registered yet');
                $('#progress').removeClass('load');
                $('#progress').addClass('loaded');
                setTimeout(() => {
                    hide_preloader();
                }, 2000)
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
    }());
    function hide_preloader(){
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
    }
    function log(msg){
        console.log(msg);
    }
}())
