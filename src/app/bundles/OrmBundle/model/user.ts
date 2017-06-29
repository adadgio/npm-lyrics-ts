import { Table, Column }    from '../../OrmBundle/annotation';
import { Model }            from '../../OrmBundle/model';

@Table('users')
export class User extends Model {
    @Column({ primaryKey: true, type: 'string', length: 32 })
    id: string;

    @Column({ type: 'string' })
    name: string;
    
    constructor() {
        super();
        this.id = this.newUuid();
    }

    setName(name: string) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }
};
