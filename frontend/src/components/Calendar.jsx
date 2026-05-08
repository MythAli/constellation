/*
The Calendar component used in the Student Home page
*/

// LIBRARY IMPORTS
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  addWeeks,
  differenceInDays,
  addDays,
} from "date-fns";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

// CSS IMPORTS
import classes from "./Calendar.module.css";

// MAIN COMPONENT
const Calendar = ({ range, onRangeChange }) => {
  // States initialization
  const [viewDate, setViewDate] = useState(range.start);
  const [lastPressed, setLastPressed] = useState(viewDate);

  // Logic to build the 7x6 grid (All following comments below assume start date was a date in Apr. 2026)
  const monthStart = startOfMonth(viewDate); // Wed Apr 01 2026 00:00:00 GMT-0500
  const monthEnd = endOfMonth(monthStart); // Thu Apr 30 2026 23:59:59 GMT-0500
  const startDate = startOfWeek(monthStart); // Sun Mar 29 2026 00:00:00 GMT-0500
  let endDate = endOfWeek(monthEnd); // Sat May 02 2026 23:59:59 GMT-0500

  // To keep the calendar same size always ~ 6 weeks (Since some months can have 1 or 2 less week rows)
  // Calculate how many days we currently have
  const currentSpan = differenceInDays(endDate, startDate) + 1;
  // If we have fewer than 42 days (6 weeks * 7 days), add the difference
  if (currentSpan < 42) {
    const daysToAdd = 42 - currentSpan;
    endDate = addDays(endDate, daysToAdd);
  }

  // Find Calendar Days since a calendar also show days for past and future months
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  //    => Sun Mar 29 2026 00:00:00 GMT-0500 -->> Sat May 02 2026 23:59:59 GMT-0500

  // For the month increment button (>)
  const incrementViewDateHandler = () => {
    setViewDate((prev) => addMonths(prev, 1));
  };

  // For the month decrement button (<)
  const decrementViewDateHandler = () => {
    setViewDate((prev) => subMonths(prev, 1));
  };

  // For handling user clicks on the calendar to change the date range
  const setRangeHandler = (date) => {
    // If the user clicks on a date on or before the start date
    //    => Set range.start and range.end equal to that date
    if (
      isSameDay(date, range.start) ||
      date < range.start ||
      lastPressed.getTime() === date.getTime() // And if the user double clicks a date
    ) {
      onRangeChange(() => ({ start: date, end: date }));
    }
    // If selection is after start date => Set end date to it
    else {
      onRangeChange((range) => ({ start: range.start, end: date }));
    }

    setLastPressed(() => date); // Set to current date clicked to handle double clicks
  };

  return (
    <div className={classes.calendar_card}>
      {/* Calendar Header */}
      <header className={classes.header}>
        <button className={classes.nav_btn} onClick={decrementViewDateHandler}>
          <LuChevronLeft size={20} />
        </button>
        <div className={classes.controls}>
          <div className={classes.select_wrapper}>
            {format(viewDate, "MMM")}
          </div>
          <div className={classes.select_wrapper}>
            {format(viewDate, "yyyy")}
          </div>
        </div>
        <button className={classes.nav_btn} onClick={incrementViewDateHandler}>
          <LuChevronRight className={classes.left_nav} size={20} />
        </button>
      </header>

      <div className={classes.grid}>
        {/* Calendar Months */}
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className={classes.weekday}>
            {d}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day) => {
          const isStart = isSameDay(day, range.start);
          const isEnd = isSameDay(day, range.end);
          const inRange = isWithinInterval(day, range);
          const isCurrentMonth = isSameMonth(day, monthStart);

          // Combine classes dynamically for the range selector
          const dayClasses = [
            classes.day_cell,
            !isCurrentMonth && classes.inactive,
            inRange && classes.in_range,
            (isStart || isEnd) && classes.selected,
            isStart && classes.range_start,
            isEnd && classes.range_end,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={day.toString()}
              className={dayClasses}
              onClick={() => setRangeHandler(day)}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
