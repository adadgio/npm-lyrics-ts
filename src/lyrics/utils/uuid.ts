class UuidSingelton {
    create() {
        // I generate the UID from two parts here
        // to ensure the random number provide enough bits.
        let part1: string|number = (Math.random() * 46656) | 0;
        let part2: string|number = (Math.random() * 46656) | 0;

        part1 = ('000' + part1.toString(36)).slice(-3);
        part2 = ('000' + part2.toString(36)).slice(-3);


        return `${this.randomMinLetter()}${part1}${part2}${this.randomMajetter()}${this.guid()}`;
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4();
    }
    
    randomMajetter() {
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }

    randomMinLetter() {
        let possible = "abcdefghijklmnopqrstuvwxy";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }
};

export let Uuid = new UuidSingelton();
