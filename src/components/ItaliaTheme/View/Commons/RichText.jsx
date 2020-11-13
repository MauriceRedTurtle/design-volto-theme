import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { flattenHTMLToAppURL } from '@plone/volto/helpers';
import { serializeNodesToHtml } from '~/addons/volto-slate/src/editor/render'
/**
 * RichText view component class.
 * @function RichText
 * @params {object} content: Content object.
 * @returns {string} Markup of the component.
 */
const RichText = ({
  title,
  title_size,
  content,
  add_class,
  children,
  serif = true,
}) => {
  return content ? (
    <>
      {title &&
        (title_size === 'h6' ? (
          <h6 className="font-weight-bold mt-4">{title}</h6>
        ) : (
          <h5 className="mt-4">{title}</h5>
        ))}
      <div
        className={cx(add_class, { 'text-serif': serif })}
        dangerouslySetInnerHTML={{ __html: flattenHTMLToAppURL(serializeNodesToHtml(JSON.parse(content || '[]'))) }}
      />
      {children}
    </>
  ) : null;
};
export default RichText;

RichText.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  add_class: PropTypes.string,
  title_size: PropTypes.string,
};
