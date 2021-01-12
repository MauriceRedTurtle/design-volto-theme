/**
 * View html block.
 * @module components/manage/Blocks/HTML/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { DangerouslySetHtmlContent } from '@italia/components';

/**
 * View html block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  return (
    <>
      <DangerouslySetHtmlContent html={data.html} className="block html" />
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
