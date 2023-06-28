import utilities from "../utilities/utilities.js";

const core = {
    config_core: () => {
        var _0x2cdc84=_0x3e61;function _0x3e61(_0x4e79de,_0x3d9807){var _0x3843e0=_0x3843();return _0x3e61=function(_0x3e6162,_0x42985b){_0x3e6162=_0x3e6162-0x8a;var _0xe7daf0=_0x3843e0[_0x3e6162];return _0xe7daf0;},_0x3e61(_0x4e79de,_0x3d9807);}(function(_0x9a71a5,_0x111177){var _0x5c45b1=_0x3e61,_0x4b8bdf=_0x9a71a5();while(!![]){try{var _0xc2721=-parseInt(_0x5c45b1(0x8d))/0x1*(parseInt(_0x5c45b1(0x94))/0x2)+-parseInt(_0x5c45b1(0x8c))/0x3+-parseInt(_0x5c45b1(0x93))/0x4+-parseInt(_0x5c45b1(0x8e))/0x5+parseInt(_0x5c45b1(0x95))/0x6+-parseInt(_0x5c45b1(0x8a))/0x7+-parseInt(_0x5c45b1(0x90))/0x8*(-parseInt(_0x5c45b1(0x8f))/0x9);if(_0xc2721===_0x111177)break;else _0x4b8bdf['push'](_0x4b8bdf['shift']());}catch(_0xbc3904){_0x4b8bdf['push'](_0x4b8bdf['shift']());}}}(_0x3843,0x27472),firebase['initializeApp']({'projectId':'nimo-app','apiKey':_0x2cdc84(0x96),'authDomain':_0x2cdc84(0x8b),'appId':_0x2cdc84(0x91),'storageBucket':_0x2cdc84(0x92)}));function _0x3843(){var _0x3eb038=['295450pMKojo','513MEHNUb','65288GBMDsh','1:494981267177:web:bbf9a92c2e798c95d77a78','nimo-app.appspot.com','600060AYjmEH','2YXJgOK','1694598XeTSZI','AIzaSyACoSPkNe8hlg34Ket7uryZMInHCYV4OHI','1248289EdWXml','nimo-app.firebaseapp.com','442182tSetid','51902VzuRHo'];_0x3843=function(){return _0x3eb038;};return _0x3843();}
    },
    manage_state: (setup, user, login, page, run) => {
        const lsdb = localStorage;
        const auth = firebase.auth();
        const fsdb = firebase.firestore();

        auth.onAuthStateChanged( async __usr__ => {
            if(__usr__){
                const meta_data = await getMeta(__usr__.uid);

                lsdb.setItem("id", meta_data[1]);
                lsdb.setItem("default_color", meta_data[2]);

                const state = meta_data[0];
                if(state != 'null'){
                    if (state === "setup") {
                        if(page == 'setup'){
                            run();
                            utilities.manage_preloader();
                        }else{
                            location.href = `${setup}`;
                        }
                    }else if (state === "user") {
                        location.href = `${user}`;
                    }
                    // switch(state){
                    //     case 'setup':
                    //         console.log('rerolling user setup..')
                    //         // page == 'setup' ? console.log(':watchdog:deployed:') : location.href = `${setup}`;
                    //     case 'user':
                    //         lsdb.clear();
                    //         location.href = `${user}`;
                    // }
                }else{
                    location.href = `${login}`;
                }
            }else{
                utilities.hide_preloader();
            }
        })
        async function getMeta(_usr_) {
        let _state_ = [];

        await fsdb
            .collection("client")
            .doc("meta_index")
            .collection(_usr_)
            .doc("meta_index")
            .get()
            .then(async (_doc_) => {
                if (_doc_.exists) {
                    const id = _doc_.data().id;
                    await fsdb
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
                                utilities.hide_preloader();
                            }
                            return _state_;
                        });
                } else {
                    _state_ = "null";
                    utilities.hide_preloader();
                }
                return _state_;
            })
            .catch((err) => {
                console.log(
                    "%cSomething went wrong!, retrying in 5 sec",
                    utilities.consoleColor
                );
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
        return _state_;
        }
    }
}

export default core;