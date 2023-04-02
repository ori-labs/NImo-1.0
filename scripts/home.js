'use-strict';
import config from "../components/lib/sanMoji/js/config.js";
import utilities from "../components/utilities/utilities.js";
import Router from "../components/services/router/router.js";


(function(){
    location.hash = '#app';
    console.log('%cSESSION: Home', 'color: #d71b43');
    firebase.initializeApp({
        apiKey: config._napi,
        authDomain: config._ndomain,
        projectId: config._pid,
        appId: config._aid,
        storageBucket: config._stBck
    })
    
    let  lsDB = localStorage;

    let auth = firebase.auth(),
        _fsDb = firebase.firestore();

    let root = document.getElementById('root');

    const router = new Router({
        mode: 'hash',
        root: '/'
    });

    function init(){
        (function(uid){
            let id0,
                user0;

            let vault_btn = document.getElementById('vault-btn'),
                notification_btn = document.getElementById('notification-btn');

            _fsDb.collection('/client').doc('meta').collection(uid).doc('meta_data').get()
            .then((sn) => {
                $('#spinnerx').removeClass('load');
                if($('#spinnerx').length > 0){
                    $('#spinnerx').removeClass('show');
                }
                const data = sn.data();
                id0 = data.id;
                user0 = data.user;
                document.querySelector('.h-usr-name').innerHTML = `${data.user}`;
                document.querySelector('#uid').innerHTML = `@${data.id}`;
                document.querySelector('.h-prof-img').style.backgroundImage = `url(${data.userProfileAvatar == 'default' ? '../src/imgs/avatar.png' : data.userProfileAvatar})`;
                document.querySelector('.h-prof-img').style.backgroundColor = `${data.userProfileBackDrop}`;

                lsDB.setItem('cache', [data.user, data.userProfileAvatar || null, data.userProfileBackDrop])
                lsDB.setItem('client', data.user);
            }).catch((err) => {
                console.log('something went wrong', err);
                location.reload();
            });
            document.querySelector('[data-user-container]').addEventListener('click', () => {
                console.log(id0);
                navigator.clipboard.writeText(`${user0}@${id0}`)
                .then(() => {
                    utilities.popup('User id copied successfully!', root);
                })
                .catch((err) => {
                    console.error('%cNode error', 'color: #1299dc');
                });
            });
            vault_btn.addEventListener('click', ()=> {
                location.hash = '#?vault'
            });

            (function(){
                listen_to_request();

                function listen_to_request(){
                    vault_btn.innerHTML = `<span>
                                            <img class="frnd" src="../src/icons/friends.svg" alt="">
                                        </span>`
                    _fsDb.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming').onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            let bagde_card = `
                                <span class="bagde vault-bagde scale-up-center" id="vault-bagde">${sn.size}</span>
                            `;
                            vault_btn.insertAdjacentHTML('beforeend', bagde_card);
                            let vault_bagde = document.getElementById('vault-bagde');

                            if(sn.size <= 0){
                                vault_btn.innerHTML = `<span>
                                    <img class="frnd" src="../src/icons/friends.svg" alt="">
                                </span>`
                            }
                        })
                    })
                }
            }());
        }(lsDB.getItem('id')));
        (function(uid){
            let get_friends = async () => {
                let dfCard = `
                    <div class="NOF">
                        <img src="/src/assets/nof.svg" />
                        <span class="nof-title">It's quiet for now!</span>
                        <span class="hr"></span>
                        <span class="nof-sub">Add friends to start chatting!</span>
                        <button class="nof-btn" id="add-friend">Add friend</button>
                    </div>`;
                let friend_list_cont = document.getElementById('f_list'),
                    spmc = 0;
                firebase.firestore().collection('/client').doc(uid).collection(uid).doc('chats').collection('node')
                .get().then((sn) => {
                    if(sn.docs.length > 0) {
                        let _dId = 0;
                        sn.forEach((s) => {
                            const dataVal = s.data();
                            let _CID = dataVal.cId,
                                _FID = dataVal.fId;
                            renderFnd(_FID, _CID);
                        })
                    }else{
                        friend_list_cont.innerHTML = dfCard;
                        let add_friend_btn = document.getElementById('add-friend');

                        add_friend_btn.addEventListener('click', function(e){
                            e.preventDefault();
                            console.log('adding friend thingi');
                            location.hash = '#?addfriend';
                        })
                    }
                })

                function  renderFnd(fID, cID){
                    fListCont.innerHTML = '';
                    _fsDb.collection('/client').doc(fID).collection(fID)
                    .doc('udata').get().then((sn) => {
                        const _dval = sn.data();
                        let fCard = `
                            <div class="friend-card" id="fid=${fID}">
                                <div class="friend-pfp-cont">
                                    <span class="f-pfp" style="background-image: url(${_dval.userProfileAvatar || '/src/imgs/avatar.svg'});background-color: ${_dval.userProfileBackDrop};"></span>
                                    <!-- <span class="bagde">9+</span> -->
                                </div>
                                <span class="f-uname">${_dval.user}</span>
                            </div>
                        `;
                        fListCont.insertAdjacentHTML('beforeend', fCard);
                        const f_btn = document.getElementById(`fid=${fID}`);
    
                        f_btn.addEventListener('click', (e)=> {
                            e.preventDefault();
                            console.log(fID, cID);
                            // window.location.hash = '/nimo-app#chats'
                            // lsDB.setItem('_fRay', _fID);
                            // lsDB.setItem('_fcRay', cID);
                        })
                        
                    })
                }
            };
            let get_rooms = async () => {
                console.log(utilities.genID())
            };

            get_friends();
            get_rooms();
        }(lsDB.getItem('id')));
    }
    (function(){
        initLag();
        auth.onAuthStateChanged( async __usr__ => {
            if(__usr__){
                const meta_data = await getMeta(__usr__.uid);

                lsDB.setItem('id', meta_data[1]);

                const state = meta_data[0];

                if(state != null){
                    if(state === 'setup'){
                        location.href = `/pages/setup.html?uid=${__usr__.uid}`;
                        console.log('rewinding setup ..')
                    }else if(state === 'cancel'){
                        location.href = '/pages/login.html';
                    }else if(state === 'user'){
                        console.log('%cUSER STATE : USER', 'color: #23e34d');
                        init();  
                    }
                }else{
                    console.log('state : '+state);
                    console.log('user not registered yet');
                }
            }else{
                console.log('not registered yet as a user');
                location.href = '/pages/login.html';
            }
        })
        async function getMeta(_usr_) {
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
    (function(){
        router
        .add('', async ()=>{
            let current_hash = location.hash;
            console.log(`%c${current_hash}`, 'color: #df3021');

            let main_hash = current_hash.split('?')[1];
            if(main_hash != 'addfriend'){
                let adf_container = document.getElementById('addfriend-cont');
                if(adf_container != null){
                    adf_container.remove();
                }
            }else{
                render_add_friend();
            }
            if(main_hash != 'vault'){
                let vault_container = document.getElementById('vault');
                if(vault_container != null){
                    vault_container.remove();
                }
                console.log('not vault')
            }else{
                render_vault();
            }
        })
    }());

    const evenListener = {
        listen: {
            esc: (el) => {
                if(el != null){
                    log('can go back');
                    document.onkeydown = function(evt) {
                        evt = evt || window.event;
                        let isEscape = false;
                        if ("key" in evt) {
                            isEscape = (evt.key === "Escape" || evt.key === "Esc");
                        } else {
                            isEscape = (evt.keyCode === 27);
                        }
                        if (isEscape) {
                            history.back();
                        }
                    };
                }else{
                    return;
                }
                
            },
            outClick: (id) => {
                document.addEventListener("mouseup", function(event) {
                    let obj = document.getElementById(id);
                    if(obj != null){
                        if (!obj.contains(event.target)) {
                            history.back();
                        }
                    }else{
                        return;
                    }
                });
            }
        },
    }
    const msgbox = {
        alert: (msg, iconEl, msgEl, parent, type) =>{
            msgEl.innerHTML = msg;
            parent.style.display = 'flex';
            if(type == 'error'){
                parent.classList.add('msg-box-error');
                parent.classList.remove('msg-box-success');
                iconEl.src = '../src/icons/info-white.svg';
            }else if(type == 'success'){
                parent.classList.add('msg-box-success');
                parent.classList.remove('msg-box-error');
                iconEl.src = '../src/icons/success-white.svg';
            }

            setTimeout(() => {
                parent.style.display = 'none';
            }, 3000)
        }
    }

    function render_add_friend(){
        let view = `
        <div class="addfriend-cont" id="addfriend-cont">
            <div class="wrapper scale-up-center" id="container-wrappper">
                <div class="header">
                    <span class="title">
                        <img src="/src/icons/add-freind.svg" alt="">
                        <span>Add friend</span>    
                    </span>
                    <span class="close-btn" id="adf-close-btn">
                        <img src="/src/icons/close-white.svg" alt="">
                    </span>
                </div>
                <div class="contents">
                    <span class="label">Add friends easily by entering their user id. <br> eg. sadie@123456789.</span>
                    <div class="input-cont">
                        <input type="text" name="id" id="input-fr" placeholder="sadie@123456789">
                        <span class="add-btn" id="send_btn">Send</span>
                    </div>
                </div>
                <div class="msg-box" id="msg-box">
                    <img src="" alt="" id="msg-box-icon">
                    <span class="msg" id="adf-msg"></span>
                </div>
            </div>
        </div>`;
        root.insertAdjacentHTML('beforeend', view);

        let container = document.getElementById('addfriend-cont'),
            close_btn = document.getElementById('adf-close-btn'),
            send_btn = document.getElementById('send_btn'),
            input = document.getElementById('input-fr');
        
        let msgbox_parent = document.getElementById('msg-box'),
            msgbox_msgEl = document.getElementById('adf-msg'),
            msgbox_icoonEl = document.getElementById('msg-box-icon');

        let value;
        
        input.oninput = function(e){
            e.preventDefault();
            value = this.value;
            log(value);
        };
        input.addEventListener('keyup', (evt) => {
            if (evt.key === 'Enter' || evt.keyCode === 13) {
                validate_request();
            }
        });
        send_btn.addEventListener('click', () => {
            validate_request();
        })
        close_btn.addEventListener('click', function(e){
            e.preventDefault();
            history.back();
        })
        evenListener.listen.esc(container);
        evenListener.listen.outClick('container-wrappper');
        
        function validate_request(){
            const regex = /^[a-zA-Z]+@[0-9]{9}$/;

            const _prld = `
                <span class="preload">
                    <img src="../src/assets/spinner-2.svg" alt="">
                </span>`;

            if(input.value != ''){
                log(input.value);
             
                (function(uid){
                    if(!regex.test(value)){
                        console.log('invalid username and ID');
                        msgbox.alert(
                            'Invalid or poorly formatted Username and ID!',
                            msgbox_icoonEl,
                            msgbox_msgEl,
                            msgbox_parent,
                            'error'
                        )
                    }else{
                        let user_id = input.value.split('@')[1];
                        log(user_id);
                        if(user_id == uid){
                            msgbox.alert(
                                'You cannot send yourself friend request!',
                                msgbox_icoonEl,
                                msgbox_msgEl,
                                msgbox_parent,
                                'error'
                            )
                        }else{
                            send_btn.innerHTML = _prld;
                            send_btn.disabled = true;
                            input.disabled = true;

                            _fsDb.collection("client")
                            .doc("meta")
                            .collection(user_id)
                            .limit(1)
                            .get()
                            .then((user) => {
                                console.log(user.size);
                                if(user.size <= 0){
                                    msgbox.alert(
                                        `Opps! No user with '${input.value}' was found!`,
                                        msgbox_icoonEl,
                                        msgbox_msgEl,
                                        msgbox_parent,
                                        'error'
                                    );
                                    reset();
                                }else{
                                    _fsDb.collection('client').doc('meta').collection(user_id).doc('requests')
                                    .collection('incoming').doc(user_id)
                                    .set({
                                        id: uid
                                    }).then(() => {
                                        _fsDb.collection('client').doc('meta').collection(uid).doc('requests')
                                        .collection('outgoing').doc(user_id)
                                        .set({
                                            id: user_id
                                        }).then(() => {
                                            log('request sent to'+user_id);
                                            msgbox.alert(
                                                `Request was send successfully!`,
                                                msgbox_icoonEl,
                                                msgbox_msgEl,
                                                msgbox_parent,
                                                'success'
                                            );
                                            reset();
                                        }).catch(error => {
                                            msgbox.alert(
                                                `Opps! Something went seriously wrong, try again later!`,
                                                msgbox_icoonEl,
                                                msgbox_msgEl,
                                                msgbox_parent,
                                                'error'
                                            );
                                            reset();
                                        })
                                    }).catch(error => {
                                        msgbox.alert(
                                            `Opps! Something went seriously wrong, try again later!`,
                                            msgbox_icoonEl,
                                            msgbox_msgEl,
                                            msgbox_parent,
                                            'error'
                                        );
                                        reset();
                                    })
                                }
                            }).catch(error => {
                                msgbox.alert(
                                    `Opps! Something went seriously wrong, try again later!`,
                                    msgbox_icoonEl,
                                    msgbox_msgEl,
                                    msgbox_parent,
                                    'error'
                                );
                                reset();
                            })
                            console.log('searching for valid match');
                        }
                    };
                }(lsDB.getItem('id')));
            }else{
                input.focus();
                msgbox.alert(
                    'Username and ID must be provided!',
                    msgbox_icoonEl,
                    msgbox_msgEl,
                    msgbox_parent,
                    'error'
                )
            }
        }
        function reset(){
            send_btn.disabled = false;
            send_btn.innerHTML = 'Send';
            input.value = '';
            input.disabled = false;
        }
    }
    function render_vault(){
        (function(uid){
            console.log('vault');
            let view = `
            <div class="vault" id="vault">
                <div class="wrapper scale-up-center" id="vault-container">
                    <div class="content-wrapper">
                        <div class="header">
                            <div class="btn-cont">
                                <div class="btn-wrapper">
                                    <span class="btn">Friends</span>
                                </div>
                                <div class="btn-wrapper active">
                                    <span class="btn">Requests</span>
                                    <span class="bagde">9+</span>
                                </div>
                            </div>
                            <div class="close-btn-cont">
                                <img src="/src/icons/close-white.svg" alt="">
                            </div>
                        </div>
                        <div class="container-wrapper friends hide">
                            <div class="friend-card">
                                <div class="card-wrapper">
                                    <div class="avatar-comp-cont">
                                        <div class="pfp-cont">
                                            <div class="pfp" style="background-image: url(https://i.ytimg.com/vi/A7IQPSPviNI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDJ_iM-rLgO7yuflacC4ys33r_jPg);">
                                            </div>
                                        </div>
                                        <div class="user-info-cont">
                                            <span class="username">Vanny</span>
                                            <span class="id">@000000000</span>
                                        </div>
                                    </div>
                                    <div class="btn-comp-cont">
                                        <span class="btn-item">
                                            <img src="/src/icons/msg.svg" alt="">
                                        </span>
                                        <span class="hr"></span>
                                        <span class="btn-item">
                                            <img src="/src/icons/remove-friend.svg" alt="">
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container-wrapper requests">
                            <div class="friend-card incoming">
                                <div class="identifier-cont">
                                    <span class="identifier">
                                        <img src="src/icons/incoming.svg" alt="">
                                        <span class="label">Incoming request</span>
                                    </span>
                                </div>
                                <div class="card-wrapper">
                                    <div class="avatar-comp-cont">
                                        <div class="pfp-cont">
                                            <div class="pfp" style="background-image: url(https://i.ytimg.com/vi/A7IQPSPviNI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDJ_iM-rLgO7yuflacC4ys33r_jPg);">
                                            </div>
                                        </div>
                                        <div class="user-info-cont">
                                            <span class="username">Vanny</span>
                                            <span class="id">Sunday 4 2023 @ 11:20pm</span>
                                        </div>
                                    </div>
                                    <div class="btn-comp-cont">
                                        <span class="btn-item btn btn-danger-normal">
                                            Decline
                                        </span>
                                        <span class="hr"></span>
                                        <span class="btn-item btn btn-primary">
                                            Accept
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="friend-card incoming">
                                <div class="identifier-cont">
                                    <span class="identifier">
                                        <img src="src/icons/outgoing.svg" alt="">
                                        <span class="label">Outgoing request</span>
                                    </span>
                                </div>
                                <div class="card-wrapper">
                                    <div class="avatar-comp-cont">
                                        <div class="pfp-cont">
                                            <div class="pfp" style="background-image: url(https://i.ytimg.com/vi/A7IQPSPviNI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDJ_iM-rLgO7yuflacC4ys33r_jPg);">
                                            </div>
                                        </div>
                                        <div class="user-info-cont">
                                            <span class="username">Vanny</span>
                                            <span class="id">Sunday 4 2023 @ 11:20pm</span>
                                        </div>
                                    </div>
                                    <div class="btn-comp-cont">
                                        <span class="btn-item btn btn-danger-normal">
                                            Cancel
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            root.insertAdjacentHTML('beforeend', view);
            
            let vault_container = document.getElementById('vault');

            evenListener.listen.esc(vault_container);
            evenListener.listen.outClick('vault-container');
        }(lsDB.getItem('id')))
    }
    function initLag(){
        setTimeout(() => {
            setTimeout(()=> {
                $('#progress').addClass('reveal');
            }, 500)
            setTimeout(()=> {
                $('#progress').addClass('load');
            }, 1500)
        });
        window.oncontextmenu = function() {
            return false;
        }
        lsDB.clear();
    }
    function hide_preloader(){
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
    }
    function log(text){
        return console.log(text);
    }
}());