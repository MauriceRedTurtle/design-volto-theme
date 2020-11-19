/**
 * View text block.
 * @module components/manage/Blocks/Text/View
 */

import PropTypes from 'prop-types';
import React from 'react';
import { flattenHTMLToAppURL } from '@plone/volto/helpers';

/**
 * View text block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) =>
  data.text ? (
    <div dangerouslySetInnerHTML={{ __html: flattenHTMLToAppURL(data.text) }} />
  ) : (
    <br />
  );

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
