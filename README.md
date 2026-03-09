# slotrix-calendar

A powerful, framework-agnostic, and highly customizable React calendar component library. Built with performance and elegance in mind, `slotrix-calendar` provides a premium scheduling experience out of the box.

## ✨ Features

- 📅 **Integrated Scheduling**: Comprehensive event management and visualization.
- ⚡ **Framework Agnostic**: Packaged as a library that plays well with standard React workflows.
- 🎨 **Premium UI**: Modern, clean, and responsive design using Tailwind CSS principles.
- 🛠️ **Highly Extensible**: Plugin-ready architecture and customizable props.
- 🌐 **Timezone Aware**: Robust handling of complex timezones via `moment-timezone`.
- 🧩 **Type Safe**: First-class TypeScript support with included declaration files.

## 🚀 Installation

Install via npm:

```bash
npm install slotrix-calendar
```

Or via yarn:

```bash
yarn add slotrix-calendar
```

## 📖 Quick Start

```tsx
import { WeekView, DayView, MonthView } from 'slotrix-calendar';
import 'slotrix-calendar/style.css'; // Import the required styles
import moment from 'moment-timezone';
import 'moment/locale/en-gb'; // Optional: Load your preferred locale

const App = () => {
  const handleEventChange = (events) => {
    console.log('Events updated:', events);
  };

  const handleDateChange = (date) => {
    console.log('Selected date:', date.format());
  };

  return (
    <div style={{ height: '800px', display: 'flex', flexDirection: 'column' }}>
      <WeekView 
        timezone="America/New_York"
        selectedDate={moment()}
        onDateChange={handleDateChange}
        slotInterval={30}
        dateFormat="YYYY-MM-DD"
        timeFormat="HH:mm"
        onEventChange={handleEventChange}
        events={[
          {
            id: '1',
            title: 'Team Meeting',
            start: moment().hour(10).minute(0).format(),
            end: moment().hour(11).minute(0).format(),
          }
        ]}
      />
    </div>
  );
};

export default App;
```

## ⚙️ Props (`CalendarProps`)

All calendar views (`DayView`, `WeekView`, `MonthView`) accept the following props:

### Core Configuration

| Prop | Type | Description |
|------|------|-------------|
| `timezone` | `string` | **Required.** The timezone strings (e.g., `"America/New_York"`). |
| `timezoneLabelInclude` | `boolean` | Whether to display the timezone label. |
| `selectedDate` | `moment.Moment \| string \| Date` | **Required.** The currently selected date to display. |
| `onDateChange` | `(date: moment.Moment) => void` | **Required.** Callback triggered when navigating dates. |
| `slotInterval` | `number` | **Required.** Duration of each time slot in minutes (e.g., 30). |
| `dateFormat` | `string` | **Required.** Format for dates. |
| `timeFormat` | `string` | **Required.** Display format for time (default: `HH:mm`). |

### Events and Interaction

| Prop | Type | Description |
|------|------|-------------|
| `events` | `CalendarEvent[]` | Array of event objects to display. |
| `onEventChange` | `(event: CalendarEvent) => void` | Callback when events are modified. |
| `onAddEvent` | `(event: CalendarEvent) => void` | Callback when adding a new event via double click empty slots. |
| `onEditEvent` | `(event: CalendarEvent) => void` | Callback when editing an existing event. |
| `onDeleteEvent` | `(eventId: string) => void` | Callback when deleting an event. |

### UI and Navigation

| Prop | Type | Description |
|------|------|-------------|
| `navigationPosition` | `"left" \| "center" \| "right"` | Position of navigation buttons. |
| `renderNavigation` | `(actions: { goToPreviousDay: () => void; goToNextDay: () => void; goToToday: () => void; }) => React.ReactNode` | Custom renderer for navigation controls. |
| `showTodayBelow` | `boolean` | Show small "Today" button below date header. |
| `showEmptyState` | `boolean` | Whether to show an empty state when no events exist. |
| `emptyStateContent` | `string` | Custom string for empty state. |
| `emptyStateContentPopup` | `React.ReactNode` | Custom React node popup for empty state. |
| `navigateToFirstEvent` | `boolean` | Auto scroll to display the first event in the view. |

### Scheduling Constraints

| Prop | Type | Description |
|------|------|-------------|
| `enabledTimeSlots` | `string[]` | Specific time slots (e.g. `["09:00", "09:30"]`) that are enabled. |
| `disabledTimeSlots` | `string[]` | Specific time slots to disable. |
| `enabledTimeInterval` | `{ start: string; end: string }[]` | Time ranges (e.g., `[{ start: "09:00", end: "17:00" }]`) that are enabled. |
| `disableTimeInterval` | `{ start: string; end: string }[]` | Time ranges to disable. |
| `futureDaysOnly` | `boolean` | Restrict navigation to future days. |
| `pastDaysOnly` | `boolean` | Restrict navigation to past days. |
| `currentDayOnly` | `boolean` | Restrict navigation to current day only. |

### Theming and Extensibility

| Prop | Type | Description |
|------|------|-------------|
| `calendarThemeVariant` | `"classic_light" \| "dark_night" \| "slate_modern" \| "emerald_forest" \| "ocean_breeze" \| "midnight_purple" \| "amber_gold" \| "rose_petal" \| "minimal_mono" \| "cyber_punk"` | Apply a predefined color theme. |
| `calendarTheme` | `CalendarTheme` | Custom calendar theme override (colors). |
| `conflictThemeVariant` | `"classic_red" \| "amber_warning" \| "indigo_modern" \| "emerald_soft" \| ...` | Apply a predefined template/theme for conflict alerts. |
| `conflictTemplate` | `ConflictTemplate` | Complete custom rendering and styling of conflict modals. |
| `onlyCreateEditRequired` | `boolean` | Internal flag enabling built-in create/edit forms on slot double-clicks. |
| `formFields` | `CalendarFormField[]` | Dynamic fields configuration for the built-in edit form. |
| `plugins` | `Plugin[]` | Custom plugins for hooking into rendering, clicking, and saving workflows. |

## 📦 Peer Dependencies

To keep the package lightweight, we rely on the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `moment` ^2.30.1
- `moment-timezone` ^0.6.0
