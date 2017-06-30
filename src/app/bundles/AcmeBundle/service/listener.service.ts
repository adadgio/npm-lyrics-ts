/**
 * An other simple service.
 */
import { Service, ServiceInterface }    from '@lyrics/component';
import { Process }                      from '@lyrics/annotation';
import { ProcessManager }               from '@lyrics/component';
import { Inject }                       from '@lyrics/routing';
import * as firebase from 'firebase';

@Process({
    name: 'somelistener'
})
@Inject([
    { firebaseConfig: '%firebase%' },
])
export class ListenerService extends Service implements ServiceInterface
{
    private firebaseApp: any;

    constructor() {
        super();
    }

    /**
     * This method is only run once
     */
    onInit() {
        this.firebaseApp = firebase.initializeApp({
            apiKey: this.injected.firebaseConfig.apiKey,
            authDomain: this.injected.firebaseConfig.authDomain,
            databaseURL: this.injected.firebaseConfig.databaseURL,
            storageBucket: this.injected.firebaseConfig.storageBucket,
            messagingSenderId: this.injected.firebaseConfig.messagingSenderId,
        });

        this.test();
    }
    
    test() {
        // stop child_added to trigger
        // everything on script first start
        let dataAlreadyLoaded = false;
        let ref = firebase.database().ref('demo');

        ref.on('child_added', (snapshot: any, prevChildKey: string) => {
            if (!dataAlreadyLoaded) { return; }

            let key = snapshot.key;
            let value = snapshot.val();
            console.log(`Got value from firebase $${key}: ${value}`);
        });

        ref.once('value', function(snapshot) {
            dataAlreadyLoaded = true;
        });
    }
}
