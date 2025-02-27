//import { useSelector } from 'react-redux';
import DefaultFilters from '@italia/components/ItaliaTheme/Blocks/UOSearch/DefaultFilters';

/*
  ***
  componente da customizzare nel proprio sito per modificare/aggiungere tipologie di Filtri
  ***
 */
const FiltersConfig = (dispatchFilter) => {
  // const subsite = useSelector((state) => state.subsite?.data);
  const defaultFilters = DefaultFilters(dispatchFilter);

  return {
    ...defaultFilters,
    //aggiungere qui le proprie customizzazioni/nuovi filtri
  };
};

export default FiltersConfig;
