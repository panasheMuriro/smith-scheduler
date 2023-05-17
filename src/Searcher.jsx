import { Button, Input, Text, Title } from '@mantine/core';
import { data } from '../data/course_data';
import { useEffect, useState } from 'react';
// to caps
import AddLineIcon from 'remixicon-react/AddLineIcon';


// const capitalized_courses = data.map(x=> JSON.stringify(x).toLowerCase())



export default function Searcher({ addCourse }) {

    let course_data = data
    // console.log(capitalized_courses)

    const [searchValue, setSearchValue] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([])

    useEffect(() => {
        let courses = filterFunction(course_data, searchValue);
        console.log(courses)
        setFilteredCourses(courses)
    }, [searchValue])


    const showCurrentCourse = (course) => {
        addCourse(course)
    }

    console.log()

    return (
        <div style={{ padding: 20, height: "100vh", }}>
            <div style={{ height: "8vh" }}><Input
                placeholder="Search for class"
                style={{ marginBottom: 10 }}
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
            /></div>
            <div style={{ height: "92vh", overflowY: "scroll" }}>
                {filteredCourses.slice(0, 30).map((course, index) => <SearchCard onClick={() => showCurrentCourse(course)} key={index} course={course} />)}
            </div>
        </div>
    )
}


const SearchCard = ({ course, onClick }) => {
    let course_display_data = course.course_surface_data;
    let course_deep_data = course.course_deep_data;

    const getCourseTime = () => {
        let data = course_deep_data.course_time_and_location.time
        let result = []
        let days = Object.keys(data)
        days.map(x => {
            result.push({ day: x, time: data[x] })
        })
        return result
    }




    return <div style={{ borderWidth: 1, position: "relative", borderStyle: "solid", marginBottom: 5, borderRadius: 10, backgroundColor: "#ff000050" }}>
        {/* <div style={{position:"absolute", width: "100%", height: "100%" }}></div> */}
        <div style={{ padding: 10, }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>

                <Text fw={700}>{course_display_data.course_dept_name} {course_display_data.course_number} </Text>

                <Button style={{borderRadius: 20, borderWidth: 0, borderColor:"#025464", backgroundColor: "white", color:"#025464"}} leftIcon={<AddLineIcon size={14}/>} onClick={onClick} variant='outline' size='sm'>add</Button></div>

            <Text fz="sm">{course_display_data.course_title}</Text>
            <Title size="h6">Schedule</Title>
            {getCourseTime().map(data => <Text fz="xs">{data.day}: {data.time}</Text>)}
            <Title size="h6">Instructor</Title>
            <Text fz="xs">{course_display_data.course_instructor}</Text>

            {course_deep_data.course_time_and_location.location && <>
                <Title size="h6">Location</Title>
                <Text>{course_deep_data.course_time_and_location.location}</Text>

            </>
}
          

        </div>

    </div>
}

//  returns the courses matching the specific text

// FIXME: improve the functionality of this
const filterFunction = (courses, search_content) => {
    let list = filterList(courses, search_content.split(/\s+/g));
    return list
}

function filterList(list, words) {
    return list.filter((item) => {
        for (let word of words) {
            if (!JSON.stringify(item).toLowerCase().toLowerCase().includes(word.toLowerCase())) {
                return false;
            }
        }
        return true;
    });
}

