import { Table, Column }    from '../../OrmBundle/annotation';
import { Model }            from '../../OrmBundle/model';

@Table('users')
export class User extends Model {

    @Column({ primaryKey: true, type: 'integer' })
    id: number;

    @Column({ type: 'string' })
    name: string;

    setName(name: string) {
        this.name = name;
        return this;
    }

    getName() {
        return this.name;
    }
};
