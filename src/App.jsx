import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Searcher from './Searcher'
import { useEffect } from 'react'
import uuid from 'react-uuid';
import { data } from '../data/course_data';
import { randomColor } from "randomcolor"
import { Button, Popover, Text, Title } from '@mantine/core'
import AddCircleLineIcon from 'remixicon-react/AddCircleLineIcon';

const localizer = momentLocalizer(moment)

function App() {
  const [count, setCount] = useState(0)
  const [eventList, setEventList] = useState([{
    title: 'Meeting',
    titleHTML: <h1>now</h1>,
    start: new Date(2023, 4, 4, 10, 0),
    end: new Date(2023, 4, 4, 11, 0),
    description: 'This is a meeting to discuss project updates',
  },])

  let my_event_list = [
    // {
    //   title: 'Meeting',
    //   titleHTML: <h1>now</h1>,
    //   start: new Date(2023, 4, 4, 10, 0),
    //   end: new Date(2023, 4, 4, 11, 0),
    //   description: 'This is a meeting to discuss project updates',
    // },
    // {
    //   title: <>now <p>Panashe</p><p>Muriro</p> </>,
    //   start: new Date(2023, 4, 5, 12, 0),
    //   end: new Date(2023, 4, 5, 16, 0),
    //   description: 'Meet at the restaurant at noon',
    // },
  ]


  const addCourse = (course) => {
    let course_times = course.course_deep_data.course_time_and_location.time
    let course_surface_data = course.course_surface_data;
    let course_name = course_surface_data.course_dept_name + " " + course_surface_data.course_number
    // avoid duplicate adding of courses
    let current_events = [...eventList];
    current_events = current_events.filter(event => event.title == course_name)
    if (current_events.length) {
      return
    }


    let days = Object.keys(course_times);
    let uid = uuid()

    let events = [...eventList]
    let color = randomColor({ hue: "red" });
    // if(JSON.stringify)

    days.map(day => {
      let time_range = course_times[day];
      let date = day;
      let class_time = generate_event_date(time_range, date)


      events.push({
        id: uid,
        title: course_name,
        start: class_time.start,
        end: class_time.end,
        description: 'This is a meeting to discuss project updates',
        color: color
      })
    })
    setEventList(events)
  }

  function disableWeekends(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }


  const removeCourse = (x) => {
    let current_events = [...eventList];
    current_events = current_events.filter(event => event.id !== x.id)
    console.log(current_events)
    setEventList(current_events)
  }

  const eventStyleGetter = (event, start, end, isSelected) => {
    // console.log(event);

    var backgroundColor = '#' + "004545";
    return {
      style: {
        backgroundColor: event.color,
        // borderRadius: '0px',
        // opacity: 0.8,
        // color: 'black',
        // fontSize: '15px',
        border: '0px',
        display: 'block',
        color: !isColorShadeLight(event.color) ? "white" : "black"
      }
    }
  }

  const [opened, setOpened] = useState(false);



  return (
    <div style={{ height: "100vh", paddingTop: 10, overflow: "hidden" }}>
      <div style={{ display: 'flex', justifyContent: "space-between", marginRight: 20, marginLeft: 20, }}>
        <Title >Smith Scheduler</Title>


        <Popover opened={opened} onChange={setOpened}>
          <Popover.Target>
            {/* <Button onClick={() => setOpened((o) => !o)}>Toggle popover</Button> */}
            <Button onClick={() => setOpened((o) => !o)}>Help</Button>
            </Popover.Target>
            <Popover.Dropdown>
            <AddCircleLineIcon/>
            <Text fw={600}>Searching for classes</Text>
            <ol>
            <li>Enter keywords related to the course you are looking for</li>
            <li>The list shows the filtered courses as you type</li>
            </ol>

            <Text fw={600}>Adding classes</Text>
            <ol>
            <li>Click on add button</li>
            </ol>
            <Text fw={600}>Removing classes</Text>
            <ol>
            <li>Click on the class from the calendar</li>
            </ol>
            </Popover.Dropdown>

          


          


        </Popover>

      
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", width: "100vw" }}>
        <Searcher addCourse={addCourse} />
        <div style={{ width: "70vw", height: "85vh", marginTop: "10vh" }}>

          <Calendar
            localizer={localizer}
            events={eventList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "85vh" }}
            defaultView={'work_week'}
            views={['day', 'work_week']}

            eventPropGetter={eventStyleGetter}
            // eventPropGetter={(event, start, end, isSelected) =>
            //   getEventStyle(event, start, end, isSelected)
            // }

            step={30}
            toolbar={false}
            min={new Date(1972, 0, 0, 7, 0, 0)}
            max={new Date(1972, 0, 0, 22, 0, 0)}
            dayPropGetter={(date) =>
              disableWeekends(date) ? { className: 'disabled-cell' } : {}
            }
            onSelectEvent={(e) => removeCourse(e)}
          />

        </div>
      </div>

    </div>
  )
}

export default App


const generate_event_date = (time_range, date) => {

  let days_until = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0
  }


  let start_time = time_range.split(/\-/g)[0].trim();
  let end_time = time_range.split(/\-/g)[1].trim();

  let moment_date = moment().day(days_until[date]);
  const moment_start_time = moment(start_time, 'HH:mm aa');
  const moment_end_time = moment(end_time, 'HH:mm aa');

  const start_date_time = moment_date
    .set({ hour: moment_start_time.hour(), minute: moment_start_time.minute(), second: 0, millisecond: 0 })
    .toDate();

  const end_date_time = moment_date
    .set({ hour: moment_end_time.hour(), minute: moment_end_time.minute(), second: 0, millisecond: 0 })
    .toDate();
  return { start: start_date_time, end: end_date_time }
}



function isColorShadeLight(color) {
  // Convert the hex color to RGB values
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Calculate the perceived brightness of the color using the YIQ formula
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return "light" if the brightness is above a threshold value, and "dark" otherwise
  return brightness >= 128
}