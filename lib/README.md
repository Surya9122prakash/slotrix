# @slotrix/calendar-app

A powerful, framework-agnostic, and highly customizable React calendar component library. Built with performance and elegance in mind, `@slotrix/calendar-app` provides a premium scheduling experience out of the box.

![License](https://img.shields.io/npm/l/@slotrix/calendar-app)
![Version](https://img.shields.io/npm/v/@slotrix/calendar-app)

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
npm install @slotrix/calendar-app
```

Or via yarn:

```bash
yarn add @slotrix/calendar-app
```

## 📖 Quick Start

```tsx
import { WeekView } from '@slotrix/calendar-app';
import 'moment/locale/en-gb'; // Optional: Load your preferred locale

const App = () => {
  const handleEventChange = (events) => {
    console.log('Events updated:', events);
  };

  return (
    <div style={{ height: '800px' }}>
      <WeekView 
        timeFormat="HH:mm"
        onEventChange={handleEventChange}
        // ... see Props for more options
      />
    </div>
  );
};

export default App;
```

## ⚙️ Props

| Prop | Type | Description |
|------|------|-------------|
| `timeFormat` | `string` | Display format for time (default: `HH:mm`) |
| `selectedDate` | `Moment` | The currently selected date |
| `onEventChange` | `(events: any[]) => void` | Callback when events are modified |
| `events` | `any[]` | Array of event objects to display |
| `showEmptyState` | `boolean` | Whether to show an empty state when no events exist |

## 📦 Peer Dependencies

To keep the package size small, we rely on the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `moment` ^2.30.1
- `moment-timezone` ^0.6.0

## 🛡️ License

MIT © [Slotrix](https://slotrix.com)
