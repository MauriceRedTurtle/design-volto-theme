import React, { useState } from 'react'
import { Card, Row, Col, Container} from 'design-react-kit/dist/design-react-kit';
import moment from 'moment/min/moment-with-locales';
import Slider from 'react-slick';
import cx from 'classnames';
import { getCalendarResults } from '@italia/actions';
import { useDispatch, useSelector } from 'react-redux';
import Item from '@italia/components/ItaliaTheme/Blocks/Calendar/Item'
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  insert_filter: {
    id: 'insert_filter',
    defaultMessage: 'Inserire un filtro dal menù laterale per visualizzare i relativi risultati',
  },
});

const Body = ({ data, inEditMode, path, onChangeBlock }) => {
  const intl = useIntl();
  moment.locale(intl.locale);

  const [activePage, setActivePage] = useState(0);
  const [monthName, setMonthName] = useState(getMonth);
  const [calendarItems, setCalendarItems] = useState([]);
  const [slidesToScroll, setSlidesToScroll] = useState(data.b_size || 4);

  useSelector(
    (state) => {
      // Check if the current value and the new value are the same
      if(state.calendarSearch.loaded && 
         !(calendarItems.length === state.calendarSearch.items.length && 
         calendarItems.every((value, index) => value === state.calendarSearch.items[index]))){
        
        // If the items is not divisible by 4, we must fill the array with the missing elements
        const module = state.calendarSearch.items?.length % (slidesToScroll)
        if(module > 0) {
          // "slidesToScroll - module" 4 is the number of elements needed to make the array divisible by "slidesToScroll"
          for(let i = 0; i < slidesToScroll - module; i++) {
            state.calendarSearch.items.push(null)
          }
        }
        setCalendarItems(state.calendarSearch.items)
      }
    },
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!data.query || data.query.length === 0) {
      data.query = [{
        i: "portal_type",
        o: "plone.app.querystring.operation.selection.any",
        v: ['Event']
      }]
      onChangeBlock({
        ...data,
        [data]: data,
      });
    }
    if(screen.width > 1024) {
      setSlidesToScroll(data.b_size || 4)
    } else if (screen.width <= 1024 && screen.width > 600) {
      setSlidesToScroll(2)
    } else {
      setSlidesToScroll(1)
    }
  }, []);

  React.useEffect(() => {
    dispatch(
      getCalendarResults(path, { ...data, fullobjects: 1 }, data.block, '@scadenziario'),
    );
  }, [data]);

  // Every time the page change check the name of the mounth
  React.useEffect(() => {
    setMonthName(getMonth);
  },[activePage]);

  // update the mounth name when the call to getCalendarResults is ended
  React.useEffect(() => {
    setMonthName(getMonth);
  },[calendarItems]);

  const settings = {
    dots: true,
    arrows: false,
    speed: 500,
    slidesToShow: data.b_size || 4,
    slidesToScroll: data.b_size || 4,
    infinite: false,
    initialSlide: 0,
    dotsClass: 'slick-dots dot',
    lazyLoad: true,
    afterChange: (current, next) => setActivePage(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const getMonth = () => {
    const currentActivePage = (activePage === 0 ? activePage : activePage )
    const startIndex = currentActivePage + (+slidesToScroll);
    const months = calendarItems?.slice(currentActivePage, startIndex).reduce((total, date) => {
      if(date) {
        const month = moment(date).format('MMMM');
        if(!total.includes(month)) {
          total.push(month);
        }
      }
      return total;
    },[]);

    return months?.map(m=> m.charAt(0).toUpperCase() + m.slice(1)).join(' / ');
  }

  return (
    <div className={cx("full-width", {'bg-light py-5': data.show_block_bg, "public-ui": inEditMode })}>
      <Container>
        {data.title && (
          <Row>
            <Col>
              <h2 className="mb-4">{data.title}</h2>
            </Col>
          </Row>
        )}
        <Card className={"card-bg"}>
          <div className="text-center calendar-header">
            <h3>{monthName}</h3>
          </div>
          <div className="calendar-body">
            {data.query?.length > 0 ?
              <Slider {...settings}>
                {calendarItems?.map((day, index) => {
                  return (
                  <div key={index} className="body">
                    <Item day={day} data={data} path={path} inEdit={inEditMode}/>
                  </div>
                )})}
              </Slider>
              : 
                inEditMode && <span>{intl.formatMessage(messages.insert_filter)}</span>
            }
          </div>
        </Card>
      </Container>
    </div>
  )
}
export default Body;
