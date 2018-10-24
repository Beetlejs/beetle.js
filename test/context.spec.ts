import 'mocha';
import { expect } from 'chai';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import fetchMock = require('fetch-mock');
import { TestContext, companies } from './fixture';

chai.use(chaiAsPromised)

describe('Service tests', () => {

    const context = new TestContext();

    it('should attach companies and their addresses', async () => {
        fetchMock.get(
            'api/Companies', companies,
            { method: 'GET', overwriteRoutes: false }
        );

        const result = await context.companies.toArrayAsync();

        expect(result).to.not.equal(companies);
        expect(JSON.stringify(result)).to.equal(JSON.stringify(companies));

        fetchMock.restore();
    });
});
