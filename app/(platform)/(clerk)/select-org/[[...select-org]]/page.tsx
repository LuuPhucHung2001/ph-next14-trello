import React from 'react';
import { OrganizationList } from '@clerk/nextjs';
const CreateOrganizationPage = () => {
  return (
    <div>
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
      />
    </div>
  );
};

export default CreateOrganizationPage;
