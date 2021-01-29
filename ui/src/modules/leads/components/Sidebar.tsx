import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import BrandFilter from '../containers/filters/BrandFilter';
import TagFilter from '../containers/filters/TagFilter';
import StatusFilter from '../containers/filters/StatusFilter';

function Sidebar(queryParams: any, refetch?: () => void) {
  return (
    <Wrapper.Sidebar>
      <TagFilter queryParams={queryParams} refetch={refetch} />
      <BrandFilter queryParams={queryParams} refetch={refetch} />
      <StatusFilter queryParams={queryParams} refetch={refetch} />
    </Wrapper.Sidebar>
  );
}

export default Sidebar;