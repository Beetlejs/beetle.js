import { BeetleLinqContext } from '..';
import { EntityBase, IEntity } from '../lib/types';

export interface Address extends IEntity {
    id: number;
    text: string;
}

export class Company extends EntityBase {

    constructor(prms?: [number, string, boolean, Date, Address]) {
        super();

        this.$type = Company.$type;
        [this.id, this.name, this.deleted, this.createDate, this.address] = prms;
    }

    id: number;
    name: string;
    deleted: boolean;
    createDate: Date;
    address: Address;
    static $type = 'Test.Company';
}

export class TestContext extends BeetleLinqContext {

    constructor() {
        super({ baseAddress: 'api' });
    }

    companies = this.set(Company, 'Companies');
    addresses = this.set('Test.Address', 'Addresses');
}

export const addresses: Address[] = [
    { id: 1, text: 'Mercury', $type: 'Test.Address' },
    { id: 2, text: 'Venus', $type: 'Test.Address' },
    { id: 3, text: 'Earth', $type: 'Test.Address' },
    { id: 4, text: 'Mars,', $type: 'Test.Address' }
];

export const companies = [
    new Company([1, 'Netflix', false, new Date(), addresses[0]]),
    new Company([2, 'Google', false, new Date(), addresses[1]]),
    new Company([3, 'Microsoft', false, new Date(), addresses[2]]),
    new Company([4, 'Facebook', false, new Date(), addresses[3]]),
    new Company([5, 'Lyft', false, new Date(), addresses[1]]),
    new Company([6, 'Uber', false, new Date(), addresses[2]]),
]
