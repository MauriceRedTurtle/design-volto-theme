import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { getContent, resetContent } from '@plone/volto/actions';
import { Link } from 'react-router-dom';
import { Icon } from 'design-react-kit/dist/design-react-kit';
import { flattenToAppURL } from '@plone/volto/helpers';
import PropTypes from 'prop-types';

/**
 * OfficeCard view component class.
 * @function OfficeCard
 * @params {object} content: Content object.
 * @returns {string} Markup of the component.
 */
const OfficeCard = ({ office, extended, icon, children }) => {
  const key = `${office['@id']}_office`;
  const url = flattenToAppURL(office['@id']);
  const officeContent = useSelector((state) => state.content.subrequests);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContent(url, null, key));
    return () => dispatch(resetContent(key));
  }, [dispatch, office, url, key]);

  let office_fo = officeContent[key]?.data;

  return office_fo ? (
    <div className="card card-teaser rounded shadow p-4">
      {icon && <Icon icon={icon}></Icon>}
      <div className="card-body pr-3">
        <h5 className="card-title no-toc">
          <Link to={flattenToAppURL(office_fo['@id'])} title={office_fo.title}>
            {office_fo.title}
          </Link>
        </h5>
        <p className="card-text">{office_fo.description}</p>
        {(office_fo.city || office_fo.zip_code || office_fo.street) && (
          <div className="card-text">
            {office_fo.street && <p>{office_fo.street}</p>}
            {(office_fo.city || office_fo.zip_code) && (
              <p>
                {office_fo.zip_code} {office_fo.city}
              </p>
            )}
            {extended ? (
              <div
                className="card-text"
                dangerouslySetInnerHTML={{
                  __html: office_fo.contact_info?.data,
                }}
              />
            ) : null}
          </div>
        )}
        {children && <div className="card-text">{children}</div>}
      </div>
    </div>
  ) : null;
};
export default OfficeCard;

OfficeCard.propTypes = {
  office: PropTypes.shape({
    '@id': PropTypes.string,
    '@type': PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    review_state: PropTypes.string,
  }),
  extended: PropTypes.bool,
  icon: PropTypes.string,
};
