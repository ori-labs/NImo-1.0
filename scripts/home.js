'use-strict';
import config from "../components/lib/sanMoji/js/config.js";
import utilities from "../components/utilities/utilities.js";
import Router from "../components/services/router/router.js";


(function(){
    // location.hash = '#?app';
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
        fsDB = firebase.firestore();

    let root = document.getElementById('root'),
        croppie_wrapper = document.querySelector("[data-c-wrapper]");

    const router = new Router({
        mode: 'hash',
        root: '/'
    });

    let croppie = new Croppie(croppie_wrapper, {
        viewport: { width: 250, height: 250, type: "circle" },
        showZoomer: false,
        enableOrientation: true,
    });

    function init(){
        (function(uid){
            let id0,
                user0;

            let vault_btn = document.getElementById('vault-btn'),
                notification_btn = document.getElementById('notification-btn'),
                new_room_btn = document.getElementById('new-room-btn'),
                explore_rooms_btn = document.getElementById('explore-rooms');

            fsDB.collection('client').doc('meta').collection(uid).doc('meta_data').get()
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
                document.querySelector('.h-prof-img').style.backgroundImage = `url(${data.userProfileAvatar === 'default' ? '../src/imgs/avatar.png' : data.userProfileAvatar})`;
                document.querySelector('.h-prof-img').style.backgroundColor = `${data.userProfileBackDrop}`;

                lsDB.setItem('cache', [data.user, data.userProfileAvatar || null, data.userProfileBackDrop])
                lsDB.setItem('client', data.user);
                lsDB.setItem('clientAvata', data.userProfileAvatar);

                update_friends_and_rooms();
                get_profile_data();

                function get_profile_data(){
                    let profile_card = `
                        <div class="profile-card hide fade-in" id="profile-card">
                            <div class="wrapper">
                                <div class="banner-prof-cont">
                                    <div class="banner" style="background-color: ${data.bannerColor}"></div>
                                    <div class="profile-cont">
                                        <span class="profile-holder" style="background-image:url('${data.userProfileAvatar == 'default' ? './src/imgs/avatar.png' : data.userProfileAvatar}')"></span>
                                    </div>
                                </div>
                                <div class="u-id-cont">
                                    <div class="wrapper">
                                        <span class="uname">${data.user}</span>
                                        <span class="uid id">@${data.id}</span>
                                    </div>
                                </div>
                                <div class="hr-wrapper">
                                    <span class="hr-1">
                                        <hr class="hr">
                                    </span>
                                </div>
                                <div class="bio-cont" style="display: ${data.about == '' ? 'none' : 'flex'}">
                                    <div class="bio-cont-wrapper">
                                        <span class="label">Bio</span>
                                        <div class="bio-wrapper">
                                            <div class="context-wrapper">
                                                <span class="bio-context">${data.about}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn-cont">
                                    <div class="btn-cont-wrapper">
                                        <div class="cont">
                                            <div class="btn-item profile-setting">
                                                <img src="./src/icons/profile.svg" alt="">
                                                <span class="label">Edit profile</span>
                                            </div>
                                            <hr class="hr">
                                            <div class="btn-item profile-setting">
                                                <img src="./src/icons/settings.svg" alt="">
                                                <span class="label">Settings</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    root.insertAdjacentHTML('beforeend', profile_card);

                    let toggle = document.getElementById('profile-toggle'),
                        profile_card_container = document.getElementById('profile-card');


                    toggle.addEventListener('click', function(){
                        log(profile_card_container.id);
                        if(profile_card_container.classList.contains('hide')){
                            profile_card_container.classList.remove('hide');
                        }
                    });
                    document.addEventListener("mouseup", function(event) {
                        if (!profile_card_container.contains(event.target)) {
                            profile_card_container.classList.add('hide');
                        }
                    });
                }
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
                location.hash = '#?vault';
            });
            notification_btn.addEventListener('click', ()=> {
                let inbox_ref = fsDB.collection('client').doc('meta').collection(uid).doc('notifications')
                .collection('inboxes').doc('all').collection('updated');
                
                location.hash = '#?notifications';
                deleteCollection(inbox_ref, 100)
                .then(function() {
                }).catch(function(error) {log(error)});
                
                function deleteCollection(inbox_ref, batchSize) {
                    var query = inbox_ref.orderBy('__name__').limit(batchSize);
                    
                    return new Promise(function(resolve, reject) {
                        deleteQueryBatch(query, batchSize, resolve, reject);
                    });
                }
                function deleteQueryBatch(query, batchSize, resolve, reject) {
                    query.get().then(function(snapshot) {
                        if (snapshot.size == 0) { return 0};
                        var batch = inbox_ref.firestore.batch();
                        snapshot.docs.forEach(function(doc) {
                            batch.delete(doc.ref);
                        });
                        return batch.commit().then(function() {
                            return snapshot.size;
                        });
                    }).then(function(numDeleted) {
                        if (numDeleted === 0) {
                            resolve();
                            return;
                        }
                    }).catch(reject);
                };
            });
            new_room_btn.addEventListener('click', ()=>{
                location.hash = '#?new-room';
            });
            explore_rooms_btn.addEventListener('click', ()=>{
                location.hash = '#?explore-rooms';
            });

            (function(){
                listen_to_request();
                listen_to_notification();

                function listen_to_request(){
                    vault_btn.innerHTML = `<span>
                                            <img class="frnd" src="../src/icons/friends.svg" alt="">
                                        </span>`
                    fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming').onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            lsDB.setItem('vault_inbox_count', sn.size);
                            
                            if(sn.size <= 0){
                                vault_btn.innerHTML = `<span>
                                    <img class="frnd" src="../src/icons/friends.svg" alt="">
                                </span>`;
                            }else{
                                let bagde_card = `
                                    <span class="bagde vault-bagde scale-up-center" id="vault-bagde">${sn.size}</span>
                                `;
                                vault_btn.insertAdjacentHTML('beforeend', bagde_card);
                                utilities.createNotification(
                                    'Friend Request', 
                                    'You have a new friend request.', 
                                    '../src/assets/notification/request-icon.png'
                                );
                            }
                        })
                    })
                };
                function listen_to_notification(){
                    notification_btn.innerHTML = `<span>
                                            <img class="frnd" src="../src/icons/notification.svg" alt="">
                                        </span>`
                    fsDB.collection('client').doc('meta').collection(uid).doc('notifications').collection('inboxes')
                    .doc('all').collection('updated').onSnapshot(function(sn){
                        sn.docChanges().forEach(function(ch){
                            lsDB.setItem('inbox size', sn.size);
                            
                            if(sn.size <= 0){
                                notification_btn.innerHTML = `<span>
                                    <img class="frnd" src="../src/icons/notification.svg" alt="">
                                </span>`
                            }else{
                                if(ch.type == 'added'){
                                    let bagde_card = `
                                        <span class="bagde vault-bagde scale-up-center" id="vault-bagde">${sn.size}</span>
                                    `;
                                    notification_btn.insertAdjacentHTML('beforeend', bagde_card);
                                    sn.forEach(data => {
                                        log(data.data());
                                        let notification_id = data.data().notification_id;

                                        fsDB.collection('client').doc('meta').collection(uid).doc('notifications').collection('history')
                                        .doc(notification_id).get().then((item) => {
                                            const item_data = item.data();
                                            log(item_data.title);
                                            let type = item_data.type;
                                            utilities.createNotification(
                                                `${type === 'request' ? 'Friend request - Nimo' : type === 'security' ? item_data.title : type === 'community' ? item_data.title : 'Update'}`,
                                                `${type === 'request' ? item_data.author + ' accepted your request.' : item_data.body}`,
                                                `${type === 'request' ? '../src/assets/notification/request-icon.png' : type === 'security' ? '../src/assets/notification/security-icon.png' : '../src/assets/notification/community-icon.png'}`
                                            )
                                        })
                                    })
                                }
                            }
                        });
                    })
                };
            }());
        }(lsDB.getItem('id')));
        
        setTip();
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

            await fsDB
                .collection("client")
                .doc("meta_index")
                .collection(_usr_)
                .doc("meta_index")
                .get()
                .then(async (_doc_) => {
                    if (_doc_.exists) {
                        const id = _doc_.data().id;
                        await fsDB
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
            };
            if(main_hash != 'vault'){
                let vault_container = document.getElementById('vault');
                if(vault_container != null){
                    vault_container.remove();
                }
                console.log('not vault')
            }else{
                render_vault();
            };
            if(main_hash != 'notifications'){
                let notification_container = document.getElementById('notifications');
                if(notification_container != null){
                    notification_container.remove();
                }
            }else{
                render_notifications();
            };
            if(main_hash != 'new-room'){
                let new_room_container = document.getElementById('new-room-container');
                if(new_room_container != null){
                    new_room_container.remove();
                }
            }else{
                render_create_room();
            }
            if(main_hash != 'explore-rooms'){
                let explore_room_container = document.getElementById('explore-room-container');
                if(explore_room_container != null){
                    explore_room_container.remove();
                }
            }else{
                render_explore_rooms();
            }
            if(main_hash == 'app'){
                log('main home');
                update_friends_and_rooms();
            }
        })
    }());

    const evenListener = {
        listen: {
            esc: (el, el2) => {
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
                            el2.classList.add('scale-out-center');
                            setTimeout(() => {
                                el2.classList.remove('scale-out-center');
                                history.back();
                            }, 100);
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
                            obj.classList.add('scale-out-center');
                            setTimeout(() => {
                                obj.classList.remove('scale-out-center');
                                history.back();
                            }, 100);
                        }
                    }else{
                        return;
                    }
                });
            }
        },
    };
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
    };
    function update_friends_and_rooms(){
        get_friend_list();
        get_room_list();
    };
    async function get_friend_list(){
        (function(uid){
            let friend_404 = `
                <div class="NOF fade-in">
                    <img src="/src/assets/nof.svg" />
                    <span class="nof-title">It's quiet for now!</span>
                    <span class="hr"></span>
                    <span class="nof-sub">Add friends to start chatting!</span>
                    <button class="nof-btn btn-primary" id="add-friend"> 
                        <img src="../src/icons/add-freind.svg" />
                        <span>Add friend </span>
                    </button>
                </div>`;
            let friend_list_cont = document.getElementById('f_list');
            
            fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
            .get().then((sn) => {
                if(sn.docs.length > 0) {
                    sn.forEach((s) => {
                        const friend_data = s.data();
                        let remote_id = friend_data.remote_id,
                            friend_id = friend_data.friend_id;
                        render_list(friend_id, remote_id);
                    })
                }else{
                    friend_list_cont.innerHTML = friend_404;
                    let add_friend_btn = document.getElementById('add-friend');

                    add_friend_btn.addEventListener('click', function(e){
                        e.preventDefault();
                        location.hash = '#?addfriend';
                    });
                }
            })

            function  render_list(friend_id, chat_id){
                friend_list_cont.innerHTML = '';
                fsDB.collection('client').doc('meta').collection(friend_id)
                .doc('meta_data').get().then(async(data) => {
                    const friend_data = data.data();
                    let card = `
                        <div class="friend-card fade-in" id="fid-${friend_id}">
                            <div class="friend-pfp-cont tippy-tip" data-tippy-content="${friend_data.user}">
                                <span class="f-pfp" style="background-image: url(${friend_data.userProfileAvatar == 'default' ? '/src/imgs/avatar.svg' : friend_data.userProfileAvatar});background-color: ${friend_data.userProfileBackDrop};"></span>
                                <span class="bagde bg-primary">9+</span>
                            </div>
                            <!--<span class="f-uname">${friend_data.user}</span> -->
                        </div>
                    `;
                    friend_list_cont.insertAdjacentHTML('beforeend', card);
                    setTip();

                    const f_btn = document.getElementById(`fid-${friend_id}`);
                    
                    f_btn.addEventListener('click', (e)=> {
                        e.preventDefault();
                        location.href = `../pages/chat.html?rid=${chat_id}`;
                    });
                })
            }
        }(lsDB.getItem('id')));
    }
    function get_room_list(){
        (function(uid){
            let room_404 = `
                <div class="NOR">
                        <img src="/src/assets/nor.svg" />
                        <span class="nof-title">You have not joined any rooms yet!</span>
                        <span class="hr"></span>
                        <button class="nof-btn" id="join-room-btn">Join room</button>
                </div>
                `;
            let room_list_cont = document.getElementById('room-list-cont');

            fsDB.collection('client').doc('meta').collection(uid).doc('logs').collection('rooms')
            .get().then(room_data => {
                // log(room_data);
                if(room_data.size <= 0){
                    log('no rooms');
                    room_list_cont.innerHTML = room_404;
                    let join_room_btn = document.getElementById('join-room-btn');

                    join_room_btn.addEventListener('click', function(e){
                        e.preventDefault();
                        location.hash = '#?explore-rooms';
                    });
                }else{
                    log('there\'re rooms ig');
                    room_list_cont.innerHTML = '';
                    room_data.forEach(data => {
                        const room_id_0 = data.data().id;
                        log(room_id_0);
                        fsDB.collection('client').doc('rooms').collection('room_meta').doc(room_id_0)
                        .get().then(data => {
                            if(data.exists){
                                let r_data = data.data();
                                let card = `
                                    <div class="room-card fade-in" id="room-id-${r_data.id}">
                                        <div class="friend-pfp-cont tippy-tip" data-tippy-content="${r_data.name}">
                                            <span class="f-pfp" style="background-image: url(${r_data.icon == 'default' || r_data.icon == null ? '/src/imgs/room.svg' : r_data.icon});"></span>
                                            <span class="bagde bg-primary">9+</span>
                                        </div>
                                    </div>
                                `;
                                room_list_cont.insertAdjacentHTML('beforeend', card);
                                setTip();
    
                                const r_btn = document.getElementById(`room-id-${r_data.id}`);
                                
                                r_btn.addEventListener('click', (e)=> {
                                    e.preventDefault();
                                    location.href = `../pages/room.html?cid=${r_data.id}`;
                                });
                            }else{
                                room_list_cont.innerHTML = room_404;
                                let join_room_btn = document.getElementById('join-room-btn');

                                join_room_btn.addEventListener('click', function(e){
                                    e.preventDefault();
                                    location.hash = '#?explore-rooms';
                                });
                            }
                        })
                    })
                }
            })
        }(lsDB.getItem('id')))
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
                        <span class="close-btn tippy-tip" id="adf-close-btn" data-tippy-content="Close">
                            <img src="/src/icons/close-white.svg" alt="">
                        </span>
                    </div>
                    <div class="contents">
                        <span class="label">Add friends easily by entering their user id. <br> eg. sadie@123456789.</span>
                        <div class="input-cont">
                            <input type="text" name="id" id="input-fr" placeholder="sadie@123456789">
                            <span class="add-btn btn-primary" id="send_btn">Send</span>
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
            container_wrapper = document.getElementById('container-wrappper'),
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
        });
        close_btn.addEventListener('click', function(e){
            e.preventDefault();
            container_wrapper.classList.add('scale-out-center');
            setTimeout(() => {
                container_wrapper.classList.remove('scale-out-center');
                history.back();
            }, 100);
        });
        evenListener.listen.esc(container, container_wrapper);
        evenListener.listen.outClick('container-wrappper');
        
        function validate_request(){
            const regex = /^[\w]+@[0-9]{9}$/;

            const _prld = `
                <span class="preload">
                    <img src="../src/assets/spinner-2.svg" alt="">
                </span>`;

            if(input.value != ''){
                let uid = lsDB.getItem('id');
                if(!regex.test(value)){
                    msgbox.alert(
                        'Invalid or poorly formatted Username and ID!',
                        msgbox_icoonEl,
                        msgbox_msgEl,
                        msgbox_parent,
                        'error'
                    )
                }else{
                    let user_id = input.value.split('@')[1];
                    if(user_id == uid){
                        msgbox.alert(
                            'You can not send yourself friend request!',
                            msgbox_icoonEl,
                            msgbox_msgEl,
                            msgbox_parent,
                            'error'
                        )
                    }else{
                        log('hmmm,,'+uid)
                        fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
                        .get()
                        .then(sn => {
                            log(sn)
                            send_btn.innerHTML = _prld;
                            send_btn.disabled = true;
                            input.disabled = true;
                            if(sn.size <= 0){
                                init_friend_req();
                            }else{
                                sn.forEach((user) => {
                                    log(user.data());
                                    if(user.data().friend_id == user_id){
                                        msgbox.alert(
                                            'This person is already your friend',
                                            msgbox_icoonEl,
                                            msgbox_msgEl,
                                            msgbox_parent,
                                            'error'
                                        );
                                        reset();
                                    }else{
                                        init_friend_req()
                                    }
                                });
                            }
                        });
                        function init_friend_req(){
                            fsDB.collection('client')
                            .doc('meta').collection(user_id).get().then((d) => {
                                if(d.size <= 0){
                                    msgbox.alert(
                                        'There is no user of given username or id!',
                                        msgbox_icoonEl,
                                        msgbox_msgEl,
                                        msgbox_parent,
                                        'error'
                                    );
                                    reset();
                                }else{
                                    fsDB.collection("client")
                                    .doc("meta")
                                    .collection(user_id)
                                    .limit(1)
                                    .get()
                                    .then((user) => {
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
                                            let date = new Date();
                                            fsDB.collection('client').doc('meta').collection(user_id).doc('requests')
                                            .collection('incoming').doc(uid)
                                            .set({
                                                id: uid,
                                                date: date
                                            }).then(() => {
                                                fsDB.collection('client').doc('meta').collection(uid).doc('requests')
                                                .collection('outgoing').doc(user_id)
                                                .set({
                                                    id: user_id,
                                                    date: date
                                                }).then(() => {
                                                    log('request sent to'+user_id);
                                                    msgbox.alert(
                                                        `Request was sent successfully!`,
                                                        msgbox_icoonEl,
                                                        msgbox_msgEl,
                                                        msgbox_parent,
                                                        'success'
                                                    );
                                                    setTimeout(() => {
                                                        reset();
                                                    }, 500);
                                                });
                                            });
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
                                    });
                                }
                            }).catch(err => {
                                msgbox.alert(
                                    'Request could not be sent, try again later!',
                                    msgbox_icoonEl,
                                    msgbox_msgEl,
                                    msgbox_parent,
                                    'error'
                                );
                                reset();
                            })
                        }
                    }
                };
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
        setTip();
    };
    function render_create_room(){
        const preloader = `
                <span class="preload">
                    <img src="../src/assets/spinner-2.svg" alt="">
                </span>`;

        let view = `
            <div class="new-room vault" id="new-room-container">
                <div class="wrapper scale-up-center" id="new-room-main-container">
                    <div class="layer fade-in" id="freezer-layer"></div>
                    <div class="content-wrapper" id="new-room-main-container">
                        <div class="header">
                            <div class="title-cont">
                                <div class="title-cont">
                                    <img src="/src/icons/rooms.svg" />
                                    <span class="title">New room</span>
                                </div>
                            </div>
                            <div class="close-btn-cont tippy-tip" id="new-room-close-btn" data-tippy-content="Close">
                                <img src="/src/icons/close-white.svg" alt="">
                            </div>
                        </div>
                        <div class="container-wrapper" id="notification-cont-wraper">
                            <div class="icon-preview-cont">
                                <div class="icon-cont" >
                                    <span class="pfp _pfp_" id="room-icon">
                                    </span>
                                    <label for="room-icon-input" class="pfp-picker _pfp-picker_" id="pfp-picker" >
                                        <img src="../src/icons/editor.svg" alt="">
                                    </label>
                                    <input type="file" accept="image/*" name="" id="room-icon-input" hidden>
                                </div>
                                <div class="preview-cont">
                                    <div class="preview-wrapper">
                                        <span class="preview-tag">
                                            Preview
                                        </span>
                                        <div class="preview-card">
                                            <div class="preview-icon" id="preview-icon">
                                                <span class="p-icon"></span>
                                            </div>
                                            <div class="preview-info-cont">
                                                <span class="prev-name" id="name-preview-holder">My room</span>
                                                <span class="description" id="description-preview-holder">Room description</span>
                                                <div class="prev-stat-cont">
                                                    <span class="item member">
                                                        <span class="id">Members :</span>
                                                        <span class="count">0</span>
                                                    </span>
                                                    <span class="item member">
                                                        <span class="id">Type :</span>
                                                        <span class="count" id="type-preview-holder">Public</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="input-cont">
                                <div class="input-item">
                                    <span class="label">Room name <small style="opacity: .4;">(Require)</small></span>
                                    <input type="text" name="Room name" id="room-name-input" placeholder="Cute Loafies" value="My room">
                                </div>
                                <div class="item-switch-cont">
                                    <div class="switch-item active-switch" id="switch-component-public">
                                        <img src="/src/icons/show.svg" alt="">
                                        <span class="label">Public</span>
                                    </div>
                                    <div class="switch-item" id="switch-component-private">
                                        <img src="/src/icons/hide.svg" alt="">
                                        <span class="label">Private</span>
                                    </div>
                                </div>
                                <div class="input-item">
                                    <div class="des-cont">
                                        <span class="title">Description <small style="opacity: .4;">(Require)</small></span>
                                        <textarea name="about" id="new-room-description-input" cols="30" rows="10" placeholder="Let members know what this room is about."></textarea>
                                        <span class="tl" id="sl">0/120</span>
                                    </div>
                                </div>
                                <button class="btn-primary create-room" id="create-rooom">
                                    Create
                                </button>
                            </div>
                        </div>
                        <div class="msg-box" id="msg-box">
                            <img src="" alt="" id="msg-box-icon">
                            <span class="msg" id="adf-msg"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        root.insertAdjacentHTML('beforeend', view);

        let new_room_container = document.getElementById('new-room-main-container'),
            new_room_close_btn = document.getElementById('new-room-close-btn'),
            new_room_container_wrapper = document.getElementById('new_room_wrapper-container');
        
        let new_rooom_name_input = document.getElementById('room-name-input'),
            name_preview_holder = document.getElementById('name-preview-holder'),
            description_input = document.getElementById('new-room-description-input'),
            description_preview_hodler = document.getElementById('description-preview-holder');

        let switch_component_public = document.getElementById('switch-component-public'),
            switch_component_private = document.getElementById('switch-component-private'),
            type_preview_holder = document.getElementById('type-preview-holder'),
            string_length_holder = document.getElementById('sl');

        let create_btn = document.getElementById('create-rooom'),
            layer = document.getElementById('freezer-layer');

        let msgbox_parent = document.getElementById('msg-box'),
            msgbox_msgEl = document.getElementById('adf-msg'),
            msgbox_icoonEl = document.getElementById('msg-box-icon');

        let is_public = true;

        new_room_close_btn.addEventListener('click', () => {
            log('hello closer')
            new_room_container.classList.add('scale-out-center');
            setTimeout(() => {
                history.back();
                new_room_container.classList.remove('scale-out-center');
            }, 100);
        });


        setTip();
        configure_room();

        function configure_room(){
            const cropper_container = document.querySelector("[data-cropper]"),
                cropper_close_btn = document.querySelector("[data-cropper-close-btn]"),
                cropper_save_btn = document.querySelector("[data-cropper-save-btn]");

            let room_icon_holder = document.getElementById('room-icon'),
                room_icon_picker = document.getElementById('room-icon-input'),
                room_preview_icon_holder = document.getElementById('preview-icon');

                
            lsDB.setItem('selected_room_icon', 'default');
            lsDB.setItem('is_room_visible', true);

            pick_icon();
            update_name_description();
            on_create_room();

            function pick_icon(){                
                room_icon_picker.addEventListener("change", () => {
                    cropper_container.style.display = "flex";
                    get_icon_data();
                });

                function get_icon_data(){
                    const icon_file = room_icon_picker.files[0];

                    if (icon_file) {
                        const file_reader = new FileReader();
                        file_reader.readAsDataURL(icon_file);
                        file_reader.addEventListener("load", function () {
                            if (icon_file.size > 5120000) {
                                utilities.alert(
                                    "Whoppsy!, selected file is too large, please consider selecting smaller file.",
                                    "info",
                                );
                            }
                            crop_icon(this.result);
                        });
                    }
                }
                function crop_icon(ic_file){
                    croppie.bind({
                        url: ic_file,
                        orientation: 0,
                    });
                    cropper_close_btn.addEventListener("click", () => {
                        cropper_container.style.display = "none";
                    });
                    cropper_save_btn.addEventListener("click", () => {
                        croppie.result("blob").then(function (blob) {
                            let reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = () => {
                                let tobase64 = reader.result;
                                lsDB.setItem("selected_room_icon", tobase64);
                                cropper_container.style.display = "none";
                                set_icon_preview();
                            };
                        });
                    });
                }
                function set_icon_preview(){
                    let selcted_icon = lsDB.getItem('selected_room_icon');

                    room_icon_holder.style.backgroundImage = `url(${selcted_icon})`;
                    room_preview_icon_holder.style.backgroundImage = `url(${selcted_icon})`;
                }
            }
            function update_name_description(){
                new_rooom_name_input.addEventListener('input', function(e){
                    e.preventDefault();
                    name_preview_holder.innerText = utilities.stringLimit(this.value, 30);
                });
                (function(){
                    switch_component_public
                    .addEventListener('click', function(){
                        this.classList.add('active-switch');
                        switch_component_private.classList.remove('active-switch');
                        is_public = true;
                        lsDB.setItem('is_room_visible', is_public);
                        type_preview_holder.innerText = is_public ? 'Public' : 'Private'
                    });
                    switch_component_private
                    .addEventListener('click', function(){
                        this.classList.add('active-switch');
                        switch_component_public.classList.remove('active-switch');
                        is_public = false;
                        lsDB.setItem('is_room_visible', is_public);
                        type_preview_holder.innerText = is_public ? 'Public' : 'Private'
                    });
                }());
                description_input.addEventListener("keyup", function(){
                    let maxLen = 120;
                    let val = this.value;
                    let chars = val.length;
                    if (chars > maxLen) {
                        this.value = val.substring(0, maxLen);
                    }
                    string_length_holder.innerText = `${this.value.length}/120`;
                    description_preview_hodler.innerText = utilities.stringLimit(this.value, 50);
                });
            }
            function on_create_room(){
                create_btn.onclick = function(e){
                    e.preventDefault();
                    if(new_rooom_name_input.value == ''){
                        new_rooom_name_input.classList.add("invalid");
                        new_rooom_name_input.focus();
                        setTimeout(() => {
                            new_rooom_name_input.classList.remove("invalid");
                        }, 1000);
                    }else if(description_input.value == ''){
                        description_input.classList.add("invalid");
                        description_input.focus();
                        setTimeout(() => {
                            description_input.classList.remove("invalid");
                        }, 1000);
                    }else{
                        create_room();
                        log(new_rooom_name_input.value+"--"+description_input.value+"--"+is_public);
                    }
                }
            }
            function create_room(){
                freeze_configuration();
                make_rooom();

                function make_rooom(){
                    let room_id = utilities.genID(),
                        room_icon = lsDB.getItem('selected_room_icon'),
                        room_name = new_rooom_name_input.value,
                        room_op = `${lsDB.getItem('client')}@${lsDB.getItem('id')}`,
                        room_type = lsDB.getItem('is_room_visible'),
                        description = description_input.value,
                        date_created = new Date();
                    let client_id = lsDB.getItem('id');

                    console.table([room_id, room_name, room_op, room_type, description, date_created]);

                    fsDB.collection('client').doc('rooms').collection('room_meta').doc(`${room_id}`)
                    .set({
                        id: `${room_id}`,
                        icon: room_icon,
                        name: room_name,
                        op: [room_op],
                        type: room_type,
                        description: description,
                        date_created: date_created
                    }).then(() => {
                        fsDB.collection('client').doc('meta').collection(client_id).doc('logs').collection('rooms').doc(`${room_id}`)
                        .set({
                            id: `${room_id}`
                        }).then(() => {
                            fsDB.collection('client').doc('rooms').collection('room_meta').doc(`${room_id}`).collection('members').doc('list')
                            .collection('all').doc(client_id).set({
                                name: lsDB.getItem('client'),
                                id: client_id
                            }).then(() => {
                                history.back();
                                setTimeout(() => {
                                    location.href = `../pages/room.html?cid=${room_id}`;
                                }, 30)
                                log('room creating successfully navigating to the room now...');
                            })
                        })
                    }).catch(error => {
                        msgbox.alert(
                            `Opps! Something went seriously wrong, try again later!`,
                            msgbox_icoonEl,
                            msgbox_msgEl,
                            msgbox_parent,
                            'error'
                        );
                    })
                }
                function freeze_configuration(){
                    layer.style.display = 'flex';
                    create_btn.innerHTML = preloader;
                }
            }
        }
    }
    function render_explore_rooms(){
        let preloader = `<div class="skeleton fade-in">
            <div class="room-info-wrapper">
                <div class="room-icon-cont">
                    <span class="icon"></span>
                </div>
                <div class="room-info-cont">
                    <span class="room-name"></span>
                    <span class="op small"></span>
                    <span class="member-type small"></span>
                </div>
            </div>
            <div class="room-description-cont">
                <div class="des"></div>
            </div>
        </div>`;

        let view = `
            <div class="explore-rooms-cont vault" id="explore-room-container">
                <div class="wrapper scale-up-center" id="explore-room-main-container">
                    <div class="layer fade-in" id="freezer-layer"></div>
                    <div class="content-wrapper" id="explore-room-main-container">
                        <div class="header">
                            <div class="title-cont">
                                <div class="title-cont">
                                    <img src="/src/icons/compass.svg" />
                                    <span class="title">Explore roooms</span>
                                </div>
                            </div>
                            <div class="right-box">
                                <div class="search-cont">
                                    <input type="text" name="rooom-search-input" id="room-search-input" placeholder="Room name or Room ID">
                                    <button class="btn-primary room-search-btn">
                                        <img src="/src/icons/lense.svg" alt="">
                                    </button>
                                </div>
                                <div class="close-btn-cont tippy-tip" id="explore-room-close-btn" data-tippy-content="Close">
                                    <img src="/src/icons/close-white.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="container-wrapper" id="explore-room-cont-wrapper">
                            <div class="card-content-wrapper" id="explore-room-content-wrapper">

                            </div>
                        </div>
                        <div class="msg-box" id="msg-box">
                            <img src="" alt="" id="msg-box-icon">
                            <span class="msg" id="adf-msg"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        root.insertAdjacentHTML('beforeend', view);

        let explore_room_container = document.getElementById('explore-room-main-container'),
            explore_room_close_btn = document.getElementById('explore-room-close-btn'),
            explore_room_container_wrapper = document.getElementById('explore-room-content-wrapper');
        

        explore_room_close_btn.addEventListener('click', () => {
            log('hello closer')
            explore_room_container.classList.add('scale-out-center');
            setTimeout(() => {
                history.back();
                explore_room_container.classList.remove('scale-out-center');
            }, 100);
        });


        for(let a = 0; a < 10; ++a){
            explore_room_container_wrapper.insertAdjacentHTML('beforeend', preloader);
        };

        setTip();
        render_rooms();


        function render_rooms(){
            fsDB.collection('client').doc('rooms').collection('room_meta').get()
            .then(room_meta => {
                room_meta.forEach(async data => {
                    explore_room_container_wrapper.innerHTML = '';
                    let meta_ID = data.id;
                    fsDB.collection('client').doc('rooms').collection('room_meta').doc(meta_ID).get()
                    .then(async data => {
                        const room_data = data.data();

                        fsDB.collection('client').doc('rooms').collection('room_meta').doc(meta_ID).collection('members')
                        .doc('list').collection('all').get().then(size_data =>{
                            if(room_data.type == 'true'){
                                let room_card = `
                                    <div class="room-card-cont fade-in" style="background-image: url(${room_data.icon=='default'?'../src/imgs/room.svg':room_data.icon})">
                                        <div class="room-info-wrapper">
                                            <div class="room-icon-cont">
                                                <span class="icon" style="background-image: url(${room_data.icon=='default'?'../src/imgs/room.svg':room_data.icon})"></span>
                                            </div>
                                            <div class="room-info-cont">
                                                <span class="room-name">${utilities.stringLimit(room_data.name, 30)}</span>
                                                <span class="op small"><span class="id">Owner : </span>${room_data.op}</span>
                                                <span class="member-type small"><span class="id">Member : </span>${size_data.size}&nbsp;&nbsp;<span class="id">Type : </span>${room_data.type == 'true' ?'Public':'Private'}</span>
                                            </div>
                                            <span class="join-btn tippy-tip" data-tippy-content="Join room" id="join-room-btn-${meta_ID}">
                                                <img src="src/icons/plus.svg" alt="">
                                            </span>
                                        </div>
                                        <div class="room-description-cont">
                                            <span>${utilities.stringLimit(room_data.description, 80)}</span>
                                        </div>
                                    </div>`;
                                explore_room_container_wrapper.insertAdjacentHTML('beforeend', room_card);
                            }
                        });

                    });
                    setTip();
                })
            })
        }
    }
    function render_vault(){
        (function(uid){
            let view = `
                <div class="vault" id="vault">
                    <div class="wrapper scale-up-center" id="vault-container">
                        <div class="content-wrapper">
                            <div class="header">
                                <div class="btn-cont-wrapper">
                                    <div class="btn-cont">
                                        <div class="btn-wrapper active" id="vault-friends-btn">
                                            <span class="btn">Friends</span>
                                        </div>
                                        <div class="btn-wrapper" id="vault-requests-btn">
                                            <span class="btn">Requests</span>
                                            <span class="bagde" style="display: none" id="request-badge"></span>
                                        </div>
                                    </div>
                                    <div class="add-friend-btn btn-primary" id="add-friend-btn">
                                        <img src="../src/icons/add-freind.svg" />
                                        <span >Add friend</span>
                                    </div>
                                </div>
                                <div class="close-btn-cont tippy-tip" id="vault-close-btn" data-tippy-content="Close">
                                    <img src="/src/icons/close-white.svg" alt="">
                                </div>
                            </div>
                            <div class="container-wrapper friends" id="vault-friends-cont">
                            </div>
                            <div class="container-wrapper requests hide" id="vault-requests-cont">
                                <div class="request-cat-cont">
                                    <div class="cat-wrapper">
                                        <div class="cat-item incoming-req active" id="incoming-req-btn">
                                            <span class="cat">Incoming</span>
                                            <span class="bagde" style="display: none" id="request-cat-badge"></span>
                                        </div>
                                        <div class="cat-item pending" id="pending-req-btn">
                                            <span class="cat">Pending</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="request-item-cont incoming-requests" id="incoming-req-cont">
                                </div>
                                <div class="request-item-cont pending-requests hide" id="pending-req-cont">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            root.insertAdjacentHTML('beforeend', view);
            
            let vault_container = document.getElementById('vault'),
                vault_wrapper = document.getElementById('vault-container'),
                vault_freinds_btn = document.getElementById('vault-friends-btn'),
                vault_requests_btn = document.getElementById('vault-requests-btn'),
                vault_friends_cont = document.getElementById('vault-friends-cont'),
                vault_requests_cont = document.getElementById('vault-requests-cont'),
                vault_close_btn = document.getElementById('vault-close-btn'),
                add_friend_btn = document.getElementById('add-friend-btn');

            let vault_incoming_req_btn = document.getElementById('incoming-req-btn'),
                vault_pending_req_btn = document.getElementById('pending-req-btn'),
                vault_incoming_req_cont = document.getElementById('incoming-req-cont'),
                vault_pending_req_cont = document.getElementById('pending-req-cont');

            let request_badge = document.getElementById('request-badge'),
                request_cat_bagde = document.getElementById('request-cat-badge');
            
            vault_freinds_btn.addEventListener('click', () => {
                if(!vault_freinds_btn.classList.contains('active')){
                    vault_freinds_btn.classList.add('active');
                    vault_requests_btn.classList.remove('active');

                    switch_tab(vault_requests_cont, vault_friends_cont);
                    render_friends_list();
                }
            });
            vault_requests_btn.addEventListener('click', () => {
                if(!vault_requests_btn.classList.contains('active')){
                    vault_requests_btn.classList.add('active');
                    vault_freinds_btn.classList.remove('active');
                    
                    switch_tab(vault_friends_cont, vault_requests_cont);
                }
            });
            add_friend_btn.addEventListener('click', () => {
                vault_wrapper.classList.add('scale-out-center');
                setTimeout(() => {
                    location.hash = '#?addfriend'
                    vault_wrapper.classList.remove('scale-out-center');
                }, 100);
            });
            vault_close_btn.addEventListener('click', () => {
                vault_wrapper.classList.add('scale-out-center');
                setTimeout(() => {
                    history.back();
                    vault_wrapper.classList.remove('scale-out-center');
                }, 100);
            });

            vault_incoming_req_btn.addEventListener('click', () => {
                if(!vault_incoming_req_btn.classList.contains('active')){
                    vault_incoming_req_btn.classList.add('active');
                    vault_pending_req_btn.classList.remove('active');

                    switch_tab(vault_pending_req_cont, vault_incoming_req_cont);
                }
            });
            vault_pending_req_btn.addEventListener('click', () => {
                if(!vault_pending_req_btn.classList.contains('active')){
                    vault_pending_req_btn.classList.add('active');
                    vault_incoming_req_btn.classList.remove('active');

                    switch_tab(vault_incoming_req_cont, vault_pending_req_cont);
                }
            });

            (function(){
                vault_incoming_req_cont.innerHTML =  `
                    <div class="empty-friend-list fade-in">
                        <div class="empty-list-wrapper">
                            <span class="icon-cont">
                            <img src="../src/assets/empty.svg" />
                            </span>
                            <span class="label">No incoming request.</span>
                        </div>
                    </div>`;
                fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                .onSnapshot(function(sn){
                    sn.docChanges().forEach(function(req){
                        log(req.doc.data());
                        let req_id = req.doc.data().id,
                            req_date = req.doc.data().date.toDate();
                        
                        if(sn.size <= 0){
                            vault_incoming_req_cont.innerHTML =  `<div class="empty-friend-list">
                                <div class="empty-list-wrapper">
                                        <span class="icon-cont">
                                        <img src="../src/assets/empty.svg" />
                                        </span>
                                        <span class="label">No incoming request.</span>
                                    </div>
                                </div>`;
                        }else{
                            vault_incoming_req_cont.innerHTML = '';
                            fsDB.collection('client').doc('meta').collection(req_id).doc('meta_data')
                            .get().then(data => {
                                let user_data = data.data();
                                let card = `
                                    <div class="friend-card incoming" id="incoming-card-${req_id}">
                                        <div class="identifier-cont">
                                            <span class="identifier">
                                                <img src="src/icons/incoming.svg" alt="">
                                                <span class="label">Incoming request</span>
                                            </span>
                                            <span class="new-badge"></span>
                                        </div>
                                        <div class="card-wrapper">
                                            <div class="avatar-comp-cont">
                                                <div class="pfp-cont">
                                                    <div class="pfp" style="background-image: url(${user_data.userProfileAvatar == 'default' ? '../src/imgs/avatar.png' : user_data.userProfileAvatar});background-color:${user_data.userProfileBackDrop}">
                                                    </div>
                                                </div>
                                                <div class="user-info-cont">
                                                    <span class="username">${user_data.user}</span>
                                                    <span class="id">${utilities.formatDate(req_date)}</span>
                                                </div>
                                            </div>
                                            <div class="btn-comp-cont">
                                                <span class="btn-item btn btn-danger-normal" id="req-decline-btn-${req_id}">
                                                    Decline
                                                </span>
                                                <span class="hr"></span>
                                                <span class="btn-item btn btn-primary" id="req-accept-btn-${req_id}">
                                                    Accept
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </div>`;
    
                                vault_incoming_req_cont.insertAdjacentHTML('beforeend', card);
    
                                let req_accept_btn = document.getElementById(`req-accept-btn-${req_id}`),
                                    req_decline_btn = document.getElementById(`req-decline-btn-${req_id}`);
    
                                let incoming_card = document.getElementById(`incoming-card-${req_id}`);
    
                                try {
                                    req_accept_btn.addEventListener('click', () => {
                                        req_accept_btn.innerHTML = `<span class="preload">
                                                <img src="../src/assets/spinner-2.svg" alt="">
                                            </span>`;
                                        req_accept_btn.disabled = true;
                                        req_decline_btn.disabled = true;
    
                                        let link_id = utilities.rayId(),
                                            remote_id = utilities.rayId(),
                                            date = new Date();
                                        log(remote_id);
                                        let username = lsDB.getItem('client');

                                        fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
                                        .doc(remote_id).set({
                                            link_id: link_id,
                                            remote_id: remote_id,
                                            friend_id: req_id,
                                            date: date
                                        }).then(() => {
                                            fsDB.collection('client').doc('meta').collection(req_id).doc('links').collection('remotes')
                                            .doc(remote_id).set({
                                                link_id: link_id,
                                                remote_id: remote_id,
                                                friend_id: uid,
                                                date: date
                                            }).then(() => {
                                                const notification_id = utilities.rayId(),
                                                    date = new Date();
                                                fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                                                .doc(req_id).delete().then(() => {
                                                    fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('outgoing')
                                                    .doc(uid).delete().then(() => {
                                                        if(incoming_card != null){
                                                            incoming_card.remove();
                                                        };
                                                        fsDB.collection('client').doc('meta').collection(req_id).doc('notifications').collection('inboxes')
                                                        .doc('all').collection('updated').doc(notification_id).set({
                                                            notification_id: notification_id,
                                                        }).then(() => {
                                                            fsDB.collection('client').doc('meta').collection(req_id).doc('notifications').collection('history')
                                                            .doc(notification_id).set({
                                                                notification_id: notification_id,
                                                                type: 'request',
                                                                title: 'Friend request',
                                                                body: `<b id="start-chat-with-user-${notification_id}" class="user-index">${username}</b> accepted your friend request.`,
                                                                date: date,
                                                                author: username,
                                                                remote_id: remote_id
                                                            }).then(() => {
                                                                fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('incoming')
                                                                .doc(uid).delete().then(() => {
                                                                    fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('outgoing')
                                                                    .doc(req_id).delete().then(() => {
                                                                        let pending_card = document.getElementById(`outgoing-card-${req_id}`);
                                                                        if(pending_card != null){
                                                                            pending_card.remove();
                                                                        }
                                                                        render_outgoing_list();
                                                                        get_friend_list();
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        })
                                    });
                                    req_decline_btn.addEventListener('click', () => {
                                        log(req_id);
                                        utilities.alert('Are you sure you want to decline this request?', 'alert', action);
        
                                        function action(){
                                            fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('incoming')
                                            .doc(req_id).delete().then(() =>{
                                                fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('outgoing')
                                                .doc(uid).delete().then(() => {
                                                    log('declined friend requests');
                                                })
                                            });
                                        }
                                    })
                                } catch (error) {
                                    log('%cNode Fetch Error: Prompt', 'color:#4423d')
                                }
                            });
                        }
                        request_badge.innerText = `${sn.size}`;
                        request_cat_bagde.innerText = `${sn.size}`;
                        request_badge.style.display = sn.size <= 0 ? 'none' : 'flex';
                        request_cat_bagde.style.display = sn.size <= 0 ? 'none' : 'flex';
                    });
                });
            }());

            render_outgoing_list();
            render_friends_list();
            setTip();

            function render_outgoing_list(){
                fsDB.collection('client').doc('meta').collection(uid)
                .doc('requests').collection('outgoing')
                .get().then((sn) => {
                    if(sn.size <= 0){
                        vault_pending_req_cont.innerHTML = `<div class="empty-friend-list fade-in">
                            <div class="empty-list-wrapper">
                                    <span class="icon-cont">
                                        <img src="../src/assets/empty.svg" />
                                    </span>
                                    <span class="label">No pending request.</span>
                                </div>
                            </div>`;
                    }else{
                        vault_pending_req_cont.innerHTML = '';
                        sn.forEach(req => {
                            let req_id = req.data().id,
                                req_date = req.data().date.toDate();
                            
                            console.log(utilities.formatDate(req_date));
    
                            fsDB.collection('client').doc('meta').collection(req_id).doc('meta_data')
                            .get().then(data => {
                                let user_data = data.data();
                                let card = `
                                    <div class="friend-card outgoing fade-in" id="outgoing-card-${req_id}">
                                        <div class="identifier-cont">
                                            <span class="identifier">
                                                <img src="src/icons/outgoing.svg" alt="">
                                                <span class="label">Outgoing request</span>
                                            </span>
                                        </div>
                                        <div class="card-wrapper">
                                            <div class="avatar-comp-cont">
                                                <div class="pfp-cont">
                                                    <div class="pfp" style="background-image: url(${user_data.userProfileAvatar == 'default' ? '../src/imgs/avatar.png' : user_data.userProfileAvatar});">
                                                    </div>
                                                </div>
                                                <div class="user-info-cont">
                                                    <span class="username">${user_data.user}</span>
                                                    <span class="id">${utilities.formatDate(req_date)}</span>
                                                </div>
                                            </div>
                                            <div class="btn-comp-cont">
                                                <span class="btn-item btn btn-danger-normal" id="outgoing-cancel-btn-${req_id}">
                                                    Cancel
                                                </span>
                                            </div>
                                        </div>
                                    </div>`;
    
                                vault_pending_req_cont.insertAdjacentHTML('beforeend', card);
    
                                let outgoing_cancel_btn = document.getElementById(`outgoing-cancel-btn-${req_id}`);
    
                                outgoing_cancel_btn.addEventListener('click', () => {
                                    log(req_id);
                                    utilities.alert('Do you want to cancel this request?', 'alert', action);
    
                                    function action(){
                                        fsDB.collection('client').doc('meta').collection(req_id).doc('requests').collection('incoming')
                                        .doc(uid).delete().then(() => {
                                             fsDB.collection('client').doc('meta').collection(uid).doc('requests').collection('outgoing')
                                            .doc(req_id).delete().then(() => {
                                                render_outgoing_list();
                                            }).catch(err => {
                                                log(err);
                                            })
                                        });
                                    }
                                });
                            });
                        });
                    }
                }).catch(error => {
                    log(error);
                });
            };
            function render_friends_list(){
                let empty_friend_list_holder = `
                    <div class="empty-friend-list fade-in">
                        <div class="empty-list-wrapper">
                            <span class="icon-cont">
                                <img src="../src/assets/no-friends.svg" />
                            </span>
                            <span class="label">Looks like there's no one in your <br> friends list yet!</span>
                            <span class="hr"></span>
                            <span class="nof-sub">Quickly add your friends to connect and start chatting!</span>
                        </div>
                    </div>`;

                fsDB.collection('client').doc('meta').collection(uid).doc('links').collection('remotes')
                .get().then((link_data) => {
                    vault_friends_cont.innerHTML = '';
                    link_data.forEach(data => {
                        let friend_id = data.data().friend_id,
                            remote_id = data.data().remote_id;

                        fsDB.collection('client').doc('meta').collection(friend_id).doc('meta_data')
                        .get().then((friend_data) => {
                            let fdata = friend_data.data();
                            let card = `
                                <div class="friend-card fade-in">
                                    <div class="card-wrapper">
                                        <div class="avatar-comp-cont">
                                            <div class="pfp-cont">
                                                <div class="pfp" style="background-image: url(${fdata.userProfileAvatar == 'default' ? '../src/imgs/avatar.png' : fdata.userProfileAvatar});">
                                                </div>
                                            </div>
                                            <div class="user-info-cont">
                                                <span class="username">${fdata.user}</span>
                                                <span class="id">@${fdata.id}</span>
                                            </div>
                                        </div>
                                        <div class="btn-comp-cont">
                                            <span class="btn-item tippy-tip" id="friend-chat-btn-${remote_id}" data-tippy-content="Message">
                                                <img src="/src/icons/msg.svg" alt="">
                                            </span>
                                            <span class="hr"></span>
                                            <span class="btn-item tippy-tip" id="friend-remove-btn-${friend_id}" data-tippy-content="Remove friend">
                                                <img src="/src/icons/remove-friend.svg" alt="">
                                            </span>
                                        </div>
                                    </div>
                                </div>`;
                            vault_friends_cont.insertAdjacentHTML('beforeend', card);

                            let vault_friend_chat_btn = document.getElementById(`friend-chat-btn-${remote_id}`),
                                vault_friend_remove_btn = document.getElementById(`friend-remove-btn-${friend_id}`);
                            
                            vault_friend_chat_btn.addEventListener('click', () => {
                                setTimeout(() => {
                                    location.href = `../pages/chat.html?rid=${remote_id}`;
                                }, 100)
                            });
                            vault_friend_remove_btn.addEventListener('click', ()=> {
                                utilities.alert(`Are you sure you want to remove <b>${fdata.user}</b> from your friend list?`, alert, action);
                                function action(){
                                    fsDB.collection('client').doc('meta').collection(uid).doc('links')
                                    .collection('remotes').doc(remote_id).delete().then(() => {
                                        fsDB.collection('client').doc('meta').collection(friend_id).doc('links')
                                        .collection('remotes').doc(remote_id).delete().then(() => {
                                            render_friends_list();
                                            get_friend_list();
                                        });
                                    });
                                };
                            });
                            setTip();
                        }).catch(error => log(error));
                    });

                    if(link_data.size <= 0){
                        vault_friends_cont.innerHTML = empty_friend_list_holder;
                    };
                }).catch(error => log(error));
            }
        }(lsDB.getItem('id')));

        function switch_tab(tab_1, tab_2){
            tab_1.classList.add('hide');
            tab_2.classList.remove('hide');
        };
    };
    function render_notifications(){
        let empty_notifications_holder = `
            <div class="empty-friend-list fade-in">
                <div class="empty-list-wrapper">
                    <span class="icon-cont">
                        <img src="../src/assets/empty-notification.svg" />
                    </span>
                    <span class="label">You don't have any notification yet.</span>
                </div>
            </div>`;
        (function(uid){
            let view = `
                <div class="vault notifications" id="notifications">
                    <div class="wrapper scale-up-center" id="notification-container">
                        <div class="content-wrapper" id="notification-container">
                            <div class="header">
                                <div class="title-cont">
                                    <div class="title-cont">
                                        <img src="../src/icons/notification.svg" />
                                        <span class="title">Notifications</span>
                                    </div>
                                </div>
                                <div class="close-btn-cont tippy-tip" id="notification-close-btn" data-tippy-content="Close">
                                    <img src="/src/icons/close-white.svg" alt="">
                                </div>
                            </div>
                            <div class="container-wrapper" id="notification-cont-wraper">
                            </div>
                        </div>
                    </div>
                </div>`;
            root.insertAdjacentHTML('beforeend', view);

            let notification_wrapper = document.getElementById('notification-container'),
                notification_close_btn = document.getElementById('notification-close-btn'),
                notification_container_wrapper = document.getElementById('notification-cont-wraper');

            notification_close_btn.addEventListener('click', () => {
                notification_wrapper.classList.add('scale-out-center');
                setTimeout(() => {
                    history.back();
                    notification_wrapper.classList.remove('scale-out-center');
                }, 100);
            });

            setTip();
            update_notification();

            function update_notification(){
                notification_container_wrapper.innerHTML = '';
                log(uid);
                fsDB.collection('client').doc('meta').collection(uid).doc('notifications').collection('history')
                .get().then(data => {
                    if(data.size <= 0){
                        notification_container_wrapper.innerHTML = empty_notifications_holder;
                    }
                    data.forEach((snap) => {
                        log(data.size);
                        const history_data = snap.data();

                        let notification_type = history_data.type,
                            notification_id = history_data.notification_id,
                            remote_id = history_data.remote_id;

                        let card_view = `
                            <div class="notification-card fade-in" id="notification-card-${notification_id}">
                                <div class="identifier-cont">
                                    <span class="identifier">
                                        <img src="${notification_type == 'request' ? 'src/icons/add-friend-blue.svg' : notification_type == 'nc' ? 'src/icons/nimo-icon.svg' : notification_type == 'ns' ? 'src/icons/shield.svg' : ''}" alt="">
                                        <span class="label" style="color:${notification_type == 'request' ? '#4285F4' : notification_type == 'nc' ? '#9568A6' : notification_type == 'ns' ? '#1D9654' : '#ffffff'}">${history_data.title}</span>
                                    </span>
                                    <span class="notification-remove-btn" id="notification-clear-${history_data.notification_id}">
                                        Clear
                                    </span>
                                </div>
                                <div class="card-wrapper">
                                    <div class="notification-comp-cont">
                                        <div class="notification-info-cont">
                                            <span class="message">${history_data.body}</span>
                                            <span class="id">${utilities.formatDate(history_data.date.toDate())}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        
                        notification_container_wrapper.insertAdjacentHTML('beforeend', card_view);

                        let notification_clear_btn = document.getElementById(`notification-clear-${history_data.notification_id}`),
                            start_chat_btn = document.getElementById(`start-chat-with-user-${notification_id}`),
                            notification_card = document.getElementById(`notification-card-${notification_id}`);

                        start_chat_btn.addEventListener('click', ()=> {
                            location.href = `../pages/chat.html?rid=${remote_id}`;
                        });
                        notification_clear_btn.addEventListener('click', () => {
                            fsDB.collection('client').doc('meta').collection(uid).doc('notifications').collection('history')
                            .doc(notification_id).delete().then(() => {
                                if(notification_card != null){
                                    notification_card.remove();
                                }
                                update_notification();
                            }).catch(error => log(error));
                        });

                    });
                }).catch(error => log(error));
            }
        }(lsDB.getItem('id')));
    };
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
    };
    function hide_preloader(){
        $('#spinnerx').removeClass('load');
        if($('#spinnerx').length > 0){
            $('#spinnerx').removeClass('show');
        }
    };
    function log(text){
        return console.log(text);
    };
    function setTip(){
        tippy('.tippy-tip', {
            placement: 'bottom',
            arrow: true,
        });
    }
}());