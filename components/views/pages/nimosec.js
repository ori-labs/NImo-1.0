// import sanCaptcha from "./components/lib/sanMoji/js/san-captcha.js";
import utilities from "../../utilities/utilities.js";

const nimo_sec = {
    render: async () => {
        let view = `
            <div class="_auth _sec" id="_opSec">     
            </div>
        `
        return view;
    },
    login: async () => {
        let view = `
            <div class="wrapper">
                <div class="logo-wrapper">
                    <span class="logo">
                        <img src="src/logo/nimo.svg" alt="NIMO" srcset="">
                    </span>
                    <span class="welcome"></span>
                </div>

                <div class="cred-cont _lg-view _login">
                    <div class="wrapper">
                        <div class="inputs">
                            <input type="email" name="email" id="_lg-email" placeholder="Email" required="">
                            <input type="password" name="pwd" id="_lg-pwd" placeholder="Password" required="">
                        </div>
                        <button class="btn" type="submit" id="_lg-btn">login</button>
                        <span class="forgot-password-btn" id="pass-reset-btn">Forgot your password?</span>
                        <span class="hr"></span>
                        <div class="login-provider-cont">
                            <button class="btn google google-auth">
                                <img src="src/icons/google.svg" alt="">
                                <span>Google</span>
                            </button>
                            <button class="btn github github-auth">
                                <img src="src/icons/github.svg" alt="">
                                <span>Github</span>
                            </button>
                        </div>
                        <span class="error-msg _lgErr hide" id="_lg-err">
                            <span class="msg ph1-err-msg">
                            </span>
                        </span>
                    </div>
                    <span class="switch-action signup-switch">
                        Don’t have an account? <u class="_create-account">create one</u>
                    </span>
                </div>

                <div class="cred-cont _sn-view phase-1 _create_account">
                    <div class="wrapper">
                        <div class="inputs">
                            <input type="email" class="" name="email" id="sn-email" autofocus placeholder="Email" required="">
                    
                            <span class="hr"></span>
                            <input type="password" name="pwd" id="sn-pwd" autofocus placeholder="Enter password" required="">
                            <input type="password" name="c-pwd" id="sn-c-pwd" autofocus placeholder="Confirm" required="">
                            <span class="error-msg _phs1-err hide">
                                <span class="msg ph1-err-msg">
                                </span>
                            </span>
                        </div>
                        <button class="btn" type="submit" id="phs-1-btn">
                            <span>next</span>
                            <img src="src/icons/arrow-right.svg" alt="">
                        </button>
                    </div>
                    <span class="switch-action login-switch">
                        Have an account? <u class="_login-btn">login</u>
                    </span>
                </div>
            </div>`
        return view;
    },
    setup: async () => {
        let view = `
            <div class="wrapper">
                <div class="cred-cont phase-2 _setup">
                    <div class="wrapper">
                        <div class="banner">
                            <div class="banner-layer _banner_" style="background-color:${utilities.genColor()}"></div>
                            <span class="banner-picker _color-picker_" id="banner-picker">
                                <img src="src/icons/picker.svg" alt="">
                            </span>
                        </div>
                        <div class="profile-cont">
                            <div class="pfp-cont">
                                <span class="pfp _pfp_" style="background-color:${utilities.genColor()}">
                                    <span class="progress hide" id="_prog"></span>
                                </span>
                                <label for="_pfp-file_" class="pfp-picker _pfp-picker_" id="pfp-picker" >
                                    <img src="src/icons/editor.svg" alt="">
                                </label>
                                <input type="file" accept="image/*" name="" id="_pfp-file_" hidden>
                            </div>
                            <div class="username-cont">
                                <input type="text" name="usrname" id="set-user-name" autofocus placeholder="Username" required="">
                                <span class="usrid" id="_id_">#404</span>
                            </div>
                        </div>
                        <span class="hr"></span>
                        <div class="about-cont">
                            <span class="title">About</span>
                            <textarea name="about" id="_set-about" cols="30" rows="10" placeholder="Optional"></textarea>
                            <span class="tl">0/120</span>
                        </div>
                        <div class="layer hide"></div>
                    </div>
                    <span class="error-msg hide _set-Err">
                        <span class="msg err-msg">
                        </span>
                    </span>

                    <div class="bottom-btn">
                        <div class="btn-cont">
                            <button class="btn setup-bc-btn" type="submit" id="setup-bc-btn">
                                <span>Skip setup</span>
                            </button>
                            <button class="btn" type="submit" id="setup-fin-btn">
                                <span>Finish</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
        return view;
    },
    pass_reset: async () => {
        let view = `
            <div class="wrapper">
                <div class="cred-cont">
                    <div class="wrapper">
                        <span class="pass_reset_spinner" id="psr_spinner">
                            <img src="src/assets/spinner-1.svg" alt="loading..."/>
                        </span>
                        <div class="success-cont" id="success-cont">
                            <img src="/src/icons/email.svg" />
                            <span  class="succ-msg">
                            </span>
                            <span class="login-page-back-btn o-btn" id="btlgp_btn">[ Back to Login page ]</span>
                        </div>
                        <div class="psr_input-cont" id="psr_input_cont">
                            <span style="color:#ffff;opacity:.6;text-align:center"><b style="color:red">*</b> Please enter your registered email to receive reset link.</span>
                            <div class="inputs">
                                <input type="email" name="email" id="_rs-email" placeholder="Email" required="">
                            </div>
                            <button class="btn" type="submit" id="_gen_pass_btn">Get Reset Link</button>
                            <span class="login-page-back-btn o-btn" id="btlgp_btn">[ Back to Login page ]</span>
                            <span class="error-msg _lgErr hide" id="_psr-err">
                                <span class="msg ph1-err-msg">
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `
        return view;
    },

    after_render: async () => {
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
    },
    login_after_render: async () => {
        let  lsDB = localStorage,
            _opSec = document.getElementById('_opSec');

        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
        let auth = firebase.auth(),
            _fsDb = firebase.firestore();

        function login(){
            const _prld = `
                <span class="preload">
                    <img src="src/assets/spinner-2.svg" alt="">
                </span>
            `
            let _createAcBtn = document.querySelector('._create-account'),
                _lgM = document.querySelector('#_lg-email'),
                _lgPwd = document.querySelector('#_lg-pwd'),
                _lgBtn = document.querySelector('#_lg-btn'),
                _lgErr = document.querySelector('#_lg-err'),
                _passResetBtn = document.getElementById('pass-reset-btn');

            document.title = 'Nimo - User Login'
            document.querySelector('._login').style.display = 'flex';
            document.querySelector('._create_account').style.display = 'none';
            document.querySelector('.welcome').style.display = 'flex';
            document.querySelector('.welcome').innerText = 'HI there, welcome!';

            (function(){
                _createAcBtn.addEventListener('click', (e)=> {
                    e.preventDefault();
                    signup();
                })
                _lgBtn.addEventListener('click', () => {
                    onlogin();
                })
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
                _passResetBtn.addEventListener('click', () => {
                    window.location.hash = '/nimo-sec#pass_reset'
                })
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
    },
    setup_after_render: async () => {
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
        (function(){
            
        }());
        function err(msg, el){
            el.classList.remove('hide');
            el.classList.add('show');
            el.querySelector('.msg').innerText = msg;

            setTimeout(() => {
                el.classList.remove('show');
                el.classList.add('hide');
            }, 5000);
        }
    },
    pass_reset_after_render: async () => {
        let auth = firebase.auth(),
            _fsDb = firebase.firestore();
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
        const _prld = `
                    <span class="preload">
                        <img src="src/assets/spinner-2.svg" alt="">
                    </span>
                `
        setTimeout(() => {
            document.getElementById('psr_spinner').style.display = 'none';
            document.getElementById('psr_input_cont').style.display = 'flex';
        }, 1200);

        (function(){
            let _genResBtn = document.getElementById('_gen_pass_btn'),
                _rsEmailInput = document.getElementById('_rs-email'),
                _psrErr = document.querySelector('#_psr-err'),
                _btlgpBtn = document.querySelectorAll('#btlgp_btn');

            _genResBtn.addEventListener('click', () => {
                onResetGen();
            })
            _rsEmailInput.addEventListener('keyup', (evt) => {
                if (evt.key === 'Enter' || evt.keyCode === 13) {
                    onResetGen();
                }
            });
            _btlgpBtn.forEach(el => {
                el.addEventListener('click', () => {
                    history.back();
                })
            })

            function onResetGen(){
                if(_rsEmailInput.value == ''){
                    err('Email field is required!', _psrErr);
                    _rsEmailInput.classList.add('invalid');
                    _rsEmailInput.classList.add('invalid');
                    _rsEmailInput.focus();
                    setTimeout(() => {
                        _rsEmailInput.classList.remove('invalid');
                        _rsEmailInput.classList.remove('invalid');
                    }, 1000);
                }else{
                    _genResBtn.innerHTML = _prld;
                    sendResetLink(_rsEmailInput.value);
                }
            }
            function sendResetLink(_email_){
                console.log('resetting password');
                auth.sendPasswordResetEmail(_email_)
                .then((_cred_) => {
                    document.getElementById('success-cont').style.display = 'flex';
                    document.getElementById('psr_input_cont').style.display = 'none';
                    document.querySelector('.succ-msg').innerHTML = `Your password reset link has been sent to <b>${_email_}</b>`
                }).catch((er) => {
                    console.log(er)
                    const code = er.code;
                    err(code == 'auth/user-not-found'?'There is no user record corresponding to this identifier. The user may have been deleted.':code=='auth/invalid-email'?'The email address is badly formatted.':'Something went wrong, try again later.', _psrErr)
                    _genResBtn.innerHTML = 'Get Reset Link';
                })
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
        }())
    }
}
export default nimo_sec;