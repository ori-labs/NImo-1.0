'use-strict'
import core from "../components/core/core.js";
import utilities from "../components/utilities/utilities.js";

(function(){
    core.config_core();
    core.manage_state(
        '/pages/setup#user',
        '/',
        '/pages/login#index',
        'login'
    )
    let auth = firebase.auth();

    on_login();
    
    function on_login(){
        const preloader = `
            <span class="preload">
                <img src="../src/assets/spinner-2.svg" alt="">
            </span>
        `
        let c_btn = document.querySelector('.c_btn'),
            lg_e = document.querySelector('#lg_e'),
            lg_pwd = document.querySelector('#lg_pwd'),
            lg_btn = document.querySelector('#lg_btn'),
            lg_error = document.querySelector('#err_cont'),
            pass_reset_btn = document.getElementById('pass-reset-btn');

        c_btn.addEventListener('click', (e)=> {
            e.preventDefault();
            location.href = '../create-account'
        });
        pass_reset_btn.addEventListener('click', () => {
            location.href = '../pages/password-reset.html'
        });
        lg_btn.addEventListener('click', () => {
           validate();
        });

        lg_e.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                lg_pwd.focus();
            }
        });
        lg_pwd.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                validate();
            }
        });

        function validate(){
            let is_valid = false;
            utilities.simple_error(lg_e.value == '' ? 'Email is required!' : lg_pwd.value == '' ? 'Password is required!' : 'Loging in ...', lg_error)
            is_valid = lg_e.value == '' ? false : lg_pwd.value == '' ? false : true;

            if(is_valid){
                login(lg_e.value, lg_pwd.value);
                lg_btn.innerHTML = preloader;
                lg_error.classList.add('hide');
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
                lg_btn.innerHTML = 'Login'
                utilities.simple_error(code == 'auth/user-not-found' ? 'User not found' : code == 'auth/wrong-password' ? 'Wrong email or password' : 'User not found', lg_error);
            })
        }
    };
}())
