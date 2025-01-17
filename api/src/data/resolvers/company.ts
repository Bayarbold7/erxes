import { Companies, Conformities, Customers, Tags } from '../../db/models';
import { ICompanyDocument } from '../../db/models/definitions/companies';
import { getDocument } from './mutations/cacheUtils';

export default {
  async customers(company: ICompanyDocument) {
    const customerIds = await Conformities.savedConformity({
      mainType: 'company',
      mainTypeId: company._id,
      relTypes: ['customer']
    });

    return Customers.find({ _id: { $in: customerIds || [] } });
  },

  getTags(company: ICompanyDocument) {
    return Tags.find({ _id: { $in: company.tagIds || [] } });
  },

  owner(company: ICompanyDocument) {
    return getDocument('users', { _id: company.ownerId });
  },

  parentCompany(company: ICompanyDocument) {
    return Companies.findOne({ _id: company.parentCompanyId });
  }
};
